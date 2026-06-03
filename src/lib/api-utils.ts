import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

export function verifyJWT(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
}

export function generateJWT(
  payload: any,
  expiresIn: SignOptions['expiresIn'] = '30m'
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function getSessionFromRequest(request: NextRequest): any {
  const session = request.cookies.get('session')?.value;
  if (!session) {
    throw new ApiError(401, 'Not authenticated');
  }
  try {
    return JSON.parse(session);
  } catch {
    throw new ApiError(401, 'Invalid session');
  }
}

export function getAuthHeader(request: NextRequest): string {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or invalid authorization header');
  }
  return authHeader.substring(7);
}

export function handleApiError(error: unknown): NextResponse {
  console.error('[Kaffeine] API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export async function validateRequestBody(request: NextRequest): Promise<any> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'Invalid JSON body');
  }
}
