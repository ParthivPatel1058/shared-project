import { useCallback, useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAccount, type StaffRole } from '@/hooks/useAccount';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  ShieldCheck,
  UserPlus,
  Loader2,
  Truck,
  Users,
  Copy,
  Lock,
  RefreshCw,
} from 'lucide-react';

interface RosterRow {
  user_id: string;
  role: string;
  full_name: string;
  phone: string | null;
  region: string | null;
  employee_code: string | null;
  is_active: boolean;
  created_at: string;
}

/** Staff hand these over in person, so they must be readable aloud. */
function suggestPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const all = upper + lower + digits;
  const pick = (set: string) => set[Math.floor(Math.random() * set.length)];
  // Guarantee the classes the function requires, then fill to length.
  const chars = [pick(upper), pick(lower), pick(digits)];
  while (chars.length < 12) chars.push(pick(all));
  return chars.sort(() => Math.random() - 0.5).join('');
}

const BLANK = {
  role: 'partner' as StaffRole,
  email: '',
  password: '',
  fullName: '',
  phone: '',
  region: '',
  employeeCode: '',
  vehicleType: '',
};

/**
 * Account creation for staff.
 *
 * An admin can create managers and delivery partners; a manager can create
 * delivery partners only. The form hides what the role may not do, but the
 * rule that matters is enforced in the edge function — this screen cannot
 * grant anything by itself.
 */
export default function StaffAccounts() {
  const { tx } = useLanguage();
  const { role, loading, canCreate, isAdmin } = useAccount();

  const [form, setForm] = useState({ ...BLANK });
  const [submitting, setSubmitting] = useState(false);
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(true);

  const set = <K extends keyof typeof BLANK>(k: K, v: (typeof BLANK)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const loadRoster = useCallback(async () => {
    setLoadingRoster(true);
    const { data, error } = await supabase
      .from('staff_roster')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setRoster((data as RosterRow[]) ?? []);
    setLoadingRoster(false);
  }, []);

  useEffect(() => {
    if (!loading && canCreate.length > 0) loadRoster();
  }, [loading, canCreate.length, loadRoster]);

  // Default the role selector to whatever this account may actually create.
  useEffect(() => {
    if (canCreate.length && !canCreate.includes(form.role)) {
      setForm((f) => ({ ...f, role: canCreate[0] }));
    }
  }, [canCreate, form.role]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-staff-account', {
        body: {
          role: form.role,
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          phone: form.phone || null,
          region: form.region || null,
          employeeCode: form.employeeCode || null,
          vehicleType: form.vehicleType || null,
        },
      });

      // Non-2xx arrives as an error; the readable reason is in the body.
      const message = (data as { error?: string })?.error ?? error?.message;
      if (error || !(data as { ok?: boolean })?.ok) {
        toast.error(message ?? tx('Could not create the account', 'खाता नहीं बना'));
        return;
      }

      toast.success(
        tx('Account created for {n}', '{n} के लिए खाता बना').replace('{n}', form.fullName),
      );
      setForm({ ...BLANK, role: form.role });
      loadRoster();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center gap-3 p-20">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-muted-foreground">{tx('Checking access…', 'पहुँच जाँची जा रही है…')}</span>
        </div>
      </div>
    );
  }

  if (canCreate.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="px-4 pt-5 lg:px-6">
          <BackButton />
        </div>
        <div className="container mx-auto max-w-2xl px-4 pb-16 pt-10">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Lock className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              {tx('Staff access only', 'केवल स्टाफ के लिए')}
            </h1>
            <p className="text-muted-foreground">
              {tx(
                'This screen is for administrators and managers. Ask an administrator if you need access.',
                'यह स्क्रीन प्रशासक और प्रबंधक के लिए है। पहुँच चाहिए तो प्रशासक से कहें।',
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="px-4 pt-5 lg:px-6">
        <BackButton />
      </div>

      <div className="container mx-auto max-w-5xl px-4 pb-16 pt-8">
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="font-serif-display text-4xl text-foreground md:text-5xl">
              {tx('Staff Accounts', 'स्टाफ खाते')}
            </h1>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            {isAdmin
              ? tx(
                  'Create manager and delivery partner accounts. Managers can go on to create partners of their own.',
                  'प्रबंधक और डिलीवरी पार्टनर खाते बनाएं। प्रबंधक आगे अपने पार्टनर बना सकते हैं।',
                )
              : tx(
                  'Create delivery partner accounts for your region.',
                  'अपने क्षेत्र के लिए डिलीवरी पार्टनर खाते बनाएं।',
                )}
          </p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {tx('Signed in as', 'साइन इन')}: {role}
          </p>
        </header>

        {/* Create */}
        <form onSubmit={submit} className="mb-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-foreground">
            <UserPlus className="h-5 w-5 text-primary" />
            {tx('Create an account', 'नया खाता बनाएं')}
          </h2>

          {/* Only roles this account may create are offered. */}
          <div className="mb-5 flex flex-wrap gap-2">
            {canCreate.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => set('role', r)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  form.role === r
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {r === 'manager' ? <Users className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                {r === 'manager' ? tx('Manager', 'प्रबंधक') : tx('Delivery Partner', 'डिलीवरी पार्टनर')}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">{tx('Full name', 'पूरा नाम')}</Label>
              <Input
                id="fullName"
                required
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                placeholder={tx('e.g. Ramesh Patel', 'जैसे रमेश पटेल')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{tx('Email', 'ईमेल')}</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="off"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">{tx('Temporary password', 'अस्थायी पासवर्ड')}</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder={tx('At least 10 characters', 'कम से कम 10 अक्षर')}
                />
                <Button type="button" variant="outline" onClick={() => set('password', suggestPassword())}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {tx('Generate', 'बनाएं')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!form.password}
                  onClick={() => {
                    navigator.clipboard.writeText(form.password);
                    toast.success(tx('Password copied', 'पासवर्ड कॉपी हुआ'));
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {tx(
                  'Give this to the person directly and ask them to change it after signing in.',
                  'यह व्यक्ति को सीधे दें और साइन इन के बाद बदलने को कहें।',
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{tx('Phone', 'फ़ोन')}</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">{tx('Region / district', 'क्षेत्र / ज़िला')}</Label>
              <Input
                id="region"
                value={form.region}
                onChange={(e) => set('region', e.target.value)}
                placeholder={tx('e.g. Indore', 'जैसे इंदौर')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeCode">{tx('Employee code', 'कर्मचारी कोड')}</Label>
              <Input
                id="employeeCode"
                value={form.employeeCode}
                onChange={(e) => set('employeeCode', e.target.value)}
                placeholder={tx('optional', 'वैकल्पिक')}
              />
            </div>
            {form.role === 'partner' && (
              <div className="space-y-2">
                <Label htmlFor="vehicleType">{tx('Vehicle', 'वाहन')}</Label>
                <Input
                  id="vehicleType"
                  value={form.vehicleType}
                  onChange={(e) => set('vehicleType', e.target.value)}
                  placeholder={tx('e.g. Bike, Tempo', 'जैसे बाइक, टेम्पो')}
                />
              </div>
            )}
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="mt-6 w-full sm:w-auto">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tx('Creating…', 'बन रहा है…')}
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                {tx('Create account', 'खाता बनाएं')}
              </>
            )}
          </Button>
        </form>

        {/* Roster */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <Users className="h-5 w-5 text-primary" />
            {isAdmin
              ? tx('All staff', 'सभी स्टाफ')
              : tx('Partners you created', 'आपके बनाए पार्टनर')}
            {roster.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">({roster.length})</span>
            )}
          </h2>

          {loadingRoster ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-8">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">{tx('Loading…', 'लोड हो रहा है…')}</span>
            </div>
          ) : roster.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              {tx('No staff accounts yet.', 'अभी कोई स्टाफ खाता नहीं।')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[38rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="p-3 font-semibold">{tx('Name', 'नाम')}</th>
                    <th className="p-3 font-semibold">{tx('Role', 'भूमिका')}</th>
                    <th className="p-3 font-semibold">{tx('Region', 'क्षेत्र')}</th>
                    <th className="p-3 font-semibold">{tx('Phone', 'फ़ोन')}</th>
                    <th className="p-3 font-semibold">{tx('Status', 'स्थिति')}</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((r) => (
                    <tr key={r.user_id} className="border-b border-border last:border-0">
                      <td className="p-3 font-medium text-foreground">
                        {r.full_name}
                        {r.employee_code && (
                          <span className="ml-2 text-xs text-muted-foreground">{r.employee_code}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                          {r.role === 'manager' ? <Users className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                          {r.role}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{r.region || '—'}</td>
                      <td className="p-3 text-muted-foreground">{r.phone || '—'}</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            r.is_active
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {r.is_active ? tx('Active', 'सक्रिय') : tx('Inactive', 'निष्क्रिय')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
