import { ShoppingBag, HelpCircle, Store, Landmark, Bot, Leaf, Truck } from 'lucide-react';
import React, { Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import WeatherWidget from '@/components/WeatherWidget';
import GlassOrb from '@/components/GlassOrb';
import SectionCard from '@/components/SectionCard';

const FluidGlass = React.lazy(() => import('@/components/FluidGlass'));

class FluidGlassErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('FluidGlass failed to render:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <GlassOrb size={280} />
        </div>
      );
    }
    return this.props.children;
  }
}

const Index = () => {
  const {
    t,
    language
  } = useLanguage();
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          {/* Interactive 3D Fluid Glass Hero */}
          <div className="relative max-w-4xl mx-auto h-[360px] md:h-[420px] rounded-3xl glass border border-primary/20 overflow-hidden mb-8 shadow-2xl">
            <FluidGlassErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }>
                <FluidGlass 
                  mode="lens"
                  lensProps={{
                    scale: 0.22,
                    ior: 1.15,
                    thickness: 4,
                    chromaticAberration: 0.12,
                    anisotropy: 0.01
                  }}
                />
              </Suspense>
            </FluidGlassErrorBoundary>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-gradient mb-4 animate-slide-up">
            BhoomiX
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            {t('tagline')}
          </p>
          
          <div className="flex justify-center mb-8 animate-scale-in">
            <SearchBar />
          </div>
          
          <div className="max-w-md mx-auto animate-slide-up">
            <WeatherWidget />
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8 stagger">
            <SectionCard title={t('agriMarketTitle')} description={t('agriMarketDesc')} icon={ShoppingBag} href="/agri-market" buttonText={t('shopNow')} gradient="primary" />
            <SectionCard title={t('kisanHelpTitle')} description={t('kisanHelpDesc')} icon={HelpCircle} href="/kisan-help" buttonText={t('getHelp')} gradient="secondary" />
            <SectionCard title={t('kisanMartTitle')} description={t('kisanMartDesc')} icon={Store} href="/kisan-mart" buttonText={t('orderNow')} gradient="primary" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8 stagger">
            <SectionCard
              title={language === 'en' ? 'Government Schemes' : 'सरकारी योजनाएं'} 
              description={language === 'en' ? 'Explore latest government benefits and schemes for farmers' : 'किसानों के लिए नवीनतम सरकारी लाभ और योजनाओं का अन्वेषण करें'} 
              icon={Landmark} 
              href="/gov-schemes" 
              buttonText={language === 'en' ? 'View Schemes' : 'योजनाएं देखें'} 
              gradient="secondary" 
            />
            <SectionCard 
              title={language === 'en' ? 'Robotic Farming' : 'रोबोटिक कृषि'} 
              description={language === 'en' ? 'Discover modern farming robots and automation technology' : 'आधुनिक कृषि रोबोट और स्वचालन प्रौद्योगिकी की खोज करें'} 
              icon={Bot} 
              href="/robotic-farming" 
              buttonText={language === 'en' ? 'Explore Tech' : 'तकनीक जानें'} 
              gradient="primary" 
            />
            <SectionCard 
              title={language === 'en' ? 'Delivery Partner' : 'डिलीवरी पार्टनर'} 
              description={language === 'en' ? 'Join as a delivery partner and start earning with flexible hours' : 'डिलीवरी पार्टनर के रूप में शामिल हों और लचीले घंटों में कमाई शुरू करें'} 
              icon={Truck} 
              href="/partner-registration" 
              buttonText={language === 'en' ? 'Join Now' : 'अभी जुड़ें'} 
              gradient="secondary" 
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 stagger">
            <SectionCard 
              title="🌱 Organic Farming"
              description={language === 'en' ? 'Complete guide to organic farming with certified seeds and natural fertilizers' : 'प्रमाणित बीजों और प्राकृतिक उर्वरकों के साथ जैविक खेती की संपूर्ण मार्गदर्शिका'}
              icon={Leaf}
              href="/organic-farming"
              buttonText={language === 'en' ? 'Explore Organic' : 'जैविक खेती देखें'}
              gradient="primary"
            />
            <SectionCard 
              title="🥬 Vegetable Farming"
              description={language === 'en' ? 'Comprehensive guide to all vegetables, farming methods, and tools' : 'सभी सब्जियों, खेती के तरीकों और उपकरणों की व्यापक मार्गदर्शिका'}
              icon={Leaf}
              href="/vegetable-farming"
              buttonText={language === 'en' ? 'View Guide' : 'मार्गदर्शिका देखें'}
              gradient="secondary"
            />
          </div>
        </div>
      </div>
    </div>;
};
export default Index;