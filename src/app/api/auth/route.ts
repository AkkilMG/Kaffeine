import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/encryption';
import { User } from '@/lib/types';
import { createSessionToken, handleApiError, ApiError, normalizeEmail, rateLimit } from '@/lib/api-utils';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body as Record<string, string | undefined>;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);

    if (action === 'register') {
      return handleRegister(normalizedEmail, password, name || '');
    } else if (action === 'login') {
      const ip = getClientIp(request);
      const rateKey = `login:${normalizedEmail}:${ip}`;
      const check = rateLimit(rateKey, 5, 60000);
      if (!check.allowed) {
        return NextResponse.json(
          { error: 'Too many login attempts. Please try again later.' },
          { status: 429 }
        );
      }
      return handleLogin(normalizedEmail, password);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return handleApiError(error);
  }
}

async function handleRegister(email: string, password: string, name: string) {
  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  if (password.length > 128) {
    throw new ApiError(400, 'Password must not exceed 128 characters');
  }

  if (!name || name.length < 1 || name.length > 100) {
    throw new ApiError(400, 'Name is required and must not exceed 100 characters');
  }

  const db = await getDatabase();
  const usersCollection = db.collection<User>('users');

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const newUser: User = {
    email,
    passwordHash,
    role: 'user',
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);

  const token = createSessionToken({
    userId: result.insertedId.toString(),
    email,
    role: 'user',
  });

  const response = NextResponse.json(
    {
      userId: result.insertedId.toString(),
      email,
      name,
      role: 'user',
    },
    { status: 201 }
  );

  setSessionCookie(response, token);

  return response;
}

async function handleLogin(email: string, password: string) {
  const db = await getDatabase();
  const usersCollection = db.collection<User>('users');

  const user = await usersCollection.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = createSessionToken({
    userId: user._id!.toString(),
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    userId: user._id!.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  setSessionCookie(response, token);

  await db.collection<User>('users').updateOne(
    { _id: user._id },
    { $set: { updatedAt: new Date() } }
  );

  return response;
}

function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { verifySessionToken } = await import('@/lib/api-utils');
    const sessionData = verifySessionToken(session);

    if (!sessionData) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: sessionData });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
