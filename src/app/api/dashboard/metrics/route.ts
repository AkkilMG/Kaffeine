import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { DashboardMetrics, Status } from '@/lib/types';
import { getSessionUser, handleApiError, requireValidObjectId } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const db = await getDatabase();
    const kaffeinersCollection = db.collection('kaffeiners');
    const statusCollection = db.collection<Status>('status');

    const userId = requireValidObjectId(user.userId);

    // Use projection to only fetch needed fields
    const kaffeiners = await kaffeinersCollection
      .find({ userId }, { projection: { _id: 1, active: 1 } })
      .toArray();

    const totalKaffeiner = kaffeiners.length;
    const activeKaffeiner = kaffeiners.filter(k => k.active).length;

    if (totalKaffeiner === 0) {
      return NextResponse.json({
        totalKaffeiner: 0,
        activeKaffeiner: 0,
        uptime: 100,
        recentKaffeiner: null,
      });
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const kaffeinerIds = kaffeiners.map(k => k._id);

    // Use index-friendly query with sort and limit instead of fetching all records
    const recentRecords = await statusCollection
      .find(
        {
          kaffeiner_id: { $in: kaffeinerIds },
          time: { $gte: oneDayAgo },
        },
        {
          projection: { status: 1, time: 1 },
          sort: { time: -1 },
        }
      )
      .toArray();

    const upCount = recentRecords.filter(r => r.status === true).length;
    const uptime = recentRecords.length > 0 ? (upCount / recentRecords.length) * 100 : 100;

    const metrics: DashboardMetrics = {
      totalKaffeiner,
      activeKaffeiner,
      uptime: Math.round(uptime * 100) / 100,
      recentKaffeiner: recentRecords[0]?.time || null,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    return handleApiError(error);
  }
}
