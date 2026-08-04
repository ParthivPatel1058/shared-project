import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Button3D from '@/components/ui/button-3d';
import PixelReactor from '@/components/PixelReactor';
import heroImage from '@/assets/auth-hero.jpg';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255),
  password: z.string().min(1, 'Password is required').max(100),
});

export default function Login() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get('next') ?? '';
  const nextPath = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

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
        <PixelReactor
          src={heroImage}
          alt={tx('Wheat field at golden hour', 'सुनहरी शाम में गेहूं का खेत')}
          cell={9}
          levels={9}
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

          <form onSubmit={handleLogin} className="space-y-5">
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
              <button
                type="button"
                onClick={() => toast.info(tx('Password reset coming soon!', 'पासवर्ड रीसेट जल्द आ रहा है!'))}
                className="text-sm text-primary hover:underline"
              >
                {tx('Forgot password?', 'पासवर्ड भूल गए?')}
              </button>
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
