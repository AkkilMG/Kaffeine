'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 120, damping: 14 });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 14 });

  const trail1X = useSpring(springX, { stiffness: 80, damping: 10 });
  const trail1Y = useSpring(springY, { stiffness: 80, damping: 10 });
  const trail2X = useSpring(trail1X, { stiffness: 50, damping: 8 });
  const trail2Y = useSpring(trail1Y, { stiffness: 50, damping: 8 });
  const trail3X = useSpring(trail2X, { stiffness: 30, damping: 6 });
  const trail3Y = useSpring(trail2Y, { stiffness: 30, damping: 6 });

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
      {[
        { x: trail1X, y: trail1Y, size: 5, opacity: 0.25 },
        { x: trail2X, y: trail2Y, size: 4, opacity: 0.12 },
        { x: trail3X, y: trail3Y, size: 3, opacity: 0.06 },
      ].map((t, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full bg-foreground"
          style={{
            translateX: t.x,
            translateY: t.y,
            x: '-50%',
            y: '-50%',
            width: t.size,
            height: t.size,
            opacity: t.opacity,
          }}
        />
      ))}
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
