import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, NEXTAUTH_SECRET } = process.env;

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  // проверяем учётку
  const validUser = username === ADMIN_USERNAME;
  const validPass = await bcrypt.compare(password, ADMIN_PASSWORD_HASH!);
  if (!validUser || !validPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // формируем JWT
  const payload = { sub: 'admin', role: 'admin' };
  const accessToken = jwt.sign(payload, NEXTAUTH_SECRET!, { algorithm: 'HS256', expiresIn: '2h' });
  const refreshToken = jwt.sign(payload, NEXTAUTH_SECRET!, { algorithm: 'HS256', expiresIn: '7d' });

  return NextResponse.json({ accessToken, refreshToken });
}
