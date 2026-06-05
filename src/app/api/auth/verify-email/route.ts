import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { rateLimit, normalizeEmail, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const mode = parseInt(searchParams.get('mode') || '0', 10);

    if (!email) {
      return NextResponse.json({ valid: false, error: 'Email is required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateKey = `verify-email:${ip}`;
    const check = rateLimit(rateKey, 20, 60000);
    if (!check.allowed) {
      return NextResponse.json(
        { valid: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const normalizedEmail = normalizeEmail(email);
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });

    if (mode === 0) {
      // Login mode: return existing status without revealing if email is registered
      return NextResponse.json({ valid: !!existingUser });
    } else {
      // Register mode: return availability status
      return NextResponse.json({ valid: !existingUser });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
