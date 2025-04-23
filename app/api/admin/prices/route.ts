// app/api/admin/prices/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@lib/auth';
import { revalidateTag } from 'next/cache';

const prisma = new PrismaClient();

// Все админские мутации будем сбрасывать кэш публичного API с тегом "prices"
const TAG = 'prices';

export async function GET(req: NextRequest) {
  // Проверка сессии
  const denied = await requireAdmin();
  if (denied) return denied;

  // Возвращаем все записи, отсортированные по position
  const prices = await prisma.prices.findMany({
    orderBy: { position: 'asc' },
  });
  await prisma.$disconnect();
  return NextResponse.json(prices);
}

export async function POST(req: NextRequest) {
  // Проверка сессии
  const denied = await requireAdmin();
  if (denied) return denied;

  // Читаем тело
  const data = await req.json();

  // Находим максимальную позицию
  const last = await prisma.prices.findFirst({
    orderBy: { position: 'desc' },
    select: { position: true },
  });
  const nextPosition = last ? last.position + 1 : 1;

  // Создаём новую запись с правильной позицией
  const created = await prisma.prices.create({
    data: {
      ...data,
      position: nextPosition,
    },
  });

  await prisma.$disconnect();

  // Сбрасываем кэш публичного API /api/prices (tag="prices")
  revalidateTag(TAG);

  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = req.nextUrl.searchParams.get('id');
  const data = await req.json();

  const updated = await prisma.prices.update({
    where: { id: Number(id) },
    data,
  });
  await prisma.$disconnect();

  revalidateTag(TAG);

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = req.nextUrl.searchParams.get('id');
  await prisma.prices.delete({ where: { id: Number(id) } });
  await prisma.$disconnect();

  revalidateTag(TAG);

  return NextResponse.json({ success: true });
}
