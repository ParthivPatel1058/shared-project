import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Button3D from '@/components/ui/button-3d';
import PixelReactor from '@/components/PixelReactor';
import heroImage from '@/assets/auth-hero.jpg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock, ArrowRight, Phone, KeyRound } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255),
  password: z.string().min(1, 'Password is required').max(100),
});

/** Indian mobile numbers, with or without the +91 the user may type. */
const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?91)?[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');

type Method = 'email' | 'phone';

export default function Login() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get('next') ?? '';
  const nextPath = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Many farmers have a mobile number but no email address, so phone sign-in
  // is offered as an equal option rather than hidden behind "more ways".
  // Honour ?method=phone so "sign in with mobile instead" lands ready to go.
  const [method, setMethod] = useState<Method>(
    searchParams.get('method') === 'phone' ? 'phone' : 'email',
  );
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const e164 = (raw: string) => '+91' + raw.replace(/\D/g, '').slice(-10);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      phoneSchema.parse(phone);
    } catch {
      toast.error(tx('Enter a valid 10-digit mobile number', 'सही 10 अंकों का मोबाइल नंबर डालें'));
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: e164(phone) });
    setLoading(false);

    if (error) {
      // Phone auth needs an SMS provider configured on the Supabase project.
      // Say so plainly instead of showing a raw provider error.
      const notConfigured = /provider|not enabled|unsupported|sms/i.test(error.message);
      toast.error(
        notConfigured
          ? tx('Phone sign-in is not enabled yet. Use email for now.', 'फ़ोन साइन-इन अभी चालू नहीं है। अभी ईमेल इस्तेमाल करें।')
          : error.message,
      );
      return;
    }
    setOtpSent(true);
    toast.success(tx('Code sent to your phone', 'आपके फ़ोन पर कोड भेजा गया'));
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: e164(phone),
      token: otp.trim(),
      type: 'sms',
    });
    setLoading(false);

    if (error) {
      toast.error(tx('That code is not right. Try again.', 'यह कोड सही नहीं है। दोबारा कोशिश करें।'));
      return;
    }
    toast.success(tx('Welcome back!', 'वापसी पर स्वागत है!'));
    if (nextPath === '/') navigate('/');
    else window.location.href = nextPath;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = loginSchema.parse(formData);
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(tx('Invalid email or password', 'ईमेल या पासवर्ड ग़लत है'));
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(tx('Welcome back!', 'वापसी पर स्वागत है!'));
        if (nextPath === '/') navigate('/');
        else window.location.href = nextPath;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(tx('An error occurred during login', 'साइन इन करते समय समस्या हुई'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${nextPath}` },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl md:grid-cols-2">
        {/* Fine cells and no ripple: the distortion pulled the hillside into
            concentric rings, which read as water rather than grass. Smaller
            cells with more tonal levels keep the blades legible. */}
        <PixelReactor
          src={heroImage}
          alt={tx('Lush green hills', 'हरी-भरी पहाड़ियां')}
          cell={9}
          levels={12}
          ripples={0}
          className="h-40 w-full md:h-full"
        />

        <div className="p-8 sm:p-10">
          <button
            onClick={() => navigate('/auth/welcome')}
            aria-label={tx('Back', 'वापस')}
            className="mb-6 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="mb-7">
            <h1 className="font-display text-3xl font-bold text-foreground">
              {tx('Welcome back', 'वापसी पर स्वागत है')}
            </h1>
            <p className="mt-1.5 text-muted-foreground">
              {tx('Sign in to continue to BhoomiX', 'BhoomiX में जारी रखने के लिए साइन इन करें')}
            </p>
          </div>

          {/* Two equal ways in. */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-1">
            {(['email', 'phone'] as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  method === m
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                {m === 'email' ? tx('Email', 'ईमेल') : tx('Mobile', 'मोबाइल')}
              </button>
            ))}
          </div>

          {method === 'phone' && (
            <form onSubmit={otpSent ? verifyOtp : sendOtp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone">{tx('Mobile number', 'मोबाइल नंबर')}</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-muted-foreground">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 pl-20"
                    required
                    disabled={loading || otpSent}
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp">{tx('Six-digit code', 'छह अंकों का कोड')}</Label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="otp"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-12 pl-11 tracking-[0.4em]"
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="text-sm text-primary hover:underline"
                  >
                    {tx('Change number', 'नंबर बदलें')}
                  </button>
                </div>
              )}

              <Button3D type="submit" tone="emerald" disabled={loading} className="!mt-7">
                {loading
                  ? tx('Please wait…', 'कृपया रुकें…')
                  : otpSent
                    ? tx('Verify and sign in', 'जाँचें और साइन इन करें')
                    : tx('Send code', 'कोड भेजें')}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button3D>
            </form>
          )}

          <form
            onSubmit={handleLogin}
            className={`space-y-5 ${method === 'email' ? '' : 'hidden'}`}
          >
            <div className="space-y-2">
              <Label htmlFor="email">{tx('Email', 'ईमेल')}</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 pl-11"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{tx('Password', 'पासवर्ड')}</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 pl-11"
                  required
                  disabled={loading}
                />
              </div>
              {/* Carry whatever they already typed, so they don't retype it. */}
              <Link
                to={`/auth/forgot-password${formData.email ? `?email=${encodeURIComponent(formData.email)}` : ''}`}
                className="inline-flex min-h-11 items-center text-sm text-primary hover:underline"
              >
                {tx('Forgot password?', 'पासवर्ड भूल गए?')}
              </Link>
            </div>

            <Button3D type="submit" tone="emerald" disabled={loading} className="!mt-7">
              {loading ? tx('Signing in…', 'साइन इन हो रहा है…') : tx('Sign In', 'साइन इन करें')}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button3D>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">{tx('or', 'या')}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="h-12 w-full text-base font-semibold"
            disabled={loading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {tx('Continue with Google', 'Google से जारी रखें')}
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {tx("Don't have an account?", 'खाता नहीं है?')}{' '}
            <button
              onClick={() =>
                navigate('/auth/signup' + (rawNext ? `?next=${encodeURIComponent(rawNext)}` : ''))
              }
              className="font-semibold text-primary hover:underline"
            >
              {tx('Sign up', 'साइन अप करें')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
