// app/api/admin/appointments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';
import { requireAdmin } from '@lib/auth';

const TZ = 'Europe/Kyiv';

/**
 * Универсальный парсер дат:
 * - ISO 8601 (с 'T' или без) => new Date(str)
 * - DMY "dd.mm.yyyy" или "dd.mm.yyyy HH:mm"
 */
function parseAnyDate(str: string): Date {
  if (str.includes('T') || !str.includes('.')) {
    return new Date(str);
  }
  const [datePart, timePart] = str.split(' ');
  const [d, m, y] = datePart.split('.');
  const dt = new Date(`${y}-${m}-${d}`);
  if (timePart) {
    const [hh, mm] = timePart.split(':').map(Number);
    dt.setHours(hh, mm, 0, 0);
  }
  return dt;
}

/** Извлекает числовой id из URL */
function getIdFromUrl(url: string): number {
  const parts = new URL(url).pathname.split('/');
  return Number(parts[parts.length - 1]);
}

export async function PUT(req: NextRequest) {
  // 1) Авторизация
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) Парсим id и тело
  const id = getIdFromUrl(req.url);
  const { startTime, duration, client, clientId, notes, price, locationId } = await req.json();

  // 3) Проверяем обязательный locationId
  if (typeof locationId !== 'number') {
    return NextResponse.json(
      { error: 'locationId обязателен и должен быть числом' },
      { status: 400 }
    );
  }

  // 4) Парсим новую дату начала
  const newStart = parseAnyDate(startTime as string);
  if (isNaN(newStart.getTime())) {
    return NextResponse.json(
      { error: 'Невірний формат дати та часу початку сеансу.' },
      { status: 400 }
    );
  }
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  // 5) Границы дня
  const dayStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate());
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  // 6) Ищем другие сеансы в тот же день (кроме текущего)
  const existing = await prisma.appointment.findMany({
    where: {
      AND: [{ id: { not: id } }, { startTime: { gte: dayStart, lt: dayEnd } }],
    },
  });

  // 7) Проверка на пересечение
  const conflict = existing.find(a => {
    const s = new Date(a.startTime);
    const e = new Date(s.getTime() + a.duration * 60000);
    return newStart < e && s < newEnd;
  });
  if (conflict) {
    const newRange = `${formatInTimeZone(newStart, TZ, 'dd.MM.yyyy HH:mm')}-${formatInTimeZone(newEnd, TZ, 'HH:mm')}`;
    const conflictStart = new Date(conflict.startTime);
    const conflictEnd = new Date(conflictStart.getTime() + conflict.duration * 60000);
    const conflictRange = `${formatInTimeZone(conflictStart, TZ, 'dd.MM.yyyy HH:mm')}-${formatInTimeZone(conflictEnd, TZ, 'HH:mm')}`;

    return NextResponse.json(
      { error: `Неможливо призначити на ${newRange}, бо вже є сеанс ${conflictRange}` },
      { status: 400 }
    );
  }

  // 8) Формируем данные для обновления
  const updateData: any = {
    startTime: newStart,
    duration,
    clientId: clientId ?? null,
    notes: notes?.trim() || null,
    price,
    locationId, // теперь обязательно включаем
  };
  if (typeof client === 'string') {
    updateData.client = client.trim();
  }

  // 9) Выполняем обновление
  const updated = await prisma.appointment.update({
    where: { id },
    data: updateData,
    include: {
      clientRel: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, color: true } }, // возвращаем локацию
    },
  });

  // 10) Сбрасываем кеш и возвращаем результат
  revalidatePath('/admin/appointments');
  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = getIdFromUrl(req.url);
  await prisma.appointment.delete({ where: { id } });

  revalidatePath('/admin/appointments');
  return NextResponse.json({ success: true }, { status: 200 });
}
