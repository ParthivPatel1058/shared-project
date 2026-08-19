import { useEffect } from 'react';

/**
 * Gives the fixed scene backdrop depth by drifting it against the pointer.
 *
 * The backdrop is a `body::before` layer, not an element React owns, so this
 * writes two custom properties on the root and lets CSS do the moving. That
 * also means no React re-render per pointer sample — a state update every
 * mousemove is what makes parallax feel heavy.
 *
 * The image drifts *opposite* the cursor. Moving with it reads as the page
 * sliding around; moving against it reads as looking past a window, which is
 * the effect worth having.
 *
 * Mounted once, near the root. Sets nothing and listens to nothing when the
 * visitor has asked for reduced motion.
 */

/** Maximum drift in either direction, in px. */
const RANGE = 18;
/** How much of the remaining distance is covered each frame. */
const EASE = 0.075;

export default function SceneParallax() {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    // Coarse pointers have no hover to track, and the listener would only
    // fire on drag — which fights scrolling on a phone.
    if (!window.matchMedia?.('(pointer: fine)').matches) return;

    const root = document.documentElement;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      // -1 … 1 from the centre of the viewport.
      targetX = -((e.clientX / window.innerWidth) * 2 - 1) * RANGE;
      targetY = -((e.clientY / window.innerHeight) * 2 - 1) * RANGE;
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const loop = () => {
      currentX += (targetX - currentX) * EASE;
      currentY += (targetY - currentY) * EASE;
      root.style.setProperty('--scene-x', `${currentX.toFixed(2)}px`);
      root.style.setProperty('--scene-y', `${currentY.toFixed(2)}px`);

      // Stop once it has effectively arrived, rather than burning a frame
      // loop forever while the pointer sits still.
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frame = requestAnimationFrame(loop);
      } else {
        frame = 0;
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty('--scene-x');
      root.style.removeProperty('--scene-y');
    };
  }, []);

  return null;
}
