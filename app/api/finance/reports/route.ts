import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period'); // day, week, month, year

  const reports = await prisma.financeReport.findMany({
    where: { periodType: period || undefined },
    orderBy: { periodStart: 'desc' },
    take: 10,
  });

  return NextResponse.json(reports);
}
