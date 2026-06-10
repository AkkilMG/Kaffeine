'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminUsers } from '@/hooks/use-data';
import { useRealtime } from '@/hooks/use-realtime';
import { cn } from '@/lib/utils';
import { Wifi, Ban, CheckCircle, KeyRound, ShieldAlert, Globe, Database, Hash, Users, Shield } from 'lucide-react';

interface User {
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

const roleTabs = [
  { id: 'all', label: 'All Users', icon: Users },
  { id: 'user', label: 'Users', icon: Users },
  { id: 'admin', label: 'Admins', icon: Shield },
] as const;

export default function AdminUsersPage() {
  const { users, loading, error, mutate } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'promote' | 'demote' | 'delete' | 'ban' | 'unban' | 'reset-password' | null>(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

  useRealtime({
    onEvent: (event) => {
      if (event.type === 'connected') {
        setIsLive(true);
      }
    },
  });

  const filteredUsers = useMemo(() => {
    if (roleFilter === 'all') return users;
    return users.filter((u: User) => u.role === roleFilter);
  }, [users, roleFilter]);

  const counts = useMemo(() => {
    const total = users.length;
    const userCount = users.filter((u: User) => u.role === 'user').length;
    const adminCount = users.filter((u: User) => u.role === 'admin').length;
    return { total, userCount, adminCount, filtered: filteredUsers.length };
  }, [users, filteredUsers]);

  const handleAction = async () => {
    if (!selectedUser) return;
    try {
      setActionError('');
      setActionSuccess('');

      let response: Response;

      if (actionType === 'promote') {
        response = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser._id, role: 'admin' }),
          credentials: 'include',
        });
      } else if (actionType === 'demote') {
        response = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser._id, role: 'user' }),
          credentials: 'include',
        });
      } else if (actionType === 'ban') {
        response = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser._id, action: 'ban' }),
          credentials: 'include',
        });
      } else if (actionType === 'unban') {
        response = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser._id, action: 'unban' }),
          credentials: 'include',
        });
      } else if (actionType === 'reset-password') {
        response = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser._id, action: 'reset-password' }),
          credentials: 'include',
        });
      } else if (actionType === 'delete') {
        response = await fetch(`/api/admin/users?id=${selectedUser._id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } else {
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Action failed');
      }

      setActionSuccess(`Successfully ${actionType === 'reset-password' ? 'reset password for' : actionType + 'd'} ${selectedUser.name}`);
      await mutate();
      setSelectedUser(null);
      setActionType(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error performing action');
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage system users, permissions, and access</p>
        </div>
        {isLive && (
          <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            LIVE
          </span>
        )}
      </div>

      {(error || actionError) && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error || actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="bg-green-500/10 text-green-600 p-3 rounded-md text-sm">
          {actionSuccess}
        </div>
      )}

      {/* Role filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/30 w-fit">
        {roleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRoleFilter(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              roleFilter === tab.id
                ? 'bg-card text-foreground shadow-xs border border-border/40'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
            <span className="ml-0.5 text-[10px] opacity-60">
              {tab.id === 'all' ? counts.total : tab.id === 'user' ? counts.userCount : counts.adminCount}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{roleFilter === 'all' ? 'All Users' : roleFilter === 'user' ? 'Users' : 'Admins'}</CardTitle>
            <CardDescription>
              {roleFilter === 'all'
                ? `Total: ${counts.total} users`
                : `Showing ${counts.filtered} of ${counts.total} users`
              }
            </CardDescription>
          </div>
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Wifi size={12} />
              Auto-refreshing
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-2 sm:px-3 font-medium text-foreground text-xs">User</th>
                  <th className="text-left py-3 px-2 sm:px-3 font-medium text-foreground text-xs hidden md:table-cell">Contact</th>
                  <th className="text-left py-3 px-2 sm:px-3 font-medium text-foreground text-xs">Role</th>
                  <th className="text-left py-3 px-2 sm:px-3 font-medium text-foreground text-xs hidden lg:table-cell">Kaffeiners</th>
                  <th className="text-left py-3 px-2 sm:px-3 font-medium text-foreground text-xs">Status</th>
                  <th className="text-right py-3 px-2 sm:px-3 font-medium text-foreground text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      <Shield size={32} className="mx-auto mb-2 opacity-40" />
                      No {roleFilter === 'admin' ? 'admins' : 'users'} found
                    </td>
                  </tr>
                ) : (filteredUsers.map((user: User) => (
                  <tr key={user._id} className={`border-b border-border hover:bg-muted/50 transition-colors ${user.banned ? 'bg-destructive/5' : ''}`}>
                    <td className="py-3 px-2 sm:px-3">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-medium text-foreground">{user.name}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground md:hidden">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-xs text-muted-foreground hidden md:table-cell">{user.email}</td>
                    <td className="py-3 px-2 sm:px-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary/20 text-secondary-foreground'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 sm:px-3 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Hash size={12} />
                          {user.kaffeinerCount}
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Globe size={12} />
                          {user.websiteCount}
                        </span>
                        <span className="flex items-center gap-1 text-secondary">
                          <Database size={12} />
                          {user.databaseCount}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:px-3">
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                          <Ban size={12} />
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                          <CheckCircle size={12} />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right">
                      <div className="flex gap-1 justify-end flex-wrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[10px] px-1.5 sm:px-2 min-h-[28px]"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType('reset-password');
                          }}
                          title="Reset password to default"
                        >
                          <KeyRound size={12} />
                        </Button>
                        {user.banned ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[10px] px-1.5 sm:px-2 min-h-[28px] text-green-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('unban');
                            }}
                            title="Unban user"
                          >
                            <CheckCircle size={12} />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[10px] px-1.5 sm:px-2 min-h-[28px] text-destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('ban');
                            }}
                            title="Ban user"
                          >
                            <Ban size={12} />
                          </Button>
                        )}
                        {user.role === 'user' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 min-h-[28px]"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('promote');
                            }}
                          >
                            Promote
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 min-h-[28px]"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('demote');
                            }}
                          >
                            Demote
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive text-[10px] sm:text-xs px-1.5 sm:px-2 min-h-[28px]"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType('delete');
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={actionType === 'promote'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote {selectedUser?.name} to admin? They will have full system access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Promote</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionType === 'demote'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demote User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to demote {selectedUser?.name} from admin? They will lose admin access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Demote</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionType === 'ban'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban {selectedUser?.name}? They will be immediately logged out and unable to sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleAction}>
              <Ban size={14} className="mr-1" /> Ban
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionType === 'unban'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unban User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unban {selectedUser?.name}? They will be able to sign in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              <CheckCircle size={14} className="mr-1" /> Unban
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionType === 'reset-password'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset {selectedUser?.name}&apos;s password to <strong>arkynox</strong>? They will need to use this password to sign in next time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              <KeyRound size={14} className="mr-1" /> Reset Password
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionType === 'delete'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This will also delete all their kaffeiners and health check data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleAction}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
