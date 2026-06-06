'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'motion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, GitBranch, Activity, Sparkles } from 'lucide-react';

const DashboardPreview = dynamic(() => import('@/components/landing/dashboard-preview'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-xl lg:max-w-2xl mx-auto rounded-2xl border border-border/60 bg-card shadow-2xl shadow-foreground/5 overflow-hidden" style={{ height: 400 }} />
  ),
});

const titleWords = ['Keep', 'Your', 'Services', 'Awake'];

const floatingShapes = [
  { size: 60, x: '10%', y: '20%', delay: 0, duration: 6 },
  { size: 40, x: '85%', y: '30%', delay: 1, duration: 8 },
  { size: 30, x: '20%', y: '70%', delay: 2, duration: 5 },
  { size: 50, x: '75%', y: '65%', delay: 0.5, duration: 7 },
  { size: 25, x: '50%', y: '15%', delay: 1.5, duration: 9 },
];

function MagneticButton({ href, children, ...props }: { href: string; children: React.ReactNode } & Omit<React.ComponentProps<typeof Link>, 'href'>) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 15 });
  const springY = useSpring(y, { stiffness: 300, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const distX = e.clientX - rect.left - rect.width / 2;
    const distY = e.clientY - rect.top - rect.height / 2;
    const maxDist = 150;
    const nx = (Math.max(-maxDist, Math.min(maxDist, distX)) / maxDist) * 12 * 0.3;
    const ny = (Math.max(-maxDist, Math.min(maxDist, distY)) / maxDist) * 12 * 0.3;
    x.set(nx);
    y.set(ny);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ translateX: springX, translateY: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={href} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}

function GradientMesh() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute -inset-[100%] transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}

export default function HeroSection() {
  const { user, loading } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const s0x = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const s0y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const s0r = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const s1x = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const s1y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const s1r = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const s2x = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const s2y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const s2r = useTransform(scrollYProgress, [0, 1], [0, 16]);
  const s3x = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const s3y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const s3r = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const s4x = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const s4y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const s4r = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const shapeOffsets = [
    { x: s0x, y: s0y, rotate: s0r },
    { x: s1x, y: s1y, rotate: s1r },
    { x: s2x, y: s2y, rotate: s2r },
    { x: s3x, y: s3y, rotate: s3r },
    { x: s4x, y: s4y, rotate: s4r },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-14 bg-background">
      <GradientMesh />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 text-xs font-medium text-primary font-mono mb-6 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15"
            >
              <Activity size={10} />
              Cloudflare-powered monitoring
            </motion.div>

            <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.9] mb-6 text-foreground">
              {titleWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40, scale: 0.85, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.14,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className={`inline-block mr-[0.3em] ${word === 'Awake' ? 'bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
            >
              Free, open-source uptime monitoring.{' '}
              <span className="text-foreground/70">Powered by Cloudflare, secured with AES-256 encryption.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-8"
            >
              {!loading && user ? (
                <MagneticButton href="/dashboard">
                  <Button
                    size="lg"
                    className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25 group/btn relative overflow-hidden cursor-pointer"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-600" />
                    Go to Dashboard{' '}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </MagneticButton>
              ) : (
                <>
                  <MagneticButton href="/register">
                    <Button
                      size="lg"
                      className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25 group/btn relative overflow-hidden cursor-pointer"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-600" />
                      Start Monitoring Free{' '}
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                  </MagneticButton>
                  <MagneticButton href="https://github.com/akkilmg/kaffeine" target="_blank">
                    <Button size="lg" className="gap-2 text-base px-8 h-12 group/btn cursor-pointer bg-transparent dark:bg-transparent border border-foreground/30 dark:border-foreground/30 text-foreground/85 hover:bg-foreground/[0.06] dark:hover:bg-foreground/[0.1] hover:text-foreground transition-all">
                      <GitBranch size={16} />
                      View on GitHub
                    </Button>
                  </MagneticButton>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-muted-foreground/50"
            >
              <Sparkles size={10} />
              <span>No credit card. No hidden limits. Just monitoring.</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>

      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/10 bg-primary/[0.03] pointer-events-none hidden sm:block"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            x: shapeOffsets[i].x,
            y: shapeOffsets[i].y,
            rotate: shapeOffsets[i].rotate,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3],
            scale: [0, 1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            times: [0, 0.3, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
