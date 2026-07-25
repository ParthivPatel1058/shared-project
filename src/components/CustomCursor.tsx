import { useEffect, useRef } from 'react';

/**
 * Laocoön-style double-ring cursor. A small solid inner ring snaps to the
 * pointer; a larger outer ring lerps toward it for a smooth, premium trail.
 * Grows on hover over interactive elements. Disabled on touch devices, where
 * a custom cursor only gets in the way.
 */
export default function CustomCursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    document.body.classList.add('has-custom-cursor');

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let outerX = cursorX;
    let outerY = cursorY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      if (innerRef.current) {
        innerRef.current.style.left = `${cursorX}px`;
        innerRef.current.style.top = `${cursorY}px`;
      }
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest('a, button, input, textarea, select, [role="button"], label');
      outerRef.current?.classList.toggle('cursor-grow', interactive);
    };

    const tick = () => {
      outerX += (cursorX - outerX) * 0.2;
      outerY += (cursorY - outerY) * 0.2;
      if (outerRef.current) {
        outerRef.current.style.left = `${outerX}px`;
        outerRef.current.style.top = `${outerY}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={innerRef} className="cursor-inner" aria-hidden />
      <div ref={outerRef} className="cursor-outer" aria-hidden />
    </>
  );
}
