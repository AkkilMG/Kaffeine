import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/api-utils';

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || 'https://auth.arkynox.com';

/**
 * POST /api/auth/logout
 *
 * Clears the local Kaffeine session cookie AND returns a redirect URL to the
 * Arkynox auth server's global-logout endpoint. When the client navigates the
 * browser there, the auth-domain session cookie is sent automatically,
 * revoking all refresh tokens across every Arkynox platform.
 *
 * Flow:
 *   1. Clear local Kaffeine session cookie
 *   2. Return auth server's signout URL with redirect back to Kaffeine
 *   3. Client redirects browser → auth server revokes everything → redirects back
 */
export async function POST(request: NextRequest) {
    // Clear the local session cookie first.
    const response = NextResponse.json({ message: 'Logged out successfully' });
    clearSessionCookie(response);

    // Build the auth server's global-logout URL.
    const appOrigin = new URL(request.url).origin;
    const signoutUrl = `${AUTH_SERVER_URL}/api/auth/signout?redirect=${encodeURIComponent(appOrigin)}`;

    return NextResponse.json({ message: 'Logged out successfully', redirectUrl: signoutUrl });
}

/**
 * GET /api/auth/logout
 * Redirects the browser to the auth server for full SSO logout.
 * The auth server revokes all tokens, clears its session, and redirects back.
 */
export async function GET(request: NextRequest) {
    // Always clear the local session first.
    const appOrigin = new URL(request.url).origin;
    const signoutUrl = `${AUTH_SERVER_URL}/api/auth/signout?redirect=${encodeURIComponent(appOrigin)}`;
    const response = NextResponse.redirect(signoutUrl);
    clearSessionCookie(response);
    return response;
}
