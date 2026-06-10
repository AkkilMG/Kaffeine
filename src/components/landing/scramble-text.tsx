'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

const chars = '!@#$%^&*()<>?/{}[]|~abcdefghijklmnopqrstuvwxyz0123456789';

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: 'hover' | 'view' | 'auto';
  delay?: number;
  speed?: number;
}

export default function ScrambleText({
  text,
  className = '',
  trigger = 'auto',
  delay = 0,
  speed = 50,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('');
  const isScrambling = useRef(false);
  const hasScrambled = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const doScramble = useCallback(() => {
    if (isScrambling.current || hasScrambled.current) return;
    isScrambling.current = true;

    let iteration = 0;
    const totalIterations = Math.max(text.length * 2 + 4, 8);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return '\u00A0';
            if (i <= Math.floor(iteration / 2)) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1;
      if (iteration >= totalIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        isScrambling.current = false;
        hasScrambled.current = true;
      }
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    if (trigger === 'auto') {
      const t = setTimeout(() => doScramble(), delay);
      return () => clearTimeout(t);
    }
    if (trigger === 'view') {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            doScramble();
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [trigger, delay, doScramble]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={() => { if (trigger === 'hover') doScramble(); }}
    >
      {displayText || text}
    </span>
  );
}
