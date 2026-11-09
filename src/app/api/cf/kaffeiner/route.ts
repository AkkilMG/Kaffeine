import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Kaffeiner, Status } from '@/lib/types';
import { decryptData } from '@/lib/encryption';
import { ObjectId } from 'mongodb';
import { eventBus } from '@/lib/event-bus';
import {
  verifyJWT,
  getAuthHeader,
  handleApiError,
  ApiError,
} from '@/lib/api-utils';
import { pingKaffeiner } from '@/lib/ping';

export async function POST(request: NextRequest) {
  try {
    const token = getAuthHeader(request);
    const decoded = verifyJWT(token);

    if ((decoded.type as string) !== 'cf-worker') {
      throw new ApiError(401, 'Invalid token type', 'INVALID_TOKEN_TYPE');
    }

    const body = await request.json();
    const { kaffeiner_id } = body;

    if (!kaffeiner_id) {
      throw new ApiError(400, 'kaffeiner_id is required', 'INVALID_PAYLOAD');
    }

    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const kaffeiner = await kaffeinersCollection.findOne({
      _id: new ObjectId(kaffeiner_id),
      active: true,
      banned: false,
    });

    if (!kaffeiner) {
      throw new ApiError(404, 'Kaffeiner not found or inactive', 'NOT_FOUND');
    }

    const uri = decryptData(kaffeiner.uri);
    const isUp = await pingKaffeiner(kaffeiner.type, kaffeiner.db_type, uri, kaffeiner.collection_or_table);
    const now = new Date();

    const statusCollection = db.collection<Status>('status');
    const statusRecord: Status = {
      kaffeiner_id: new ObjectId(kaffeiner_id),
      status: isUp,
      time: now,
    };

    await statusCollection.insertOne(statusRecord);
    await kaffeinersCollection.updateOne(
      { _id: new ObjectId(kaffeiner_id) },
      { $set: { recentKaffeiner: now } }
    );

    eventBus.emit({
      type: 'status-update',
      kaffeinerId: kaffeiner_id,
      userId: kaffeiner.userId.toString(),
      status: isUp,
      time: now.toISOString(),
    });

    // Prune records older than 30 days (time-based, interval-agnostic)
    const retentionCutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    await statusCollection.deleteMany({
      kaffeiner_id: new ObjectId(kaffeiner_id),
      time: { $lt: retentionCutoff },
    });

    return NextResponse.json({
      success: true,
      status: isUp ? 'up' : 'down',
      time: now,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
