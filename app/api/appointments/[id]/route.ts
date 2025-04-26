// app/api/appointments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';
import { requireAdmin } from '@lib/auth';

const TZ = 'Europe/Kyiv';

/** Универсальный парсер дат: поддерживает ISO и DMY */
function parseAnyDate(str: string): Date {
  if (str.includes('.')) {
    // DMY => "dd.mm.yyyy" или "dd.mm.yyyy HH:mm"
    const [datePart, timePart] = str.split(' ');
    const [d, m, y] = datePart.split('.');
    const dt = new Date(`${y}-${m}-${d}`);
    if (timePart) {
      const [hh, mm] = timePart.split(':').map(Number);
      dt.setHours(hh, mm, 0, 0);
    }
    return dt;
  } else {
    // ISO => "yyyy-mm-dd" или полный ISO с временем
    return new Date(str);
  }
}

/** Вспомогательная: извлекает числовой id сеанса из URL */
function getIdFromUrl(url: string): number {
  const parts = new URL(url).pathname.split('/');
  return Number(parts[parts.length - 1]);
}

export async function PUT(req: NextRequest) {
  // 1) Авторизация
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) Парсим id и тело запроса
  const id = getIdFromUrl(req.url);
  const { startTime, duration, client, clientId, notes, price } = await req.json();

  // 3) Парсим дату начала через универсальный парсер
  const newStart = parseAnyDate(startTime as string);
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  // 4) Определяем границы дня
  const dayStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate());
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  // 5) Ищем другие сеансы в этот же день (кроме текущего)
  const existing = await prisma.appointment.findMany({
    where: {
      AND: [
        { id: { not: id } },
        {
          startTime: {
            gte: dayStart.toISOString(),
            lt: dayEnd.toISOString(),
          },
        },
      ],
    },
  });

  // 6) Проверка на пересечение
  const conflict = existing.find(a => {
    const s = new Date(a.startTime);
    const e = new Date(s.getTime() + a.duration * 60000);
    return newStart < e && s < newEnd;
  });

  if (conflict) {
    const conflictStr = formatInTimeZone(new Date(conflict.startTime), TZ, 'dd.MM.yyyy HH:mm');
    const newStr = formatInTimeZone(newStart, TZ, 'dd.MM.yyyy HH:mm');
    return NextResponse.json(
      { error: `Неможливо на ${newStr}, бо вже є сеанс ${conflictStr}` },
      { status: 400 }
    );
  }

  // 7) Формируем объект обновления
  const updateData: any = {
    startTime: newStart.toISOString(),
    duration,
    clientId: clientId ?? null,
    notes: notes?.trim() || null,
    price,
  };
  if (typeof client === 'string') {
    updateData.client = client.trim();
  }

  // 8) Обновляем сеанс в базе
  const updated = await prisma.appointment.update({
    where: { id },
    data: updateData,
  });

  // 9) Сбрасываем кеш и возвращаем результат
  revalidatePath('/api/appointments');
  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  // 1) Авторизация
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) Парсим id и удаляем
  const id = getIdFromUrl(req.url);
  await prisma.appointment.delete({ where: { id } });

  // 3) Сбрасываем кеш и возвращаем результат
  revalidatePath('/api/appointments');
  return NextResponse.json({ success: true }, { status: 200 });
}
