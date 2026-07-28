import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StarBorderProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Colour of the travelling glow. */
  color?: string;
  /** One full lap, e.g. "6s". */
  speed?: string;
  /** Thickness of the glow band in px. */
  thickness?: number;
  [key: string]: unknown;
}

/**
 * React Bits style star border: two soft radial glows travel along the top
 * and bottom edges, giving a pill an animated, premium rim.
 */
export default function StarBorder({
  children,
  as: Component = 'button',
  className,
  color = 'hsl(var(--aqua))',
  speed = '6s',
  thickness = 1.5,
  ...rest
}: StarBorderProps) {
  const style = {
    '--star-color': color,
    '--star-speed': speed,
    padding: `${thickness}px 0`,
  } as CSSProperties;

  return (
    <Component className={cn('star-border', className)} style={style} {...rest}>
      <span className="star-border-trail star-border-trail--bottom" aria-hidden />
      <span className="star-border-trail star-border-trail--top" aria-hidden />
      <span className="star-border-inner">{children}</span>
    </Component>
  );
}
