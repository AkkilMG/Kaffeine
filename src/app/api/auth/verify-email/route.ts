import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const mode = parseInt(searchParams.get('mode') || '0', 10);

    if (!email) {
      return NextResponse.json({ valid: false, error: 'Email is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (mode === 0) {
      // Login mode: email should exist
      return NextResponse.json({ valid: !!existingUser });
    } else {
      // Register mode: email should be available
      return NextResponse.json({ valid: !existingUser });
    }
  } catch (error) {
    console.error('[Kaffeine] Email verification error:', error);
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
  }
}
