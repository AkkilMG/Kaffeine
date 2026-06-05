import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/api-utils';

export async function adminMiddleware(request: NextRequest) {
  try {
    getAdminUser(request);
    return null;
  } catch {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
}

export async function withAdminMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const middlewareResponse = await adminMiddleware(request);
    if (middlewareResponse) return middlewareResponse;
    return handler(request);
  };
}
