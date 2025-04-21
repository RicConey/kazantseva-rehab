import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';

const TZ = 'Europe/Kyiv';

function getIdFromUrl(url: string): number {
  const parts = new URL(url).pathname.split('/');
  return Number(parts[parts.length - 1]);
}

export async function PUT(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  const { startTime, duration, client, notes } = await req.json();
  const newStart = new Date(startTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  const dayStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate());
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

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

  const conflict = existing.find(a => {
    const s = new Date(a.startTime);
    const e = new Date(s.getTime() + a.duration * 60000);
    return newStart < e && s < newEnd;
  });

  if (conflict) {
    const newStr = formatInTimeZone(newStart, TZ, 'dd.MM.yyyy HH:mm');
    const cdt = new Date(conflict.startTime);
    const conflictStr = formatInTimeZone(cdt, TZ, 'dd.MM.yyyy HH:mm');
    return NextResponse.json(
      { error: `Неможливо на ${newStr}, бо вже є сеанс ${conflictStr}` },
      { status: 400 }
    );
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      startTime: newStart.toISOString(),
      duration,
      client: client.trim(),
      notes: notes?.trim() || null,
    },
  });

  revalidatePath('/api/appointments');
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  await prisma.appointment.delete({ where: { id } });
  revalidatePath('/api/appointments');
  return NextResponse.json({ success: true });
}
