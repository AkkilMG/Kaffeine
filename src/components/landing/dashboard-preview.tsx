'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, ArrowUpRight } from 'lucide-react';

const services = [
  { name: 'example.com', uptime: '99.97%', latency: '12ms', time: 'just now', status: 'up' as const },
  { name: 'api.example.com', uptime: '99.94%', latency: '45ms', time: '30s ago', status: 'up' as const },
  { name: 'db-primary', uptime: '100%', latency: '3ms', time: 'just now', status: 'up' as const },
  { name: 'app-staging', uptime: '98.2%', latency: '108ms', time: '1m ago', status: 'up' as const },
];

const chartData = [
  { x: '00:00', y: 100 },
  { x: '00:05', y: 99.9 },
  { x: '00:10', y: 100 },
  { x: '00:15', y: 99.8 },
  { x: '00:20', y: 99.9 },
  { x: '00:25', y: 100 },
  { x: '00:30', y: 100 },
  { x: '00:35', y: 99.95 },
  { x: '00:40', y: 100 },
  { x: '00:45', y: 99.9 },
  { x: '00:50', y: 100 },
  { x: '00:55', y: 100 },
];

const pathD = chartData
  .map((d, i) => {
    const x = 10 + i * (280 / (chartData.length - 1));
    const y = 50 - ((d.y - 99.7) / 0.5) * 30;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  })
  .join(' ');

export default function DashboardPreview() {
  const [showRows, setShowRows] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const t1 = setTimeout(() => setChartVisible(true), 300);
          const t2 = setTimeout(() => setShowRows(1), 600);
          const t3 = setTimeout(() => setShowRows(2), 850);
          const t4 = setTimeout(() => setShowRows(3), 1100);
          const t5 = setTimeout(() => setShowRows(4), 1350);
          const t6 = setTimeout(() => setShowFooter(true), 1700);
          return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
            clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
          };
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  return (
    <div ref={ref} className="w-full max-w-xl mx-auto">
      <div className="rounded-xl border border-border bg-card shadow-2xl shadow-foreground/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <Activity size={16} className="text-primary" />
            <span className="font-semibold text-sm text-foreground">Dashboard</span>
          </div>
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </motion.div>
        </div>

        <div className="p-5 space-y-3">
          {chartVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 60 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <svg viewBox="0 0 300 60" className="w-full h-14">
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="currentColor"
                  className="text-primary/40"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
                <motion.path
                  d={`${pathD} L 290 50 L 10 50 Z`}
                  fill="currentColor"
                  className="text-primary/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                {chartData.filter((_, i) => i % 3 === 0).map((d, i) => {
                  const x = 10 + i * 3 * (280 / (chartData.length - 1));
                  const y = 50 - ((d.y - 99.7) / 0.5) * 30;
                  return (
                    <motion.circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="2"
                      className="text-primary fill-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                    />
                  );
                })}
              </svg>
            </motion.div>
          )}

          <div className="flex items-center gap-3 pb-1 text-xs text-muted-foreground/60">
            <span className="w-3 shrink-0" />
            <span className="w-36 shrink-0">Service</span>
            <span className="w-16 shrink-0">Uptime</span>
            <span className="w-12 shrink-0">Status</span>
            <span className="w-14 shrink-0">Latency</span>
            <span className="hidden sm:block">Last Check</span>
          </div>

          {services.slice(0, showRows).map((svc) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/30 transition-colors -mx-2"
            >
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-success" />
              </span>
              <span className="w-36 shrink-0 text-sm font-medium text-foreground truncate flex items-center gap-1.5">
                {svc.name}
              </span>
              <span className="w-16 shrink-0 text-sm font-mono text-foreground">{svc.uptime}</span>
              <span className="w-12 shrink-0">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success">
                  <span className="size-1 rounded-full bg-success" />
                  UP
                </span>
              </span>
              <span className="w-14 shrink-0 text-sm font-mono text-muted-foreground">{svc.latency}</span>
              <span className="hidden sm:block text-xs text-muted-foreground/60">{svc.time}</span>
            </motion.div>
          ))}

          {showFooter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="pt-3 border-t border-border flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-success" />
                <span className="text-sm text-success font-medium">All 4 services operational</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                <ArrowUpRight size={10} />
                Updated just now
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
