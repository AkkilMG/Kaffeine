'use client';

import { motion } from 'motion/react';

type SplitMode = 'chars' | 'words';

const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionH3 = motion.h3;
const MotionH4 = motion.h4;
const MotionP = motion.p;
const MotionDiv = motion.div;
const MotionSpan = motion.span;

const tagMap = {
  h1: MotionH1,
  h2: MotionH2,
  h3: MotionH3,
  h4: MotionH4,
  p: MotionP,
  div: MotionDiv,
  span: MotionSpan,
} as const;

type Tag = keyof typeof tagMap;

export default function SplitText({
  text,
  mode = 'chars',
  className = '',
  gradient = false,
  delay = 0,
  stagger = 0.025,
  as: tag = 'span',
}: {
  text: string;
  mode?: SplitMode;
  className?: string;
  gradient?: boolean;
  delay?: number;
  stagger?: number;
  as?: Tag;
}) {
  const items =
    mode === 'chars'
      ? text.split('').map((c) => (c === ' ' ? '\u00A0' : c))
      : text.split(' ').map((w, i, a) => (i < a.length - 1 ? w + '\u00A0' : w));

  const Wrapper = tagMap[tag];
  const isInline = tag === 'span';

  return (
    <Wrapper
      className={className}
      style={{
        perspective: 800,
        display: isInline ? 'inline-block' : undefined,
      }}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, rotateX: -90, filter: 'blur(2px)' }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.45,
            delay: delay + i * stagger,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className={`inline-block ${gradient ? 'bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent' : ''}`}
        >
          {item}
        </motion.span>
      ))}
    </Wrapper>
  );
}
