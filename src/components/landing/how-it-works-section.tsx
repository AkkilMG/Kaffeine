'use client';

import { motion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/components/landing/animations';

const steps = [
  { number: '01', title: 'Create Account', desc: 'Sign up for free in under 30 seconds. No credit card.' },
  { number: '02', title: 'Add Your Service', desc: 'Website URL or database connection string. We handle the rest.' },
  { number: '03', title: 'Monitor & Relax', desc: 'Real-time alerts if anything goes down. Stay awake with Kaffeine.' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-muted/20">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--primary) 4%, transparent), transparent 60%)',
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-sm font-medium text-primary font-mono mb-4 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">
            /getting-started
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            From zero to monitoring{' '}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">in 2 minutes</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base text-muted-foreground max-w-xl mx-auto">
            No config files, no complex setup. Just you and your services.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Desktop connector line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 pointer-events-none" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div className="rounded-xl border border-border/60 bg-card p-6 md:p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/2 transition-all duration-500 h-full relative">
                <div className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="font-mono text-lg font-bold text-primary">{step.number}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2">
                        <ArrowRight size={14} className="text-primary/25 rotate-270" />
                      </div>
                    )}
                  </div>
                  <div className="md:mt-4">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
