import { useEffect, useRef, useState, type ReactNode } from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  /** Seconds of stagger between each character. */
  stagger?: number;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
  as?: 'h1' | 'h2' | 'span' | 'p';
  children?: ReactNode;
}

/**
 * Laocoön-style per-letter blur-up reveal. Each character rises from 50px
 * below with a 12px→0 blur, staggered. Triggers once when scrolled into view.
 * Use "\n" in `text` for line breaks.
 */
export default function BlurText({
  text,
  className = '',
  stagger = 0.035,
  delay = 0,
  as: Tag = 'h1',
}: BlurTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  let charIndex = 0;
  const lines = text.split('\n');

  return (
    <Tag ref={ref as never} className={`blur-text ${shown ? 'is-shown' : ''} ${className}`}>
      {lines.map((line, li) => (
        <span key={li} className="blur-text-line">
          {Array.from(line).map((ch, ci) => {
            if (ch === ' ') return <span key={ci}>&nbsp;</span>;
            const d = delay + charIndex * stagger;
            charIndex += 1;
            return (
              <span key={ci} className="blur-char" style={{ transitionDelay: `${d}s` }}>
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
