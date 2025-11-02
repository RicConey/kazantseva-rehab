// app/api/prices/route.ts

// Next.js caching & tags
// export const dynamic = 'force-dynamic';
export const revalidate = 604800; // 1 неделя
export const tags = ['prices'];

import { NextResponse } from 'next/server';
import prismaRead from '@lib/prismaRead';

export async function GET() {
  // Читаем из БД под read-only клиентом
  const prices = await prismaRead.prices.findMany({
    orderBy: { position: 'asc' },
  });

  return NextResponse.json(prices);
}
