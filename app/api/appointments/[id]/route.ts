// app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../auth/[...nextauth]/auth.config';
import prisma from '../../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';

async function requireAdmin() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await ctx.params;
  const id = Number(idParam);

  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { client, startTime, duration, notes } = await req.json();
  const start = new Date(startTime);
  const dur = Number(duration);
  const end = new Date(start.getTime() + dur * 60000);

  // Границы дня
  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(start);
  dayEnd.setHours(23, 59, 59, 999);

  const existing = await prisma.appointment.findMany({
    where: {
      id: { not: id },
      startTime: { gte: dayStart, lt: dayEnd },
    },
  });

  for (const appt of existing) {
    const s = new Date(appt.startTime);
    const e = new Date(s.getTime() + appt.duration * 60000);
    if (start < e && s < end) {
      // Форматируем оба времени в часовой пояс Киева
      const requested = formatInTimeZone(start, 'Europe/Kyiv', 'HH:mm');
      const conflictAt = formatInTimeZone(s, 'Europe/Kyiv', 'HH:mm');
      return NextResponse.json(
        {
          error: `Неможливо перемістити сеанс на ${requested}: вже є сеанс о ${conflictAt}`,
        },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      client,
      startTime: start,
      duration: dur,
      notes: notes?.trim() || null,
    },
  });

  revalidatePath('/api/appointments');

  return NextResponse.json(updated);
}
