import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Chunky button with real depth: a darker plinth sits behind the face, and the
 * face travels down onto it when pressed. Two stacked layers rather than a
 * box-shadow, so the press reads as the button physically bottoming out.
 */
interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'emerald' | 'gold';
}

const TONES = {
  emerald: {
    face: 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-emerald-950',
    plinth: 'bg-emerald-800',
    glow: 'shadow-[0_10px_36px_-10px_rgba(16,185,129,0.65)]',
  },
  gold: {
    face: 'bg-gradient-to-b from-amber-200 to-amber-400 text-amber-950',
    plinth: 'bg-amber-700',
    glow: 'shadow-[0_10px_36px_-10px_rgba(245,158,11,0.6)]',
  },
} as const;

const Button3D = React.forwardRef<HTMLButtonElement, Button3DProps>(
  ({ tone = 'emerald', className, children, disabled, ...props }, ref) => {
    const t = TONES[tone];
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'group relative block w-full select-none rounded-2xl outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          disabled && 'pointer-events-none opacity-60',
          className,
        )}
        {...props}
      >
        {/* Plinth — the side of the button you see under the face. */}
        <span
          aria-hidden="true"
          className={cn('absolute inset-x-0 bottom-0 top-[6px] rounded-2xl', t.plinth)}
        />

        {/* Face — drops onto the plinth on press. */}
        <span
          className={cn(
            'relative flex h-14 items-center justify-center gap-2 rounded-2xl',
            'text-base font-bold tracking-wide',
            'transition-transform duration-100 ease-out',
            'group-hover:-translate-y-[1px] group-active:translate-y-[6px]',
            t.face,
            t.glow,
          )}
        >
          {/* Specular sheen along the top edge. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-[3px] h-[38%] rounded-full bg-white/35 blur-[6px]"
          />
          <span className="relative flex items-center gap-2">{children}</span>
        </span>
      </button>
    );
  },
);
Button3D.displayName = 'Button3D';

export default Button3D;
