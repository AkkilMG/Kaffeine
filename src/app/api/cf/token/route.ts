import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const CF_API_TOKEN = process.env.CF_API_TOKEN || '';
const CF_WORKER_SECRET = process.env.CF_WORKER_SECRET || '';
const JWT_SECRET = process.env.JWT_SECRET || '';

function verifyCombinedKey(key: string): boolean {
  const combined = `${CF_API_TOKEN}:${CF_WORKER_SECRET}`;
  return key === combined;
}

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    if (!verifyCombinedKey(key)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
    }

    const token = jwt.sign(
      { type: 'cf-worker', iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    return NextResponse.json({ token, expiresIn: 1800 });
  } catch (error) {
    console.error('[Kaffeine] Token generation error:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
