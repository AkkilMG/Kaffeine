'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import SplitText from '@/components/landing/split-text';

const pricingItems = [
  'Unlimited website monitors',
  'Unlimited database monitors',
  'Real-time health checks every 60s',
  'Cloudflare distributed monitoring',
  'AES-256 encrypted storage',
  'Detailed analytics & charts',
  'Open source (Apache 2.0)',
  'Community support',
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);
  const bgTranslateY = useTransform(scrollYProgress, [0, 1], ['-20px', '20px']);

  return (
    <section id="pricing" ref={sectionRef} className="relative py-16 sm:py-24 md:py-32 bg-muted/20">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--primary) 4%, transparent), transparent 60%)',
          transform: bgTranslateY,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary font-mono mb-4 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">
            /pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            <SplitText text="One plan. " mode="chars" />
            <SplitText text="Completely free." mode="chars" gradient />
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            No tiers, no upselling, no feature gates. Just honest monitoring for everyone.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="max-w-md mx-auto"
        >
          <motion.div
            className="relative rounded-xl border border-border/60 bg-card p-8 shadow-xl"
            style={{ rotateX, perspective: 800 }}
            whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ border: '1px solid transparent' }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(var(--primary), 0)',
                  '0 0 20px 2px rgba(var(--primary), 0.15)',
                  '0 0 0 0 rgba(var(--primary), 0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium font-mono shadow-lg">
                <Sparkles size={10} />
                FREE FOREVER
              </div>
            </div>
            <div className="text-center pt-4">
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
                <Button
                  size="lg"
                  className="w-full gap-2 text-base h-12 shadow-lg shadow-primary/25 group/btn relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-600" />
                  Get Started Free{' '}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
