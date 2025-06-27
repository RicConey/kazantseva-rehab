// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const loginLimiter = new RateLimiterMemory({ points: 5, duration: 15 * 60 });

export async function POST(request: NextRequest) {
  // 1. Анти-брутфорс: вытягиваем IP из заголовков
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown';

  try {
    await loginLimiter.consume(clientIp);
  } catch {
    return NextResponse.json({ error: 'TooManyRequests' }, { status: 429 });
  }

  // 2. Читаем тело JSON
  const { username, password } = await request.json();

  // 3. Проверяем логин/пароль
  if (username !== process.env.ADMIN_USERNAME) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const passOk = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);
  if (!passOk) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 4. Генерируем JWT
  const token = jwt.sign({ sub: 'admin', role: 'admin' }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  // 5. Отдаём клиенту
  return NextResponse.json({ token }, { status: 200 });
}
