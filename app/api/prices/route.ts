// app/api/prices/route.ts
import { NextResponse } from 'next/server';
import prismaRead from '@lib/prismaRead';

export async function GET() {
  // читаем только через prismaRead
  const prices = await prismaRead.prices.findMany({
    orderBy: { position: 'asc' },
  });
  return NextResponse.json(prices);
}
