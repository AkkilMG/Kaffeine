'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 120, damping: 14 });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 14 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReduced) return;

    document.body.style.cursor = 'none';

    const a = document.createElement('style');
    a.textContent = 'a,button,[role="button"],input,select,textarea,label{cursor:none!important}';
    document.head.appendChild(a);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', move);
    return () => {
      document.body.style.cursor = '';
      a.remove();
      window.removeEventListener('mousemove', move);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-7 h-7 rounded-full border border-foreground/25 bg-foreground/[0.03]"
        style={{
          translateX: springX,
          translateY: springY,
          x: '-50%',
          y: '-50%',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1 h-1 rounded-full bg-foreground/50"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: '-50%',
          y: '-50%',
        }}
      />
    </>
  );
}
