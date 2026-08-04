import { useEffect, useRef } from 'react';

/**
 * Pixel-mosaic image that reacts to the pointer.
 *
 * The image is reduced to a grid of colour cells once, up front. Every frame
 * each cell samples the grid at a position pushed radially away from the
 * cursor, so colours smear outward from wherever the pointer is and settle back
 * when it leaves. Sampling a pre-built grid rather than re-reading pixel data
 * keeps the loop to cheap fillRect calls.
 */
interface PixelReactorProps {
  src: string;
  alt: string;
  /** Size of one mosaic block, in canvas pixels. Larger = chunkier. */
  cell?: number;
  /** How far the distortion reaches, in canvas pixels. */
  radius?: number;
  /** Peak displacement at the cursor, in canvas pixels. */
  strength?: number;
  className?: string;
}

const W = 400;
const H = 540;

export default function PixelReactor({
  src,
  alt,
  cell = 7,
  radius = 185,
  strength = 130,
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

    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /** Averaged colour per mosaic cell, RGB triplets. */
    let grid: Uint8ClampedArray | null = null;
    let frame = 0;

    // Pointer in canvas space, plus a smoothed copy so motion feels fluid.
    const target = { x: W / 2, y: H / 2 };
    const eased = { x: W / 2, y: H / 2 };
    // 0 when idle, 1 while hovering — lets the effect fade rather than snap.
    let energy = 0;
    let hovering = false;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Downscale to one pixel per cell; the browser averages for us.
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
      for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
        grid[j] = data[i];
        grid[j + 1] = data[i + 1];
        grid[j + 2] = data[i + 2];
      }
      loop();
    };

    img.onerror = () => {
      ctx.fillStyle = '#16241d';
      ctx.fillRect(0, 0, W, H);
    };

    const draw = () => {
      if (!grid) return;

      // Ease the pointer and the on/off energy.
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
              const amount = (f * f * push) / cell;
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

    const toCanvas = (clientX: number, clientY: number) => {
      const r = host.getBoundingClientRect();
      target.x = ((clientX - r.left) / r.width) * W;
      target.y = ((clientY - r.top) / r.height) * H;
    };

    const onMove = (e: PointerEvent) => {
      toCanvas(e.clientX, e.clientY);
      hovering = true;
      wake();
    };
    const onLeave = () => {
      hovering = false;
      wake();
    };

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    img.src = src;

    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [src, cell, radius, strength]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={alt}
      className={`relative block cursor-crosshair touch-pan-y overflow-hidden ${className ?? ''}`}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="pointer-events-none absolute inset-0 block size-full"
      />
    </div>
  );
}
