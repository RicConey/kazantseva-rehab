// app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';

const TZ = 'Europe/Kyiv';

// Вспомогательная функция для вычленения id из URL
function getIdFromUrl(url: string): number {
  const parts = new URL(url).pathname.split('/');
  return Number(parts[parts.length - 1]);
}

export async function PUT(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  // теперь деструктурируем также price
  const { startTime, duration, client, notes, price } = await req.json();

  const newStart = new Date(startTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  // границы дня для поиска конфликтов
  const dayStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate());
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  // ищем все записи в тот же день, кроме текущей
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

  // проверка наложений
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

  // выполняем update с передачей price
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      startTime: newStart.toISOString(),
      duration,
      client: client.trim(),
      notes: notes?.trim() || null,
      price, // ← добавлено сюда
    },
  });

  // сбрасываем кеш
  revalidatePath('/api/appointments');

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  await prisma.appointment.delete({ where: { id } });
  revalidatePath('/api/appointments');
  return NextResponse.json({ success: true });
}
