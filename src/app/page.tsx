'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Coffee, Shield, Globe, Database,
  Cloud, Bell, TrendingUp, GitBranch, ExternalLink,
  CheckCircle, ChevronRight, Moon, Sun, Menu, X,
  Sparkles, Code, ArrowRight, Activity
} from 'lucide-react';
import { useTheme } from 'next-themes';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const features = [
  {
    icon: Globe, title: 'Website Monitoring',
    desc: 'HTTP/HTTPS checks every 60s from 350+ global locations.',
    color: 'from-violet-500/15',
    featured: true,
  },
  {
    icon: Database, title: 'Database Monitoring',
    desc: 'MongoDB, PostgreSQL, MySQL, Redis — native driver checks.',
    color: 'from-blue-500/15',
  },
  {
    icon: Cloud, title: 'Edge Infrastructure',
    desc: 'Cloudflare Workers in 350+ cities — no single point of failure.',
    color: 'from-cyan-500/15',
  },
  {
    icon: Shield, title: 'Zero-Knowledge Encryption',
    desc: 'AES-256 encrypted at rest. Your credentials stay yours.',
    color: 'from-purple-500/15',
  },
  {
    icon: Bell, title: 'Instant Alerts',
    desc: 'Real-time notifications the moment a service goes down.',
    color: 'from-amber-500/15',
  },
  {
    icon: Code, title: '100% Open Source',
    desc: 'MIT licensed. Self-host anytime. Full transparency.',
    color: 'from-emerald-500/15',
  },
  {
    icon: TrendingUp, title: 'Uptime Analytics',
    desc: 'Track response times, uptime percentage, and history.',
    color: 'from-pink-500/15',
  },
];

const steps = [
  { number: '01', title: 'Create Account', desc: 'Sign up for free in under 30 seconds. No credit card.' },
  { number: '02', title: 'Add Your Service', desc: 'Website URL or database connection string. We handle the rest.' },
  { number: '03', title: 'Monitor & Relax', desc: 'Real-time alerts if anything goes down. Stay awake with Kaffeine.' },
];

const faqs = [
  { q: 'What is Kaffeine?', a: 'Free and open-source uptime monitoring. It periodically checks your websites and databases, alerting you immediately if something goes wrong.' },
  { q: 'Is Kaffeine really free?', a: 'Yes — completely free. No paid tiers, no hidden costs, no feature limitations.' },
  { q: 'How is my data encrypted?', a: 'All sensitive data, including database URIs, are AES-256 encrypted before storage.' },
  { q: 'Can I self-host Kaffeine?', a: 'Absolutely. 100% open source under the MIT license. Deploy on your own infrastructure.' },
  { q: 'What services can I monitor?', a: 'Websites via HTTP/HTTPS and databases — MongoDB, PostgreSQL, MySQL, and more.' },
  { q: 'Do I need a credit card?', a: 'No. Sign up with your email and start monitoring. No payment info required.' },
];

const heroStats = [
  { value: '100%', label: 'Free Forever' },
  { value: 'MIT', label: 'Open Source' },
  { value: 'AES-256', label: 'Encrypted' },
  { value: '350+', label: 'Global Cities' },
];

const pricingItems = [
  'Unlimited website monitors',
  'Unlimited database monitors',
  'Real-time health checks every 60s',
  'Cloudflare distributed monitoring',
  'AES-256 encrypted storage',
  'Detailed analytics & charts',
  'Open source (MIT license)',
  'Community support',
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-background/80 backdrop-blur-2xl border-b border-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Coffee className="size-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">Kaffeine</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <div className="hidden md:flex items-center gap-3">
              {!loading && user ? (
                <Link href="/dashboard">
                  <Button size="sm" className="gap-2">
                    Dashboard <ChevronRight size={14} />
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="sm" className="gap-2">
                    Get Started <ChevronRight size={14} />
                  </Button>
                </Link>
              )}
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-2xl overflow-hidden">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                {!loading && user ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full gap-2">Dashboard <ChevronRight size={14} /></Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gap-2">Get Started <ChevronRight size={14} /></Button>
                    </Link>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function DashboardPreview() {
  const [showRows, setShowRows] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  const services = [
    { name: 'example.com', uptime: '99.97%', latency: '12ms', time: 'just now' },
    { name: 'api.example.com', uptime: '99.94%', latency: '45ms', time: '30s ago' },
    { name: 'db-primary', uptime: '100%', latency: '3ms', time: 'just now' },
    { name: 'app-staging', uptime: '98.2%', latency: '108ms', time: '1m ago' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const timer1 = setTimeout(() => setShowRows(1), 400);
          const timer2 = setTimeout(() => setShowRows(2), 700);
          const timer3 = setTimeout(() => setShowRows(3), 1000);
          const timer4 = setTimeout(() => setShowRows(4), 1300);
          const timer5 = setTimeout(() => setShowFooter(true), 1700);
          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
          };
        }
      },
      { threshold: 0.3 }
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
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>

        <div className="p-5 space-y-1">
          <div className="flex items-center gap-3 pb-2 text-xs text-muted-foreground/60">
            <span className="w-4 shrink-0" />
            <span className="w-36 shrink-0">Service</span>
            <span className="w-16 shrink-0">Uptime</span>
            <span className="w-12 shrink-0">Status</span>
            <span className="w-14 shrink-0">Latency</span>
            <span className="hidden sm:block">Last Check</span>
          </div>

          {services.slice(0, showRows).map((svc) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/30 transition-colors -mx-2">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-success" />
              </span>
              <span className="w-36 shrink-0 text-sm font-medium text-foreground truncate">{svc.name}</span>
              <span className="w-16 shrink-0 text-sm font-mono text-foreground">{svc.uptime}</span>
              <span className="w-12 shrink-0">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success">UP</span>
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
              className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-success" />
                <span className="text-sm text-success font-medium">All 4 services operational</span>
              </div>
              <span className="text-xs text-muted-foreground/60">Updated just now</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const { user, loading } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 60%)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10">
            <DashboardPreview />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.92] mb-6 text-foreground">
            Keep Your Services<br />
            <span className="text-primary">Awake</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Free, open-source uptime monitoring. Cloudflare-powered, end-to-end encrypted.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20">
            {!loading && user ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/30">
                  Go to Dashboard <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/30">
                    Start Monitoring Free <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="https://github.com/akkilmg/kaffeine" target="_blank">
                  <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                    <GitBranch size={16} />
                    View on GitHub
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {heroStats.map((stat) => (
              <div key={stat.label}
                className="rounded-xl border border-border bg-card/60 backdrop-blur-sm px-4 py-3">
                <div className="font-mono text-lg font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--primary) 5%, transparent), transparent 60%)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16">
          <motion.div variants={fadeIn} className="text-sm font-medium text-primary font-mono mb-4">
            /features
          </motion.div>
          <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Everything you need to{' '}
            <span className="text-primary">monitor</span>
          </motion.h2>
          <motion.p variants={fadeIn} className="text-base text-muted-foreground max-w-xl mx-auto">
            No caps, no hidden limits. Every capability is available to every user.
          </motion.p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Globe size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-foreground">Website Monitoring</h3>
                  <p className="text-sm text-muted-foreground">HTTP/HTTPS checks every 60s from 350+ locations</p>
                </div>
                <span className="ml-auto hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-[pulse-dot_2s_ease-out_infinite] rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  All systems operational
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: '99.97%', label: 'Uptime' },
                  { value: '12,847', label: 'Checks Today' },
                  { value: '23ms', label: 'Avg Response' },
                  { value: '3', label: 'Active Monitors' },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                    <div className="font-mono text-lg font-bold text-foreground">{m.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.slice(1).map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                <div className="relative p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
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
          className="mt-8 text-center">
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

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16">
          <motion.div variants={fadeIn} className="text-sm font-medium text-primary font-mono mb-4">
            /getting-started
          </motion.div>
          <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            From zero to monitoring{' '}
            <span className="text-primary">in 2 minutes</span>
          </motion.h2>
          <motion.p variants={fadeIn} className="text-base text-muted-foreground max-w-xl mx-auto">
            No config files, no complex setup. Just you and your services.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group">
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 hover:border-primary/30 transition-all duration-500 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <span className="font-mono text-lg font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="relative py-24 md:py-32 bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--primary) 4%, transparent), transparent 60%)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <motion.div variants={fadeIn} className="lg:col-span-2">
              <div className="text-sm font-medium text-primary font-mono mb-4">/trust</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-foreground">
                Open source.{' '}
                <span className="text-primary">Always.</span>
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Kaffeine is 100% open source under the MIT license. Every line of code is available for you to inspect, contribute to, or self-host.</p>
                <p>Your connection URIs and sensitive data are AES-256 encrypted before they ever touch our database. Zero-knowledge monitoring — you control your data, always.</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="https://github.com/akkilmg/kaffeine" target="_blank">
                  <Button className="gap-2"><GitBranch size={16} />View Source</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="gap-2">Start Monitoring <ArrowRight size={14} /></Button>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="lg:col-span-3 space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={18} className="text-success" />
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
              </div>
              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <Code size={18} className="text-primary" />
                  <span className="font-semibold text-sm text-foreground">Open Source Stack</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[
                    'MIT Licensed — free to use, modify, distribute',
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16">
          <motion.div variants={fadeIn} className="text-sm font-medium text-primary font-mono mb-4">/pricing</motion.div>
          <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            One plan.{' '}
            <span className="text-primary">Completely free.</span>
          </motion.h2>
          <motion.p variants={fadeIn} className="text-base text-muted-foreground max-w-xl mx-auto">
            No tiers, no upselling, no feature gates. Just honest monitoring for everyone.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto">
          <div className="rounded-xl border border-border bg-card p-8 shadow-xl hover:border-primary/30 transition-all duration-500">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary mb-6 font-mono">
                <Sparkles size={10} />
                FREE FOREVER
              </div>
              <div className="text-6xl font-bold text-foreground mb-1">
                <span className="text-3xl align-top text-muted-foreground">$</span>0
              </div>
              <p className="text-muted-foreground text-sm mb-8">No credit card required. Never.</p>
              <ul className="space-y-3 text-left mb-8">
                {pricingItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-success shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" className="w-full gap-2 text-base h-12 shadow-lg shadow-primary/25">
                  Get Started Free <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-32 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-12">
          <motion.div variants={fadeIn} className="text-sm font-medium text-primary font-mono mb-4">/faq</motion.div>
          <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Frequently asked <span className="text-primary">questions</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/20">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4">
                <span className="font-medium text-sm md:text-base text-foreground">{faq.q}</span>
                <ChevronRight size={14}
                  className={`shrink-0 text-muted-foreground transition-transform duration-300 ${openIndex === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coffee className="size-3.5 text-primary" />
              </div>
              <span className="text-base font-bold text-foreground">Kaffeine</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              Free and open-source uptime monitoring. Keep your services awake with Kaffeine.
            </p>
            <Link href="https://github.com/akkilmg/kaffeine" target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <GitBranch size={14} /> GitHub
            </Link>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link href="https://github.com/akkilmg/kaffeine" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">GitHub <ExternalLink size={10} /></Link></li>
              <li><Link href="https://github.com/akkilmg/kaffeine/issues" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">Report Issue <ExternalLink size={10} /></Link></li>
              <li><Link href="https://github.com/akkilmg/kaffeine/blob/main/LICENSE" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">MIT License <ExternalLink size={10} /></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/policy/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/policy/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policy/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {year} Kaffeine. Released under the{' '}
            <Link href="https://github.com/akkilmg/kaffeine/blob/main/LICENSE" target="_blank"
              className="text-primary hover:underline">MIT License</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full size-6 border-t-2 border-b-2 border-primary" />
          <p className="text-muted-foreground mt-4 text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
