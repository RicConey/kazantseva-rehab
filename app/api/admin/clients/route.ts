// app/api/admin/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { requireAdmin } from '@lib/auth';

function parseDateDMY(str: string): Date {
  const [d, m, y] = str.split('.');
  return new Date(`${y}-${m}-${d}`);
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { phone, name, birthDate, notes } = await req.json();
  const client = await prisma.client.create({
    data: { phone, name, birthDate: parseDateDMY(birthDate), notes },
  });
  return NextResponse.json(client, { status: 201 });
}
