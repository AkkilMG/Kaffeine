'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'motion/react';
import {
  Globe, Database, Cloud, Shield, Bell, Code, TrendingUp, Sparkles,
} from 'lucide-react';
import SplitText from '@/components/landing/split-text';

const spotlightFeatures = [
  {
    icon: Globe,
    title: 'Website Monitoring',
    desc: 'HTTP/HTTPS checks every 60 seconds from 350+ global locations. Monitor any website, API, or endpoint with detailed response time tracking and instant downtime detection.',
    color: 'from-violet-500/15',
    metrics: [
      { value: '99.97%', label: 'Uptime' },
      { value: '12,847', label: 'Checks Today' },
      { value: '23ms', label: 'Avg Response' },
      { value: '3', label: 'Active Monitors' },
    ],
  },
  {
    icon: Database,
    title: 'Database Monitoring',
    desc: 'Monitor MongoDB, PostgreSQL, MySQL, and Redis databases with native driver health checks. Get alerted before connection issues cascade into full downtime.',
    color: 'from-blue-500/15',
    metrics: [
      { value: '4', label: 'Supported Engines' },
      { value: '<30s', label: 'Detection Time' },
      { value: 'AES-256', label: 'Encryption' },
      { value: 'Native', label: 'Driver Checks' },
    ],
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    desc: 'Real-time downtime alerts via email, Slack, Discord, or webhook. Get instant incident notifications the moment a service goes down with multi-channel delivery.',
    color: 'from-amber-500/15',
    metrics: [
      { value: '<1s', label: 'Alert Latency' },
      { value: '4+', label: 'Channels' },
      { value: '99.9%', label: 'Delivery Rate' },
      { value: '24/7', label: 'Coverage' },
    ],
  },
];

const gridFeatures = [
  {
    icon: Cloud,
    title: 'Edge Infrastructure',
    desc: 'Cloudflare Workers in 350+ cities — no single point of failure.',
    color: 'from-cyan-500/15',
  },
  {
    icon: Shield,
    title: 'Zero-Knowledge Encryption',
    desc: 'AES-256 encrypted at rest. Your credentials stay yours.',
    color: 'from-purple-500/15',
  },
  {
    icon: Code,
    title: '100% Open Source',
    desc: 'Apache 2.0 licensed. Self-host anytime. Full transparency.',
    color: 'from-emerald-500/15',
  },
  {
    icon: TrendingUp,
    title: 'Uptime Analytics',
    desc: 'Track response times, uptime percentage, and history.',
    color: 'from-pink-500/15',
  },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [5, -5]);
  const rotateY = useTransform(x, [0, 1], [-5, 5]);

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const progressBar = useTransform(scrollYProgress, [0, 0.4], ['0%', '100%']);
  const bgParallax = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const card1Opacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const card1Y = useTransform(scrollYProgress, [0.05, 0.25], [40, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const card2Y = useTransform(scrollYProgress, [0.2, 0.4], [40, 0]);
  const card3Opacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const card3Y = useTransform(scrollYProgress, [0.35, 0.55], [40, 0]);

  const cardScroll = [card1Opacity, card2Opacity, card3Opacity];
  const cardScrollY = [card1Y, card2Y, card3Y];

  return (
    <section id="features" ref={sectionRef} className="relative py-8 sm:py-12 md:py-16 bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--primary) 4%, transparent), transparent 60%), radial-gradient(ellipse at 70% 80%, color-mix(in srgb, var(--primary) 2%, transparent), transparent 40%)',
          transform: `translateY(${bgParallax})`,
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            <SplitText text="Everything you need to " mode="chars" />
            <SplitText text="monitor" mode="chars" gradient />
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            No caps, no hidden limits. Every capability is available to every user.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {spotlightFeatures.map((feature, i) => (
            <motion.div key={feature.title} style={{ opacity: cardScroll[i], y: cardScrollY[i] }}>
            <TiltCard>
              <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />

                <div
                  className={`relative p-5 sm:p-6 md:p-8 flex flex-col ${
                    i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-4 sm:gap-6 md:gap-8 items-center`}
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 8, mass: 0.5 }}
                        className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                      >
                        <feature.icon size={22} className="text-primary" />
                      </motion.div>
                      <h3 className="font-semibold text-xl text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">
                      {feature.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Always active', 'No setup required', 'Real-time'].map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted-foreground bg-muted/30 border border-border/40 px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full lg:w-auto shrink-0">
                    <div className="grid grid-cols-2 gap-2 min-w-0 sm:min-w-[200px] lg:min-w-[240px]">
                      {feature.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
                        >
                          <div className="font-mono text-lg font-bold text-foreground">
                            {m.value}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gridFeatures.map((feature) => (
            <TiltCard key={feature.title}>
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 8, mass: 0.6 }}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-colors duration-500"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="relative p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                    <feature.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1.5 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm text-muted-foreground">
              All features included — no paid tiers, no feature gates
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
