'use client';

import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  return (
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 w-px h-24 sm:h-32 bg-foreground/5 z-50 pointer-events-none hidden md:block">
      <motion.div
        className="w-full bg-foreground/25 origin-top"
        style={{ scaleY }}
      />
    </div>
  );
}
