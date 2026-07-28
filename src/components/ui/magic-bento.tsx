import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BentoItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

interface MagicBentoProps {
  items: BentoItem[];
  /** Radius in px within which a card's border begins to glow. */
  proximity?: number;
  /** Disable tilt/particles for low-power devices. */
  simple?: boolean;
  className?: string;
}

/** Bento spans, cycled over the item list to build an editorial rhythm. */
const SPANS = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-1',
];

function BentoCard({
  item,
  span,
  simple,
  onOpen,
}: {
  item: BentoItem;
  span: string;
  simple: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    // Card-local coords drive the spotlight; normalised coords drive tilt.
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (!simple) setTilt({ ry: (px - 0.5) * 7, rx: (0.5 - py) * 7 });
  };

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      onClick={onOpen}
      className={cn('bento-card group relative overflow-hidden rounded-[26px] text-left', span)}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
      />

      {/* Legibility + cursor spotlight */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-transparent" />
      <span className="bento-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Copy */}
      <span className="relative z-10 flex h-full flex-col justify-end p-5">
        <span className="flex items-end justify-between gap-3">
          <span className="min-w-0">
            <span
              className="block truncate text-lg font-medium text-white md:text-xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {item.title}
            </span>
            <span className="mt-1 block max-h-0 overflow-hidden text-sm leading-relaxed text-white/75 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-24 group-hover:opacity-100">
              {item.summary}
            </span>
          </span>
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:border-white/70 group-hover:bg-white group-hover:text-neutral-900">
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </span>
        </span>
      </span>
    </button>
  );
}

/**
 * React Bits style Magic Bento: a varied bento grid where every card's border
 * lights up as the pointer approaches, the surface catches a cursor spotlight,
 * and cards tilt slightly under the pointer.
 *
 * Proximity glow is driven from a single container-level pointer listener and
 * written straight to CSS custom properties, so hovering the grid does not
 * re-render React for every card.
 */
export default function MagicBento({
  items,
  proximity = 380,
  simple = false,
  className,
}: MagicBentoProps) {
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);

  const onPointer = useCallback(
    (e: PointerEvent) => {
      const grid = gridRef.current;
      if (!grid) return;
      for (const el of Array.from(grid.children) as HTMLElement[]) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = Math.max(Math.abs(e.clientX - cx) - r.width / 2, 0);
        const dy = Math.max(Math.abs(e.clientY - cy) - r.height / 2, 0);
        const dist = Math.hypot(dx, dy);
        const intensity = Math.max(0, 1 - dist / proximity);
        el.style.setProperty('--glow', intensity.toFixed(3));
        el.style.setProperty('--gx', `${e.clientX - r.left}px`);
        el.style.setProperty('--gy', `${e.clientY - r.top}px`);
      }
    },
    [proximity],
  );

  useEffect(() => {
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [onPointer]);

  return (
    <div
      ref={gridRef}
      className={cn(
        'grid auto-rows-[190px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3',
        className,
      )}
    >
      {items.map((item, i) => (
        <BentoCard
          key={item.id}
          item={item}
          span={SPANS[i % SPANS.length]}
          simple={simple}
          onOpen={() => navigate(item.url)}
        />
      ))}
    </div>
  );
}
