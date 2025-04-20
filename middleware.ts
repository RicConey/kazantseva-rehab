// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1) только UI-пути админки
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const res = NextResponse.next();

    // 2) блокируем кэширование HTML (UI)
    res.headers.set('Cache-Control', 'no-store, private');

    // 3) говорим роботам не индексировать
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

    return res;
  }
  return NextResponse.next();
}

// Применяем middleware только к /admin/…
// Все /api/... (в том числе /api/appointments) будут обходиться
export const config = {
  matcher: ['/admin/:path*'],
};
