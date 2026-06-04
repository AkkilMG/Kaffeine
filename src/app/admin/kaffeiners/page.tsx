'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerTable } from '@/components/ui/shimmer';
import { useAdminKaffeiners } from '@/hooks/use-data';
import { useRealtime } from '@/hooks/use-realtime';
import { Coffee, Globe, Database, Wifi } from 'lucide-react';

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
  const { kaffeiners, loading, error } = useAdminKaffeiners();
  const [isLive, setIsLive] = useState(false);

  useRealtime({
    onEvent: (event) => {
      if (event.type === 'connected') {
        setIsLive(true);
      }
    },
  });

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2" />
        </div>
        <ShimmerTable rows={5} />
      </div>
    );
  }

  const activeCount = kaffeiners.filter((k: AdminKaffeiner) => k.active).length;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">All Kaffeiners</h1>
          <p className="text-sm text-muted-foreground">
            {kaffeiners.length} total · {activeCount} active
          </p>
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

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Platform Kaffeiners</CardTitle>
            <CardDescription>All kaffeiners across the platform</CardDescription>
          </div>
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Wifi size={12} />
              Auto-refreshing
            </span>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm">Title</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm hidden sm:table-cell">Type</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm hidden md:table-cell">Recent Check</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground text-xs sm:text-sm hidden md:table-cell">Created</th>
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
                  kaffeiners.map((k: AdminKaffeiner) => (
                    <tr key={k._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2">
                          {k.type === 'website' ? (
                            <Globe size={14} className="text-blue-500 shrink-0" />
                          ) : (
                            <Database size={14} className="text-green-500 shrink-0" />
                          )}
                          <span className="font-medium text-foreground text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{k.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                        <span className="capitalize text-muted-foreground text-xs sm:text-sm">
                          {k.type}{k.db_type ? ` · ${k.db_type}` : ''}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className={`relative flex h-2 w-2 shrink-0 ${k.active ? '' : ''}`}>
                            {k.active && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            )}
                            <span className={`inline-flex rounded-full h-2 w-2 ${k.active ? 'bg-green-500' : k.banned ? 'bg-red-500' : 'bg-yellow-500'}`} />
                          </span>
                          <span className="text-[10px] sm:text-xs whitespace-nowrap">
                            {k.active ? 'Active' : k.banned ? 'Banned' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-muted-foreground text-[10px] sm:text-xs hidden md:table-cell">
                        {k.recentKaffeiner ? new Date(k.recentKaffeiner).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-muted-foreground text-[10px] sm:text-xs hidden md:table-cell">
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
