// app/api/finance/monthly-range/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  const prisma = new PrismaClient();
  try {
    // Год из query или текущий
    const yearParam = req.nextUrl.searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    // Начало серии — 1 января, конец — 1 декабря (12 месяцев)
    const seriesStart = `${year}-01-01` as const;
    const seriesEnd = `${year}-12-01` as const;

    // SQL: для каждого gs.mon считаем сеансы от gs.mon (начало месяца)
    // до min(gs.mon + 1 month, current_date) — т.е. для текущего мес. до вчерашнего дня,
    // для прошлых месяцев — полный месяц, для будущих — пусто.
    const rows = await prisma.$queryRaw<{ periodStart: string; total: string }[]>`
      SELECT
        to_char(gs.mon, 'YYYY-MM-01')          AS "periodStart",
        COALESCE(SUM(a.price), 0)::text        AS total
      FROM generate_series(
             ${seriesStart}::date,
             ${seriesEnd}::date,
             '1 month'
           ) AS gs(mon)
      LEFT JOIN "appointments" a
        ON a."startTime" >= gs.mon
        AND a."startTime" < least(
             gs.mon + INTERVAL '1 month',
             current_date::timestamp
           )
      GROUP BY gs.mon
      ORDER BY gs.mon;
    `;

    await prisma.$disconnect();

    // Приводим total к числу
    return NextResponse.json(
      rows.map(r => ({
        periodStart: r.periodStart,
        total: parseFloat(r.total),
      }))
    );
  } finally {
    await prisma.$disconnect();
  }
}
