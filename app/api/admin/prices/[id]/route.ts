// app/api/admin/prices/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@lib/auth';
import { revalidateTag } from 'next/cache';

const prisma = new PrismaClient();
const TAG = 'prices';

export async function PUT(req: NextRequest) {
  // 1) Проверка сессии
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) Извлечение ID из URL
  const parts = req.nextUrl.pathname.split('/');
  const rawId = parts[parts.length - 1];
  const id = Number(rawId);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // 3) Выполняем обновление
  const data = await req.json();
  const updated = await prisma.prices.update({
    where: { id },
    data,
  });
  await prisma.$disconnect();

  // 4) Сброс кэша публичного прайса
  revalidateTag(TAG);

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  // 1) Проверка сессии
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) Извлечение ID из URL
  const parts = req.nextUrl.pathname.split('/');
  const rawId = parts[parts.length - 1];
  const id = Number(rawId);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // 3) Удаляем запись
  await prisma.prices.delete({ where: { id } });
  await prisma.$disconnect();

  // 4) Сброс кэша публичного прайса
  revalidateTag(TAG);

  return NextResponse.json({ success: true });
}
