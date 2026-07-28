import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Count of the signed-in user's active (not yet delivered/cancelled) orders.
 * Used for the sidebar badge — returns 0 rather than throwing when signed out
 * or when the query fails, so the badge simply doesn't render.
 */
export function useOrderCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    let active = true;

    (async () => {
      const { count: n, error } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('status', 'in', '("delivered","cancelled")');

      if (active && !error && typeof n === 'number') setCount(n);
    })();

    return () => {
      active = false;
    };
  }, [user]);

  return count;
}
