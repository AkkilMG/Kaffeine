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
    const usersCollection = db.collection('users');
    const kaffeinersCollection = db.collection('kaffeiners');

    const [totalStatusRecords, totalUsers, totalKaffeiners] = await Promise.all([
      statusCollection.countDocuments(),
      usersCollection.countDocuments(),
      kaffeinersCollection.countDocuments(),
    ]);

    const activeKaffeiners = await kaffeinersCollection.countDocuments({ active: true });

    return NextResponse.json({
      totalStatusRecords,
      totalUsers,
      totalKaffeiners,
      activeKaffeiners,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
