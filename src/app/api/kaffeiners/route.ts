import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { encryptData, decryptData } from '@/lib/encryption';
import { Kaffeiner } from '@/lib/types';
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
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const kaffeiners = await kaffeinersCollection
      .find({ userId: new ObjectId(user.userId) })
      .sort({ createdKaffeiner: -1 })
      .toArray();

    const decrypted = kaffeiners.map(k => ({
      ...k,
      uri: decryptData(k.uri),
    }));

    return NextResponse.json(decrypted);
  } catch (error) {
    console.error('[Kaffeine] Get kaffeiners error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, db_type, uri, collection_or_table } = body;

    if (!title || !type || !uri) {
      return NextResponse.json({ error: 'Missing required fields: title, type, uri' }, { status: 400 });
    }

    if (type === 'database' && !db_type) {
      return NextResponse.json({ error: 'Database type required (sql or mongodb)' }, { status: 400 });
    }

    if (type === 'database' && !collection_or_table) {
      return NextResponse.json({ error: 'Collection or table name required' }, { status: 400 });
    }

    const now = new Date();
    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const kaffeiner: Kaffeiner = {
      userId: new ObjectId(user.userId),
      title,
      type,
      db_type: type === 'database' ? db_type : undefined,
      uri: encryptData(uri),
      collection_or_table: type === 'database' ? collection_or_table : undefined,
      recentUpdated: now,
      recentKaffeiner: now,
      createdKaffeiner: now,
      active: true,
      banned: false,
    };

    const result = await kaffeinersCollection.insertOne(kaffeiner);

    return NextResponse.json(
      { ...kaffeiner, _id: result.insertedId, uri },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Kaffeine] Create kaffeiner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, type, db_type, uri, collection_or_table, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing kaffeiner ID' }, { status: 400 });
    }

    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const kaffeiner = await kaffeinersCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.userId),
    });

    if (!kaffeiner) {
      return NextResponse.json({ error: 'Kaffeiner not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { recentUpdated: new Date() };
    if (title) updateData.title = title;
    if (type) updateData.type = type;
    if (db_type) updateData.db_type = db_type;
    if (uri) updateData.uri = encryptData(uri);
    if (collection_or_table) updateData.collection_or_table = collection_or_table;
    if (typeof active === 'boolean') updateData.active = active;

    await kaffeinersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Kaffeine] Update kaffeiner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing kaffeiner ID' }, { status: 400 });
    }

    const db = await getDatabase();
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const result = await kaffeinersCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Kaffeiner not found' }, { status: 404 });
    }

    const statusCollection = db.collection('status');
    await statusCollection.deleteMany({ kaffeiner_id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Kaffeine] Delete kaffeiner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
