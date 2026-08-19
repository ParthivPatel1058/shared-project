import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TubelightNavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: TubelightNavItem[];
  className?: string;
}

/**
 * Pill navigation with a "tubelight" glow sitting over the active item.
 *
 * Two changes from the reference implementation:
 *
 * The active item is derived from the current route rather than held in local
 * state. The original seeds state from `items[0]` and only updates on click,
 * so the lamp sat on the first tab no matter which page you were actually on,
 * and never moved for browser back/forward or any link elsewhere in the app.
 *
 * `next/link` is swapped for React Router, since this is a Vite SPA.
 *
 * The glow travels between items via a shared `layoutId`, so Framer animates
 * one element moving rather than cross-fading two.
 */
export function TubelightNavBar({ items, className }: NavBarProps) {
  const { pathname } = useLocation();

  // Longest match wins, so "/agri-market" is not shadowed by a "/" item.
  const activeUrl =
    items
      .filter((i) => pathname === i.url || pathname.startsWith(`${i.url}/`))
      .sort((a, b) => b.url.length - a.url.length)[0]?.url ?? null;

  return (
    <nav
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1',
        'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]',
        'backdrop-blur-2xl',
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeUrl === item.url;

        return (
          <Link
            key={item.url}
            to={item.url}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5',
              isActive
                ? 'text-white'
                : 'text-white/65 hover:text-white',
            )}
          >
            <span className="relative z-10 hidden items-center gap-2 md:inline-flex">
              <Icon size={15} strokeWidth={2.4} />
              {item.name}
            </span>
            <span className="relative z-10 md:hidden">
              <Icon size={18} strokeWidth={2.5} />
            </span>

            {isActive && (
              <motion.span
                layoutId="tubelight"
                className="absolute inset-0 -z-0 rounded-full bg-white/15"
                initial={false}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              >
                {/* The filament, plus three blurred pools standing in for the
                    light it throws. Decorative only. */}
                <span className="absolute -top-[3px] left-1/2 h-[3px] w-9 -translate-x-1/2 rounded-full bg-[hsl(var(--aqua))]">
                  <span className="absolute -left-3 -top-2 h-6 w-14 rounded-full bg-[hsl(var(--aqua)/0.45)] blur-md" />
                  <span className="absolute -top-1 h-5 w-9 rounded-full bg-[hsl(var(--aqua)/0.35)] blur-md" />
                  <span className="absolute left-2 top-0 h-4 w-5 rounded-full bg-[hsl(var(--aqua)/0.3)] blur-sm" />
                </span>
              </motion.span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default TubelightNavBar;
