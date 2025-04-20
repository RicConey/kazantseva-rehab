// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../auth/[...nextauth]/auth.config';
import prisma from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';

async function requireAdmin() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get('date');

  const dayStart = dateParam
    ? new Date(`${dateParam}T00:00:00.000Z`)
    : new Date(new Date().setHours(0, 0, 0, 0));
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  const list = await prisma.appointment.findMany({
    where: { startTime: { gte: dayStart, lt: dayEnd } },
    orderBy: { startTime: 'asc' },
  });

  return NextResponse.json(list, {
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=0',
    },
  });
}

export async function POST(req: NextRequest) {
  await requireAdmin();

  const { client, startTime, duration, notes } = await req.json();
  const start = new Date(startTime);
  const dur = Number(duration);
  const end = new Date(start.getTime() + dur * 60000);

  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(start);
  dayEnd.setHours(23, 59, 59, 999);

  const existing = await prisma.appointment.findMany({
    where: { startTime: { gte: dayStart, lt: dayEnd } },
  });

  for (const appt of existing) {
    const s = new Date(appt.startTime);
    const e = new Date(s.getTime() + appt.duration * 60000);
    if (start < e && s < end) {
      // Показываем время конфликта в часовом поясе Киева
      const conflictAt = formatInTimeZone(s, 'Europe/Kyiv', 'HH:mm');
      const requested = formatInTimeZone(start, 'Europe/Kyiv', 'HH:mm');
      return NextResponse.json(
        {
          error: `Неможливо створити запис о ${requested}: вже є сеанс о ${conflictAt}`,
        },
        { status: 400 }
      );
    }
  }

  const appt = await prisma.appointment.create({
    data: {
      client,
      startTime: start,
      duration: dur,
      notes: notes?.trim() || null,
    },
  });

  revalidatePath('/api/appointments');

  return NextResponse.json(appt);
}
