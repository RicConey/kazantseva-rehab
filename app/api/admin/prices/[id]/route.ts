// app/api/admin/prices/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@lib/auth';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  // Проверяем сессию
  const denied = await requireAdmin();
  if (denied) return denied;

  // Берём id из URL: /api/admin/prices/<id>
  const parts = req.nextUrl.pathname.split('/');
  const rawId = parts[parts.length - 1];
  const id = Number(rawId);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Читаем тело и обновляем
  const data = await req.json();
  const updated = await prisma.prices.update({
    where: { id },
    data,
  });
  await prisma.$disconnect();
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  // Проверяем сессию
  const denied = await requireAdmin();
  if (denied) return denied;

  // Берём id из URL
  const parts = req.nextUrl.pathname.split('/');
  const rawId = parts[parts.length - 1];
  const id = Number(rawId);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Удаляем запись
  await prisma.prices.delete({ where: { id } });
  await prisma.$disconnect();
  return NextResponse.json({ success: true });
}
