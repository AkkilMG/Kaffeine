'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import DashboardPreview from '@/components/landing/dashboard-preview';
import { ArrowRight, GitBranch, Sparkles, Activity } from 'lucide-react';

export default function HeroSection() {
  const { user, loading } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const gradientX = useTransform(scrollYProgress, [0, 0.5], ['50%', '55%']);
  const gradientY = useTransform(scrollYProgress, [0, 0.5], ['0%', '10%']);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-24 bg-background"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at ${50 + (mousePos.x - 0.5) * 10}% ${0 + (mousePos.y - 0.5) * 5}%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 60%)`,
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at ${80 + (mousePos.x - 0.5) * -15}% ${40 + (mousePos.y - 0.5) * -10}%, color-mix(in srgb, var(--primary) 4%, transparent), transparent 50%)`,
          }}
        />
      </motion.div>

      {/* Dot grid overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 25, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8"
        style={{ opacity, scale }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 text-xs font-medium text-primary font-mono mb-6 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15"
              >
                <Activity size={10} />
                Cloudflare-powered monitoring
              </motion.div>

              <h1 className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.88] mb-6 text-foreground">
                Keep Your<br />
                Services{' '}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Awake
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
            >
              Free, open-source uptime monitoring.{' '}
              <span className="text-foreground/70">Powered by Cloudflare, secured with AES-256 encryption.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-8"
            >
              {!loading && user ? (
                <Link href="/dashboard">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="lg"
                      className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25 group/btn relative overflow-hidden"
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      Go to Dashboard{' '}
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        size="lg"
                        className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25 group/btn relative overflow-hidden"
                      >
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        Start Monitoring Free{' '}
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="https://github.com/akkilmg/kaffeine" target="_blank">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 text-base px-8 h-12 group/btn"
                      >
                        <GitBranch size={16} />
                        View on GitHub
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-muted-foreground/50"
            >
              <Sparkles size={10} />
              <span>No credit card. No hidden limits. Just monitoring.</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <span className="text-[9px] text-muted-foreground/30 font-mono tracking-widest uppercase">Scroll</span>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
