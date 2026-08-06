import { useState } from 'react';

interface ProductImageProps {
  /** Either a bundled asset URL, or a single emoji used as a stand-in. */
  src: string;
  alt: string;
  /** Sizing/rounding classes, applied to whichever element is rendered. */
  className?: string;
}

/** An asset import resolves to a path; anything else is a glyph, not a URL. */
function isImageUrl(src: string): boolean {
  return /^(https?:|data:|blob:|\/)/.test(src) || src.includes('/');
}

/**
 * Product thumbnail that never renders a broken image.
 *
 * Some catalogue rows carry an emoji instead of a photo — a stand-in for
 * products we have no picture for. Passing that straight to `<img src>` made
 * the browser request `/🧪`, so the card showed a torn-image icon. Here a
 * non-URL value is drawn as the glyph it is, and a URL that fails to load
 * falls back to the same tile rather than leaving a hole in the grid.
 */
export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (src && isImageUrl(src) && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={className}
      />
    );
  }

  // Keep the caller's box so the grid never shifts when a photo is missing.
  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center bg-muted text-3xl ${className}`}
    >
      <span aria-hidden="true">{src && !isImageUrl(src) ? src : '🌾'}</span>
    </div>
  );
}
