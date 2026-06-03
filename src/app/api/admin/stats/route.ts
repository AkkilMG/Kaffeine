import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
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
    const statusCollection = db.collection('status');
    const totalStatusRecords = await statusCollection.countDocuments();

    return NextResponse.json({ totalStatusRecords });
  } catch (error) {
    return handleApiError(error);
  }
}
