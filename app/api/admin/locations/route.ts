// app/api/admin/locations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { requireAdmin } from '@lib/auth';

/**
 * GET /api/admin/locations
 * Возвращает все кабинеты в порядке position для селекта в админке.
 */
export async function GET(req: NextRequest) {
  // Проверяем, что пользователь — админ
  const denied = await requireAdmin();
  if (denied) return denied;

  // Читаем из БД
  const locations = await prisma.location.findMany({
    orderBy: { position: 'asc' },
    select: { id: true, name: true },
  });

  return NextResponse.json(locations);
}
