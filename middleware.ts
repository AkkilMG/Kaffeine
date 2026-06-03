import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/', '/login', '/register'];
  const apiPrefix = '/api';
  const staticPrefixes = ['/_next/static', '/_next/image', '/favicon.ico'];

  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const isApiRoute = pathname.startsWith(apiPrefix);
  const isStatic = staticPrefixes.some(prefix => pathname.startsWith(prefix));
  const isCfRoute = pathname.startsWith('/api/cf');

  if (isStatic || isPublicRoute) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session');

  if (isCfRoute) {
    return NextResponse.next();
  }

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
