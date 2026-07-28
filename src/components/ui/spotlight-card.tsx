import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** rgba/hsl colour of the spotlight glow. */
  spotlightColor?: string;
}

/**
 * React Bits style spotlight card: a soft radial highlight tracks the cursor
 * across the card surface and fades out on leave.
 */
export default function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(255, 236, 190, 0.28)',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(circle 240px at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
