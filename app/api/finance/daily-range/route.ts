// app/api/finance/daily-range/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@lib/auth';

export async function GET(req: NextRequest) {
  // 1) Проверяем, что пользователь авторизован
  const denied = await requireAdmin();
  if (denied) return denied;

  // 2) Читаем from/to из query
  const from = req.nextUrl.searchParams.get('from')!;
  const to = req.nextUrl.searchParams.get('to')!;

  // 3) Обрезаем to «вчерашним» днём
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yestStr = yesterday.toISOString().slice(0, 10);
  const toDate = to > yestStr ? yestStr : to;

  // 4) Делаем запрос к базе
  const prisma = new PrismaClient();
  try {
    const sql = `
      WITH gs AS (
        SELECT generate_series(
          date '${from}',
          date '${toDate}',
          '1 day'::interval
        )::date AS day
      )
      SELECT
        to_char(gs.day, 'YYYY-MM-DD') AS "periodStart",
        coalesce(sum(a.price), 0)::text AS total
      FROM gs
      LEFT JOIN appointments a
        ON a."startTime"::date = gs.day
        AND a."startTime" < now()
      GROUP BY gs.day
      ORDER BY gs.day;
    `;

    // Используем $queryRawUnsafe, чтобы подставить даты непосредственно в SQL
    const rows = await prisma.$queryRawUnsafe<{ periodStart: string; total: string }[]>(sql);

    // 5) Преобразуем total из string в number
    const result = rows.map(r => ({
      periodStart: r.periodStart,
      total: Number(r.total),
    }));

    return NextResponse.json(result);
  } finally {
    await prisma.$disconnect();
  }
}
