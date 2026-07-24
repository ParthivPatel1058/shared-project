import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FRAME_COUNT = 7;
const FRAME_SRC = (i: number) => `/frames/frame_${String(i + 1).padStart(3, '0')}.png`;

/**
 * Apple-style scroll-scrubbed cinema section. A tall scroll region pins a
 * full-viewport canvas; scroll progress scrubs through the frame sequence
 * with crossfade interpolation between adjacent frames so a short sequence
 * still reads as smooth motion. Falls back to a static frame when the user
 * prefers reduced motion.
 */
export default function ScrollCinema() {
  const { language } = useLanguage();
  const en = language === 'en';

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const rafRef = useRef<number>();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preload all frames
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_SRC(i);
      img.onload = () => {
        loaded += 1;
        if (loaded === FRAME_COUNT) setReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  // Draw one image cover-fit
  const drawCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cw: number,
    ch: number,
    alpha: number,
  ) => {
    if (!img.naturalWidth) return;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  // Render current progress to canvas
  const render = () => {
    const canvas = canvasRef.current;
    const imgs = imagesRef.current;
    if (!canvas || imgs.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const float = progressRef.current * (FRAME_COUNT - 1);
    const lo = Math.floor(float);
    const hi = Math.min(lo + 1, FRAME_COUNT - 1);
    const frac = float - lo;

    ctx.clearRect(0, 0, cw, ch);
    drawCover(ctx, imgs[lo], cw, ch, 1);
    if (hi !== lo && frac > 0) drawCover(ctx, imgs[hi], cw, ch, frac);
    ctx.globalAlpha = 1;
  };

  // Scroll → progress
  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      progressRef.current = reduced ? 0 : p;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        render();
        setProgress(progressRef.current);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const captionOpacity = progress < 0.12 ? 1 : Math.max(0, 1 - (progress - 0.12) * 6);
  const endOpacity = progress > 0.8 ? Math.min(1, (progress - 0.8) * 6) : 0;

  return (
    <section ref={sectionRef} className="relative h-[350vh] -mx-4 mb-16">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Frame canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Soft edges so the section blends with the page */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/90 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />

        {/* Opening caption */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none transition-opacity duration-200"
          style={{ opacity: captionOpacity }}
        >
          <div className="glass px-8 py-6 !rounded-3xl max-w-lg">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-2">
              {en ? 'The BhoomiX Journey' : 'BhoomiX की यात्रा'}
            </h2>
            <p className="text-white/70 text-sm md:text-base">
              {en
                ? 'From your farm to every market in India — scroll to travel'
                : 'आपके खेत से भारत के हर बाज़ार तक — यात्रा के लिए स्क्रॉल करें'}
            </p>
          </div>
          <ChevronDown className="mt-6 h-6 w-6 text-white/70 animate-bounce" />
        </div>

        {/* Closing caption */}
        <div
          className="absolute inset-x-0 bottom-16 flex justify-center px-6 pointer-events-none transition-opacity duration-200"
          style={{ opacity: endOpacity }}
        >
          <div className="glass px-6 py-4 !rounded-2xl">
            <p className="font-display text-lg md:text-xl font-bold text-white">
              {en ? 'Delivered. From seed to sale 🌾' : 'पहुंच गया। बीज से बिक्री तक 🌾'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
