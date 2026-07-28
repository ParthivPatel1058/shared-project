import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlareHoverProps {
  children: ReactNode;
  className?: string;
  /** Angle of the glare band, in degrees. */
  angle?: number;
  /** Sweep duration in seconds. */
  duration?: number;
  /** Glare colour. */
  color?: string;
  /** Peak opacity of the band. */
  opacity?: number;
}

/**
 * React Bits style glare hover: a soft light band sweeps diagonally across
 * the surface on hover. Purely decorative and pointer-transparent, so it can
 * wrap interactive controls without swallowing clicks.
 */
export default function GlareHover({
  children,
  className,
  angle = 115,
  duration = 0.75,
  color = 'rgba(255,255,255,0.55)',
  opacity = 1,
}: GlareHoverProps) {
  const style = {
    '--glare-angle': `${angle}deg`,
    '--glare-duration': `${duration}s`,
    '--glare-color': color,
    '--glare-opacity': opacity,
  } as CSSProperties;

  return (
    <span className={cn('glare-hover', className)} style={style}>
      {children}
    </span>
  );
}
