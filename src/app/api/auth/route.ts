import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { encryptData, decryptData, hashPassword, verifyPassword } from '@/lib/encryption';
import { User } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name } = await request.json();

    if (action === 'register') {
      return handleRegister(email, password, name);
    } else if (action === 'login') {
      return handleLogin(email, password);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Kaffeine] Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleRegister(email: string, password: string, name: string) {
  const db = await getDatabase();
  const usersCollection = db.collection<User>('users');

  // Check if user exists
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Create new user
  const passwordHash = hashPassword(password);
  const newUser: User = {
    email,
    passwordHash,
    role: 'user',
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);

  return NextResponse.json(
    {
      userId: result.insertedId.toString(),
      email,
      name,
      role: 'user',
    },
    { status: 201 }
  );
}

async function handleLogin(email: string, password: string) {
  const db = await getDatabase();
  const usersCollection = db.collection<User>('users');

  const user = await usersCollection.findOne({ email });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({
    userId: user._id!.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Set session cookie
  response.cookies.set('session', JSON.stringify({
    userId: user._id!.toString(),
    email: user.email,
    role: user.role,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session')?.value;
    
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const sessionData = JSON.parse(session);
    return NextResponse.json({ authenticated: true, user: sessionData });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
