import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Kaffeiner } from '@/lib/types';
import { handleApiError, ApiError } from '@/lib/api-utils';

function getSessionUser(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return null;
  try {
    const data = JSON.parse(session);
    return data.role === 'admin' ? data : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      throw new ApiError(403, 'Admin access required');
    }

    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const kaffeiners = await kaffeinersCollection
      .find({})
      .project({ uri: 0 })
      .sort({ createdKaffeiner: -1 })
      .toArray();

    return NextResponse.json(kaffeiners);
  } catch (error) {
    return handleApiError(error);
  }
}
