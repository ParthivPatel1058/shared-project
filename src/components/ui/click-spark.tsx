import { useEffect, useRef } from 'react';

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  start: number;
}

/**
 * React Bits style click spark: a burst of short rays fires from every click,
 * drawn on one full-screen canvas so it costs a single context no matter how
 * many clicks happen. Mount once, near the app root.
 */
export default function ClickSpark({
  sparkColor = '#f3e2bd',
  sparkSize = 11,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 420,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const raf = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onClick = (e: MouseEvent) => {
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / sparkCount,
          start: now,
        });
      }
    };
    window.addEventListener('click', onClick);

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks.current = sparks.current.filter((s) => now - s.start < duration);

      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      for (const s of sparks.current) {
        const t = (now - s.start) / duration;
        const eased = easeOut(t);
        const dist = eased * sparkRadius;
        const len = sparkSize * (1 - eased);

        ctx.globalAlpha = 1 - eased;
        ctx.beginPath();
        ctx.moveTo(s.x + dist * Math.cos(s.angle), s.y + dist * Math.sin(s.angle));
        ctx.lineTo(
          s.x + (dist + len) * Math.cos(s.angle),
          s.y + (dist + len) * Math.sin(s.angle),
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', onClick);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
