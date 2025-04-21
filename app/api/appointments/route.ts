import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';

const TZ = 'Europe/Kyiv';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  if (!date) return NextResponse.json([], { status: 200 });

  const startOfDay = new Date(date);
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const appointments = await prisma.appointment.findMany({
    where: {
      startTime: {
        gte: startOfDay.toISOString(),
        lt: endOfDay.toISOString(),
      },
    },
    orderBy: { startTime: 'asc' },
  });

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const { startTime, duration, client, notes } = await req.json();
  const newStart = new Date(startTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  // границы дня
  const dayStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate());
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  const existing = await prisma.appointment.findMany({
    where: {
      startTime: {
        gte: dayStart.toISOString(),
        lt: dayEnd.toISOString(),
      },
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

  const appt = await prisma.appointment.create({
    data: {
      startTime: newStart.toISOString(),
      duration,
      client: client.trim(),
      notes: notes?.trim() || null,
    },
  });

  revalidatePath('/api/appointments');
  return NextResponse.json(appt, { status: 201 });
}
