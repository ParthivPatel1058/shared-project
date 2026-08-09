import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button3D from '@/components/ui/button-3d';
import PixelReactor from '@/components/PixelReactor';
import BhoomixMark from '@/components/BhoomixMark';
import heroImage from '@/assets/auth-hero.jpg';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

/** Mirrors the rule enforced in create-staff-account, so both agree. */
function passwordProblem(pw: string): { en: string; hi: string } | null {
  if (pw.length < 10) return { en: 'At least 10 characters', hi: 'कम से कम 10 अक्षर' };
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw))
    return { en: 'Needs an upper and a lower case letter', hi: 'एक बड़ा और एक छोटा अक्षर चाहिए' };
  if (!/\d/.test(pw)) return { en: 'Needs a number', hi: 'एक अंक चाहिए' };
  return null;
}

type LinkState = 'checking' | 'valid' | 'invalid';

/**
 * Step two of password recovery: set the new password.
 *
 * Arriving from the emailed link puts a short-lived recovery session in place,
 * which supabase-js picks up from the URL fragment. That means this route is
 * reached *while signed in*, so it must sit outside PublicOnlyRoute — guarding
 * it as a public-only page would bounce the user to the dashboard before they
 * could choose a password, and the link is single-use.
 */
export default function ResetPassword() {
  const { tx } = useLanguage();
  const navigate = useNavigate();

  const [state, setState] = useState<LinkState>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let settled = false;

    // Fires once supabase-js has consumed the recovery token from the URL.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        settled = true;
        setState('valid');
      }
    });

    // The event may already have fired before this effect ran.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        settled = true;
        setState('valid');
      }
    });

    // An expired or reused link leaves no session and fires nothing at all,
    // so silence after a moment is the only signal that it failed.
    const timer = window.setTimeout(() => {
      if (!settled) setState('invalid');
    }, 3000);

    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const problem = passwordProblem(password);
    if (problem) {
      toast.error(tx(problem.en, problem.hi));
      return;
    }
    if (password !== confirm) {
      toast.error(tx('Passwords do not match', 'पासवर्ड मेल नहीं खाते'));
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      toast.error(
        /same/i.test(error.message)
          ? tx('That is your current password. Choose a new one.', 'यह आपका मौजूदा पासवर्ड है। नया चुनें।')
          : error.message,
      );
      return;
    }

    toast.success(tx('Password updated. You are signed in.', 'पासवर्ड बदल गया। आप साइन इन हैं।'));
    navigate('/', { replace: true });
  };

  const problem = password ? passwordProblem(password) : null;
  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl md:grid-cols-2">
        <div className="relative hidden md:block">
          <PixelReactor
            src={heroImage}
            alt="Lush green hills"
            cell={4}
            levels={14}
            ripples={0}
            centerMark={<BhoomixMark />}
            className="h-full w-full"
          />
        </div>

        <div className="p-7 sm:p-10">
          {state === 'checking' && (
            <div className="flex min-h-[18rem] flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">{tx('Checking your link…', 'आपका लिंक जाँचा जा रहा है…')}</p>
            </div>
          )}

          {state === 'invalid' && (
            <div className="min-h-[18rem]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                <ShieldAlert className="h-7 w-7 text-amber-500" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {tx('This link has expired', 'यह लिंक समाप्त हो गया')}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {tx(
                  'Reset links last one hour and work only once. Ask for a fresh one.',
                  'रीसेट लिंक एक घंटे चलता है और एक ही बार काम करता है। नया लिंक मंगाएं।',
                )}
              </p>
              <Link
                to="/auth/forgot-password"
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground"
              >
                {tx('Send a new link', 'नया लिंक भेजें')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {state === 'valid' && (
            <>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <div className="mb-7">
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {tx('Choose a new password', 'नया पासवर्ड चुनें')}
                </h1>
                <p className="mt-1.5 text-muted-foreground">
                  {tx('You will be signed in straight after.', 'इसके तुरंत बाद आप साइन इन हो जाएंगे।')}
                </p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">{tx('New password', 'नया पासवर्ड')}</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={show ? 'text' : 'password'}
                      autoComplete="new-password"
                      autoFocus
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-11 pr-11"
                      required
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? tx('Hide password', 'पासवर्ड छिपाएं') : tx('Show password', 'पासवर्ड दिखाएं')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className={`text-xs ${problem ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                    {problem
                      ? tx(problem.en, problem.hi)
                      : password
                        ? tx('Strong enough', 'पर्याप्त मजबूत')
                        : tx('At least 10 characters, with upper, lower and a number', 'कम से कम 10 अक्षर, बड़े-छोटे अक्षर और एक अंक')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">{tx('Confirm password', 'पासवर्ड दोबारा')}</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirm"
                      type={show ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="h-12 pl-11"
                      required
                      disabled={saving}
                    />
                  </div>
                  {mismatch && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      {tx('Passwords do not match', 'पासवर्ड मेल नहीं खाते')}
                    </p>
                  )}
                </div>

                <Button3D
                  type="submit"
                  tone="emerald"
                  disabled={saving || !!problem || mismatch || !confirm}
                  className="!mt-7"
                >
                  {saving ? tx('Saving…', 'सहेजा जा रहा है…') : tx('Update password', 'पासवर्ड बदलें')}
                  {!saving && <ArrowRight className="h-4 w-4" />}
                </Button3D>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
