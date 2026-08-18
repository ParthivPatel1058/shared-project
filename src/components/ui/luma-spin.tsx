import { cn } from '@/lib/utils';

/**
 * Two squares chasing each other around the corners of a box.
 *
 * The keyframes live in `tailwind.config.ts` rather than in a `<style jsx>`
 * block as the original snippet had them: styled-jsx is a Next.js feature and
 * is inert under Vite, and an inline `<style>` would be duplicated into the
 * DOM once per mounted spinner.
 *
 * Colour follows `currentColor`, so a caller sets it with a text class the
 * same way it would tint an icon — that keeps it legible on the dark
 * cinematic backdrop and on a light card without the component knowing which
 * it is sitting on.
 */
export function LumaSpin({
  className,
  label = 'Loading',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('relative aspect-square w-[65px] text-foreground', className)}
    >
      <span className="absolute animate-luma-spin rounded-[50px] shadow-[inset_0_0_0_3px_currentColor]" />
      {/* Half a cycle behind, so the two squares sit on opposite corners. */}
      <span className="absolute animate-luma-spin rounded-[50px] shadow-[inset_0_0_0_3px_currentColor] [animation-delay:-1.25s]" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default LumaSpin;
