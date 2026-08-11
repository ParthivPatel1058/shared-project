import { useEffect, useRef } from "react";

/**
 * Animated tile mosaic used behind the auth panels.
 *
 * The colour is generated from a vertical ramp rather than sampled from a
 * photograph: a photo of an evening field quantises to flat olive blocks, and
 * no amount of saturation lifting gives the green-to-water transition this
 * design needs. Generating it means the gradient is the same on every screen
 * size and never depends on which part of an image happens to be in frame.
 *
 * Everything is drawn to one canvas. A CSS grid of ~7,000 elements, each with
 * its own keyframes, is the obvious implementation and it janks badly on a mid
 * range phone — the whole point of this panel is that it feels calm.
 */

interface TileMosaicProps {
  /** Described to screen readers; the canvas itself carries no meaning. */
  alt: string;
  /** Size of one tile, in CSS pixels. Larger = chunkier. */
  cell?: number;
  className?: string;
}

/** Vertical colour ramp: forest floor at the top, water and light at the base. */
const STOPS: Array<[number, string]> = [
  [0.0, "#1a3409"],
  [0.14, "#2d5016"],
  [0.32, "#4a7c2a"],
  [0.46, "#7cb342"],
  [0.6, "#a4d65e"],
  [0.68, "#4a90b8"],
  [0.79, "#7fc4dd"],
  [0.88, "#b8e0ed"],
  [0.95, "#e8f4f8"],
  [1.0, "#ffffff"],
];

type RGB = [number, number, number];

const RAMP: Array<[number, RGB]> = STOPS.map(([t, hex]) => [
  t,
  [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ] as RGB,
]);

/** Colour at a position on the ramp, clamped at both ends. */
function rampAt(t: number): RGB {
  if (t <= RAMP[0][0]) return RAMP[0][1];
  if (t >= RAMP[RAMP.length - 1][0]) return RAMP[RAMP.length - 1][1];
  for (let i = 1; i < RAMP.length; i++) {
    const [t1, c1] = RAMP[i];
    if (t <= t1) {
      const [t0, c0] = RAMP[i - 1];
      const f = (t - t0) / (t1 - t0);
      return [
        c0[0] + (c1[0] - c0[0]) * f,
        c0[1] + (c1[1] - c0[1]) * f,
        c0[2] + (c1[2] - c0[2]) * f,
      ];
    }
  }
  return RAMP[RAMP.length - 1][1];
}

/** Deterministic per-tile noise, so the mosaic is identical on every load. */
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * cubic-bezier(0.16, 1, 0.3, 1) — the load cascade's easing.
 * Solved by bisection: it runs once per tile per frame only while the tile is
 * still entering, so precision matters more than the few microseconds saved.
 */
function easeOutExpoBezier(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const cx = 3 * 0.16;
  const bx = 3 * (0.3 - 0.16) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * 1;
  const by = 3 * (1 - 1) - cy;
  const ay = 1 - cy - by;

  let lo = 0;
  let hi = 1;
  let u = t;
  for (let i = 0; i < 18; i++) {
    const x = ((ax * u + bx) * u + cx) * u;
    if (x < t) lo = u;
    else hi = u;
    u = (lo + hi) / 2;
  }
  return ((ay * u + by) * u + cy) * u;
}

export default function TileMosaic({
  alt,
  cell = 9,
  className,
}: TileMosaicProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let W = 0;
    let H = 0;
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let visible = true;
    const startedAt = performance.now();

    /** Diagonal hatch, built once and tiled — the hand-sketched texture. */
    let hatch: CanvasPattern | null = null;
    const buildHatch = () => {
      const tile = document.createElement("canvas");
      tile.width = 8;
      tile.height = 8;
      const tctx = tile.getContext("2d");
      if (!tctx) return;
      tctx.strokeStyle = "rgba(255,255,255,0.5)";
      tctx.lineWidth = 0.7;
      tctx.beginPath();
      tctx.moveTo(-2, 10);
      tctx.lineTo(10, -2);
      tctx.moveTo(2, 14);
      tctx.lineTo(14, 2);
      tctx.stroke();
      hatch = ctx.createPattern(tile, "repeat");
    };

    /**
     * Sparse white wedges. These are what read as blades catching the light —
     * without them the panel is just a gradient and looks machine-made.
     */
    let wedges: Array<{ x: number; y: number; s: number; a: number }> = [];
    const buildWedges = () => {
      wedges = [];
      const count = Math.round((W * H) / 9000);
      for (let i = 0; i < count; i++) {
        const r1 = hash(i * 1.7, 9.1);
        const r2 = hash(i * 3.3, 4.7);
        const r3 = hash(i * 5.9, 2.3);
        // Kept to the upper, leafy two-thirds; the water below stays smooth.
        const y = r2 * 0.72 * H;
        wedges.push({
          x: r1 * W,
          y,
          s: 4 + r3 * 9,
          a: 0.35 + r3 * 0.5,
        });
      }
    };

    const pointer = { x: -9999, y: -9999 };
    let hoverEnergy = 0;
    let hovering = false;

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
      buildHatch();
      buildWedges();
      draw(performance.now());
    };

    function draw(now: number) {
      const time = (now - startedAt) / 1000;

      // Cascade delay is per diagonal, so the reveal sweeps top-left to
      // bottom-right rather than filling row by row.
      const cascadeDone = reduced || time * 1000 > (cols + rows) * 15 + 400;

      // Diagonal light sweep: one pass every nine seconds, then a rest.
      const sweep = ((time % 9) / 9) * 1.7 - 0.35;

      ctx.fillStyle = "#0d1c07";
      ctx.fillRect(0, 0, W, H);

      for (let ry = 0; ry < rows; ry++) {
        const ty = (ry * cell + cell / 2) / H;

        for (let rx = 0; rx < cols; rx++) {
          const n = hash(rx, ry);

          // Base position on the ramp, roughened so bands never look ruled.
          // Two octaves: a broad drift that gathers tiles into patches, plus
          // per-tile grain. One octave alone gives either uniform rows or
          // static — the patchiness is what reads as leaves and water.
          const patch = hash(Math.floor(rx / 4), Math.floor(ry / 4));
          let pos = ty + (patch - 0.5) * 0.1 + (n - 0.5) * 0.075;

          if (!reduced) {
            // Shimmer: each tile drifts between neighbouring shades on its own
            // 3-5s cycle, so the surface never pulses in unison.
            const period = 3 + n * 2;
            pos += Math.sin((time / period) * Math.PI * 2 + n * 12.9) * 0.022;

            // Water: a slow horizontal wave through the blue band only.
            if (ty > 0.66) {
              const depth = (ty - 0.66) / 0.34;
              pos += Math.sin(rx * 0.16 - time * 0.9) * 0.018 * depth;
            }
          }

          let [r, g, b] = rampAt(pos);

          if (!reduced) {
            // Light sweep, brightest along a diagonal band.
            const d = (rx / cols + ry / rows) / 2;
            const gap = Math.abs(d - sweep);
            if (gap < 0.14) {
              const lift = (1 - gap / 0.14) ** 2 * 34;
              r += lift;
              g += lift;
              b += lift;
            }
          }

          let px = rx * cell;
          let py = ry * cell;
          let size = cell;

          // Hover: lighten and lift the tiles nearest the cursor.
          if (hoverEnergy > 0.01) {
            const cxp = px + cell / 2;
            const cyp = py + cell / 2;
            const dist = Math.hypot(cxp - pointer.x, cyp - pointer.y);
            if (dist < 130) {
              const f = (1 - dist / 130) ** 2 * hoverEnergy;
              const lift = f * 40;
              r += lift;
              g += lift;
              b += lift;
              py -= f * 3;
              size = cell + f * 1.2;
            }
          }

          let alpha = 1;
          if (!cascadeDone) {
            // Fade and scale each tile in, offset along the diagonal.
            const delay = (rx + ry) * 15;
            const e = easeOutExpoBezier((time * 1000 - delay) / 400);
            if (e <= 0) continue;
            alpha = e;
            const scale = 0.9 + 0.1 * e;
            const inset = (cell * (1 - scale)) / 2;
            px += inset;
            py += inset;
            size = cell * scale;
          }

          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
          ctx.fillRect(px, py, size + 0.6, size + 0.6);
        }
      }

      ctx.globalAlpha = 1;

      // Texture goes on last so it reads as one surface rather than per tile.
      if (cascadeDone) {
        for (const w of wedges) {
          ctx.globalAlpha = w.a;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(w.x, w.y);
          ctx.lineTo(w.x - w.s, w.y - w.s * 0.34);
          ctx.lineTo(w.x - w.s, w.y + w.s * 0.34);
          ctx.closePath();
          ctx.fill();
        }

        if (hatch) {
          ctx.globalAlpha = 0.16;
          ctx.fillStyle = hatch;
          ctx.fillRect(0, 0, W, H);
        }
        ctx.globalAlpha = 1;
      }
    }

    const loop = (now: number) => {
      hoverEnergy += ((hovering ? 1 : 0) - hoverEnergy) * 0.1;
      draw(now);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!frame && visible && !reduced) frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    // Off-screen or background tabs must not burn a frame loop for a
    // decorative panel nobody is looking at.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    if (reduced) draw(performance.now());
    else start();

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      stop();
    };
  }, [cell]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={alt}
      className={`relative block overflow-hidden bg-[#0d1c07] ${className ?? ""}`}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block size-full"
      />
    </div>
  );
}
