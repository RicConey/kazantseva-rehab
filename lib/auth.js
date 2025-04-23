// lib/auth.ts
import { getServerSession } from 'next-auth';
import authConfig from '../app/api/auth/[...nextauth]/auth.config';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
