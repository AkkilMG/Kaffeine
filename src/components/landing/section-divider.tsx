'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scaleX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const springScaleX = useSpring(scaleX, { stiffness: 60, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-24 md:h-32 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/2 left-[10%] right-[10%] h-px -translate-y-1/2"
        style={{ scaleX: springScaleX, opacity, transformOrigin: 'left' }}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </motion.div>
    </div>
  );
}
