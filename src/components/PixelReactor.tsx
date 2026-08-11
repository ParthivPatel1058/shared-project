import { useEffect, useRef } from 'react';

/**
 * Pixel-mosaic image that reacts to the pointer.
 *
 * The image is reduced to a grid of flat colour cells once, up front. Every
 * frame each cell samples that grid at a position pushed radially away from the
 * cursor, so colours streak outward from wherever the pointer is and settle
 * back when it leaves. Sampling a pre-built grid rather than re-reading pixel
 * data keeps the loop to cheap fillRect calls.
 *
 * The canvas is sized from its container so the blocks stay square whatever the
 * panel's aspect ratio — stretching a fixed-resolution canvas to fit would
 * squash the pixels, which is very visible at this block size.
 */
interface PixelReactorProps {
  src: string;
  alt: string;
  /** Size of one mosaic block, in CSS pixels. Larger = chunkier. */
  cell?: number;
  /** How far the distortion reaches, in pixels. */
  radius?: number;
  /** Peak displacement at the cursor, in pixels. */
  strength?: number;
  /** Steps per colour channel. Lower = flatter, more poster-like bands. */
  levels?: number;
  /**
   * Ring density of the ripple. Higher = tighter, more water-like rings.
   * Defaults to 0: rings drew attention away from the sign-in form, so the
   * panel now smears smoothly outward instead of pulsing.
   */
  ripples?: number;
  /** Colour intensity multiplier applied before quantising. 1 = untouched. */
  saturation?: number;
  /** Overall lightness multiplier applied before quantising. 1 = untouched. */
  brightness?: number;
  /** Mark drawn over the centre of the panel, e.g. a logo. */
  centerMark?: React.ReactNode;
  className?: string;
}

export default function PixelReactor({
  src,
  alt,
  cell = 9,
  radius = 185,
  strength = 45,
  levels = 12,
  ripples = 0,
  saturation = 1.28,
  brightness = 1.06,
  centerMark,
  className,
}: PixelReactorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0;
    let H = 0;
    let cols = 0;
    let rows = 0;
    /** Quantised colour per mosaic cell, RGB triplets. */
    let grid: Uint8ClampedArray | null = null;
    let frame = 0;
    let loaded = false;

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    // 0 when idle, 1 while hovering — lets the effect fade rather than snap.
    let energy = 0;
    let hovering = false;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    /** Rebuild the colour grid for the current canvas size. */
    const build = () => {
      if (!loaded || cols < 1 || rows < 1) return;

      const small = document.createElement('canvas');
      small.width = cols;
      small.height = rows;
      const sctx = small.getContext('2d');
      if (!sctx) return;

      // Cover-fit so the image fills the panel without distorting.
      const scale = Math.max(cols / img.width, rows / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      sctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);

      const data = sctx.getImageData(0, 0, cols, rows).data;
      grid = new Uint8ClampedArray(cols * rows * 3);

      // Snap each channel to a few steps. This is what gives flat, poster-like
      // colour bands rather than a merely blurry photo.
      const step = 255 / (levels - 1);
      const quantise = (v: number) => Math.round(Math.round(v / step) * step);

      // Lift saturation and brightness first. The hero photo is an evening
      // field, so quantising it straight produces flat olive blocks — the
      // bands are there but the colour is not. Pushing each channel away from
      // its own grey point before snapping is what makes the mosaic read as
      // deliberate graphic art rather than a dark, blurry photograph.
      for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const grey = (r + g + b) / 3;
        grid[j] = quantise((grey + (r - grey) * saturation) * brightness);
        grid[j + 1] = quantise((grey + (g - grey) * saturation) * brightness);
        grid[j + 2] = quantise((grey + (b - grey) * saturation) * brightness);
      }
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      if (w === W && h === H) return;

      W = w;
      H = h;
      canvas.width = W;
      canvas.height = H;
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      target.x = eased.x = W / 2;
      target.y = eased.y = H / 2;
      build();
      draw();
    };

    const draw = () => {
      if (!grid) return;

      eased.x += (target.x - eased.x) * 0.16;
      eased.y += (target.y - eased.y) * 0.16;
      energy += ((hovering ? 1 : 0) - energy) * 0.09;

      const push = strength * energy;

      for (let ry = 0; ry < rows; ry++) {
        for (let rx = 0; rx < cols; rx++) {
          let sx = rx;
          let sy = ry;

          if (push > 0.3) {
            const px = rx * cell + cell / 2;
            const py = ry * cell + cell / 2;
            const dx = px - eased.x;
            const dy = py - eased.y;
            const dist = Math.hypot(dx, dy);

            if (dist < radius && dist > 0.001) {
              // Falls off smoothly to nothing at the edge of the radius.
              const f = 1 - dist / radius;
              // With rings on, cells are displaced alternately in and out so
              // the surface reads as water disturbed by the pointer. At zero
              // the sine would be flat zero and kill the effect outright, so
              // zero instead means a single smooth outward smear — quieter,
              // and it never pulls focus from the form beside it.
              const ripple = ripples > 0 ? Math.sin(dist * ripples * 0.05) * f : f;
              const amount = (ripple * f * push) / cell;
              sx = Math.round(rx + (dx / dist) * amount);
              sy = Math.round(ry + (dy / dist) * amount);
              // Clamp so cells near the border keep sampling real colours.
              sx = sx < 0 ? 0 : sx >= cols ? cols - 1 : sx;
              sy = sy < 0 ? 0 : sy >= rows ? rows - 1 : sy;
            }
          }

          const i = (sy * cols + sx) * 3;
          ctx.fillStyle = `rgb(${grid[i]},${grid[i + 1]},${grid[i + 2]})`;
          ctx.fillRect(rx * cell, ry * cell, cell, cell);
        }
      }
    };

    const loop = () => {
      draw();
      // Idle frames are wasted work: stop once the effect has fully settled.
      const settled =
        energy < 0.004 &&
        Math.abs(target.x - eased.x) < 0.5 &&
        Math.abs(target.y - eased.y) < 0.5;
      if (reduced || settled) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!frame && !reduced) frame = requestAnimationFrame(loop);
    };

    img.onload = () => {
      loaded = true;
      build();
      draw();
    };

    img.onerror = () => {
      ctx.fillStyle = '#16241d';
      ctx.fillRect(0, 0, W || 1, H || 1);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      hovering = true;
      wake();
    };
    const onLeave = () => {
      hovering = false;
      wake();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    img.src = src;

    return () => {
      observer.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [src, cell, radius, strength, levels, ripples, saturation, brightness]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={alt}
      className={`relative block cursor-crosshair touch-pan-y overflow-hidden ${className ?? ''}`}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block size-full" />

      {centerMark && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {centerMark}
        </div>
      )}
    </div>
  );
}
