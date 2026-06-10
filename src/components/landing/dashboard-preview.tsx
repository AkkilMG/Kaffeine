'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'motion/react';
import { Activity, Bell, Settings, BarChart3, Globe, LayoutDashboard, Server, ArrowUpRight, CheckCircle, Clock, Zap, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./dashboard-chart'), {
  ssr: false,
  loading: () => <div className="rounded-xl border border-border/40 bg-muted/10 p-2" style={{ height: 95 }} />,
});

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
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

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
    animRef.current = animate(0, value, {
      type: 'spring',
      stiffness: 50,
      damping: 15,
      onUpdate: (v) => setCount(v),
    });
    return () => animRef.current?.stop();
  }, [visible, value]);

  return <span ref={ref} className="tabular-nums">{count.toFixed(decimals)}{suffix}</span>;
}

function Tilt3D({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useTransform(my, [0, 1], [3, -3]);
  const rotateY = useTransform(mx, [0, 1], [-3, 3]);

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0.5);
    my.set(0.5);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 800,
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className={className}
    >
      <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-foreground/5 overflow-hidden backdrop-blur-sm">
        {children}
      </div>
    </motion.div>
  );
}

export default function DashboardPreview() {
  const [activeView, setActiveView] = useState('Overview');
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [animateCounters, setAnimateCounters] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimateCounters(true), 500);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full max-w-xl lg:max-w-2xl mx-auto">
      <Tilt3D className="w-full">
        {/* Header - no animation to prevent layout shift */}
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
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-wide">LIVE</span>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar - static */}
          <div className="hidden sm:flex flex-col gap-1 p-3 border-r border-border/40 bg-muted/10 min-w-[140px]">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveView(item.label)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  item.label === activeView
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <item.icon size={13} />
                {item.label}
              </button>
            ))}
            <div className="mt-auto pt-3 border-t border-border/40">
              <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-muted-foreground">
                <RefreshCw size={10} />
                Synced
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-3 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Welcome - static */}
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground">Overview</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Your monitoring summary</p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-medium">
                <BarChart3 size={11} />
                Details
              </div>
            </div>

            {/* Stats Cards - static render with CSS-only animation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: 'Total', value: 4, suffix: '', icon: Globe, color: 'text-primary', bg: 'bg-primary/8' },
                { label: 'Uptime', value: 99.97, suffix: '%', icon: Zap, color: 'text-success', bg: 'bg-success/8' },
                { label: 'Alerts', value: 0, suffix: '', icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted/30' },
                { label: 'Avg', value: 23, suffix: 'ms', icon: Clock, color: 'text-foreground', bg: 'bg-muted/30' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-xl border border-border/50 p-2.5 sm:p-3 ${stat.bg} cursor-default`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <stat.icon size={9} className={stat.color} />
                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className={`font-mono text-sm font-bold ${stat.color}`}>
                    {animateCounters ? (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.label === 'Uptime' ? 2 : 0} />
                    ) : (
                      <span className="tabular-nums">{stat.value}{stat.suffix}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart - fixed height, no animation */}
            <Chart />

            {/* Services List - static */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 sm:gap-4 pb-1.5 px-1 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                <span className="w-6 shrink-0" />
                <span className="flex-1 min-w-0">Service</span>
                <span className="w-14 sm:w-14 text-right shrink-0">Uptime</span>
                <span className="w-[52px] text-right shrink-0">Status</span>
                <span className="w-14 text-right shrink-0 hidden sm:block">Latency</span>
              </div>

              {servicesData.map((svc) => (
                <div
                  key={svc.name}
                  onMouseEnter={() => setHoveredService(svc.name)}
                  onMouseLeave={() => setHoveredService(null)}
                  className="flex items-center gap-2 sm:gap-4 py-2.5 px-2 rounded-lg -mx-1 cursor-default hover:bg-muted/30 transition-colors"
                >
                  <span className="relative flex size-2 shrink-0 self-center">
                    <span className={`inline-flex size-2 rounded-full ${svc.status === 'up' ? 'bg-success' : 'bg-warning'}`} />
                  </span>
                  <span className="flex-1 text-xs font-medium text-foreground truncate flex items-center gap-1.5 min-w-0">
                    <Server size={10} className="text-muted-foreground shrink-0" />
                    {svc.name}
                    {hoveredService === svc.name && (
                      <span className="text-[8px] text-muted-foreground font-mono hidden sm:inline">
                        {svc.checks} checks
                      </span>
                    )}
                  </span>
                  <span className="w-14 sm:w-12 text-right text-xs font-mono text-foreground shrink-0">{svc.uptime}</span>
                  <span className="w-14 text-right shrink-0">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${svc.status === 'up' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      <span className={`size-1 rounded-full ${svc.status === 'up' ? 'bg-success' : 'bg-warning'}`} />
                      {svc.status === 'up' ? 'UP' : 'WARN'}
                    </span>
                  </span>
                  <span className="w-14 text-right text-xs font-mono text-muted-foreground hidden sm:block shrink-0">{svc.latency}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 sm:pt-4 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={11} className="text-success shrink-0" />
                <span className="text-[10px] text-success font-medium">All 2 services operational</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <ArrowUpRight size={9} />
                Updated just now
              </div>
            </div>
          </div>
        </div>
      </Tilt3D>
    </div>
  );
}
