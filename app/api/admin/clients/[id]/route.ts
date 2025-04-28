// app/api/admin/clients/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { requireAdmin } from '@lib/auth';

/** Парсер даты из формата "dd.mm.yyyy" */
function parseDateDMY(str: string): Date {
  const [d, m, y] = str.split('.');
  return new Date(`${y}-${m}-${d}`);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 1) Проверка прав
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) извлекаем id
  const { id } = await params;

  // 3) Читаем клиента вместе с сеансами и их локациями
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        include: {
          location: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: { startTime: 'asc' },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: 'Клієнт не знайдений' }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 1) Проверка прав
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) извлекаем id
  const { id } = await params;

  // 3) парсим тело запроса
  const { phone, name, birthDate, notes, messengerTypes } = await req.json();

  try {
    // 4) обновляем клиента
    const updated = await prisma.client.update({
      where: { id },
      data: {
        phone,
        name,
        birthDate: parseDateDMY(birthDate),
        notes,
        messengerTypes,
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Не вдалося оновити' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 1) Проверка прав
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) извлекаем id
  const { id } = await params;

  try {
    // 3) удаляем клиента
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Не вдалося видалити' }, { status: 500 });
  }
}
