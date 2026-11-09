import { type NextRequest, NextResponse } from 'next/server';

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || 'https://auth.arkynox.com';
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID || 'kaffeine';

/**
 * Kaffeine's request proxy.
 *
 * Next.js 16 renamed Middleware to Proxy and requires the file to sit next to
 * the app directory (this project uses `src/app`, so it belongs in `src/`).
 * Protected pages redirect to the central Arkynox auth server and carry the
 * exact path + query string in `state`, so the user lands back where they
 * started after signing in.
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes — no auth needed.
    if (
        pathname === '/' ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/api/auth/callback' ||
        pathname.startsWith('/policy') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/assets')
    ) {
        return NextResponse.next();
    }

    const session = request.cookies.get('session');

    if (!session) {
        // Redirect to auth.arkynox.com with a return URL.
        const callbackUrl = `${request.nextUrl.origin}/api/auth/callback`;
        const params = new URLSearchParams({
            client_id: AUTH_CLIENT_ID,
            redirect_uri: callbackUrl,
            response_type: 'code',
            scope: 'openid profile email',
            state: `${pathname}${request.nextUrl.search}`,
        });

        const authUrl = new URL('/signin', AUTH_SERVER_URL);
        authUrl.searchParams.set('redirect', `/api/auth/authorize?${params.toString()}`);

        return NextResponse.redirect(authUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};
