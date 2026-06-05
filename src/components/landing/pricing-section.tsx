'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/components/landing/animations';

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
  return (
    <section id="pricing" className="relative py-24 md:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-sm font-medium text-primary font-mono mb-4 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">
            /pricing
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            One plan.{' '}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Completely free.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base text-muted-foreground max-w-xl mx-auto">
            No tiers, no upselling, no feature gates. Just honest monitoring for everyone.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md mx-auto"
        >
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative rounded-xl border border-border/60 bg-card p-8 shadow-xl hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
          >
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
                {pricingItems.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle size={14} className="text-success shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full gap-2 text-base h-12 shadow-lg shadow-primary/25 group/btn relative overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
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
