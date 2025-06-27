import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const { NEXTAUTH_SECRET } = process.env;

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();
  if (!refreshToken) {
    return NextResponse.json({ error: 'Missing refreshToken' }, { status: 400 });
  }

  try {
    const payload = jwt.verify(refreshToken, NEXTAUTH_SECRET!) as any;
    const newAccessToken = jwt.sign({ sub: payload.sub, role: payload.role }, NEXTAUTH_SECRET!, {
      algorithm: 'HS256',
      expiresIn: '2h',
    });
    const newRefreshToken = jwt.sign({ sub: payload.sub, role: payload.role }, NEXTAUTH_SECRET!, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });
    return NextResponse.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    return NextResponse.json({ error: 'Invalid refreshToken' }, { status: 401 });
  }
}
