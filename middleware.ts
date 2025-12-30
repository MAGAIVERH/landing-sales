import { NextResponse, type NextRequest } from 'next/server';
import {
  getAdminCookieName,
  verifyAdminSessionCookieValue,
} from '@/lib/admin-session';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isLoginPage = pathname === '/admin/login';

  // ✅ IMPORTANTÍSSIMO: não bloquear o endpoint de login
  const isAdminLoginApi = pathname === '/api/admin/login';

  // (opcional) deixe o logout passar mesmo sem sessão,
  // para "limpar" cookie no client sem dor de cabeça
  const isAdminLogoutApi = pathname === '/api/admin/logout';

  if (isAdminLoginApi || isAdminLogoutApi) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(getAdminCookieName())?.value ?? null;

  // ✅ verify é async agora
  const verified = await verifyAdminSessionCookieValue(cookie);

  if (verified.ok) {
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // APIs: 401
  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // páginas: manda para login com next (inclui querystring)
  if (!isLoginPage) {
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
