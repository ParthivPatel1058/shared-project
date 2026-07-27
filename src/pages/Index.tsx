import { useEffect, useState } from 'react';
import { ShoppingBag, HelpCircle, Store, Landmark, Bot, Leaf, Truck, Carrot, ScanSearch, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import GalleryHoverGrid from '@/components/ui/gallery-hover-carousel';
import GooeyNav from '@/components/GooeyNav';
import Reveal, { RevealWords } from '@/components/Reveal';

/* Curated agriculture photography (Unsplash, verified). */
const W = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;
const imgDisease = W('1416879595882-3373a0480b5b');   // greenhouse, warm light
const imgMarket = W('1523348837708-15d4a09cfac2');    // fresh vegetables
const imgMart = W('1488459716781-31db52582fe9');      // produce market
const imgAdvisory = W('1625246333195-78d9c38ad449');  // Indian farmer
const imgSchemes = W('1500382017468-9049fed747ef');   // wheat field
const imgRobotic = W('1595246140625-573b715d11dc');   // agri drone / tech
const imgOrganic = W('1592982537447-7440770cbfc9');   // hands in soil, warm
const imgVegetable = W('1464226184884-fa280b87c399'); // field at golden hour
const imgDelivery = W('1530267981375-f0de937f5f13');  // logistics / cargo

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

  // Auto-advance the hero carousel; resets whenever the user interacts.
  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % total), 4500);
    return () => window.clearInterval(id);
  }, [slide, total]);

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-4 md:pt-5 pb-16">
        {/* Hero — editorial luxury spread */}
        <section className="editorial-stage relative overflow-hidden mx-4 lg:ml-8 lg:mr-0 rounded-[32px] lg:rounded-r-none animate-editorial">
          <div className="relative flex flex-col min-h-[88vh] lg:min-h-[86vh]">

            {/* Top meta rail */}
            <div className="relative z-20 flex items-center justify-between px-6 lg:px-14 pt-8">
              <span className="eyebrow text-gold">BhoomiX</span>
              <span className="eyebrow opacity-45 hidden sm:block">
                {en ? 'Since 2026 · India' : '2026 से · भारत'}
              </span>
            </div>

            {/* Stage */}
            <div className="relative flex-1 flex items-center">

              {/* Photography, right side, dissolving into the stage */}
              <div className="image-fade-left img-zoom absolute inset-y-0 right-0 w-full lg:w-[62%] overflow-hidden">
                {FEATURES.map((f, i) => (
                  <img
                    key={f.href + i}
                    src={f.img}
                    alt={en ? f.title : f.titleHi}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${i === slide ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
              </div>

              {/* Headline, overlapping the photograph */}
              <div className="relative z-10 w-full px-6 lg:px-14 py-12">
                <Reveal immediate className="flex items-center gap-4 mb-7 max-w-md" delay={0.05} distance={16}>
                  <span className="eyebrow opacity-60">
                    {en ? 'Tools & advisory for every farming decision' : 'हर कृषि निर्णय के लिए उपकरण और सलाह'}
                  </span>
                </Reveal>

                <h1 className="font-serif-display uppercase text-[clamp(3.2rem,12vw,11rem)] mb-3">
                  <RevealWords
                    immediate
                    key={en ? 'en' : 'hi'}
                    text={en ? `Grow\nSmarter` : `स्मार्ट\nखेती`}
                    delay={0.15}
                    stagger={0.14}
                  />
                </h1>

                <Reveal immediate delay={0.5} distance={18} blur><p
                  className="text-gold italic mb-8"
                  style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem,3.2vw,2.6rem)', lineHeight: 1.1 }}
                >
                  {en ? 'with BhoomiX' : 'BhoomiX के साथ'}
                </p></Reveal>

                <Reveal immediate delay={0.62} distance={0}><div className="rule-hairline h-px w-full max-w-xs mb-7" /></Reveal>

                <Reveal immediate delay={0.7}>
                  <p className="text-sm md:text-base leading-relaxed opacity-70 max-w-sm mb-9">
                    {t('tagline')}
                  </p>
                </Reveal>

                <Reveal immediate className="flex flex-wrap items-center gap-3" delay={0.8}>
                  <Link
                    to="/crop-disease"
                    className="btn-sheen group inline-flex items-center gap-2.5 h-12 px-7 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-500 hover:gap-4"
                    style={{ background: 'hsl(var(--espresso))', color: 'hsl(var(--cream))' }}
                  >
                    <ScanSearch strokeWidth={1.5} className="h-4 w-4" />
                    {en ? 'Scan Crop Disease' : 'फसल रोग स्कैन'}
                    <ArrowRight strokeWidth={1.5} className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to="/agri-market"
                    className="btn-sheen group inline-flex items-center gap-2.5 h-12 px-7 rounded-full text-[13px] font-semibold tracking-wide border transition-all duration-500 hover:gap-4"
                    style={{ borderColor: 'hsl(var(--espresso) / 0.25)' }}
                  >
                    <ShoppingBag strokeWidth={1.5} className="h-4 w-4" />
                    {en ? 'Explore Market' : 'बाज़ार देखें'}
                  </Link>
                </Reveal>
              </div>
            </div>

            {/* Bottom rail — current feature + carousel controls */}
            <div className="relative z-20 px-6 lg:px-14 pb-8">
              <div className="rule-hairline h-px w-full mb-5" />
              <div className="flex items-end justify-between gap-6">
                <button onClick={() => navigate(current.href)} className="group text-left min-w-0">
                  <span className="eyebrow opacity-45 block mb-1.5">
                    {en ? 'Featured' : 'विशेष'}
                  </span>
                  <span
                    className="flex items-center gap-2 truncate"
                    style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.05rem,2vw,1.6rem)' }}
                  >
                    {en ? current.title : current.titleHi}
                    <ArrowRight strokeWidth={1.5} className="h-4 w-4 text-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                  </span>
                </button>

                <div className="flex items-center gap-5 flex-shrink-0">
                  <span className="eyebrow tabular-nums opacity-70">
                    {String(slide + 1).padStart(2, '0')}
                    <span className="opacity-40"> / {String(total).padStart(2, '0')}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => go(-1)}
                      aria-label="Previous"
                      className="flex items-center justify-center h-11 w-11 rounded-full border transition-all duration-500 hover:scale-105 active:scale-95"
                      style={{ borderColor: 'hsl(var(--espresso) / 0.22)' }}
                    >
                      <ChevronLeft strokeWidth={1.5} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => go(1)}
                      aria-label="Next"
                      className="flex items-center justify-center h-11 w-11 rounded-full border transition-all duration-500 hover:scale-105 active:scale-95"
                      style={{ borderColor: 'hsl(var(--espresso) / 0.22)' }}
                    >
                      <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Mobile search */}
          <div className="mt-6 md:hidden">
            <SearchBar />
          </div>

          {/* Premium gooey quick-nav */}
          <Reveal className="mt-14 flex justify-center" delay={0.05}>
            <div className="glass px-2 py-1.5 !rounded-full">
              <GooeyNav
                items={[
                  { label: en ? 'Crop AI' : 'फसल एआई', href: '/crop-disease' },
                  { label: en ? 'Market' : 'बाज़ार', href: '/agri-market' },
                  { label: en ? 'Kisan Mart' : 'किसान मार्ट', href: '/kisan-mart' },
                  { label: en ? 'Advisory' : 'सलाह', href: '/kisan-help' },
                  { label: en ? 'Schemes' : 'योजनाएं', href: '/gov-schemes' },
                ]}
                particleCount={15}
                particleDistances={[90, 10]}
                particleR={100}
                animationTime={600}
                timeVariance={300}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                initialActiveIndex={0}
                /* Let the gooey particles play before routing away. */
                onItemClick={(_, item) => window.setTimeout(() => navigate(item.href), 420)}
              />
            </div>
          </Reveal>

          {/* Feature gallery — hover-reveal 3×3 grid */}
          <section className="mt-12 mb-8">
            <GalleryHoverGrid
              heading={en ? 'Everything you need' : 'आपकी हर ज़रूरत'}
              subheading={en ? 'From seed to sale — explore every tool in one place.' : 'बीज से बिक्री तक — हर टूल एक ही जगह।'}
              items={FEATURES.map((f) => ({
                id: f.href,
                title: en ? f.title : f.titleHi,
                summary: en ? f.description : f.descriptionHi,
                url: f.href,
                image: f.img,
              }))}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
