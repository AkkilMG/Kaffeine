'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, GitBranch, ArrowRight, Lock, FileCode, Heart, ExternalLink, Star, Activity, Globe, Shield } from 'lucide-react';
import SplitText from '@/components/landing/split-text';

const stats = [
  { icon: Star, value: 1284, label: 'GitHub Stars', suffix: '' },
  { icon: Activity, value: 99.97, label: 'Avg Uptime', suffix: '%', decimals: 2 },
  { icon: Globe, value: 350, label: 'Global Locations', suffix: '+' },
  { icon: Shield, value: 100, label: 'Open Source', suffix: '%' },
];

function AnimatedCounter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
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

  return <span ref={ref} className="tabular-nums">{count.toFixed(decimals)}{suffix}</span>;
}

export default function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgTranslateY = useTransform(scrollYProgress, [0, 1], ['0px', '20px']);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-background">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--primary) 3%, transparent), transparent 60%)',
          transform: bgTranslateY,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={16} className="text-primary" />
                </div>
                <div className="font-mono text-2xl font-bold text-foreground">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
          >
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary font-mono mb-4 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">
                /trust
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-foreground">
                <SplitText text="Open source. " mode="chars" />
                <SplitText text="Always." mode="chars" gradient />
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Kaffeine is 100% open source under the Apache License 2.0 — crafted by{' '}
                  <Link href="https://arkynox.com" target="_blank" className="text-primary hover:underline font-medium">
                    Arkynox <ExternalLink size={10} className="inline" />
                  </Link>
                  . Every line of code is available for you to inspect, contribute to, or self-host.
                </p>
                <p>
                  Your connection URIs and sensitive data are AES-256 encrypted before they ever touch
                  our database. Zero-knowledge monitoring — you control your data, always.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="https://github.com/akkilmg/kaffeine" target="_blank">
                  <Button className="gap-2 group/btn">
                    <GitBranch size={16} />
                    View Source
                  </Button>
                </Link>
                <Link href="https://github.com/akkilmg/kaffeine/issues" target="_blank">
                  <Button variant="outline" className="gap-2 group/btn border-primary/30 hover:border-primary/50">
                    <Heart size={16} />
                    Contribute
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="gap-2 group/btn">
                    Start Monitoring{' '}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-xl border border-border/60 bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                    <Lock size={16} className="text-success" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Encryption at Rest</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[
                    'AES-256 encrypted connection strings',
                    'SHA-256 hashed passwords',
                    'HTTP-only session cookies',
                    'No plaintext secrets stored',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle size={12} className="text-success shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-xl border border-border/60 bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCode size={16} className="text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Open Source Stack</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[
                    'Apache 2.0 — free to use, modify, distribute',
                    'Built by Arkynox — contributions welcome',
                    'Next.js + TypeScript + Tailwind CSS',
                    'Cloudflare Workers for distributed checks',
                    'MongoDB for scalable data storage',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle size={12} className="text-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
