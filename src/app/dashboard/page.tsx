'use client';

import { motion } from 'framer-motion';
import { useDashboardMetrics, useKaffeiners } from '@/hooks/use-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShimmerCard, ShimmerChart } from '@/components/ui/shimmer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Coffee, Activity, Timer, CheckCircle2, TrendingUp, PlusCircle, Wifi, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRealtime } from '@/hooks/use-realtime';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { metrics, loading } = useDashboardMetrics();
  const { kaffeiners } = useKaffeiners();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);

  useRealtime({
    onStatusUpdate: () => {
      setLastUpdate(new Date());
    },
    onEvent: (event) => {
      if (event.type === 'connected') {
        setIsLive(true);
      }
    },
  });

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <ShimmerCard />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShimmerChart />
          <ShimmerChart />
        </div>
      </div>
    );
  }

  const uptimeData = [
    { name: 'Up', value: metrics?.uptime || 0, color: '#10b981' },
    { name: 'Down', value: Math.max(0, 100 - (metrics?.uptime || 0)), color: '#ef4444' },
  ];

  const activeKaffeiners = kaffeiners?.filter((k: any) => k.active) || [];
  const lastKaffeinerTime = metrics?.recentKaffeiner
    ? new Date(metrics.recentKaffeiner).toLocaleTimeString()
    : 'Never';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of your monitored services</p>
        </div>
        <div className="flex items-center gap-3">
          {isLive && (
            <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              LIVE
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kaffeiners</CardTitle>
            <Coffee size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl md:text-3xl font-bold text-foreground"
              key={metrics?.totalKaffeiner}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {metrics?.totalKaffeiner || 0}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">{metrics?.activeKaffeiner || 0} active</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Uptime</CardTitle>
            <Activity size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl md:text-3xl font-bold text-foreground"
              key={metrics?.uptime?.toFixed(1)}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {metrics?.uptime?.toFixed(1) || 0}%
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
            <Zap size={16} className="text-muted-foreground group-hover:text-green-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl md:text-3xl font-bold text-foreground"
              key={activeKaffeiners.length}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {activeKaffeiners.length}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Monitoring now</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Check</CardTitle>
            <Timer size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-lg md:text-xl font-mono font-bold text-foreground"
              key={lastKaffeinerTime}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {lastKaffeinerTime}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Most recent kaffeine</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Overall Uptime</CardTitle>
              <CardDescription>24-hour service availability across all kaffeiners</CardDescription>
            </div>
            {isLive && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Wifi size={12} />
                Auto-refreshing
              </span>
            )}
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={uptimeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={750}
                  >
                    {uptimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-4">
              {uptimeData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Current health of your kaffeiners</CardDescription>
            </div>
            {isLive && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Wifi size={12} />
                Live
              </span>
            )}
          </CardHeader>
          <CardContent>
            {activeKaffeiners.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                <Coffee size={48} className="text-muted-foreground/40" />
                <div>
                  <p className="text-muted-foreground font-medium">No active kaffeiners</p>
                  <p className="text-xs text-muted-foreground mt-1">Create your first kaffeiner to start monitoring</p>
                </div>
                <Link href="/dashboard/kaffeiner">
                  <Button size="sm" className="gap-2">
                    <PlusCircle size={16} />
                    Add Kaffeiner
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeKaffeiners.slice(0, 5).map((k: any, i: number) => (
                  <Link
                    key={k._id || i}
                    href={`/dashboard/kaffeiners/${k._id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {k.title}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{k.type}</p>
                      </div>
                    </div>
                    <TrendingUp size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
                {activeKaffeiners.length > 5 && (
                  <Link
                    href="/dashboard/kaffeiners"
                    className="block text-center text-sm text-primary hover:underline pt-2"
                  >
                    View all {activeKaffeiners.length} kaffeiners
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {metrics?.totalKaffeiner === 0 && (
        <motion.div variants={item}>
          <Card className="border-dashed border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee size={20} className="text-primary" />
                Get Started with Kaffeine
              </CardTitle>
              <CardDescription>
                Add your first kaffeiner to start monitoring websites or databases in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/kaffeiner">
                <Button className="gap-2">
                  <PlusCircle size={16} />
                  Create Kaffeiner
                </Button>
              </Link>
              <Link href="/dashboard/kaffeiners">
                <Button variant="outline">View Existing</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
