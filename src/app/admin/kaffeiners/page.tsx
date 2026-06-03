'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerTable } from '@/components/ui/shimmer';
import { Coffee, Globe, Database, Clock, User } from 'lucide-react';

interface AdminKaffeiner {
  _id: string;
  userId: string;
  title: string;
  type: string;
  db_type?: string;
  active: boolean;
  banned: boolean;
  recentKaffeiner: string;
  createdKaffeiner: string;
}

export default function AdminKaffeinersPage() {
  const [kaffeiners, setKaffeiners] = useState<AdminKaffeiner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await fetch('/api/admin/kaffeiners', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setKaffeiners(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2" />
        </div>
        <ShimmerTable rows={5} />
      </div>
    );
  }

  const activeCount = kaffeiners.filter(k => k.active).length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Kaffeiners</h1>
        <p className="text-muted-foreground">
          {kaffeiners.length} total · {activeCount} active
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Platform Kaffeiners</CardTitle>
          <CardDescription>All kaffeiners across the platform</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Recent Check</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Created</th>
                </tr>
              </thead>
              <tbody>
                {kaffeiners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                      <Coffee size={32} className="mx-auto mb-2 opacity-40" />
                      No kaffeiners on the platform yet
                    </td>
                  </tr>
                ) : (
                  kaffeiners.map((k) => (
                    <tr key={k._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {k.type === 'website' ? (
                            <Globe size={14} className="text-blue-500" />
                          ) : (
                            <Database size={14} className="text-green-500" />
                          )}
                          <span className="font-medium text-foreground">{k.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-muted-foreground">
                          {k.type}{k.db_type ? ` · ${k.db_type}` : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${k.active ? 'bg-green-500' : k.banned ? 'bg-red-500' : 'bg-yellow-500'}`} />
                          <span className="text-xs">
                            {k.active ? 'Active' : k.banned ? 'Banned' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {k.recentKaffeiner ? new Date(k.recentKaffeiner).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(k.createdKaffeiner).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
