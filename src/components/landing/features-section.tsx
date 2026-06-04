'use client';

import { motion } from 'framer-motion';
import {
  Globe, Database, Cloud, Shield, Bell, Code, TrendingUp, Sparkles,
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/components/landing/animations';

const features = [
  {
    icon: Globe,
    title: 'Website Monitoring',
    desc: 'HTTP/HTTPS checks every 60s from 350+ global locations.',
    color: 'from-violet-500/15',
    featured: true,
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
    desc: 'MongoDB, PostgreSQL, MySQL, Redis — native driver checks.',
    color: 'from-blue-500/15',
  },
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
    icon: Bell,
    title: 'Instant Alerts',
    desc: 'Real-time notifications the moment a service goes down.',
    color: 'from-amber-500/15',
  },
  {
    icon: Code,
    title: '100% Open Source',
    desc: 'MIT licensed. Self-host anytime. Full transparency.',
    color: 'from-emerald-500/15',
  },
  {
    icon: TrendingUp,
    title: 'Uptime Analytics',
    desc: 'Track response times, uptime percentage, and history.',
    color: 'from-pink-500/15',
  },
];

export default function FeaturesSection() {
  const featured = features[0];
  const rest = features.slice(1);

  return (
    <section id="features" className="relative py-24 md:py-32 bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--primary) 5%, transparent), transparent 60%), radial-gradient(ellipse at 70% 80%, color-mix(in srgb, var(--primary) 3%, transparent), transparent 40%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-sm font-medium text-primary font-mono mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
            <Sparkles size={12} />
            /features
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Everything you need to{' '}
            <span className="text-primary">monitor</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base text-muted-foreground max-w-xl mx-auto">
            No caps, no hidden limits. Every capability is available to every user.
          </motion.p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Globe size={22} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-foreground">{featured.title}</h3>
                  <p className="text-sm text-muted-foreground">{featured.desc}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full shrink-0">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  All systems operational
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {featured.metrics!.map((m) => (
                  <div key={m.label} className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                    <div className="font-mono text-lg font-bold text-foreground">{m.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-500"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="relative p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                    <feature.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1.5 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm text-muted-foreground">
              All features included — no paid tiers, no feature gates
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
