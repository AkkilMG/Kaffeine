'use client';

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { useDashboardMetrics, useKaffeiners } from '@/hooks/use-data';
import { useRealtime } from '@/hooks/use-realtime';
import { Button } from '@/components/ui/button';
import { ShimmerCard } from '@/components/ui/shimmer';
import {
  Activity, Globe, Zap, PlusCircle, Server, ArrowUpRight,
  CheckCircle, Clock, BarChart3, Coffee,
} from 'lucide-react';
import Link from 'next/link';

const UptimeChart = lazy(() => import('@/components/dashboard/uptime-chart'));

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 } as const,
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

function AnimatedCounter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const steps = 50;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, value]);

  return <span ref={ref} className="tabular-nums">{count.toFixed(decimals)}{suffix}</span>;
}

export default function DashboardPage() {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { kaffeiners, loading: kaffeinersLoading } = useKaffeiners();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);
  const [hoveredKafe, setHoveredKafe] = useState<string | null>(null);

  useRealtime({
    onStatusUpdate: () => setLastUpdate(new Date()),
    onEvent: (event) => {
      if (event.type === 'connected') setIsLive(true);
    },
  });

  const loading = metricsLoading || kaffeinersLoading;

  const activeKaffeiners = kaffeiners?.filter((k: any) => k.active) || [];
  const uptimeValue = metrics?.uptime ?? 100;
  const lastKaffeinerTime = metrics?.recentKaffeiner
    ? new Date(metrics.recentKaffeiner).toLocaleTimeString()
    : '—';

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <ShimmerCard />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <ShimmerCard key={i} />)}
        </div>
        <ShimmerCard />
      </div>
    );
  }

  const statsCards = [
    { label: 'Total', value: metrics?.totalKaffeiner ?? 0, suffix: '', icon: Globe, sub: 'Kaffeiners', color: 'text-primary', bg: 'bg-primary/8' },
    { label: 'Uptime', value: uptimeValue, suffix: '%', icon: Activity, sub: 'Last 24h', color: 'text-success', bg: 'bg-success/8' },
    { label: 'Active', value: activeKaffeiners.length, suffix: '', icon: Zap, sub: 'Monitoring now', color: 'text-foreground', bg: 'bg-muted/20' },
    { label: 'Checked', value: lastKaffeinerTime, suffix: '', icon: Clock, sub: 'Most recent', color: 'text-muted-foreground', bg: 'bg-muted/20', isTime: true },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto"
    >
      {/* Premium Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Your monitoring overview</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLive && (
            <motion.div
              className="flex items-center gap-1.5"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <span className="text-[10px] font-mono text-muted-foreground tracking-wide">LIVE</span>
            </motion.div>
          )}
          <span className="text-[10px] text-muted-foreground/60 font-mono">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`rounded-xl border border-border/50 p-4 ${stat.bg} transition-all duration-300 cursor-default relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={13} className={stat.color} />
              </div>
              <div className={`font-semibold text-lg md:text-xl tracking-tight ${stat.color}`}>
                {stat.isTime ? (
                  <span className="text-sm font-mono">{stat.value as string}</span>
                ) : (
                  <AnimatedCounter value={stat.value as number} suffix={stat.suffix} decimals={stat.label === 'Uptime' ? 1 : 0} />
                )}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart & Service List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Uptime Chart */}
        <motion.div variants={item} className="lg:col-span-3">
          <div className="rounded-xl border border-border/50 bg-card p-4 md:p-5 hover:border-primary/20 transition-all duration-500 h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">Uptime (24h)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  {uptimeValue.toFixed(2)}% uptime
                </span>
                {isLive && (
                  <span className="flex items-center gap-1 text-[9px] text-muted-foreground/60">
                    <span className="size-1 rounded-full bg-success" />
                    Auto-refresh
                  </span>
                )}
              </div>
            </div>
            <div className="h-48 md:h-56">
              <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" /></div>}>
                <UptimeChart uptimeValue={uptimeValue} />
              </Suspense>
            </div>
          </div>
        </motion.div>

        {/* Service Status List */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="rounded-xl border border-border/50 bg-card p-4 md:p-5 hover:border-primary/20 transition-all duration-500 h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server size={13} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">Services</span>
              </div>
              <Link href="/dashboard/kaffeiner">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-medium hover:bg-primary/15 transition-colors"
                >
                  <PlusCircle size={10} />
                  Add
                </motion.button>
              </Link>
            </div>

            {activeKaffeiners.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center space-y-3">
                <Coffee size={28} className="text-muted-foreground/30" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">No active services</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">Create your first kaffeiner</p>
                </div>
                <Link href="/dashboard/kaffeiner">
                  <Button size="sm" className="gap-1.5 text-xs h-7">
                    <PlusCircle size={12} />
                    Add Kaffeiner
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 sm:gap-2 pb-1.5 px-1 text-[9px] text-muted-foreground/50 font-medium uppercase tracking-wider">
                  <span className="w-3 shrink-0" />
                  <span className="flex-1 min-w-0">Name</span>
                  <span className="w-14 text-right shrink-0">Status</span>
                  <span className="w-14 text-right shrink-0 hidden sm:block">Type</span>
                </div>
                {activeKaffeiners.slice(0, 6).map((k: any) => (
                  <Link
                    key={k._id}
                    href={`/dashboard/kaffeiners/${k._id}`}
                    onMouseEnter={() => setHoveredKafe(k._id)}
                    onMouseLeave={() => setHoveredKafe(null)}
                    className="flex items-center gap-1 sm:gap-2 py-2 px-2 rounded-lg transition-colors -mx-1 group/kafe hover:bg-muted/40"
                  >
                    <span className="relative flex size-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-success" />
                    </span>
                    <span className="flex-1 text-xs font-medium text-foreground truncate flex items-center gap-1 sm:gap-1.5 min-w-0">
                      <Server size={9} className="text-muted-foreground shrink-0" />
                      <span className="truncate">{k.title}</span>
                      {hoveredKafe === k._id && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-[8px] text-muted-foreground/60 shrink-0 hidden sm:inline"
                        >
                          View →
                        </motion.span>
                      )}
                    </span>
                    <span className="w-14 text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-success/10 text-success">
                        <span className="size-1 rounded-full bg-success" />
                        UP
                      </span>
                    </span>
                    <span className="w-14 text-right text-[10px] text-muted-foreground/60 font-mono hidden sm:block shrink-0 capitalize">
                      {k.type === 'website' ? 'HTTP' : k.db_type?.toUpperCase() || 'DB'}
                    </span>
                  </Link>
                ))}
                {activeKaffeiners.length > 6 && (
                  <Link
                    href="/dashboard/kaffeiners"
                    className="block text-center text-[10px] text-primary hover:underline pt-2 mt-1 border-t border-border/30"
                  >
                    View all {activeKaffeiners.length} services →
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* All operational footer */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-3 sm:px-4 py-3 rounded-xl border border-border/40 bg-muted/10"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CheckCircle size={11} className="text-success shrink-0" />
          <span className="text-[10px] sm:text-xs text-success font-medium">
            All {activeKaffeiners.length} service{activeKaffeiners.length !== 1 ? 's' : ''} operational
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] text-muted-foreground/60">
          <ArrowUpRight size={9} />
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </motion.div>

      {/* Empty state for new users */}
      {metrics?.totalKaffeiner === 0 && (
        <motion.div variants={item}>
          <div className="rounded-xl border border-dashed border-primary/40 bg-primary/3 p-6 md:p-8 text-center space-y-4">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Coffee size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Welcome to Kaffeine</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Add your first kaffeiner to start monitoring websites or databases in real-time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/kaffeiner">
                <Button className="gap-2">
                  <PlusCircle size={16} />
                  Create Kaffeiner
                </Button>
              </Link>
              <Link href="/dashboard/kaffeiners">
                <Button variant="outline">View Existing</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
