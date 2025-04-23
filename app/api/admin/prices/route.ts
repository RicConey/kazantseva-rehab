// app/api/admin/prices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@lib/auth';

const prisma = new PrismaClient();

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
  return NextResponse.json(created);
}
