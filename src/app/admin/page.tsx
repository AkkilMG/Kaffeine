'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerCard } from '@/components/ui/shimmer';
import { useAdminStats } from '@/hooks/use-data';
import { useRealtime } from '@/hooks/use-realtime';
import { Users, Coffee, Activity, ShieldCheck, Wifi } from 'lucide-react';

export default function AdminDashboardPage() {
  const { adminStats, loading } = useAdminStats();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-3xl font-bold text-foreground"
              key={adminStats?.totalUsers}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {adminStats?.totalUsers || 0}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kaffeiners</CardTitle>
            <Coffee size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-3xl font-bold text-foreground"
              key={adminStats?.totalKaffeiners}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {adminStats?.totalKaffeiners || 0}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">{adminStats?.activeKaffeiners || 0} active</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status Records</CardTitle>
            <Activity size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-3xl font-bold text-foreground"
              key={adminStats?.totalStatusRecords}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {(adminStats?.totalStatusRecords || 0).toLocaleString()}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Health checks performed</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            <ShieldCheck size={16} className="text-muted-foreground group-hover:text-green-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <div className="text-lg font-bold text-green-600">Operational</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All systems running</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Kaffeine uptime monitoring platform</CardDescription>
          </div>
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Wifi size={12} />
              Auto-refreshing
            </span>
          )}
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
