import { useEffect, useState } from 'react';
import { ShoppingBag, HelpCircle, Store, Landmark, Bot, Leaf, Truck, Carrot, ScanSearch, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import GalleryHoverGrid from '@/components/ui/gallery-hover-carousel';
import GooeyNav from '@/components/GooeyNav';
import BlurText from '@/components/BlurText';

/* Curated agriculture photography (Unsplash, verified). */
const W = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;
const imgDisease = W('1518977676601-b53f82aba655');   // tomato plant / leaf
const imgMarket = W('1523348837708-15d4a09cfac2');    // fresh vegetables
const imgMart = W('1488459716781-31db52582fe9');      // produce market
const imgAdvisory = W('1625246333195-78d9c38ad449');  // Indian farmer
const imgSchemes = W('1500382017468-9049fed747ef');   // wheat field
const imgRobotic = W('1595246140625-573b715d11dc');   // agri drone / tech
const imgOrganic = W('1574943320219-553eb213f72d');   // organic crop rows
const imgVegetable = W('1466692476868-aef1dfb1e735'); // green field
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
        {/* Hero — text left, full-bleed image carousel right */}
        <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-center pt-2 md:pt-4 pl-4 md:pl-6 lg:pl-8 pr-4 lg:pr-0">
          {/* Left: editorial copy */}
          <div className="animate-slide-up">
            <span className="glass inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 !rounded-full text-primary text-sm font-medium">
              🌱 {en ? 'Tools & advisory for every farming decision' : 'हर कृषि निर्णय के लिए उपकरण और सलाह'}
            </span>
            <BlurText
              as="h1"
              key={en ? 'en' : 'hi'}
              text={en ? 'Grow smarter\nwith BhoomiX' : 'BhoomiX के साथ\nस्मार्ट खेती करें'}
              className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.03]"
            />
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-7 max-w-md">
              {t('tagline')}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-7">
              <Link
                to="/crop-disease"
                className="group inline-flex items-center gap-2 h-11 px-5 rounded-full gradient-primary text-white text-sm font-semibold glow-primary shine hover:scale-[1.03] active:scale-95 transition-transform duration-300"
              >
                <ScanSearch strokeWidth={1.75} className="h-4 w-4" />
                {en ? 'Scan Crop Disease' : 'फसल रोग स्कैन'}
              </Link>
              <Link
                to="/agri-market"
                className="glass inline-flex items-center gap-2 h-11 px-5 !rounded-full text-sm font-semibold text-foreground hover:border-primary/40 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                <ShoppingBag strokeWidth={1.75} className="h-4 w-4" />
                {en ? 'Explore Market' : 'बाज़ार देखें'}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['RS', 'AK', 'MP'].map((ini, i) => (
                  <div
                    key={ini}
                    className={`h-9 w-9 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white ${['gradient-primary', 'gradient-secondary', 'gradient-accent'][i]}`}
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
          </div>

          {/* Right: image carousel with scroll buttons */}
          <div className="animate-scale-in">
            <div className="relative overflow-hidden rounded-[28px] lg:rounded-r-none border border-white/12 lg:border-r-0 shadow-[0_24px_70px_rgba(8,15,30,0.5)] h-[58vh] sm:h-[64vh] lg:h-[86vh] lg:max-h-[900px]">
              {/* Cross-fading images */}
              {FEATURES.map((f, i) => (
                <img
                  key={f.href + i}
                  src={f.img}
                  alt={en ? f.title : f.titleHi}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/85 via-transparent to-transparent" />

              {/* Scroll buttons */}
              <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 glass flex items-center justify-center h-10 w-10 !rounded-full text-white hover:bg-white/[0.22] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <ChevronLeft strokeWidth={2} className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 glass flex items-center justify-center h-10 w-10 !rounded-full text-white hover:bg-white/[0.22] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <ChevronRight strokeWidth={2} className="h-5 w-5" />
              </button>

              {/* Caption + counter */}
              <button
                onClick={() => navigate(current.href)}
                className="group absolute bottom-3 left-3 right-3 glass flex items-center gap-3 px-4 py-3 !rounded-2xl text-left hover:bg-white/[0.16] transition-all duration-300"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                    {en ? current.title : current.titleHi}
                    <ArrowRight strokeWidth={2} className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {en ? current.cta : current.ctaHi}
                  </p>
                </div>
                <span className="text-sm font-semibold text-white/80 tabular-nums flex-shrink-0">
                  {String(slide + 1).padStart(2, '0')} <span className="text-white/40">/ {String(total).padStart(2, '0')}</span>
                </span>
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {FEATURES.map((f, i) => (
                <button
                  key={f.href + i}
                  onClick={() => setSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-primary' : 'w-1.5 bg-white/25 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Mobile search */}
          <div className="mt-6 md:hidden">
            <SearchBar />
          </div>

          {/* Premium gooey quick-nav */}
          <div className="mt-14 flex justify-center">
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
          </div>

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
