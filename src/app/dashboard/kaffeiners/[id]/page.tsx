'use client';

import { use, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useKaffeinerStats } from '@/hooks/use-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerCard, ShimmerChart } from '@/components/ui/shimmer';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import Link from 'next/link';
import { ArrowLeft, Activity, CheckCircle2, XCircle, Clock, TrendingUp, Wifi } from 'lucide-react';

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

export default function KaffeinerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { stats, loading } = useKaffeinerStats(id);
  const [isLive, setIsLive] = useState(false);

  const chartData = useMemo(() => {
    if (!stats?.records) return [];
    return stats.records.map((r: any) => ({
      time: new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: r.status ? 1 : 0,
      label: r.status ? 'Up' : 'Down',
    })).reverse();
  }, [stats]);

  const statusDistribution = useMemo(() => {
    if (!stats?.records) return [];
    const up = stats.records.filter((r: any) => r.status === true).length;
    const down = stats.records.filter((r: any) => r.status === false).length;
    return [{ name: 'Up', value: up, color: '#10b981' }, { name: 'Down', value: down, color: '#ef4444' }];
  }, [stats]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <ShimmerCard />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
        <ShimmerChart />
        <ShimmerChart />
      </div>
    );
  }

  const uptimeColor = (stats?.uptime || 0) >= 99 ? 'text-green-500' : (stats?.uptime || 0) >= 95 ? 'text-yellow-500' : 'text-red-500';
  const totalUp = stats?.records?.filter((r: any) => r.status === true).length || 0;
  const totalDown = stats?.records?.filter((r: any) => r.status === false).length || 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/kaffeiners"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Kaffeiner Details</h1>
            <p className="text-muted-foreground text-sm">24-hour monitoring record</p>
          </div>
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
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Uptime</CardTitle>
            <Activity size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className={`text-2xl md:text-3xl font-bold ${uptimeColor}`}
              key={stats?.uptime?.toFixed(2)}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {stats?.uptime?.toFixed(2) || 0}%
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Up / Down</CardTitle>
            <TrendingUp size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <motion.span
                  className="text-xl font-bold text-foreground"
                  key={totalUp}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {totalUp}
                </motion.span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-red-500" />
                <motion.span
                  className="text-xl font-bold text-foreground"
                  key={totalDown}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {totalDown}
                </motion.span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total checks performed</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Checks</CardTitle>
            <Clock size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl md:text-3xl font-bold text-foreground"
              key={stats?.totalChecks}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {stats?.totalChecks || 0}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Health checks (24h)</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Status Timeline</CardTitle>
              <CardDescription>Up/Down status over the last 24 hours</CardDescription>
            </div>
            {isLive && <Wifi size={14} className="text-green-500" />}
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No data available for the last 24 hours
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="time"
                      stroke="var(--color-muted-foreground)"
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      tick={{ fontSize: 11 }}
                      domain={[-0.5, 1.5]}
                      ticks={[0, 1]}
                      tickFormatter={(v: number) => (v === 1 ? 'Up' : 'Down')}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [value === 1 ? 'Up' : 'Down', 'Status']}
                    />
                    <Line
                      type="stepAfter"
                      dataKey="status"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Up vs Down breakdown</CardDescription>
            </div>
            {isLive && <Wifi size={14} className="text-green-500" />}
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {statusDistribution.length === 0 || statusDistribution.every((d: any) => d.value === 0) ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={500}>
                      {statusDistribution.map((entry: any, index: number) => (
                        <rect key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Records</CardTitle>
              <CardDescription>Latest status checks (most recent first)</CardDescription>
            </div>
            {isLive && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Live
              </span>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.records?.slice(0, 20).map((record: any, index: number) => (
                <motion.div
                  key={record._id || index}
                  initial={index === 0 ? { opacity: 0, x: -10 } : undefined}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`relative flex h-2.5 w-2.5 ${index === 0 ? 'animate-pulse' : ''}`}
                    >
                      <span
                        className={`inline-flex rounded-full h-2.5 w-2.5 ${
                          record.status ? 'bg-green-500 shadow-sm shadow-green-500/50' : 'bg-red-500 shadow-sm shadow-red-500/50'
                        }`}
                      />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {record.status ? 'Service Up' : 'Service Down'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(record.time).toLocaleString()}
                  </span>
                </motion.div>
              ))}
              {(!stats?.records || stats.records.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No records yet. The kaffeiner will be checked soon.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
