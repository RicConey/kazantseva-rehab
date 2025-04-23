// app/api/finance/daily-range/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  const prisma = new PrismaClient();
  try {
    // Парсим from/to из query (формат YYYY-MM-DD)
    const fromStr = req.nextUrl.searchParams.get('from')!;
    const toStr = req.nextUrl.searchParams.get('to')!;

    // Вычисляем вчерашний день (строка YYYY-MM-DD)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toISOString().slice(0, 10);

    // Конечная дата серии — не позже вчерашнего
    const endStr = toStr < yestStr ? toStr : yestStr;

    // Генерируем серию дней только до вчерашнего
    const rows = await prisma.$queryRaw<{ periodStart: string; total: string }[]>`
      SELECT
        to_char(gs.day, 'YYYY-MM-DD')     AS "periodStart",
        COALESCE(SUM(a.price), 0)::text    AS total
      FROM generate_series(
             ${fromStr}::date,
             ${endStr}::date,
             '1 day'
           ) AS gs(day)
      LEFT JOIN "appointments" a
        ON a."startTime"::date = gs.day
        AND a."startTime" <= now()      -- лишние будущие не попадают
      GROUP BY gs.day
      ORDER BY gs.day;
    `;

    // Парсим строки в числа
    const result = rows.map(r => ({
      periodStart: r.periodStart,
      total: parseFloat(r.total),
    }));

    return NextResponse.json(result);
  } finally {
    await prisma.$disconnect();
  }
}
