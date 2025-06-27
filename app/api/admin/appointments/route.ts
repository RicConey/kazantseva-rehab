// app/api/admin/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';
import { requireAdmin } from '@lib/auth';
import { verify } from 'jsonwebtoken';

const TZ = 'Europe/Kyiv';

async function authGuard(req: NextRequest): Promise<NextResponse | null> {
  // 1) Попытка по JWT
  const auth = req.headers.get('authorization') ?? '';
  if (auth.startsWith('Bearer ')) {
    const token = auth.slice('Bearer '.length);
    try {
      verify(token, process.env.JWT_SECRET!);
      return null; // JWT валиден — дальше можно выполнять логику
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  // 2) Иначе — проверяем сессию NextAuth
  const denied = await requireAdmin();
  if (denied) {
    // requireAdmin вернул редирект или ошибку
    return denied;
  }
  return null;
}

function getIdFromUrl(url: string): number {
  const parts = new URL(url).pathname.split('/');
  return Number(parts[parts.length - 1]);
}

export async function GET(req: NextRequest) {
  // Авторизация (JWT или cookie-сессия)
  const guard = await authGuard(req);
  if (guard) return guard;

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
    where.startTime = { gte: d0.toISOString(), lt: d1.toISOString() };
  } else {
    where.startTime = {
      gte: new Date(from!).toISOString(),
      lt: new Date(to!).toISOString(),
    };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { startTime: 'asc' },
    include: {
      clientRel: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, color: true } },
    },
  });

  return NextResponse.json(appointments, { status: 200 });
}

export async function POST(req: NextRequest) {
  const guard = await authGuard(req);
  if (guard) return guard;

  const { startTime, duration, client, clientId, notes, price, locationId } = await req.json();
  if (typeof locationId !== 'number') {
    return NextResponse.json({ error: 'Нужно передать locationId (число)' }, { status: 400 });
  }

  const newStart = new Date(startTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  // Проверка конфликтов
  const all = await prisma.appointment.findMany();
  for (const appt of all) {
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

  const data: any = {
    startTime: newStart.toISOString(),
    duration,
    clientId: clientId || null,
    notes: notes?.trim() || null,
    price,
    locationId,
  };
  if (!clientId && typeof client === 'string') {
    data.client = client.trim();
  }

  const appt = await prisma.appointment.create({
    data,
    include: {
      clientRel: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, color: true } },
    },
  });

  revalidatePath('/admin/appointments');
  return NextResponse.json(appt, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const guard = await authGuard(req);
  if (guard) return guard;

  const id = getIdFromUrl(req.url);
  const { startTime, duration, client, clientId, notes, price, locationId } = await req.json();
  if (typeof locationId !== 'number') {
    return NextResponse.json({ error: 'Нужно передать locationId (число)' }, { status: 400 });
  }

  const newStart = new Date(startTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000);

  // Проверяем конфликты в тот же день
  const dayStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate());
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
  const existing = await prisma.appointment.findMany({
    where: {
      AND: [
        { id: { not: id } },
        { startTime: { gte: dayStart.toISOString(), lt: dayEnd.toISOString() } },
      ],
    },
  });

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

  const data: any = {
    startTime: newStart.toISOString(),
    duration,
    clientId: clientId || null,
    notes: notes?.trim() || null,
    price,
    locationId,
  };
  if (!clientId && typeof client === 'string') {
    data.client = client.trim();
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data,
    include: {
      clientRel: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, color: true } },
    },
  });

  revalidatePath('/admin/appointments');
  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const guard = await authGuard(req);
  if (guard) return guard;

  const id = getIdFromUrl(req.url);
  await prisma.appointment.delete({ where: { id } });
  revalidatePath('/admin/appointments');

  return NextResponse.json({ success: true }, { status: 200 });
}
