import { useEffect, useRef, useState } from 'react';

/**
 * Giant BHOOMIX wordmark with video playing inside the letterforms.
 *
 * Done by knockout rather than `background-clip: text`, which cannot take a
 * video: the video sits underneath, and an SVG rectangle painted in the page
 * background colour is laid over it with the text masked *out*. The background
 * covers everything except the letters, so the video shows only through them.
 * This keeps real text in the DOM, so the font loads normally and screen
 * readers still get the word.
 */
interface VideoWordmarkProps {
  /** Word to cut out of the overlay. */
  text?: string;
  /** Video shown through the letters. */
  src?: string;
  className?: string;
}

export default function VideoWordmark({
  text = 'BHOOMIX',
  src = '/media/wordmark.mp4',
  className,
}: VideoWordmarkProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  // Respect the OS "reduce motion" setting — a looping video is exactly the
  // kind of thing that setting exists to stop.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const v = videoRef.current;
      if (!v) return;
      if (media.matches) v.pause();
      else void v.play().catch(() => {/* autoplay blocked; poster still shows */});
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  // Unique per instance so two wordmarks on one page cannot share a mask id.
  const maskId = `wordmark-knockout-${text.toLowerCase().replace(/\W/g, '')}`;

  return (
    <div
      className={className}
      role="img"
      aria-label={text}
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
    >
      {!failed && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/*
        Fallback when the video cannot load: a warm gradient so the wordmark
        still reads as intended instead of showing a blank hole.
      */}
      {failed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-primary/70 via-secondary/60 to-primary/40"
        />
      )}

      <svg
        viewBox="0 0 1000 230"
        preserveAspectRatio="xMidYMid meet"
        className="relative block w-full"
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId}>
            {/* White keeps the overlay, black punches the letters through. */}
            <rect x="0" y="0" width="1000" height="230" fill="white" />
            <text
              x="500"
              y="205"
              textAnchor="middle"
              fill="black"
              /*
                textLength pins the word to the viewBox regardless of which font
                actually loads, so a fallback font cannot push letters off the
                edge. Without it "BHOOMIX" overflowed and clipped the X.
              */
              textLength="960"
              lengthAdjust="spacingAndGlyphs"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '200px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {text}
            </text>
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="1000"
          height="230"
          mask={`url(#${maskId})`}
          style={{ fill: 'hsl(var(--background))' }}
        />
      </svg>
    </div>
  );
}
