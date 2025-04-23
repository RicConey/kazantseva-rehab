// app/api/admin/prices/[id]/move/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@lib/auth';
import { revalidateTag } from 'next/cache';

const prisma = new PrismaClient();
const TAG = 'prices';

export async function PUT(req: NextRequest) {
  // 1) Авторизация
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) Парсим id из URL: .../api/admin/prices/<id>/move
  const segments = req.nextUrl.pathname.split('/');
  // ['', 'api', 'admin', 'prices', '<id>', 'move']
  const rawId = segments[segments.length - 2];
  const id = Number(rawId);
  if (isNaN(id)) {
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // 3) Парсим direction из query
  const direction = req.nextUrl.searchParams.get('direction');
  if (direction !== 'up' && direction !== 'down') {
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Invalid direction' }, { status: 400 });
  }

  // 4) Находим саму запись
  const record = await prisma.prices.findUnique({ where: { id } });
  if (!record) {
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 5) Находим соседний элемент для обмена позиций
  const swapWith = await prisma.prices.findFirst({
    where: {
      position: direction === 'up'
          ? { lt: record.position }
          : { gt: record.position },
    },
    orderBy: {
      position: direction === 'up' ? 'desc' : 'asc',
    },
  });

  // 6) Меняем позиции, если сосед найден
  if (swapWith) {
    await prisma.$transaction([
      prisma.prices.update({
        where: { id: record.id },
        data: { position: swapWith.position },
      }),
      prisma.prices.update({
        where: { id: swapWith.id },
        data: { position: record.position },
      }),
    ]);
  }

  await prisma.$disconnect();

  // 7) Сбрасываем кэш публичного прайса
  revalidateTag(TAG);

  return NextResponse.json({ success: true });
}
