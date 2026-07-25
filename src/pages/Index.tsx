import { useState } from 'react';
import { ShoppingBag, HelpCircle, Store, Landmark, Bot, Leaf, Truck, Carrot, ScanSearch, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import SectionCard from '@/components/SectionCard';
import BlurText from '@/components/BlurText';
import heroScene from '@/assets/scene-bg.png';
import imgDisease from '@/assets/cabbage.jpg';
import imgMarket from '@/assets/organic-sprayer.jpg';
import imgMart from '@/assets/milk.jpg';
import imgAdvisory from '@/assets/spinach.jpg';
import imgSchemes from '@/assets/india-gate-rice.jpg';
import imgRobotic from '@/assets/mulch-spreader.jpg';
import imgOrganic from '@/assets/vermicompost.jpg';
import imgVegetable from '@/assets/carrots.jpg';
import imgDelivery from '@/assets/potatoes.jpg';

interface Feature {
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  icon: typeof ScanSearch;
  emoji: string;
  img: string;
  href: string;
  cta: string;
  ctaHi: string;
  gradient: 'primary' | 'secondary';
  badge?: string;
  badgeHi?: string;
}

const FEATURES: Feature[] = [
  { title: 'Crop Disease Detection', titleHi: 'फसल रोग पहचान', description: 'Scan crop photos to identify diseases, browse the disease library, and get treatment advice', descriptionHi: 'फसल की फोटो स्कैन करके रोग पहचानें और उपचार की सलाह पाएं', icon: ScanSearch, emoji: '🔬', img: imgDisease, href: '/crop-disease', cta: 'Scan Now', ctaHi: 'स्कैन करें', gradient: 'primary', badge: 'New', badgeHi: 'नया' },
  { title: 'Agri Market', titleHi: 'कृषि बाज़ार', description: 'Seeds, fertilizers, tools, and crop protection', descriptionHi: 'बीज, उर्वरक, उपकरण और फसल सुरक्षा', icon: ShoppingBag, emoji: '🛒', img: imgMarket, href: '/agri-market', cta: 'Browse Products', ctaHi: 'उत्पाद देखें', gradient: 'secondary' },
  { title: 'Kisan Mart', titleHi: 'किसान मार्ट', description: 'Everyday groceries and farm household supplies', descriptionHi: 'रोज़मर्रा का किराना और घरेलू सामान', icon: Store, emoji: '🏪', img: imgMart, href: '/kisan-mart', cta: 'Browse Store', ctaHi: 'स्टोर देखें', gradient: 'primary' },
  { title: 'Crop Advisory', titleHi: 'फसल सलाह', description: 'Ask a question or identify crop disease from a photo', descriptionHi: 'प्रश्न पूछें या फोटो से फसल रोग पहचानें', icon: HelpCircle, emoji: '👨‍🌾', img: imgAdvisory, href: '/kisan-help', cta: 'Get Advice', ctaHi: 'सलाह लें', gradient: 'secondary' },
  { title: 'Government Schemes', titleHi: 'सरकारी योजनाएं', description: 'Explore latest government benefits and schemes for farmers', descriptionHi: 'किसानों के लिए नवीनतम सरकारी लाभ और योजनाओं का अन्वेषण करें', icon: Landmark, emoji: '🏛️', img: imgSchemes, href: '/gov-schemes', cta: 'View Schemes', ctaHi: 'योजनाएं देखें', gradient: 'primary' },
  { title: 'Robotic Farming', titleHi: 'रोबोटिक कृषि', description: 'Discover modern farming robots and automation technology', descriptionHi: 'आधुनिक कृषि रोबोट और स्वचालन प्रौद्योगिकी की खोज करें', icon: Bot, emoji: '🤖', img: imgRobotic, href: '/robotic-farming', cta: 'Explore Tech', ctaHi: 'तकनीक जानें', gradient: 'secondary' },
  { title: 'Organic Farming', titleHi: 'जैविक खेती', description: 'Complete guide to organic farming with certified seeds and natural fertilizers', descriptionHi: 'प्रमाणित बीजों और प्राकृतिक उर्वरकों के साथ जैविक खेती की संपूर्ण मार्गदर्शिका', icon: Leaf, emoji: '🌱', img: imgOrganic, href: '/organic-farming', cta: 'Explore Organic', ctaHi: 'जैविक खेती देखें', gradient: 'primary' },
  { title: 'Vegetable Farming', titleHi: 'सब्जी की खेती', description: 'Comprehensive guide to all vegetables, farming methods, and tools', descriptionHi: 'सभी सब्जियों, खेती के तरीकों और उपकरणों की व्यापक मार्गदर्शिका', icon: Carrot, emoji: '🥕', img: imgVegetable, href: '/vegetable-farming', cta: 'View Guide', ctaHi: 'मार्गदर्शिका देखें', gradient: 'secondary' },
  { title: 'Delivery Partner', titleHi: 'डिलीवरी पार्टनर', description: 'Join as a delivery partner and start earning with flexible hours', descriptionHi: 'डिलीवरी पार्टनर के रूप में शामिल हों और लचीले घंटों में कमाई शुरू करें', icon: Truck, emoji: '🚚', img: imgDelivery, href: '/partner-registration', cta: 'Join Now', ctaHi: 'अभी जुड़ें', gradient: 'primary' },
];

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const en = language === 'en';

  const [slide, setSlide] = useState(0);
  const total = FEATURES.length;
  const current = FEATURES[slide];
  const go = (dir: number) => setSlide((s) => (s + dir + total) % total);

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-4 md:pt-5 pb-16">
        {/* Hero carousel card */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/12 shadow-[0_24px_70px_rgba(8,15,30,0.5)] animate-scale-in">
          {/* Background image */}
          <img
            src={heroScene}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Readability gradients — heavier on the left where text sits */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1424]/90 via-[#0d1726]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/85 via-transparent to-[#0a1120]/25" />

          {/* Content */}
          <div className="relative flex flex-col justify-between min-h-[420px] md:min-h-[480px] p-6 md:p-10">
            <div className="max-w-xl">
              <span className="glass inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 !rounded-full text-primary text-sm font-medium">
                🌱 {en ? 'Tools & advisory for every farming decision' : 'हर कृषि निर्णय के लिए उपकरण और सलाह'}
              </span>
              <BlurText
                as="h1"
                key={en ? 'en' : 'hi'}
                text={en ? 'Grow smarter\nwith BhoomiX' : 'BhoomiX के साथ\nस्मार्ट खेती करें'}
                className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.03]"
              />
              <p className="text-base md:text-lg text-white/75 leading-relaxed mb-6 max-w-md">
                {t('tagline')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link
                  to="/crop-disease"
                  className="group inline-flex items-center gap-2 h-11 px-5 rounded-full gradient-primary text-white text-sm font-semibold glow-primary shine hover:scale-[1.03] active:scale-95 transition-transform duration-300"
                >
                  <ScanSearch strokeWidth={1.75} className="h-4 w-4" />
                  {en ? 'Scan Crop Disease' : 'फसल रोग स्कैन'}
                </Link>
                <Link
                  to="/agri-market"
                  className="glass inline-flex items-center gap-2 h-11 px-5 !rounded-full text-sm font-semibold text-white hover:bg-white/[0.16] hover:scale-[1.03] active:scale-95 transition-all duration-300"
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
                      className={`h-9 w-9 rounded-full border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-white ${['gradient-primary', 'gradient-secondary', 'gradient-accent'][i]}`}
                    >
                      {ini}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/75 leading-tight">
                  {en ? (
                    <>Trusted by <span className="text-white font-semibold">25K+</span><br />farmers across India</>
                  ) : (
                    <>भारत भर के <span className="text-white font-semibold">25K+</span><br />किसानों का भरोसा</>
                  )}
                </p>
              </div>
            </div>

            {/* Bottom row: carousel arrows + current-feature panel */}
            <div className="flex items-end justify-between gap-4 mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous feature"
                  className="glass flex items-center justify-center h-11 w-11 !rounded-full text-white hover:bg-white/[0.18] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <ChevronLeft strokeWidth={2} className="h-5 w-5" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next feature"
                  className="glass flex items-center justify-center h-11 w-11 !rounded-full text-white hover:bg-white/[0.18] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <ChevronRight strokeWidth={2} className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => navigate(current.href)}
                className="glass group flex items-center gap-4 px-3 py-3 !rounded-2xl text-left hover:bg-white/[0.16] transition-all duration-300 min-w-[240px] max-w-sm"
              >
                <span className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-white/20">
                  {FEATURES.map((f, i) => (
                    <img
                      key={f.href + i}
                      src={f.img}
                      alt=""
                      aria-hidden
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                    {en ? current.title : current.titleHi}
                    <ArrowRight strokeWidth={2} className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {en ? 'Everything you need to succeed' : 'सफलता के लिए सब कुछ'}
                  </p>
                </div>
                <span className="text-sm font-semibold text-white/80 tabular-nums flex-shrink-0">
                  {String(slide + 1).padStart(2, '0')} <span className="text-white/40">/ {String(total).padStart(2, '0')}</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Mobile search */}
        <div className="mt-6 md:hidden">
          <SearchBar />
        </div>

        {/* Feature grid */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {en ? 'Explore BhoomiX' : 'BhoomiX एक्सप्लोर करें'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {en ? 'Everything you need — from seed to sale' : 'बीज से बिक्री तक — सब कुछ यहाँ'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
            {FEATURES.map((f) => (
              <SectionCard
                key={f.href + f.title}
                title={en ? f.title : f.titleHi}
                description={en ? f.description : f.descriptionHi}
                icon={f.icon}
                emoji={f.emoji}
                href={f.href}
                buttonText={en ? f.cta : f.ctaHi}
                gradient={f.gradient}
                badge={f.badge ? (en ? f.badge : f.badgeHi) : undefined}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
