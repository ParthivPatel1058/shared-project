import { ShoppingBag, HelpCircle, Store, Landmark, Bot, Leaf, Truck, Carrot, ScanSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import WeatherWidget from '@/components/WeatherWidget';
import SectionCard from '@/components/SectionCard';

const Index = () => {
  const { t, language } = useLanguage();
  const en = language === 'en';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-8 md:pt-12 pb-16">
        {/* Hero */}
        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center mb-16">
          <div className="animate-slide-up">
            <span className="glass inline-flex items-center gap-2 px-4 py-1.5 mb-6 !rounded-full text-primary text-sm font-medium">
              🌱 {en ? 'Tools & advisory for every farming decision' : 'हर कृषि निर्णय के लिए उपकरण और सलाह'}
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5 leading-[1.05]">
              {en ? (
                <>Grow smarter<br />with <span className="text-gradient">BhoomiX</span></>
              ) : (
                <><span className="text-gradient">BhoomiX</span> के साथ<br />स्मार्ट खेती करें</>
              )}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              {t('tagline')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link
                to="/crop-disease"
                className="group inline-flex items-center gap-2 h-12 px-6 rounded-full gradient-primary text-white text-sm font-semibold glow-primary shine hover:scale-[1.03] active:scale-95 transition-transform duration-300"
              >
                <ScanSearch strokeWidth={1.75} className="h-4 w-4" />
                {en ? 'Scan Crop Disease' : 'फसल रोग स्कैन करें'}
              </Link>
              <Link
                to="/agri-market"
                className="glass inline-flex items-center gap-2 h-12 px-6 !rounded-full text-sm font-semibold text-foreground hover:bg-white/[0.14] hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                <ShoppingBag strokeWidth={1.75} className="h-4 w-4" />
                {en ? 'Explore Market' : 'बाज़ार देखें'}
              </Link>
            </div>

            {/* Trusted by */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['RS', 'AK', 'MP'].map((ini, i) => (
                  <div
                    key={ini}
                    className={`h-9 w-9 rounded-full border-2 border-background/40 flex items-center justify-center text-[10px] font-bold text-white ${
                      ['gradient-primary', 'gradient-secondary', 'gradient-accent'][i]
                    }`}
                  >
                    {ini}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-tight">
                {en ? (
                  <>Trusted by <span className="text-foreground font-semibold">25K+</span><br />farmers across India</>
                ) : (
                  <>भारत भर के <span className="text-foreground font-semibold">25K+</span><br />किसानों का भरोसा</>
                )}
              </p>
            </div>

            {/* Mobile search (desktop search lives in the top bar) */}
            <div className="mt-8 md:hidden">
              <SearchBar />
            </div>
          </div>

          {/* Floating weather card */}
          <div className="animate-scale-in max-w-md w-full mx-auto lg:mx-0 animate-float" style={{ animationDuration: '6s' }}>
            <WeatherWidget />
          </div>
        </section>

        {/* Feature grid */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {en ? 'Explore BhoomiX' : 'BhoomiX एक्सप्लोर करें'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {en ? 'Everything you need — from seed to sale' : 'बीज से बिक्री तक — सब कुछ यहाँ'}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
            <SectionCard
              title={en ? 'Crop Disease Detection' : 'फसल रोग पहचान'}
              description={en ? 'Scan crop photos to identify diseases, browse the disease library, and get treatment advice' : 'फसल की फोटो स्कैन करके रोग पहचानें और उपचार की सलाह पाएं'}
              icon={ScanSearch}
              href="/crop-disease"
              buttonText={en ? 'Scan Now' : 'स्कैन करें'}
              gradient="primary"
              badge={en ? 'New' : 'नया'}
            />
            <SectionCard title={t('agriMarketTitle')} description={t('agriMarketDesc')} icon={ShoppingBag} href="/agri-market" buttonText={t('shopNow')} gradient="secondary" />
            <SectionCard title={t('kisanMartTitle')} description={t('kisanMartDesc')} icon={Store} href="/kisan-mart" buttonText={t('orderNow')} gradient="primary" />
            <SectionCard title={t('kisanHelpTitle')} description={t('kisanHelpDesc')} icon={HelpCircle} href="/kisan-help" buttonText={t('getHelp')} gradient="secondary" />
            <SectionCard
              title={en ? 'Government Schemes' : 'सरकारी योजनाएं'}
              description={en ? 'Explore latest government benefits and schemes for farmers' : 'किसानों के लिए नवीनतम सरकारी लाभ और योजनाओं का अन्वेषण करें'}
              icon={Landmark}
              href="/gov-schemes"
              buttonText={en ? 'View Schemes' : 'योजनाएं देखें'}
              gradient="primary"
            />
            <SectionCard
              title={en ? 'Robotic Farming' : 'रोबोटिक कृषि'}
              description={en ? 'Discover modern farming robots and automation technology' : 'आधुनिक कृषि रोबोट और स्वचालन प्रौद्योगिकी की खोज करें'}
              icon={Bot}
              href="/robotic-farming"
              buttonText={en ? 'Explore Tech' : 'तकनीक जानें'}
              gradient="secondary"
            />
            <SectionCard
              title={en ? 'Organic Farming' : 'जैविक खेती'}
              description={en ? 'Complete guide to organic farming with certified seeds and natural fertilizers' : 'प्रमाणित बीजों और प्राकृतिक उर्वरकों के साथ जैविक खेती की संपूर्ण मार्गदर्शिका'}
              icon={Leaf}
              href="/organic-farming"
              buttonText={en ? 'Explore Organic' : 'जैविक खेती देखें'}
              gradient="primary"
            />
            <SectionCard
              title={en ? 'Vegetable Farming' : 'सब्जी की खेती'}
              description={en ? 'Comprehensive guide to all vegetables, farming methods, and tools' : 'सभी सब्जियों, खेती के तरीकों और उपकरणों की व्यापक मार्गदर्शिका'}
              icon={Carrot}
              href="/vegetable-farming"
              buttonText={en ? 'View Guide' : 'मार्गदर्शिका देखें'}
              gradient="secondary"
            />
            <SectionCard
              title={en ? 'Delivery Partner' : 'डिलीवरी पार्टनर'}
              description={en ? 'Join as a delivery partner and start earning with flexible hours' : 'डिलीवरी पार्टनर के रूप में शामिल हों और लचीले घंटों में कमाई शुरू करें'}
              icon={Truck}
              href="/partner-registration"
              buttonText={en ? 'Join Now' : 'अभी जुड़ें'}
              gradient="primary"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
