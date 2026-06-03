'use client';

import { use, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useKaffeinerStats } from '@/hooks/use-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerCard, ShimmerChart } from '@/components/ui/shimmer';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import Link from 'next/link';
import { ArrowLeft, Activity, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';

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
      <motion.div variants={item} className="flex items-center gap-4">
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
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Uptime</CardTitle>
            <Activity size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl md:text-3xl font-bold ${uptimeColor}`}>
              {stats?.uptime?.toFixed(2) || 0}%
            </div>
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
                <span className="text-xl font-bold text-foreground">{totalUp}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-red-500" />
                <span className="text-xl font-bold text-foreground">{totalDown}</span>
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
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {stats?.totalChecks || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Health checks (24h)</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
            <CardDescription>Up/Down status over the last 24 hours</CardDescription>
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
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Up vs Down breakdown</CardDescription>
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
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
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
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
            <CardDescription>Latest status checks (most recent first)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.records?.slice(0, 20).map((record: any, index: number) => (
                <div
                  key={record._id || index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        record.status ? 'bg-green-500 shadow-sm shadow-green-500/50' : 'bg-red-500 shadow-sm shadow-red-500/50'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {record.status ? 'Service Up' : 'Service Down'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(record.time).toLocaleString()}
                  </span>
                </div>
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
