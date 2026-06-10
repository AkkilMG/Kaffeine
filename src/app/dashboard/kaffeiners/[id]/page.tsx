'use client';

import React, { use, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useKaffeinerStats } from '@/hooks/use-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerCard, ShimmerChart } from '@/components/ui/shimmer';
import { Separator } from '@/components/ui/separator';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import Link from 'next/link';
import {
  ArrowLeft, Activity, CheckCircle2, XCircle, Clock, TrendingUp, Wifi,
  BarChart3, ChevronRight,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

function StatCard({ title, value, subtitle, icon: Icon, color, gradient, delay = 0 }: {
  title: string;
  value: React.ReactNode;
  subtitle: string;
  icon: any;
  color: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden relative border-border/50">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="absolute -top-6 -right-6 size-20 rounded-full bg-gradient-to-br from-foreground/[0.02] to-transparent blur-xl group-hover:scale-150 transition-transform duration-700" />
        <CardHeader className="pb-2 flex flex-row items-center justify-between relative">
          <CardTitle className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">{title}</CardTitle>
          <div className="size-7 rounded-md bg-foreground/[0.03] flex items-center justify-center group-hover:bg-primary/8 transition-colors">
            <Icon size={13} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <motion.div
            className={`text-2xl md:text-3xl font-bold ${color}`}
            key={String(value)}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
          >
            {value}
          </motion.div>
          <p className="text-[10px] text-muted-foreground/60 mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

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

  const uptimeColor = (stats?.uptime || 0) >= 99 ? 'text-success' : (stats?.uptime || 0) >= 95 ? 'text-warning' : 'text-destructive';
  const totalUp = stats?.records?.filter((r: any) => r.status === true).length || 0;
  const totalDown = stats?.records?.filter((r: any) => r.status === false).length || 0;
  const totalChecks = stats?.totalChecks || 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.04] via-card to-card p-5 md:p-6">
        <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.015]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard/kaffeiners"
              className="size-8 rounded-lg bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors shrink-0"
            >
              <ArrowLeft size={16} className="text-muted-foreground" />
            </Link>
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shrink-0">
              <BarChart3 size={18} className="text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate tracking-tight">Kaffeiner Details</h1>
              <p className="text-xs text-muted-foreground/70 truncate">24-hour monitoring record</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isLive && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-[10px] font-semibold text-success">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                LIVE
              </span>
            )}
            <Link
              href="/dashboard/kaffeiners"
              className="text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors flex items-center gap-1"
            >
              All services
              <ChevronRight size={10} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          title="Uptime"
          value={`${stats?.uptime?.toFixed(2) || 0}%`}
          subtitle="Last 24 hours"
          icon={Activity}
          color={uptimeColor}
          gradient="from-success/10 via-success/[0.02] to-transparent"
          delay={0}
        />
        <StatCard
          title="Up / Down"
          value={
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-success" />
                {totalUp}
              </span>
              <span className="text-muted-foreground/30">/</span>
              <span className="flex items-center gap-1.5">
                <XCircle size={16} className="text-destructive" />
                {totalDown}
              </span>
            </div>
          }
          subtitle="Total checks performed"
          icon={TrendingUp}
          color="text-foreground"
          gradient="from-primary/10 via-primary/[0.02] to-transparent"
          delay={0.05}
        />
        <StatCard
          title="Total Checks"
          value={totalChecks}
          subtitle="Health checks (24h)"
          icon={Clock}
          color="text-foreground"
          gradient="from-secondary/10 via-secondary/[0.02] to-transparent"
          delay={0.1}
        />
      </div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Timeline */}
        <Card className="border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between relative">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-md bg-primary/8 flex items-center justify-center">
                  <Activity size={12} className="text-primary" />
                </div>
                <CardTitle className="text-sm">Status Timeline</CardTitle>
              </div>
              <CardDescription className="text-[11px] mt-0.5">Up/Down status over the last 24 hours</CardDescription>
            </div>
            {isLive && <Wifi size={13} className="text-success" />}
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground/60 text-sm">
                  No data available for the last 24 hours
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                    <XAxis
                      dataKey="time"
                      stroke="var(--color-muted-foreground)"
                      strokeOpacity={0.3}
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      strokeOpacity={0.3}
                      tick={{ fontSize: 10 }}
                      domain={[-0.5, 1.5]}
                      ticks={[0, 1]}
                      tickFormatter={(v: number) => (v === 1 ? 'Up' : 'Down')}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '12px',
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
                      animationDuration={400}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between relative">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-md bg-primary/8 flex items-center justify-center">
                  <BarChart3 size={12} className="text-primary" />
                </div>
                <CardTitle className="text-sm">Status Distribution</CardTitle>
              </div>
              <CardDescription className="text-[11px] mt-0.5">Up vs Down breakdown</CardDescription>
            </div>
            {isLive && <Wifi size={13} className="text-success" />}
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {statusDistribution.length === 0 || statusDistribution.every((d: any) => d.value === 0) ? (
                <div className="h-full flex items-center justify-center text-muted-foreground/60 text-sm">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                    <XAxis dataKey="name" stroke="var(--color-muted-foreground)" strokeOpacity={0.5} tick={{ fontSize: 11 }} />
                    <YAxis stroke="var(--color-muted-foreground)" strokeOpacity={0.5} tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={400}>
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

      {/* Recent Records */}
      <motion.div variants={item}>
        <Card className="border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between relative">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-md bg-primary/8 flex items-center justify-center">
                  <Clock size={12} className="text-primary" />
                </div>
                <CardTitle className="text-sm">Recent Records</CardTitle>
              </div>
              <CardDescription className="text-[11px] mt-0.5">Latest status checks (most recent first)</CardDescription>
            </div>
            {isLive && (
              <span className="flex items-center gap-1.5 text-[10px] text-success font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Live
              </span>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {stats?.records?.slice(0, 20).map((record: any, index: number) => (
                <motion.div
                  key={record._id || index}
                  initial={index < 3 ? { opacity: 0, x: -8 } : undefined}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all gap-2 group/record"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex items-center justify-center">
                      <span className={`inline-flex rounded-full h-3 w-3 ${
                        record.status
                          ? 'bg-success shadow-xs shadow-success/30'
                          : 'bg-destructive shadow-xs shadow-destructive/30'
                      }`} />
                      {index === 0 && (
                        <span className="absolute inset-0 rounded-full bg-success/30 animate-ping" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                        {record.status ? 'Service Up' : 'Service Down'}
                        {index === 0 && (
                          <span className="text-[9px] text-success bg-success/10 px-1.5 py-0.5 rounded font-medium">
                            Latest
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground/60 font-mono shrink-0 whitespace-nowrap">
                    {new Date(record.time).toLocaleString()}
                  </span>
                </motion.div>
              ))}
              {(!stats?.records || stats.records.length === 0) && (
                <div className="text-center py-10 text-muted-foreground/60 text-sm">
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
