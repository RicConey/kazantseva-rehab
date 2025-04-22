// app/api/appointments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';

const TZ = 'Europe/Kyiv';

function getIdFromUrl(url: string): number {
  const parts = new URL(url).pathname.split('/');
  return Number(parts[parts.length - 1]);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  if (!date && (!from || !to)) {
    return NextResponse.json([], { status: 200 });
  }

  let where: any = {};
  if (date) {
    const d0 = new Date(date);
    const d1 = new Date(d0.getTime() + 24 * 60 * 60 * 1000);
    where.startTime = {
      gte: d0.toISOString(),
      lt: d1.toISOString(),
    };
  } else {
    where.startTime = {
      gte: new Date(from!).toISOString(),
      lt: new Date(to!).toISOString(),
    };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { startTime: 'asc' },
  });

  return NextResponse.json(appointments, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { startTime, duration, client, notes, price } = await req.json();

  const newStart = new Date(startTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  // Проверяем пересечения
  const list = await prisma.appointment.findMany();
  for (const appt of list) {
    const s = new Date(appt.startTime);
    const e = new Date(s.getTime() + appt.duration * 60000);
    if (newStart < e && s < newEnd) {
      const conflictStr = formatInTimeZone(s, TZ, 'dd.MM.yyyy HH:mm');
      const newStr = formatInTimeZone(newStart, TZ, 'dd.MM.yyyy HH:mm');
      return NextResponse.json(
        { error: `Неможливо на ${newStr}, бо вже є сеанс ${conflictStr}` },
        { status: 400 }
      );
    }
  }

  // Создаём новую запись с price
  const appt = await prisma.appointment.create({
    data: {
      startTime: newStart.toISOString(),
      duration,
      client: client.trim(),
      notes: notes?.trim() || null,
      price, // ← вот тут
    },
  });

  revalidatePath('/api/appointments');
  return NextResponse.json(appt, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  const { startTime, duration, client, notes, price } = await req.json();

  const newStart = new Date(startTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  // Проверяем пересечения (skip self)
  const list = await prisma.appointment.findMany();
  for (const appt of list) {
    if (appt.id === id) continue;
    const s = new Date(appt.startTime);
    const e = new Date(s.getTime() + appt.duration * 60000);
    if (newStart < e && s < newEnd) {
      const conflictStr = formatInTimeZone(s, TZ, 'dd.MM.yyyy HH:mm');
      const newStr = formatInTimeZone(newStart, TZ, 'dd.MM.yyyy HH:mm');
      return NextResponse.json(
        { error: `Неможливо на ${newStr}, бо вже є сеанс ${conflictStr}` },
        { status: 400 }
      );
    }
  }

  // Обновляем запись, включая price
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      startTime: newStart.toISOString(),
      duration,
      client: client.trim(),
      notes: notes?.trim() || null,
      price, // ← и тут
    },
  });

  revalidatePath('/api/appointments');
  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  await prisma.appointment.delete({ where: { id } });
  revalidatePath('/api/appointments');
  return NextResponse.json({ success: true }, { status: 200 });
}
