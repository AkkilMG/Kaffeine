import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Kaffeiner } from '@/lib/types';
import { getAdminUser, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    getAdminUser(request);

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
