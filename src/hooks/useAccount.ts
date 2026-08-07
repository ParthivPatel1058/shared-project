import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type StaffRole = 'admin' | 'manager' | 'partner' | 'user';
export type AccountType = 'farmer' | 'buyer' | 'partner' | 'manager' | 'admin';
export type FarmType = 'rural' | 'peri_urban' | 'urban';

/** Which roles each role may create. Mirrors the edge function exactly. */
const MAY_CREATE: Record<StaffRole, StaffRole[]> = {
  admin: ['manager', 'partner'],
  manager: ['partner'],
  partner: [],
  user: [],
};

interface Account {
  role: StaffRole;
  accountType: AccountType;
  /** Null until the farmer has created a farm profile. */
  farmType: FarmType | null;
  fullName: string | null;
  onboarded: boolean;
}

const GUEST: Account = {
  role: 'user',
  accountType: 'farmer',
  farmType: null,
  fullName: null,
  onboarded: false,
};

/**
 * Everything the app needs to decide what to show this person: their
 * privilege level, what kind of account they hold, and — for farmers —
 * whether they grow in a village or on a city terrace.
 *
 * These values shape the UI only. Every privileged action is re-checked
 * server-side by row level security or the edge function, so a tampered
 * value here reveals nothing and grants nothing.
 */
export function useAccount() {
  const { user, loading: authLoading } = useAuth();
  const [account, setAccount] = useState<Account>(GUEST);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setAccount(GUEST);
      setLoading(false);
      return;
    }

    // One round trip each, in parallel. All three are optional: the schema
    // may not be migrated yet, and a new user has no farm profile.
    const [roleRes, profileRes, farmRes] = await Promise.all([
      supabase.rpc('my_role'),
      supabase.from('profiles').select('account_type, full_name, onboarded_at').eq('id', user.id).maybeSingle(),
      supabase.from('farm_profiles').select('farm_type').eq('user_id', user.id).maybeSingle(),
    ]);

    const role = (!roleRes.error && roleRes.data ? roleRes.data : 'user') as StaffRole;
    const profile = profileRes.data as
      | { account_type?: AccountType; full_name?: string; onboarded_at?: string | null }
      | null;

    // A staff role outranks whatever the profile says, so a partner cannot be
    // shown the farmer home just because their profile row lagged behind.
    const accountType: AccountType =
      role === 'admin' || role === 'manager' || role === 'partner'
        ? role
        : profile?.account_type ?? 'farmer';

    setAccount({
      role,
      accountType,
      farmType: (farmRes.data as { farm_type?: FarmType } | null)?.farm_type ?? null,
      fullName: profile?.full_name ?? (user.user_metadata?.full_name as string) ?? null,
      onboarded: Boolean(profile?.onboarded_at),
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    refresh();
  }, [authLoading, refresh]);

  const { role, accountType, farmType } = account;

  return {
    ...account,
    loading: loading || authLoading,
    canCreate: MAY_CREATE[role] ?? [],
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isPartner: role === 'partner',
    isStaff: role === 'admin' || role === 'manager',
    /** Anyone whose home is an operations screen rather than the farm home. */
    isOps: role === 'admin' || role === 'manager' || role === 'partner',
    isUrban: farmType === 'urban' || farmType === 'peri_urban',
    accountType,
    refresh,
  };
}
