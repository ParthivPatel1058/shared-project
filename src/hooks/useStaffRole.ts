import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type StaffRole = 'admin' | 'manager' | 'partner' | 'user';

/** Which roles each role is allowed to create. Mirrors the edge function. */
const MAY_CREATE: Record<StaffRole, StaffRole[]> = {
  admin: ['manager', 'partner'],
  manager: ['partner'],
  partner: [],
  user: [],
};

/**
 * The signed-in user's highest-privilege role.
 *
 * This drives what the UI offers, not what the server permits — every
 * privileged action is re-checked in `create-staff-account` against the same
 * table. Treat the value here as a hint for rendering, never as a guarantee.
 */
export function useStaffRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<StaffRole>('user');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setRole('user');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.rpc('my_role');
    setRole(!error && data ? (data as StaffRole) : 'user');
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    refresh();
  }, [authLoading, refresh]);

  const canCreate = MAY_CREATE[role] ?? [];

  return {
    role,
    loading: loading || authLoading,
    canCreate,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    /** True when this account may open the staff screen at all. */
    isStaff: role === 'admin' || role === 'manager',
    refresh,
  };
}
