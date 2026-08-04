import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/auth-hero.jpg';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PixelReactor from '@/components/PixelReactor';

export default function Welcome() {
  const navigate = useNavigate();
  const { language, setLanguage, tx } = useLanguage();

  const points = [
    tx('Free crop disease scanning', 'मुफ़्त फसल रोग जांच'),
    tx('Available in 23 Indian languages', '23 भारतीय भाषाओं में उपलब्ध'),
    tx('No credit card required', 'क्रेडिट कार्ड की ज़रूरत नहीं'),
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 sm:p-6">
      <div className="absolute right-6 top-6 z-10">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Globe className="h-4 w-4 text-primary" />
          {tx('हिंदी', 'English')}
        </button>
      </div>

      {/* Split card: mosaic on the left, sign-in on the right. */}
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl md:grid-cols-2">
        <PixelReactor
          src={heroImage}
          alt={tx('Wheat field at golden hour', 'सुनहरी शाम में गेहूं का खेत')}
          cell={9}
          levels={9}
          className="h-56 w-full md:h-full"
        />

        <div className="flex flex-col justify-center gap-7 p-8 sm:p-12">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {tx('Sign in to continue', 'जारी रखने के लिए साइन इन करें')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {tx('Your farming companion', 'आपका खेती साथी')}
            </p>
          </div>

          <ul className="space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-foreground">
                <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/auth/signup')}
              size="lg"
              className="h-12 w-full text-base font-semibold"
            >
              {tx('Get Started', 'शुरू करें')}
            </Button>

            <button
              onClick={() => navigate('/auth/login')}
              className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {tx('Already have an account? Sign in', 'पहले से खाता है? साइन इन करें')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
