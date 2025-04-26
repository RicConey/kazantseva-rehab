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

  // 2) await params → извлекаем id
  const { id } = await params;

  // 3) Читаем клиента вместе с сеансами
  const client = await prisma.client.findUnique({
    where: { id },
    include: { appointments: true },
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

  // 2) await params → извлекаем id
  const { id } = await params;
  // 3) Парсим тело запроса
  const { phone, name, birthDate, notes } = await req.json();

  try {
    // 4) Обновляем клиента
    const updated = await prisma.client.update({
      where: { id },
      data: {
        phone,
        name,
        birthDate: parseDateDMY(birthDate),
        notes,
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

  // 2) await params → извлекаем id
  const { id } = await params;

  try {
    // 3) Удаляем клиента
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Не вдалося видалити' }, { status: 500 });
  }
}
