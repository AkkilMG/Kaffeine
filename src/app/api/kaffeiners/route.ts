import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { encryptData, decryptData } from '@/lib/encryption';
import { Kaffeiner, ALLOWED_CHECK_INTERVALS, CheckInterval } from '@/lib/types';
import { eventBus } from '@/lib/event-bus';
import { getSessionUser, verifyJWT, handleApiError, ApiError, requireValidObjectId, rateLimit } from '@/lib/api-utils';
import { pingMongoDB, pingSQL } from '@/lib/ping';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    // Support Bearer token auth for Cloudflare Worker (cf-worker type)
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyJWT(token);
      if ((decoded.type as string) === 'cf-worker') {
        const kaffeiners = await kaffeinersCollection
          .find({ active: true, banned: false })
          .project<Pick<Kaffeiner, '_id' | 'type' | 'db_type' | 'check_interval' | 'recentKaffeiner'>>({
            _id: 1, type: 1, db_type: 1, check_interval: 1, recentKaffeiner: 1,
          })
          .sort({ createdKaffeiner: -1 })
          .toArray();

        const result = kaffeiners.map(k => ({
          _id: k._id?.toString(),
          type: k.type,
          db_type: k.db_type,
          check_interval: k.check_interval ?? 60,
          recentKaffeiner: k.recentKaffeiner?.toISOString() ?? null,
        }));

        return NextResponse.json(result);
      }
    }

    // Default session cookie auth for dashboard users
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = requireValidObjectId(user.userId);

    const kaffeiners = await kaffeinersCollection
      .find({ userId })
      .sort({ createdKaffeiner: -1 })
      .toArray();

    const decrypted = kaffeiners.map(k => ({
      ...k,
      uri: decryptData(k.uri),
    }));

    return NextResponse.json(decrypted);
  } catch (error) {
    return handleApiError(error);
  }
}

const ALLOWED_TYPES = ['website', 'database'] as const;
const ALLOWED_DB_TYPES = ['sql', 'mongodb'] as const;

export async function POST(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateKey = `create-kaffeiner:${user.userId}:${ip}`;
    const check = rateLimit(rateKey, 30, 60000);
    if (!check.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { title, type, db_type, uri, collection_or_table, check_interval } = body as Record<string, string | number | undefined>;

    if (!title || typeof title !== 'string' || title.length > 200) {
      throw new ApiError(400, 'Title is required and must not exceed 200 characters');
    }

    if (!type || !ALLOWED_TYPES.includes(type as typeof ALLOWED_TYPES[number])) {
      throw new ApiError(400, 'Type must be "website" or "database"');
    }

    if (!uri || typeof uri !== 'string' || uri.length > 2000) {
      throw new ApiError(400, 'URI is required and must not exceed 2000 characters');
    }

    if (type === 'database' && (!db_type || !ALLOWED_DB_TYPES.includes(db_type as typeof ALLOWED_DB_TYPES[number]))) {
      throw new ApiError(400, 'Database type must be "sql" or "mongodb"');
    }

    if (type === 'database' && (!collection_or_table || typeof collection_or_table !== 'string')) {
      throw new ApiError(400, 'Collection or table name is required');
    }

    // Validate and default check_interval
    let interval: CheckInterval = 60; // default: 1 hour
    if (check_interval !== undefined) {
      const numInterval = typeof check_interval === 'string' ? parseInt(check_interval, 10) : check_interval;
      if (!ALLOWED_CHECK_INTERVALS.includes(numInterval as CheckInterval)) {
        throw new ApiError(400, `check_interval must be one of: ${ALLOWED_CHECK_INTERVALS.join(', ')} minutes`);
      }
      interval = numInterval as CheckInterval;
    }

    // For databases, validate connectivity BEFORE saving
    if (type === 'database') {
      let isConnected = false;
      if (db_type === 'mongodb') {
        isConnected = await pingMongoDB(uri, collection_or_table as string);
      } else if (db_type === 'sql') {
        isConnected = await pingSQL(uri, collection_or_table as string);
      }

      if (!isConnected) {
        throw new ApiError(
          400,
          'Cannot connect to the database. Please verify the connection URI, credentials, and ensure the database is accessible from the internet.',
          'DB_CONNECTION_FAILED',
        );
      }
    }

    // Website connectivity is not pre-checked during creation —
    // a website may be temporarily down but come back up later.
    // The monitoring interval will track its status regardless.

    const now = new Date();
    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const kaffeiner: Kaffeiner = {
      userId: requireValidObjectId(user.userId),
      title,
      type: type as 'website' | 'database',
      db_type: type === 'database' ? db_type as 'sql' | 'mongodb' : undefined,
      uri: encryptData(uri),
      collection_or_table: type === 'database' ? collection_or_table as string : undefined,
      check_interval: interval,
      recentUpdated: now,
      recentKaffeiner: now,
      createdKaffeiner: now,
      active: true,
      banned: false,
    };

    const result = await kaffeinersCollection.insertOne(kaffeiner);

    eventBus.emit({
      type: 'kaffeiner-change',
      action: 'create',
      userId: user.userId,
      kaffeinerId: result.insertedId.toString(),
    });

    return NextResponse.json(
      { ...kaffeiner, _id: result.insertedId, uri },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, type, db_type, uri, collection_or_table, active, check_interval } = body as Record<string, unknown>;

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Missing kaffeiner ID');
    }

    const kaffeinerId = requireValidObjectId(id);
    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const userId = requireValidObjectId(user.userId);

    const kaffeiner = await kaffeinersCollection.findOne({
      _id: kaffeinerId,
      userId,
    });

    if (!kaffeiner) {
      return NextResponse.json({ error: 'Kaffeiner not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { recentUpdated: new Date() };
    if (title && typeof title === 'string') updateData.title = title;
    if (type && typeof type === 'string') updateData.type = type;
    if (db_type && typeof db_type === 'string') updateData.db_type = db_type;
    if (uri && typeof uri === 'string') updateData.uri = encryptData(uri);
    if (collection_or_table && typeof collection_or_table === 'string') updateData.collection_or_table = collection_or_table;
    if (typeof active === 'boolean') updateData.active = active;
    if (check_interval !== undefined) {
      const numInterval = typeof check_interval === 'string' ? parseInt(check_interval, 10) : (check_interval as number);
      if (!ALLOWED_CHECK_INTERVALS.includes(numInterval as CheckInterval)) {
        throw new ApiError(400, `check_interval must be one of: ${ALLOWED_CHECK_INTERVALS.join(', ')} minutes`);
      }
      updateData.check_interval = numInterval;
    }

    // If a database URI is being updated, re-validate connectivity
    if (uri && typeof uri === 'string') {
      const effectiveDbType = (db_type && typeof db_type === 'string' ? db_type : kaffeiner.db_type) as 'sql' | 'mongodb' | undefined;
      const effectiveCollectionOrTable = (collection_or_table && typeof collection_or_table === 'string' ? collection_or_table : kaffeiner.collection_or_table) as string | undefined;
      const effectiveType = (type && typeof type === 'string' ? type : kaffeiner.type) as 'website' | 'database';

      if (effectiveType === 'database') {
        let isConnected = false;
        if (effectiveDbType === 'mongodb') {
          isConnected = await pingMongoDB(uri, effectiveCollectionOrTable);
        } else if (effectiveDbType === 'sql') {
          isConnected = await pingSQL(uri, effectiveCollectionOrTable);
        }

        if (!isConnected) {
          throw new ApiError(
            400,
            'Cannot connect to the database. Please verify the connection URI, credentials, and ensure the database is accessible from the internet.',
            'DB_CONNECTION_FAILED',
          );
        }
      }
    }

    await kaffeinersCollection.updateOne(
      { _id: kaffeinerId },
      { $set: updateData }
    );

    eventBus.emit({
      type: 'kaffeiner-change',
      action: 'update',
      userId: user.userId,
      kaffeinerId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError(400, 'Missing kaffeiner ID');
    }

    const kaffeinerId = requireValidObjectId(id);
    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const userId = requireValidObjectId(user.userId);

    const result = await kaffeinersCollection.deleteOne({
      _id: kaffeinerId,
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Kaffeiner not found' }, { status: 404 });
    }

    const statusCollection = db.collection('status');
    await statusCollection.deleteMany({ kaffeiner_id: kaffeinerId });

    eventBus.emit({
      type: 'kaffeiner-change',
      action: 'delete',
      userId: user.userId,
      kaffeinerId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
