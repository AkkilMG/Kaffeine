import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Status } from '@/lib/types';
import { ObjectId } from 'mongodb';

function getSessionUser(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: kaffeinerId } = await params;
    const db = await getDatabase();

    const kaffeinersCollection = db.collection('kaffeiners');
    const kaffeiner = await kaffeinersCollection.findOne({
      _id: new ObjectId(kaffeinerId),
      userId: new ObjectId(user.userId),
    });

    if (!kaffeiner) {
      return NextResponse.json({ error: 'Kaffeiner not found' }, { status: 404 });
    }

    const statusCollection = db.collection<Status>('status');
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const records = await statusCollection
      .find({
        kaffeiner_id: new ObjectId(kaffeinerId),
        time: { $gte: oneDayAgo },
      })
      .sort({ time: -1 })
      .toArray();

    const upCount = records.filter(r => r.status === true).length;
    const totalCount = records.length;
    const uptime = totalCount > 0 ? (upCount / totalCount) * 100 : 100;

    return NextResponse.json({
      records,
      uptime,
      totalChecks: totalCount,
    });
  } catch (error) {
    console.error('[Kaffeine] Get kaffeiner stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
