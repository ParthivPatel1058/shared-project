import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Guard for the auth screens (welcome / login / signup). A user who already
 * has a session should never be shown a login form — send them on to the app
 * instead, honouring `?next=` when it points somewhere in-app.
 */
export default function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (loading || !user) return;
    const raw = params.get('next') ?? '';
    const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
    navigate(next, { replace: true });
  }, [user, loading, navigate, params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return user ? null : <>{children}</>;
}
