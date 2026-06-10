'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import SplitText from '@/components/landing/split-text';

const steps = [
  { number: '01', title: 'Create Account', desc: 'Sign up for free in under 30 seconds. No credit card.', extraDesc: 'No email verification maze. Start monitoring immediately.' },
  { number: '02', title: 'Add Your Service', desc: 'Website URL or database connection string. We handle the rest.', extraDesc: 'HTTP/HTTPS, TCP, MongoDB, PostgreSQL, MySQL, Redis — all supported.' },
  { number: '03', title: 'Monitor & Relax', desc: 'Real-time alerts if anything goes down. Stay awake with Kaffeine.', extraDesc: 'Email, Slack, Discord, and webhook notifications — all included.' },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const springPathLength = useSpring(pathLength, { stiffness: 60, damping: 20 });

  const bgParallax = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const s1o = useTransform(scrollYProgress, [0, 0.25], [0.3, 1]);
  const s1s = useTransform(scrollYProgress, [0, 0.25], [0.92, 1]);
  const s2o = useTransform(scrollYProgress, [0.18, 0.43], [0.3, 1]);
  const s2s = useTransform(scrollYProgress, [0.18, 0.43], [0.92, 1]);
  const s3o = useTransform(scrollYProgress, [0.36, 0.61], [0.3, 1]);
  const s3s = useTransform(scrollYProgress, [0.36, 0.61], [0.92, 1]);
  const stepActive = [
    { opacity: s1o, scale: s1s },
    { opacity: s2o, scale: s2s },
    { opacity: s3o, scale: s3s },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-8 sm:py-12 md:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            <SplitText text="From zero to monitoring " mode="chars" />
            <SplitText text="in 2 minutes" mode="chars" gradient />
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            No config files, no complex setup. Just you and your services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          <svg
            className="hidden md:block absolute top-12 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px pointer-events-none"
            style={{ width: 'calc(100% - 33.33% - 3rem)', margin: '0 auto' }}
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 0 0.5 L 100 0.5"
              stroke="var(--primary)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="transparent"
              style={{ pathLength: springPathLength, opacity: 0.15 }}
            />
            <motion.path
              d="M 0 0.5 L 100 0.5"
              stroke="var(--primary)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="transparent"
              style={{ pathLength: springPathLength }}
            />
          </svg>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              style={{
                opacity: stepActive[i].opacity,
                scale: stepActive[i].scale,
              }}
              className="relative"
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <motion.div
                layout
                className="rounded-xl border border-border/60 bg-card p-5 sm:p-6 md:p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/2 transition-all duration-500 h-full relative overflow-hidden"
              >
                <div className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                  <div className="relative shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 8, mass: 0.5 }}
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                    >
                      <span className="font-mono text-lg font-bold text-primary">{step.number}</span>
                    </motion.div>
                  </div>
                  <div className="md:mt-4">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    <AnimatePresence>
                      {hoveredStep === i && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                          className="text-xs text-primary/70 font-mono overflow-hidden"
                        >
                          {step.extraDesc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm text-muted-foreground">
              No configuration files needed
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
