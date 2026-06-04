import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { User } from '@/lib/types';
import { handleApiError, ApiError, getSessionFromRequest } from '@/lib/api-utils';
import { ObjectId } from 'mongodb';
import { eventBus } from '@/lib/event-bus';

function getSessionUser(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return null;
  try {
    const data = JSON.parse(session);
    return data.role === 'admin' ? data : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      throw new ApiError(403, 'Admin access required');
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    const users = await usersCollection
      .find({})
      .project({ passwordHash: 0 }) // Exclude password hashes
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      throw new ApiError(403, 'Admin access required');
    }

    const { userId, role } = await request.json();

    if (!userId || !['admin', 'user'].includes(role)) {
      throw new ApiError(400, 'Invalid userId or role');
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    // Prevent self-demotion
    if (userId === user.userId && role !== 'admin') {
      throw new ApiError(400, 'Cannot demote yourself from admin');
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date() } }
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
    const user = getSessionUser(request);
    if (!user) {
      throw new ApiError(403, 'Admin access required');
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      throw new ApiError(400, 'Missing user ID');
    }

    // Prevent self-deletion
    if (userId === user.userId) {
      throw new ApiError(400, 'Cannot delete your own account');
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    const kaffeinersCollection = db.collection('kaffeiners');
    const statusCollection = db.collection('status');

    const kaffeiners = await kaffeinersCollection.find({ userId: new ObjectId(userId) }).toArray();
    const kaffeinerIds = kaffeiners.map((k: any) => k._id);

    if (kaffeinerIds.length > 0) {
      await statusCollection.deleteMany({ kaffeiner_id: { $in: kaffeinerIds } });
      await kaffeinersCollection.deleteMany({ userId: new ObjectId(userId) });
    }

    // Delete user
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

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
