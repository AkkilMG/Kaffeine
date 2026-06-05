import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getAdminUser, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    getAdminUser(request);

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
