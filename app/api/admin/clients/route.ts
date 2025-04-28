// app/api/admin/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { requireAdmin } from '@lib/auth';
import { Prisma } from '@prisma/client';

function parseDateDMY(str: string): Date {
  // Якщо приходить «YYYY-MM-DD», просто конвертуємо без розбору через крапки
  if (str.includes('-')) {
    return new Date(str);
  }
  const [d, m, y] = str.split('.');
  return new Date(`${y}-${m}-${d}`);
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  // вернёт все поля, включая messengerTypes
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  // теперь читаем messengerTypes из тела запроса
  const { phone, name, birthDate, notes, messengerTypes } = (await req.json()) as {
    phone: string;
    name: string;
    birthDate: string;
    notes?: string | null;
    messengerTypes?: Array<'telegram' | 'whatsapp' | 'viber'>;
  };

  try {
    const client = await prisma.client.create({
      data: {
        phone,
        name,
        birthDate: parseDateDMY(birthDate),
        notes,
        // и сохраняем массив mессенджеров
        messengerTypes: messengerTypes || [],
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // повторный уникальный телефон
      if (
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('phone')
      ) {
        return NextResponse.json(
          { message: 'Клієнт з таким номером телефону вже існує.' },
          { status: 409 }
        );
      }
    }
    console.error('Помилка створення клієнта:', error);
    return NextResponse.json(
      {
        message:
          'Не вдалося створити клієнта. Сервер тимчасово недоступний. Спробуйте, будь ласка, пізніше.',
      },
      { status: 503 }
    );
  }
}
