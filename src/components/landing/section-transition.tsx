'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export default function SectionTransition({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawOpacity = useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [0.4, 1, 1, 0.4]);
  const rawY = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [30, 0, 0, 30]);
  const rawScale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.97, 1, 1, 0.97]);

  const opacity = useSpring(rawOpacity, { stiffness: 60, damping: 20 });
  const y = useSpring(rawY, { stiffness: 70, damping: 25 });
  const scale = useSpring(rawScale, { stiffness: 80, damping: 25 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale, willChange: 'transform, opacity' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
