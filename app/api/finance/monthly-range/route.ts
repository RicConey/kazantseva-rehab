// app/api/finance/monthly-range/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@lib/auth';

export async function GET(req: NextRequest) {
  // 1) Проверяем сессию
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) Парсим год из query или берём текущий
  const yearParam = req.nextUrl.searchParams.get('year');
  const year = yearParam ? Number(yearParam) : new Date().getFullYear();

  // 3) Определяем последний полностью прошедший месяц (первое число)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const lastYear = yesterday.getFullYear();
  const lastMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
  const maxMonthStr = `${lastYear}-${lastMonth}-01`;

  // 4) Границы серии: с 1 января до либо maxMonthStr (если тот же год), либо до 1 декабря
  const seriesStart = `${year}-01-01`;
  const seriesEnd = lastYear === year ? maxMonthStr : `${year}-12-01`;

  const prisma = new PrismaClient();
  try {
    // 5) Собираем SQL вручную и выполняем через $queryRawUnsafe
    const sql = `
            WITH gs AS (
                SELECT generate_series(
                               date '${seriesStart}',
                               date '${seriesEnd}',
                               '1 month'::interval
                       )::date AS mon
            )
            SELECT
                to_char(gs.mon, 'YYYY-MM-01') AS "periodStart",
                coalesce(sum(a.price), 0)::text AS total
            FROM gs
                     LEFT JOIN appointments a
                               ON date_trunc('month', a."startTime") = gs.mon
                                   AND a."startTime" < date_trunc('day', now())  -- только прошлые дни
            GROUP BY gs.mon
            ORDER BY gs.mon;
        `;

    const rows = await prisma.$queryRawUnsafe<{ periodStart: string; total: string }[]>(sql);

    // 6) Преобразуем total в число и возвращаем JSON
    const result = rows.map(r => ({
      periodStart: r.periodStart,
      total: Number(r.total),
    }));
    return NextResponse.json(result);
  } finally {
    await prisma.$disconnect();
  }
}
