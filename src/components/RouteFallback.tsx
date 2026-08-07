import { Loader2 } from 'lucide-react';

/**
 * Shown while a lazily-loaded route chunk downloads.
 *
 * Deliberately plain and provider-free: it renders inside Suspense during a
 * navigation, when the target page's own context may not be mounted yet.
 * Both languages are inlined for the same reason.
 */
export default function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center gap-3" role="status" aria-live="polite">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Loading… / लोड हो रहा है…</span>
    </div>
  );
}
