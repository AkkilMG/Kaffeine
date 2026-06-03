import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Kaffeiner, Status } from '@/lib/types';
import { decryptData } from '@/lib/encryption';
import { ObjectId } from 'mongodb';
import {
  verifyJWT,
  getAuthHeader,
  handleApiError,
  ApiError,
} from '@/lib/api-utils';

async function pingWebsite(uri: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(uri, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'Kaffeine/1.0' },
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

async function pingMongoDB(uri: string, _collection?: string): Promise<boolean> {
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await client.connect();
    const db = client.db();
    await db.command({ ping: 1 });
    await client.close();
    return true;
  } catch {
    return false;
  }
}

async function pingSQL(uri: string, _table?: string): Promise<boolean> {
  try {
    const url = new URL(uri);
    const { connect } = await import('net');
    return new Promise((resolve) => {
      const socket = connect(
        parseInt(url.port || '5432'),
        url.hostname,
        () => {
          socket.destroy();
          resolve(true);
        }
      );
      socket.on('error', () => resolve(false));
      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve(false);
      });
    });
  } catch {
    return false;
  }
}

async function pingKaffeiner(kaffeiner: Kaffeiner): Promise<boolean> {
  const uri = decryptData(kaffeiner.uri);

  if (kaffeiner.type === 'website') {
    return pingWebsite(uri);
  }

  if (kaffeiner.type === 'database') {
    if (kaffeiner.db_type === 'mongodb') {
      return pingMongoDB(uri, kaffeiner.collection_or_table);
    }
    if (kaffeiner.db_type === 'sql') {
      return pingSQL(uri, kaffeiner.collection_or_table);
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthHeader(request);
    const decoded = verifyJWT(token);

    if (decoded.type !== 'cf-worker') {
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

    const isUp = await pingKaffeiner(kaffeiner);
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

    const recordCount = await statusCollection.countDocuments({
      kaffeiner_id: new ObjectId(kaffeiner_id),
    });
    if (recordCount > 1440) {
      const oldRecords = await statusCollection
        .find({ kaffeiner_id: new ObjectId(kaffeiner_id) })
        .sort({ time: 1 })
        .limit(recordCount - 1440)
        .toArray();
      if (oldRecords.length > 0) {
        await statusCollection.deleteMany({
          _id: { $in: oldRecords.map(r => r._id!) },
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: isUp ? 'up' : 'down',
      time: now,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
