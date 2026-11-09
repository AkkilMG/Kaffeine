import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db';
import { User } from '@/lib/types';
import { verifySessionToken, clearSessionCookie } from '@/lib/api-utils';

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || 'https://auth.arkynox.com';
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID || 'kaffeine';

/**
 * GET /api/auth — Check current session.
 * Returns user info if a valid session cookie exists.
 */
export async function GET(request: NextRequest) {
    try {
        const session = request.cookies.get('session')?.value;
        if (!session) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const sessionData = verifySessionToken(session);
        if (!sessionData) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Verify the user still exists and isn't banned.
        const db = await getDatabase();
        const user = await db.collection<User>('users').findOne(
            { _id: new ObjectId(sessionData.userId) },
            { projection: { banned: 1, name: 1, email: 1, role: 1 } },
        );

        if (!user || user.banned) {
            const response = NextResponse.json({ authenticated: false }, { status: 401 });
            clearSessionCookie(response);
            return response;
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                userId: sessionData.userId,
                email: user.email || sessionData.email,
                name: user.name || sessionData.name,
                role: user.role || sessionData.role,
            },
        });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}

/**
 * POST /api/auth — Deprecated. Auth is now handled by auth.arkynox.com.
 * This endpoint is kept for backward compatibility but returns a redirect hint.
 */
export async function POST(request: NextRequest) {
    // Redirect clients to the auth server.
    const origin = request.nextUrl.origin;
    const callbackUrl = `${origin}/api/auth/callback`;

    const authUrl = new URL('/signin', AUTH_SERVER_URL);
    authUrl.searchParams.set('client_id', AUTH_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', callbackUrl);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email');

    return NextResponse.json({
        redirectTo: authUrl.toString(),
        message: 'Authentication is now handled by Arkynox Auth. Please sign in there.',
    });
}
