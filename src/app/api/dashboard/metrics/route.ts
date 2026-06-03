import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { DashboardMetrics, Status } from '@/lib/types';
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

export async function GET(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const db = await getDatabase();
    const kaffeinersCollection = db.collection('kaffeiners');
    const statusCollection = db.collection<Status>('status');

    const kaffeiners = await kaffeinersCollection
      .find({ userId: new ObjectId(user.userId) })
      .toArray();

    const totalKaffeiner = kaffeiners.length;
    const activeKaffeiner = kaffeiners.filter((k: any) => k.active).length;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const kaffeinerIds = kaffeiners.map(k => k._id);

    const recentRecords = await statusCollection
      .find({
        kaffeiner_id: { $in: kaffeinerIds },
        time: { $gte: oneDayAgo },
      })
      .toArray();

    const upCount = recentRecords.filter(r => r.status === true).length;
    const uptime = recentRecords.length > 0 ? (upCount / recentRecords.length) * 100 : 100;

    const lastRecord = recentRecords.length > 0
      ? recentRecords.sort((a, b) => b.time.getTime() - a.time.getTime())[0]
      : null;

    const metrics: DashboardMetrics = {
      totalKaffeiner,
      activeKaffeiner,
      uptime: Math.round(uptime * 100) / 100,
      recentKaffeiner: lastRecord?.time || null,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[Kaffeine] Dashboard metrics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
