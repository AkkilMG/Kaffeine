import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function adminMiddleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const sessionData = JSON.parse(session);

    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    return null; // Middleware passed, continue to handler
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}

export async function withAdminMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const middlewareResponse = await adminMiddleware(request);
    if (middlewareResponse) return middlewareResponse;
    return handler(request);
  };
}
