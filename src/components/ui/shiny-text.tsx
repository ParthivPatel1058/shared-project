import { cn } from '@/lib/utils';

interface ShinyTextProps {
  text: string;
  className?: string;
  /** Seconds for one shine pass. */
  speed?: number;
  disabled?: boolean;
}

/**
 * React Bits style shiny text: a light band sweeps across the glyphs on a
 * loop. Uses background-clip so the shine rides the text itself.
 */
export default function ShinyText({
  text,
  className,
  speed = 5,
  disabled = false,
}: ShinyTextProps) {
  return (
    <span
      className={cn('shiny-text', disabled && 'shiny-text--off', className)}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}
