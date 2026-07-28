import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  /** Where to go when there is no history to pop back to. */
  fallback?: string;
  className?: string;
}

/**
 * Top-left back control. Steps back through history when there is somewhere
 * to return to, otherwise routes to `fallback` so a deep link or refresh
 * doesn't leave the user stranded. Hidden on the home page.
 */
export default function BackButton({ fallback = '/', className }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const en = language === 'en';

  if (location.pathname === fallback) return null;

  const goBack = () => {
    // idx > 0 means this entry was pushed by the app, so popping stays in-app.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback);
  };

  return (
    <button
      onClick={goBack}
      aria-label={en ? 'Go back' : 'वापस जाएं'}
      className={cn(
        'btn-metal group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold',
        className,
      )}
    >
      <ArrowLeft
        strokeWidth={2}
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
      />
      {en ? 'Back' : 'वापस'}
    </button>
  );
}
