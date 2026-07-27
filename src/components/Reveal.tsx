import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before this element animates. */
  delay?: number;
  /** Direction the element travels in from. */
  from?: Direction;
  /** Travel distance in px. */
  distance?: number;
  /** Adds a blur-in, for headline-weight elements. */
  blur?: boolean;
  className?: string;
  /** Stagger children that are themselves <Reveal> or motion elements. */
  stagger?: number;
  as?: 'div' | 'section' | 'span' | 'li';
  /**
   * Animate immediately on mount instead of waiting to scroll into view.
   * Use for above-the-fold content — an IntersectionObserver that never
   * fires would otherwise leave it stuck at opacity 0.
   */
  immediate?: boolean;
}

const offset = (from: Direction, d: number) => {
  switch (from) {
    case 'up': return { y: d };
    case 'down': return { y: -d };
    case 'left': return { x: -d };
    case 'right': return { x: d };
    default: return {};
  }
};

/**
 * Scroll-triggered entrance. Uses the editorial easing curve so motion feels
 * slow and expensive rather than snappy. Animates once, and collapses to a
 * plain fade when the user prefers reduced motion.
 */
export default function Reveal({
  children,
  delay = 0,
  from = 'up',
  distance = 28,
  blur = false,
  className,
  stagger,
  as = 'div',
  immediate = false,
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offset(from, distance),
      ...(blur ? { filter: 'blur(12px)' } : {}),
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: 'blur(0px)' } : {}),
      transition: {
        duration: 1,
        delay,
        ease: [0.16, 1, 0.3, 1],
        ...(stagger ? { staggerChildren: stagger, delayChildren: delay } : {}),
      },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once: true, amount: 0.2 } })}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Word-by-word reveal for display headlines. Each word rises and unblurs on a
 * stagger — designed for the large editorial serif.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  stagger = 0.08,
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount — required for above-the-fold headlines. */
  immediate?: boolean;
}) {
  const lines = text.split('\n');
  let index = 0;

  return (
    <span className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden">
          {line.split(' ').map((word) => {
            const i = index++;
            return (
              <motion.span
                key={`${li}-${i}`}
                className="inline-block"
                initial={{ opacity: 0, y: '0.5em', filter: 'blur(10px)' }}
                {...(immediate
                  ? { animate: { opacity: 1, y: 0, filter: 'blur(0px)' } }
                  : {
                      whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
                      viewport: { once: true },
                    })}
                transition={{
                  duration: 1.1,
                  delay: delay + i * stagger,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
                {' '}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
