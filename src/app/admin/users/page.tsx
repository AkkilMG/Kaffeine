'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { Wifi } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export default function AdminUsersPage() {
  const { users, loading, error, mutate } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'promote' | 'demote' | 'delete' | null>(null);
  const [actionError, setActionError] = useState('');
  const [isLive, setIsLive] = useState(false);

  useRealtime({
    onEvent: (event) => {
      if (event.type === 'connected') {
        setIsLive(true);
      }
    },
  });

  const handlePromote = async () => {
    if (!selectedUser) return;
    try {
      setActionError('');
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser._id, role: 'admin' }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to promote user');
      await mutate();
      setSelectedUser(null);
      setActionType(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error promoting user');
    }
  };

  const handleDemote = async () => {
    if (!selectedUser) return;
    try {
      setActionError('');
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser._id, role: 'user' }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to demote user');
      await mutate();
      setSelectedUser(null);
      setActionType(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error demoting user');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      setActionError('');
      const response = await fetch(`/api/admin/users?id=${selectedUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      await mutate();
      setSelectedUser(null);
      setActionType(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error deleting user');
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
          <p className="text-sm text-muted-foreground">Manage system users and permissions</p>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Total: {users.length} users</CardDescription>
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
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm">Name</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm hidden sm:table-cell">Email</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm">Role</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm hidden sm:table-cell">Joined</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm">Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {users.map((user: User) => (
                    <tr key={user._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{user.name}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">{user.email}</td>
                      <td className="py-3 px-2 sm:px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary/20 text-secondary-foreground'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                      <td className="py-3 px-2 sm:px-4 text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    <td className="py-3 px-2 sm:px-4 text-right">
                      <div className="flex gap-1.5 sm:gap-2 justify-end">
                        {user.role === 'user' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 sm:px-3"
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
                            className="text-xs px-2 sm:px-3"
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
                          className="text-destructive hover:text-destructive text-xs px-2 sm:px-3"
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={actionType === 'promote'} onOpenChange={(open: any) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote {selectedUser?.name} to admin? They will have full system access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePromote}>Promote</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionType === 'demote'} onOpenChange={(open: any) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demote User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to demote {selectedUser?.name} from admin? They will lose admin access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDemote}>Demote</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionType === 'delete'} onOpenChange={(open: any) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This will also delete all their kaffeiners and health check data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
