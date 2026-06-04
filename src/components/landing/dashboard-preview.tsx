'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ChevronRight, Bell, Settings, BarChart3, Globe, LayoutDashboard, Server, ArrowUpRight, CheckCircle, AlertTriangle, Clock, Zap, RefreshCw } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const chartData = [
  { time: '00:00', uptime: 100, latency: 12 },
  { time: '01:00', uptime: 99.9, latency: 14 },
  { time: '02:00', uptime: 100, latency: 11 },
  { time: '03:00', uptime: 99.8, latency: 18 },
  { time: '04:00', uptime: 100, latency: 10 },
  { time: '05:00', uptime: 99.95, latency: 13 },
  { time: '06:00', uptime: 100, latency: 9 },
  { time: '07:00', uptime: 99.9, latency: 15 },
  { time: '08:00', uptime: 100, latency: 11 },
  { time: '09:00', uptime: 99.85, latency: 22 },
  { time: '10:00', uptime: 100, latency: 12 },
  { time: '11:00', uptime: 100, latency: 10 },
];

const servicesData = [
  { name: 'example.com', uptime: '99.97%', latency: '12ms', status: 'up' as const, checks: '12,847' },
  { name: 'app-staging', uptime: '98.21%', latency: '108ms', status: 'degraded' as const, checks: '12,802' },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Globe, label: 'Monitors', active: false },
  { icon: Bell, label: 'Alerts', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

function AnimatedCounter({ value, suffix = '', decimals = 1 }: { value: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, value]);

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 backdrop-blur-sm px-3 py-2 shadow-xl text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-medium text-foreground" style={{ color: entry.color }}>
          {entry.name === 'uptime' ? `Uptime: ${entry.value}%` : `Latency: ${entry.value}ms`}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPreview() {
  const [activeView, setActiveView] = useState('Overview');
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [animateComplete, setAnimateComplete] = useState(false);
  const [livePulse, setLivePulse] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimateComplete(true), 2000);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setLivePulse((p) => !p), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="w-full max-w-lg lg:max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-foreground/5 overflow-hidden backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-3.5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity size={14} className="text-primary" />
            </div>
            <div>
              <span className="font-semibold text-sm text-foreground">Kaffeine</span>
              <span className="text-[10px] text-muted-foreground ml-2 font-mono">v2.0</span>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: livePulse ? 1 : 0.6 }}
            transition={{ duration: 0.4 }}
          >
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-wide">LIVE</span>
          </motion.div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden sm:flex flex-col gap-1 p-3 border-r border-border/40 bg-muted/10 min-w-[130px]"
          >
            {sidebarItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView(item.label)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  item.label === activeView
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <item.icon size={13} />
                {item.label}
              </motion.button>
            ))}
            <div className="mt-auto pt-3 border-t border-border/40">
              <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-muted-foreground">
                <RefreshCw size={10} className="animate-spin" />
                Sync now
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-3 sm:p-5 space-y-3 sm:space-y-4">
            {/* Welcome */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground">Overview</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Your monitoring summary</p>
                </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-medium hover:bg-primary/15 transition-colors"
              >
                <BarChart3 size={11} />
                Details
              </motion.button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2"
            >
              {[
                { label: 'Total', value: 4, suffix: '', icon: Globe, color: 'text-primary', bg: 'bg-primary/8' },
                { label: 'Uptime', value: 99.97, suffix: '%', icon: Zap, color: 'text-success', bg: 'bg-success/8' },
                { label: 'Alerts', value: 0, suffix: '', icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted/30' },
                { label: 'Avg', value: 23, suffix: 'ms', icon: Clock, color: 'text-foreground', bg: 'bg-muted/30' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className={`rounded-xl border border-border/50 p-2 sm:p-2.5 ${stat.bg} transition-all duration-300 cursor-default`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <stat.icon size={9} className={stat.color} />
                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className={`font-mono text-sm font-bold ${stat.color}`}>
                    {animateComplete ? (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.label === 'Uptime' ? 2 : 0} />
                    ) : (
                      <span className="opacity-0">0</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 100 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-border/40 bg-muted/10 p-2">
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Uptime (24h)</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[8px] text-success">
                      <span className="size-1.5 rounded-full bg-success" />
                      99.97%
                    </span>
                    <span className="flex items-center gap-1 text-[8px] text-primary">
                      <span className="size-1.5 rounded-full bg-primary" />
                      12ms avg
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--success)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="var(--success)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: 'var(--muted-foreground)' }} interval={3} />
                    <YAxis hide domain={[99.5, 100.5]} />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Area
                      type="monotone"
                      dataKey="uptime"
                      stroke="var(--primary)"
                      strokeWidth={1.5}
                      fill="url(#uptimeGradient)"
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                    <Area
                      type="monotone"
                      dataKey="latency"
                      stroke="var(--success)"
                      strokeWidth={1.5}
                      fill="url(#latencyGradient)"
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Services List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-1 sm:gap-3 pb-1.5 px-1 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                <span className="w-4 shrink-0" />
                <span className="flex-1 min-w-0">Service</span>
                <span className="w-14 sm:w-12 text-right shrink-0">Uptime</span>
                <span className="w-14 text-right shrink-0">Status</span>
                <span className="w-14 text-right shrink-0 hidden sm:block">Latency</span>
              </div>

              <AnimatePresence>
                {servicesData.map((svc, i) => (
                  <motion.div
                    key={svc.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 1.0 + i * 0.12 }}
                    onHoverStart={() => setHoveredService(svc.name)}
                    onHoverEnd={() => setHoveredService(null)}
                    whileHover={{ backgroundColor: 'var(--muted)', transition: { duration: 0.2 } }}
                    className="flex items-center gap-1 sm:gap-3 py-2 px-2 rounded-lg transition-colors -mx-1 cursor-default"
                  >
                    <span className="relative flex size-2 shrink-0 self-center">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full ${
                          svc.status === 'up' ? 'bg-success' : 'bg-warning'
                        } ${svc.status === 'up' ? 'animate-ping' : ''} opacity-75`}
                      />
                      <span
                        className={`relative inline-flex size-2 rounded-full ${
                          svc.status === 'up' ? 'bg-success' : 'bg-warning'
                        }`}
                      />
                    </span>
                    <span className="flex-1 text-xs font-medium text-foreground truncate flex items-center gap-1.5 min-w-0">
                      <Server size={10} className="text-muted-foreground shrink-0" />
                      {svc.name}
                      {hoveredService === svc.name && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-[8px] text-muted-foreground font-mono hidden sm:inline"
                        >
                          {svc.checks} checks
                        </motion.span>
                      )}
                    </span>
                    <span className="w-14 sm:w-12 text-right text-xs font-mono text-foreground shrink-0">{svc.uptime}</span>
                    <span className="w-14 text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          svc.status === 'up'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        <span
                          className={`size-1 rounded-full ${
                            svc.status === 'up' ? 'bg-success' : 'bg-warning'
                          }`}
                        />
                        {svc.status === 'up' ? 'UP' : 'WARN'}
                      </span>
                    </span>
                    <span className="w-14 text-right text-xs font-mono text-muted-foreground hidden sm:block shrink-0">{svc.latency}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: animateComplete ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="pt-3 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle size={11} className="text-success shrink-0" />
                <span className="text-[10px] text-success font-medium">All 2 services operational</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <ArrowUpRight size={9} />
                Updated just now
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
