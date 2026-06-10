'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const wipeProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const springWipe = useSpring(wipeProgress, { stiffness: 40, damping: 15 });

  const clipPath = useTransform(
    springWipe,
    [0, 0.5, 1],
    ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']
  );

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-24 md:h-32 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath, opacity, willChange: 'clip-path' }}
      >
        <div className="relative w-full max-w-3xl">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary/40 blur-sm"
            style={{ scale: springWipe }}
          />
        </div>
      </motion.div>
    </div>
  );
}
