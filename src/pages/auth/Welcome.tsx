import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import bhoomixLogo from '@/assets/bhoomix-logo-main.jpg';
import heroImage from '@/assets/green-manure.jpg';
import { Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PixelReactor from '@/components/PixelReactor';

export default function Welcome() {
  const navigate = useNavigate();
  const { language, setLanguage, tx } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-10 animate-fade-in">
      {/* Language Switcher — liquid glass pill */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="glass flex items-center gap-2 px-4 py-2 !rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{tx('हिंदी', 'English')}</span>
        </button>
      </div>

      {/* Liquid glass panel wrapping the whole hero */}
      <div className="glass-strong border-glow relative w-full max-w-md px-6 sm:px-10 py-10 flex flex-col items-center">
        {/* Pointer-reactive pixel mosaic — move the cursor across it */}
        <div className="mb-8 flex justify-center">
          <PixelReactor
            src={heroImage}
            alt={tx('BhoomiX', 'BhoomiX')}
            className="h-[432px] w-80 rounded-2xl border border-border/50 shadow-2xl"
          />
        </div>

        {/* Logo plate with animated gradient ring */}
        <div className="relative w-56 h-[4.25rem] mb-8 animate-float" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-primary/30 rounded-xl blur-2xl" />
          <div className="absolute -inset-2 bg-gradient-to-r from-primary via-accent to-primary rounded-xl blur-md animate-pulse opacity-60" />
          <div className="absolute -inset-[2px] bg-gradient-to-r from-primary via-accent to-primary rounded-xl" />
          <div className="relative bg-card/95 backdrop-blur-sm rounded-xl shadow-2xl flex items-center justify-center overflow-hidden h-full shine">
            <img src={bhoomixLogo} alt="BhoomiX Logo" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-extrabold text-gradient mb-2">BhoomiX</h1>
          <p className="text-muted-foreground">
            {tx('Your farming companion', 'आपका खेती साथी')}
          </p>
        </div>

        {/* CTA */}
        <div className="w-full space-y-4">
          <Button
            onClick={() => navigate('/auth/signup')}
            className="group w-full h-12 text-base font-semibold glow-primary shine"
            size="lg"
          >
            {tx('Get Started', 'शुरू करें')}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {tx('Already have an account?', 'पहले से खाता है?')}{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-primary font-semibold hover:underline"
            >
              {tx('Sign In', 'साइन इन करें')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
