import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { User } from '@/lib/types';
import { getAdminUser, handleApiError, ApiError, requireValidObjectId } from '@/lib/api-utils';
import { eventBus } from '@/lib/event-bus';

export async function GET(request: NextRequest) {
  try {
    getAdminUser(request);

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    const users = await usersCollection
      .find({})
      .project({ passwordHash: 0 })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = getAdminUser(request);

    const body = await request.json();
    const { userId, role } = body as Record<string, unknown>;

    if (!userId || typeof userId !== 'string') {
      throw new ApiError(400, 'Invalid userId');
    }

    const normalizedRole = role as string;
    if (!normalizedRole || !['admin', 'user'].includes(normalizedRole)) {
      throw new ApiError(400, 'Invalid role. Must be "admin" or "user"');
    }

    if (userId === admin.userId && normalizedRole !== 'admin') {
      throw new ApiError(400, 'Cannot demote yourself from admin');
    }

    const targetId = requireValidObjectId(userId);
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    const result = await usersCollection.updateOne(
      { _id: targetId },
      { $set: { role: normalizedRole as 'admin' | 'user', updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      throw new ApiError(404, 'User not found');
    }

    eventBus.emit({
      type: 'user-change',
      action: 'role-change',
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = getAdminUser(request);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId || typeof userId !== 'string') {
      throw new ApiError(400, 'Missing user ID');
    }

    if (userId === admin.userId) {
      throw new ApiError(400, 'Cannot delete your own account');
    }

    const targetId = requireValidObjectId(userId);
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    const kaffeinersCollection = db.collection('kaffeiners');
    const statusCollection = db.collection('status');

    const kaffeiners = await kaffeinersCollection.find({ userId: targetId }).toArray();
    const kaffeinerIds = kaffeiners.map(k => k._id);

    if (kaffeinerIds.length > 0) {
      await statusCollection.deleteMany({ kaffeiner_id: { $in: kaffeinerIds } });
      await kaffeinersCollection.deleteMany({ userId: targetId });
    }

    const result = await usersCollection.deleteOne({ _id: targetId });

    if (result.deletedCount === 0) {
      throw new ApiError(404, 'User not found');
    }

    eventBus.emit({
      type: 'user-change',
      action: 'delete',
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
