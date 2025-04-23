// app/api/admin/prices/[id]/move/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@lib/auth';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  // получаем id из пути и direction из query
  const parts = req.nextUrl.pathname.split('/');
  const id = Number(parts[parts.length - 2]); // [..., "[id]", "move"]
  const direction = req.nextUrl.searchParams.get('direction');

  const record = await prisma.prices.findUnique({ where: { id } });
  if (!record) {
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // находим соседний элемент
  const swapWith = await prisma.prices.findFirst({
    where: {
      position: direction === 'up' ? { lt: record.position } : { gt: record.position },
    },
    orderBy: {
      position: direction === 'up' ? 'desc' : 'asc',
    },
  });

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
  return NextResponse.json({ success: true });
}
