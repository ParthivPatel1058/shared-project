import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Perspective depth card — the surface tilts toward the pointer and its
 * contents sit at different depths, so the card reads as a shallow box
 * rather than a flat rectangle.
 *
 * Written here rather than installed from React Bits Pro: that package needs
 * a licensed registry and a REACTBITS_LICENSE_KEY, neither of which is
 * configured in this project. The mechanics are the standard ones — a
 * perspective ancestor, rotateX/rotateY driven by the pointer's position
 * within the element, and translateZ on the children to separate the planes.
 *
 * Rotation is applied through CSS custom properties rather than React state
 * on every pointer sample: a re-render per mousemove is what makes tilt
 * effects feel heavy, and the browser can animate a variable off the main
 * thread. Only the entered/left flag is state.
 */

export interface DepthCardProps {
  children: ReactNode;
  /** Maximum tilt in degrees at the very edge of the card. */
  maxTilt?: number;
  /** Distance of the viewer from the surface. Lower exaggerates the effect. */
  perspective?: number;
  /** Lift applied while hovered, in px. */
  lift?: number;
  className?: string;
  /** Extra classes for the inner tilting plane. */
  innerClassName?: string;
}

export default function DepthCard({
  children,
  maxTilt = 9,
  perspective = 900,
  lift = 10,
  className,
  innerClassName,
}: DepthCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // -0.5 … 0.5 across each axis, so the centre is neutral.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Y drives rotateX inverted: pointer above centre should tip the top away.
    el.style.setProperty('--tilt-x', `${(-py * maxTilt).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(px * maxTilt).toFixed(2)}deg`);
    el.style.setProperty('--glare-x', `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--glare-y', `${((py + 0.5) * 100).toFixed(1)}%`);
  };

  const reset = () => {
    const el = ref.current;
    setHovered(false);
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={reset}
      className={cn('group/depth relative', className)}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-300 ease-out will-change-transform',
          '[transform-style:preserve-3d]',
          innerClassName,
        )}
        style={{
          transform: hovered
            ? 'rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) ' +
              `translateZ(${lift}px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0)',
        }}
      >
        {children}

        {/* Specular sheen that tracks the pointer. Sits above the content but
            takes no clicks, so the card underneath stays fully interactive. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/depth:opacity-100"
          style={{
            background:
              'radial-gradient(420px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.16), transparent 60%)',
            transform: 'translateZ(1px)',
          }}
        />
      </div>
    </div>
  );
}
