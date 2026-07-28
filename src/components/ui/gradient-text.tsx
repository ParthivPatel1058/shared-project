import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  /** Gradient stops, cycled left to right. */
  colors?: string[];
  /** Seconds for one full sweep. */
  animationSpeed?: number;
  /** Draws an animated gradient border around the text instead. */
  showBorder?: boolean;
}

/**
 * React Bits style gradient text: an animated multi-stop gradient clipped to
 * the glyphs, optionally inside a matching animated border chip.
 */
export default function GradientText({
  children,
  className,
  colors = ['#ffd89b', '#f7b733', '#ffe9a8', '#c9a227', '#ffd89b'],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const gradient = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span
      className={cn(
        'relative inline-flex max-w-fit items-center justify-center overflow-hidden',
        showBorder && 'rounded-full px-4 py-1.5',
        className,
      )}
    >
      {showBorder && (
        <span
          aria-hidden
          className="gradient-text-anim absolute inset-0 z-0 bg-[length:300%_100%]"
          style={gradient}
        >
          <span className="absolute inset-[1px] z-10 rounded-full bg-[#0b0d12]" />
        </span>
      )}
      <span
        className="gradient-text-anim relative z-10 bg-[length:300%_100%] bg-clip-text text-transparent"
        style={gradient}
      >
        {children}
      </span>
    </span>
  );
}
