import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import bhoomixLogo from '@/assets/bhoomix-logo-main.jpg';
import { Leaf, ShoppingCart, Bot, TrendingUp, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import GlassOrb from '@/components/GlassOrb';

export default function Welcome() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6 py-12 animate-fade-in">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-card/80 border border-border transition-all duration-300 hover:scale-105"
        >
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{language === 'en' ? 'हिंदी' : 'English'}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        {/* Refractive glass orb hero */}
        <div className="flex justify-center mb-6 animate-float">
          <GlassOrb size={240} />
        </div>

        <div className="relative w-64 h-20 mb-10 animate-float" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-primary/30 rounded-xl blur-2xl" />
          <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur-md animate-pulse opacity-70" />
          <div className="absolute -inset-[2px] bg-gradient-to-r from-primary via-secondary to-primary rounded-xl" />
          <div className="relative bg-card/95 backdrop-blur-sm rounded-xl shadow-2xl flex items-center justify-center overflow-hidden h-full">
            <img src={bhoomixLogo} alt="BhoomiX Logo" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="text-center mb-8 mt-4">
          <h1 className="font-display text-4xl font-extrabold text-gradient mb-2">BhoomiX</h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Your farming companion' : 'आपका खेती साथी'}
          </p>
        </div>

        {/* Animated Features */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl glass hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="p-3 rounded-full bg-primary/10 hover:scale-110 transition-transform duration-300">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-medium text-center">
              {language === 'en' ? 'Organic Farming' : 'जैविक खेती'}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl glass hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="p-3 rounded-full bg-primary/10 hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-medium text-center">
              {language === 'en' ? 'Kisan Mart' : 'किसान मार्ट'}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl glass hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="p-3 rounded-full bg-primary/10 hover:scale-110 transition-transform duration-300">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-medium text-center">
              {language === 'en' ? 'AI Assistant' : 'AI सहायक'}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl glass hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="p-3 rounded-full bg-primary/10 hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-medium text-center">
              {language === 'en' ? 'Market Prices' : 'बाजार मूल्य'}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <Button 
          onClick={() => navigate('/auth/signup')}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          {language === 'en' ? 'Get Started' : 'शुरू करें'}
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          {language === 'en' ? 'Already have an account?' : 'पहले से खाता है?'}{' '}
          <button
            onClick={() => navigate('/auth/login')}
            className="text-primary font-semibold hover:underline"
          >
            {language === 'en' ? 'Sign In' : 'साइन इन करें'}
          </button>
        </p>
      </div>
    </div>
  );
}
