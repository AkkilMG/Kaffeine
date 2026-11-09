/**
 * Kaffeine Auth Utilities
 *
 * After centralization, session tokens are still local JWTs (signed with
 * Kaffeine's own JWT_SECRET) but are minted only after a successful OAuth
 * code exchange with auth.arkynox.com.
 *
 * The CF Worker token system remains unchanged — it uses a separate secret.
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

const rawJwtSecret = process.env.JWT_SECRET;

// Defer the secret validation to runtime so builds don't fail.
// At runtime, if the secret is missing, the first API call will throw.
function getJwtSecret(): string {
    if (!rawJwtSecret || rawJwtSecret === 'your-jwt-secret') {
        throw new Error('JWT_SECRET environment variable is not set or is using the default value.');
    }
    return rawJwtSecret;
}

const JWT_SECRET: string = rawJwtSecret || '';
const SESSION_EXPIRY = '7d';

export interface SessionPayload {
    userId: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string,
    ) {
        super(message);
    }
}

/** Verify a generic JWT (used for CF Worker tokens). */
export function verifyJWT(token: string): Record<string, unknown> {
    try {
        return jwt.verify(token, getJwtSecret()) as Record<string, unknown>;
    } catch {
        throw new ApiError(401, 'Invalid or expired token');
    }
}

/** Generate a generic JWT (used for CF Worker tokens). */
export function generateJWT(
    payload: Record<string, unknown>,
    expiresIn: SignOptions['expiresIn'] = '30m',
): string {
    return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

/** Create a local session token after successful auth via auth.arkynox.com. */
export function createSessionToken(payload: SessionPayload): string {
    return jwt.sign(
        { ...payload, type: 'session' },
        getJwtSecret(),
        { expiresIn: SESSION_EXPIRY },
    );
}

/** Verify a local session token. */
export function verifySessionToken(token: string): SessionPayload | null {
    try {
        const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload & {
            userId?: string;
            email?: string;
            name?: string;
            role?: string;
            type?: string;
        };
        if (!decoded.userId || !decoded.role) return null;
        return {
            userId: decoded.userId as string,
            email: (decoded.email as string) || '',
            name: (decoded.name as string) || '',
            role: (decoded.role as 'admin' | 'user') || 'user',
        };
    } catch {
        return null;
    }
}

/** Read session from request cookies. */
export function getSessionUser(request: NextRequest): SessionPayload | null {
    const session = request.cookies.get('session')?.value;
    if (!session) return null;
    return verifySessionToken(session);
}

/** Read session or throw 401. */
export function getSessionFromRequest(request: NextRequest): SessionPayload {
    const user = getSessionUser(request);
    if (!user) {
        throw new ApiError(401, 'Not authenticated');
    }
    return user;
}

export function isAdmin(request: NextRequest): boolean {
    const user = getSessionUser(request);
    return user?.role === 'admin';
}

export function getAdminUser(request: NextRequest): SessionPayload {
    const user = getSessionFromRequest(request);
    if (user.role !== 'admin') {
        throw new ApiError(403, 'Admin access required');
    }
    return user;
}

export function getAuthHeader(request: NextRequest): string {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Missing or invalid authorization header');
    }
    return authHeader.substring(7);
}

export function handleApiError(error: unknown): NextResponse {
    if (error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message, code: error.code },
            { status: error.statusCode },
        );
    }

    if (error instanceof Error && error.name === 'BSONError') {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    console.error('[Kaffeine] API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function validateRequestBody(request: NextRequest): Promise<Record<string, unknown>> {
    try {
        return await request.json();
    } catch {
        throw new ApiError(400, 'Invalid JSON body');
    }
}

export function isValidObjectId(id: string): boolean {
    try {
        return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
    } catch {
        return false;
    }
}

export function requireValidObjectId(id: string): ObjectId {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid ID format');
    }
    return new ObjectId(id);
}

export function normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
}

/** Set a local session cookie after successful auth. */
export function setSessionCookie(response: NextResponse, token: string) {
    response.cookies.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

/** Clear the local session cookie. */
export function clearSessionCookie(response: NextResponse) {
    response.cookies.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
}

// Simple in-memory rate limiter for API routes
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
    key: string,
    maxRequests: number = 10,
    windowMs: number = 60000,
): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetAt) {
        rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
    }

    if (record.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetAt: record.resetAt };
    }

    record.count++;
    return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of rateLimitStore.entries()) {
            if (now > record.resetAt) {
                rateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}
