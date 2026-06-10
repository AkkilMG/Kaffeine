'use client';

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { useDashboardMetrics, useKaffeiners } from '@/hooks/use-data';
import { useRealtime } from '@/hooks/use-realtime';
import { Button } from '@/components/ui/button';
import { ShimmerCard } from '@/components/ui/shimmer';
import { Separator } from '@/components/ui/separator';
import {
  Activity, Globe, Zap, PlusCircle, Server, ArrowUpRight,
  CheckCircle, Clock, BarChart3, Coffee, Wifi,
  List, ExternalLink, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const UptimeChart = lazy(() => import('@/components/dashboard/uptime-chart'));

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
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
    {
      label: 'Total', value: metrics?.totalKaffeiner ?? 0, suffix: '', icon: Globe,
      sub: 'Kaffeiners', color: 'text-primary',
      gradient: 'from-primary/20 via-primary/5 to-transparent',
      iconBg: 'bg-primary/10',
    },
    {
      label: 'Uptime', value: uptimeValue, suffix: '%', icon: Activity,
      sub: 'Last 24h', color: 'text-success',
      gradient: 'from-success/20 via-success/5 to-transparent',
      iconBg: 'bg-success/10',
    },
    {
      label: 'Active', value: activeKaffeiners.length, suffix: '', icon: Zap,
      sub: 'Monitoring now', color: 'text-foreground',
      gradient: 'from-muted/30 via-muted/10 to-transparent',
      iconBg: 'bg-muted/20',
    },
    {
      label: 'Checked', value: lastKaffeinerTime, suffix: '', icon: Clock,
      sub: 'Most recent', color: 'text-muted-foreground', isTime: true,
      gradient: 'from-muted/30 via-muted/10 to-transparent',
      iconBg: 'bg-muted/20',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.04] via-card to-card p-5 md:p-6">
        <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.015]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
              <p className="text-xs text-muted-foreground/70">Your monitoring overview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isLive && (
              <motion.div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                <span className="text-[10px] font-semibold text-success tracking-wider">LIVE</span>
              </motion.div>
            )}
            <span className="text-[10px] text-muted-foreground/50 font-mono bg-muted/30 px-2 py-1 rounded-md">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider mr-1 shrink-0">Quick</span>
        <Link href="/dashboard/kaffeiner">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/15 transition-colors shrink-0"
          >
            <PlusCircle size={12} />
            New
          </motion.button>
        </Link>
        <Link href="/dashboard/kaffeiners">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 text-muted-foreground text-xs font-medium hover:bg-muted/60 transition-colors shrink-0"
          >
            <List size={12} />
            View All
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="relative rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 cursor-default group overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="absolute -top-6 -right-6 size-16 rounded-full bg-gradient-to-br from-foreground/[0.02] to-transparent blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative space-y-2">
              <div className={`size-8 rounded-lg ${stat.iconBg} flex items-center justify-center ring-1 ring-foreground/5`}>
                <stat.icon size={13} className={stat.color} />
              </div>
              <div>
                <div className={`font-bold text-lg md:text-xl tracking-tight ${stat.color}`}>
                  {stat.isTime ? (
                    <span className="text-[11px] font-mono font-medium">{stat.value as string}</span>
                  ) : (
                    <AnimatedCounter value={stat.value as number} suffix={stat.suffix} decimals={stat.label === 'Uptime' ? 1 : 0} />
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5 font-medium">{stat.sub}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Uptime Chart */}
        <motion.div variants={item} className="lg:col-span-3">
          <div className="relative rounded-xl border border-border/50 bg-card p-4 md:p-5 hover:border-primary/20 transition-all duration-500 h-full group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-md bg-primary/8 flex items-center justify-center">
                    <Activity size={12} className="text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Uptime (24h)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[10px] text-success font-medium">
                    <span className="size-1.5 rounded-full bg-success" />
                    {uptimeValue.toFixed(2)}%
                  </span>
                  {isLive && (
                    <span className="flex items-center gap-1 text-[9px] text-muted-foreground/40">
                      <Wifi size={9} />
                      Auto
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
          </div>
        </motion.div>

        {/* Services List */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="relative rounded-xl border border-border/50 bg-card p-4 md:p-5 hover:border-primary/20 transition-all duration-500 h-full group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-md bg-primary/8 flex items-center justify-center">
                    <Server size={12} className="text-primary" />
                  </div>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-40 flex flex-col items-center justify-center text-center space-y-3"
                >
                  <div className="size-10 rounded-xl bg-muted/20 flex items-center justify-center">
                    <Coffee size={20} className="text-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">No active services</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">Create your first kaffeiner</p>
                  </div>
                  <Link href="/dashboard/kaffeiner">
                    <Button size="sm" className="gap-1.5 text-xs h-7">
                      <PlusCircle size={12} />
                      Add Kaffeiner
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 pb-1.5 px-1 text-[9px] text-muted-foreground/40 font-medium uppercase tracking-wider">
                    <span className="w-3 shrink-0" />
                    <span className="flex-1 min-w-0">Name</span>
                    <span className="w-14 text-right shrink-0">Status</span>
                    <span className="w-14 text-right shrink-0 hidden sm:block">Type</span>
                  </div>
                  {activeKaffeiners.slice(0, 6).map((k: any, i: number) => (
                    <motion.div
                      key={k._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={`/dashboard/kaffeiners/${k._id}`}
                        className="flex items-center gap-2 py-2.5 sm:py-2 px-2 rounded-lg transition-all -mx-1 group/kafe hover:bg-muted/30 hover:shadow-xs min-h-[36px] sm:min-h-0"
                      >
                        <span className="relative flex size-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-success" />
                        </span>
                        <span className="flex-1 text-xs font-medium text-foreground truncate flex items-center gap-1.5 min-w-0">
                          <Server size={9} className="text-muted-foreground/50 shrink-0" />
                          <span className="truncate">{k.title}</span>
                          <ChevronRight size={10} className="text-muted-foreground/20 group-hover/kafe:text-primary/50 transition-all -ml-0.5 shrink-0" />
                        </span>
                        <span className="w-14 text-right shrink-0">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-success/10 text-success">
                            <span className="size-1 rounded-full bg-success" />
                            UP
                          </span>
                        </span>
                        <span className="w-14 text-right text-[10px] text-muted-foreground/50 font-mono hidden sm:block shrink-0 capitalize">
                          {k.type === 'website' ? 'HTTP' : k.db_type?.toUpperCase() || 'DB'}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                  {activeKaffeiners.length > 6 && (
                    <Link
                      href="/dashboard/kaffeiners"
                      className="flex items-center justify-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors pt-2.5 mt-1.5 border-t border-border/20"
                    >
                      View all {activeKaffeiners.length} services
                      <ArrowUpRight size={10} />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status bar */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 rounded-xl border border-border/30 bg-gradient-to-r from-success/[0.04] via-muted/10 to-transparent"
      >
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-success/10 flex items-center justify-center">
            <CheckCircle size={12} className="text-success" />
          </div>
          <span className="text-xs text-success font-medium">
            All {activeKaffeiners.length} service{activeKaffeiners.length !== 1 ? 's' : ''} operational
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
          <ArrowUpRight size={9} />
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </motion.div>

      {/* Empty state for new users */}
      {metrics?.totalKaffeiner === 0 && (
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/[0.04] to-card p-6 md:p-8 text-center space-y-4">
            <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.02]" />
            <div className="relative">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto ring-1 ring-primary/20">
                <Coffee size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mt-4">Welcome to Kaffeine</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Add your first kaffeiner to start monitoring websites or databases in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
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
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
