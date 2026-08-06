/**
 * The BhoomiX mark, for laying over imagery.
 *
 * A rosette of overlapping rings with the brand X at its centre. Drawn as thin
 * strokes rather than a filled plate so the image still reads through it — a
 * solid badge would punch a hole in the very texture it sits on. Stroke-based
 * rather than a font glyph so it stays crisp at any size and never depends on
 * the display font having loaded.
 */
export default function BhoomixMark({ size = 84 }: { size?: number }) {
  // Twelve rings stepped around a small orbit make the interference pattern.
  const petals = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]"
    >
      <g stroke="white" strokeWidth="0.9" opacity="0.92">
        {petals.map((deg) => (
          <circle
            key={deg}
            cx="50"
            cy="50"
            r="21"
            transform={`rotate(${deg} 50 50) translate(0 -11)`}
          />
        ))}
      </g>

      {/* Centre dot, the still point the rosette turns around. */}
      <circle cx="50" cy="50" r="2.4" fill="white" />
    </svg>
  );
}
