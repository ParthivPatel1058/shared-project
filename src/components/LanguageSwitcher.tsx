import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="glass border-primary/20 hover:border-primary/40 transition-all"
    >
      <Languages className="mr-2 h-4 w-4" />
      {language === 'en' ? 'हिं' : 'EN'}
    </Button>
  );
};

export default LanguageSwitcher;
