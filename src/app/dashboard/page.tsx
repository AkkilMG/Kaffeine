'use client';

import { motion } from 'framer-motion';
import { useDashboardMetrics, useKaffeiners } from '@/hooks/use-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShimmerCard, ShimmerChart } from '@/components/ui/shimmer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Coffee, Activity, Timer, CheckCircle2, TrendingUp, PlusCircle } from 'lucide-react';
import Link from 'next/link';

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
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your monitored services</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kaffeiners</CardTitle>
            <Coffee size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground">{metrics?.totalKaffeiner || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{metrics?.activeKaffeiner || 0} active</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Uptime</CardTitle>
            <Activity size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {metrics?.uptime?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
            <CheckCircle2 size={16} className="text-muted-foreground group-hover:text-green-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground">{activeKaffeiners.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Monitoring now</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Check</CardTitle>
            <Timer size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-xl font-mono font-bold text-foreground">{lastKaffeinerTime}</div>
            <p className="text-xs text-muted-foreground mt-1">Most recent kaffeine</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Uptime</CardTitle>
            <CardDescription>24-hour service availability across all kaffeiners</CardDescription>
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
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Current health of your kaffeiners</CardDescription>
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
                      <div className="w-2 h-2 rounded-full bg-green-500" />
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
