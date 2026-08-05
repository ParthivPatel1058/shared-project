import React from 'react';
import { cn } from '@/lib/utils';

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visible label. Split per-character so each letter can animate. */
  label: string;
  icon?: React.ReactNode;
  /** Optional confirmed state shown after click (e.g. "Added"). */
  sentLabel?: string;
  sentIcon?: React.ReactNode;
  /**
   * True while a click is being honoured — the icon launches off the right
   * edge and the label dissolves downward, mirroring the original's
   * plane-takeoff sequence. Meant to be held for ~600ms before the caller
   * navigates or completes the action, e.g.:
   *   const [launching, setLaunching] = useState(false);
   *   onClick={() => { setLaunching(true); setTimeout(go, 650); }}
   */
  launching?: boolean;
  /**
   * 'neutral' (default) follows the theme — a light plate that turns dark in
   * dark mode, teal accent. 'gold' pins a warm cream plate and gold accent in
   * both themes, for a primary CTA that should read as premium rather than
   * blend into a dark UI.
   */
  tone?: 'neutral' | 'gold';
}

/**
 * Neumorphic action button: a raised plate with a conic light sweeping its
 * rim on hover, and a per-letter wave across the label.
 *
 * Ported from the styled-components original to plain CSS so it doesn't pull
 * a second styling runtime into a Tailwind project. The per-letter animation
 * is driven by a `--i` custom property set on each span — the original wrote
 * `style={{-i: n}}`, which is not a valid CSS custom property, so the stagger
 * never ran.
 */
const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ label, icon, sentLabel, sentIcon, launching, tone = 'neutral', className, ...props }, ref) => {
    const letters = Array.from(label);

    return (
      <button
        ref={ref}
        className={cn(
          'fancy-btn',
          tone === 'gold' && 'fancy-btn--gold',
          launching && 'fancy-btn--launching',
          className,
        )}
        {...props}
      >
        <span className="fancy-btn__outline" aria-hidden />

        <span className="fancy-btn__state fancy-btn__state--default">
          {icon && <span className="fancy-btn__icon">{icon}</span>}
          <span className="fancy-btn__label" aria-hidden>
            {letters.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                style={{ '--i': i } as React.CSSProperties}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
          {/* Readable label for assistive tech, since the visible one is split */}
          <span className="sr-only">{label}</span>
        </span>

        {sentLabel && (
          <span className="fancy-btn__state fancy-btn__state--sent">
            {sentIcon && <span className="fancy-btn__icon">{sentIcon}</span>}
            <span className="fancy-btn__label" aria-hidden>
              {Array.from(sentLabel).map((ch, i) => (
                <span key={`s-${ch}-${i}`} style={{ '--i': i } as React.CSSProperties}>
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </span>
          </span>
        )}
      </button>
    );
  },
);

FancyButton.displayName = 'FancyButton';

export { FancyButton };
