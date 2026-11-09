import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db';
import { User } from '@/lib/types';
import { createSessionToken, setSessionCookie, handleApiError } from '@/lib/api-utils';

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || 'https://auth.arkynox.com';
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID || 'kaffeine';

/**
 * GET /api/auth/callback
 *
 * Handles the redirect from auth.arkynox.com after successful authentication.
 * Exchanges the authorization code for user info, creates/updates local user record,
 * and sets a local session cookie.
 *
 * Flow:
 *   1. User authenticates at auth.arkynox.com
 *   2. auth.arkynox.com redirects here with ?code=...
 *   3. We exchange the code at auth.arkynox.com/api/auth/token
 *   4. We create/update a local user record
 *   5. We set a local session cookie and redirect to the dashboard
 */
export async function GET(request: NextRequest) {
    try {
        const code = request.nextUrl.searchParams.get('code');
        const state = request.nextUrl.searchParams.get('state') || '';
        const origin = request.nextUrl.origin;
        const callbackUrl = `${origin}/api/auth/callback`;

        if (!code) {
            return NextResponse.redirect(`${origin}/login?error=auth_failed`);
        }

        // Exchange code for tokens + user info at auth.arkynox.com.
        const tokenRes = await fetch(`${AUTH_SERVER_URL}/api/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code,
                client_id: AUTH_CLIENT_ID,
                client_secret: process.env.AUTH_CLIENT_SECRET,
                redirect_uri: callbackUrl,
            }),
        });

        if (!tokenRes.ok) {
            console.error('[Kaffeine] Token exchange failed:', await tokenRes.text());
            return NextResponse.redirect(`${origin}/login?error=token_exchange_failed`);
        }

        const tokenData = await tokenRes.json();
        const { user } = tokenData;

        if (!user || !user.id) {
            return NextResponse.redirect(`${origin}/login?error=no_user_info`);
        }

        // Create or update local user record (JIT provisioning).
        const db = await getDatabase();
        const usersCollection = db.collection<User>('users');

        // Try to find by auth server user ID (stored as externalId).
        let localUser = await usersCollection.findOne({ externalId: user.id });

        if (!localUser && user.email) {
            // Fallback: find by email.
            localUser = await usersCollection.findOne({ email: user.email.toLowerCase() });
        }
        if (localUser) {
            // Update existing user with latest info from auth server.
            await usersCollection.updateOne(
                { _id: localUser._id },
                {
                    $set: {
                        externalId: user.id,
                        name: user.name || localUser.name,
                        email: user.email ? user.email.toLowerCase() : localUser.email,
                        role: user.role === 'admin' ? 'admin' : localUser.role,
                        updatedAt: new Date(),
                    },
                },
            );
        } else {
            // Create new local user.
            const newUser: User & { externalId: string } = {
                externalId: user.id,
                email: user.email ? user.email.toLowerCase() : '',
                passwordHash: '', // No local password — auth is centralized.
                name: user.name || 'User',
                role: user.role === 'admin' ? 'admin' : 'user',
                banned: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const result = await usersCollection.insertOne(newUser as any);
            localUser = await usersCollection.findOne({ _id: result.insertedId });
        }

        if (!localUser) {
            return NextResponse.redirect(`${origin}/login?error=user_creation_failed`);
        }

        if (localUser.banned) {
            return NextResponse.redirect(`${origin}/login?error=account_banned`);
        }

        // Create local session token.
        const sessionToken = createSessionToken({
            userId: localUser._id!.toString(),
            email: localUser.email,
            name: localUser.name,
            role: localUser.role || 'user',
        });

        // Parse the post-login destination. `state` is normally a plain path;
        // the JSON form is accepted for links created by older builds.
        let redirectTo = '/dashboard';
        if (state) {
            let candidate = state;
            if (state.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(decodeURIComponent(state));
                    candidate = parsed.returnTo || '';
                } catch {
                    candidate = '';
                }
            }
            if (candidate.startsWith('/') && !candidate.startsWith('//')) {
                redirectTo = candidate;
            }
        }

        // Redirect and attach the session cookie to the same response.
        const response = NextResponse.redirect(new URL(redirectTo, origin));
        setSessionCookie(response, sessionToken);
        return response;
    } catch (error) {
        console.error('[Kaffeine] Auth callback error:', error);
        return NextResponse.redirect(`${request.nextUrl.origin}/login?error=auth_error`);
    }
}
