import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/encryption';
import { User, Kaffeiner } from '@/lib/types';
import { getAdminUser, handleApiError, ApiError, requireValidObjectId } from '@/lib/api-utils';
import { eventBus } from '@/lib/event-bus';

export interface AdminUserResponse {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  banned: boolean;
  createdAt: string;
  kaffeinerCount: number;
  websiteCount: number;
  databaseCount: number;
}

export async function GET(request: NextRequest) {
  try {
    getAdminUser(request);

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    const kaffeinersCollection = db.collection<Kaffeiner>('kaffeiners');

    const users = await usersCollection
      .find({})
      .project({ passwordHash: 0 })
      .toArray();

    const usersWithCounts: AdminUserResponse[] = await Promise.all(
      users.map(async (user) => {
        const pipeline = [
          { $match: { userId: user._id } },
          { $group: { _id: '$type', count: { $sum: 1 } } },
        ];
        const typeCounts = await kaffeinersCollection.aggregate<{ _id: string; count: number }>(pipeline).toArray();
        const websiteCount = typeCounts.find(t => t._id === 'website')?.count || 0;
        const databaseCount = typeCounts.find(t => t._id === 'database')?.count || 0;

        return {
          _id: user._id!.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          banned: user.banned ?? false,
          createdAt: user.createdAt.toISOString(),
          kaffeinerCount: websiteCount + databaseCount,
          websiteCount,
          databaseCount,
        };
      })
    );

    return NextResponse.json(usersWithCounts);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = getAdminUser(request);

    const body = await request.json();
    const { userId, action, role } = body as Record<string, unknown>;

    if (!userId || typeof userId !== 'string') {
      throw new ApiError(400, 'Invalid userId');
    }

    const targetId = requireValidObjectId(userId);
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    if (action === 'ban') {
      if (userId === admin.userId) {
        throw new ApiError(400, 'Cannot ban yourself');
      }

      const result = await usersCollection.updateOne(
        { _id: targetId },
        { $set: { banned: true, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        throw new ApiError(404, 'User not found');
      }

      eventBus.emit({
        type: 'user-change',
        action: 'ban',
        userId,
      });

      return NextResponse.json({ success: true, banned: true });
    }

    if (action === 'unban') {
      const result = await usersCollection.updateOne(
        { _id: targetId },
        { $set: { banned: false, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        throw new ApiError(404, 'User not found');
      }

      eventBus.emit({
        type: 'user-change',
        action: 'unban',
        userId,
      });

      return NextResponse.json({ success: true, banned: false });
    }

    if (action === 'reset-password') {
      const defaultPassword = 'arkynox';
      const passwordHash = await hashPassword(defaultPassword);

      const result = await usersCollection.updateOne(
        { _id: targetId },
        { $set: { passwordHash, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        throw new ApiError(404, 'User not found');
      }

      eventBus.emit({
        type: 'user-change',
        action: 'reset-password',
        userId,
      });

      return NextResponse.json({ success: true, message: 'Password reset to default' });
    }

    // Fallback: role change (legacy)
    if (!role) {
      throw new ApiError(400, 'Invalid action. Must be "ban", "unban", "reset-password", or provide a role');
    }

    const normalizedRole = role as string;
    if (!['admin', 'user'].includes(normalizedRole)) {
      throw new ApiError(400, 'Invalid role. Must be "admin" or "user"');
    }

    if (userId === admin.userId && normalizedRole !== 'admin') {
      throw new ApiError(400, 'Cannot demote yourself from admin');
    }

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
