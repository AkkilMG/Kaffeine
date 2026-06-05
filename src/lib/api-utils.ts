import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

const rawJwtSecret = process.env.JWT_SECRET;

if (!rawJwtSecret || rawJwtSecret === 'your-jwt-secret') {
  throw new Error('JWT_SECRET environment variable is not set or is using the default value. Generate a secure random key (min 32 chars).');
}

const JWT_SECRET: string = rawJwtSecret;
const SESSION_EXPIRY = '7d';

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

export function verifyJWT(token: string): Record<string, unknown> {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
}

export function generateJWT(
  payload: Record<string, unknown>,
  expiresIn: SignOptions['expiresIn'] = '30m'
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function createSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_EXPIRY });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!decoded.userId || !decoded.role) return null;
    return {
      userId: decoded.userId as string,
      email: decoded.email as string,
      role: decoded.role as 'admin' | 'user',
    };
  } catch {
    return null;
  }
}

export function getSessionUser(request: NextRequest): SessionPayload | null {
  const session = request.cookies.get('session')?.value;
  if (!session) return null;
  return verifySessionToken(session);
}

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
      { status: error.statusCode }
    );
  }

  if (error instanceof Error && error.name === 'BSONError') {
    return NextResponse.json(
      { error: 'Invalid ID format' },
      { status: 400 }
    );
  }

  console.error('[Kaffeine] API Error:', error);

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
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

// Simple in-memory rate limiter for API routes
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
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
