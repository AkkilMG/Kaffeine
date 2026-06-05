import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { encryptData, decryptData } from '@/lib/encryption';
import { Kaffeiner } from '@/lib/types';
import { eventBus } from '@/lib/event-bus';
import { getSessionUser, handleApiError, ApiError, requireValidObjectId, rateLimit } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

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
    const { title, type, db_type, uri, collection_or_table } = body as Record<string, string | undefined>;

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

    const now = new Date();
    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const kaffeiner: Kaffeiner = {
      userId: requireValidObjectId(user.userId),
      title,
      type: type as 'website' | 'database',
      db_type: type === 'database' ? db_type as 'sql' | 'mongodb' : undefined,
      uri: encryptData(uri),
      collection_or_table: type === 'database' ? collection_or_table : undefined,
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
    const { id, title, type, db_type, uri, collection_or_table, active } = body as Record<string, unknown>;

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
