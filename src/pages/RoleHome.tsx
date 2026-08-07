import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAccount } from '@/hooks/useAccount';
import { useLanguage } from '@/contexts/LanguageContext';
import Index from '@/pages/Index';

/**
 * Decides what "home" means for whoever just signed in.
 *
 * A delivery partner opening the app wants today's runs, not a seed
 * catalogue; a manager wants their roster. Only growers get the farm home.
 * Everyone keeps full navigation afterwards — this chooses the first screen,
 * it does not restrict anything.
 */
export default function RoleHome() {
  const { isPartner, isStaff, loading } = useAccount();
  const { tx } = useLanguage();

  // Rendering the farmer home first and then redirecting would flash the
  // wrong screen at exactly the moment the app is being judged.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-muted-foreground">{tx('Loading…', 'लोड हो रहा है…')}</span>
      </div>
    );
  }

  if (isPartner) return <Navigate to="/partner-orders" replace />;
  if (isStaff) return <Navigate to="/staff-accounts" replace />;
  return <Index />;
}
