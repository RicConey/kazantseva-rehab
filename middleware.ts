// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Защита UI-части админки
  if (pathname.startsWith('/admin')) {
    // проверяем JWT-токен из куки
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    // если нет токена или нет роли admin — редиректим на login
    if (!token || token.role !== 'admin') {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/auth/login';         // ваш роут авторизации
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // есть доступ — подставляем ваши заголовки
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, private');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // 2) Защита API-эндпоинтов админки
  if (pathname.startsWith('/api/admin')) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    // если не авторизован — возвращаем 401 JSON
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
          { message: 'Not authorized' },
          { status: 401 },
      );
    }
    // иначе пропускаем дальше к вашему API-хендлеру
  }

  // всё остальное без изменений
  return NextResponse.next();
}

// указываем, на какие пути применять middleware
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
