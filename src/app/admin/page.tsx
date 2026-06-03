'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerCard } from '@/components/ui/shimmer';
import { Users, Coffee, Activity, ShieldCheck } from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  totalKaffeiners: number;
  activeKaffeiners: number;
  totalStatusRecords: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalKaffeiners: 0,
    activeKaffeiners: 0,
    totalStatusRecords: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, kaffeinersRes, statusRes] = await Promise.all([
          fetch('/api/admin/users', { credentials: 'include' }),
          fetch('/api/admin/kaffeiners', { credentials: 'include' }),
          fetch('/api/admin/stats', { credentials: 'include' }),
        ]);
        const users = usersRes.ok ? await usersRes.json() : [];
        const kaffeiners = kaffeinersRes.ok ? await kaffeinersRes.json() : [];
        const adminStats = statusRes.ok ? await statusRes.json() : { totalStatusRecords: 0 };
        setStats({
          totalUsers: users.length || 0,
          totalKaffeiners: kaffeiners.length || 0,
          activeKaffeiners: kaffeiners.filter((k: any) => k.active).length || 0,
          totalStatusRecords: adminStats.totalStatusRecords || 0,
        });
      } catch (error) {
        console.error('[Kaffeine] Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <ShimmerCard />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <ShimmerCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kaffeiners</CardTitle>
            <Coffee size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalKaffeiners}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.activeKaffeiners} active</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status Records</CardTitle>
            <Activity size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalStatusRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Health checks performed</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            <ShieldCheck size={16} className="text-muted-foreground group-hover:text-green-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground mt-1">All systems running</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Kaffeine uptime monitoring platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Database</p>
              <p className="font-medium text-foreground">MongoDB</p>
            </div>
            <div>
              <p className="text-muted-foreground">API Status</p>
              <p className="font-medium text-green-600">Operational</p>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Quick Links</p>
            <div className="space-y-2">
              <a href="/admin/users" className="block text-primary hover:underline text-sm">
                → Manage Users
              </a>
              <a href="/admin/kaffeiners" className="block text-primary hover:underline text-sm">
                → View All Kaffeiners
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
