import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  HelpCircle,
  Store,
  Package,
  Settings as SettingsIcon,
  Menu,
  LogOut,
  Search,
  Bell,
  MapPin,
  Command,
} from 'lucide-react';
import { toast } from 'sonner';
import { trackSearch } from '@/lib/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWeather } from '@/hooks/useWeather';
import { WeatherIcon } from './WeatherWidget';
import GradientText from '@/components/ui/gradient-text';
import GlareHover from '@/components/ui/glare-hover';
import StarBorder from '@/components/ui/star-border';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import logo from '@/assets/bhoomix-logo.jpeg';
import SettingsSidebar from './SettingsSidebar';

/** Frosted control that adapts to light and dark. */
const CTRL =
  'flex items-center justify-center rounded-full border transition-all duration-300 ' +
  'border-black/10 bg-white/70 text-neutral-600 hover:bg-white hover:text-neutral-900 ' +
  'dark:border-white/15 dark:bg-white/10 dark:text-white/75 dark:hover:bg-white/20 dark:hover:text-white';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, tx } = useLanguage();
  const { signOut, user } = useAuth();
  const { weather } = useWeather();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const searchRef = React.useRef<HTMLInputElement>(null);

  const initials = (user?.email ?? 'BX').slice(0, 2).toUpperCase();

  // Cmd/Ctrl-K focuses search, matching the hint shown in the field.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    trackSearch(query.trim());
    navigate(`/agri-market?search=${encodeURIComponent(query.trim())}`);
  };

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/agri-market', icon: ShoppingBag, label: t('agriMarket') },
    { path: '/kisan-help', icon: HelpCircle, label: t('kisanHelp') },
    { path: '/kisan-mart', icon: Store, label: t('kisanMart') },
    { path: '/orders', icon: Package, label: t('myOrders') || 'My Orders' },
  ];

  return (
    <nav className="sticky top-3 z-50 mx-3 lg:mx-4 xl:mx-6">
      <div
        className="flex h-[68px] items-center gap-2.5 rounded-[22px] border px-2.5 backdrop-blur-2xl sm:gap-3 sm:px-3.5
                   border-black/[0.07] bg-white/75 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_14px_44px_rgba(30,40,60,0.14)]
                   dark:border-white/[0.14] dark:bg-white/[0.07] dark:shadow-[0_1px_0_rgba(255,255,255,0.14)_inset,0_14px_44px_rgba(0,0,0,0.45)]"
      >
        {/* Brand — the dock owns this on lg+ */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-2.5 lg:hidden">
          <img src={logo} alt="" className="h-8 w-8 rounded-lg object-cover ring-1 ring-black/10 dark:ring-white/20" />
          <span className="hidden font-display text-base font-bold sm:inline">
            <GradientText animationSpeed={9}>BhoomiX</GradientText>
          </span>
        </Link>

        {/* Weather — one segmented capsule instead of two loose chips */}
        <div
          className="hidden flex-shrink-0 items-center gap-2.5 rounded-full border py-2 pl-3.5 pr-4 xl:flex
                     border-black/[0.07] bg-black/[0.035] dark:border-white/[0.12] dark:bg-white/[0.06]"
        >
          <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-white">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {weather.city}
          </span>
          <span className="h-4 w-px bg-black/10 dark:bg-white/15" />
          <span className="flex items-center gap-1.5">
            <WeatherIcon icon={weather.conditionIcon} className="h-4 w-4" />
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {weather.temperature}°
            </span>
            <span className="text-xs text-neutral-500 dark:text-white/60">{weather.condition}</span>
          </span>
        </div>

        {/* Search — grows on focus, with a Cmd-K affordance */}
        <form
          onSubmit={handleSearch}
          className="group relative mx-auto hidden w-full max-w-sm transition-[max-width] duration-500 focus-within:max-w-xl md:flex"
        >
          <Search
            strokeWidth={2}
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary dark:text-white/45"
          />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tx('Search crops, products, advisory…', 'फसल, उत्पाद, सलाह खोजें…')}
            className="h-12 w-full rounded-full border pl-11 pr-16 text-sm outline-none transition-all duration-500
                       border-black/[0.07] bg-black/[0.035] text-neutral-900 placeholder:text-neutral-400
                       focus:border-primary/45 focus:bg-white focus:shadow-[0_0_0_4px_hsl(var(--aqua)/0.14)]
                       dark:border-white/[0.12] dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/45
                       dark:focus:border-primary/55 dark:focus:bg-white/[0.12]"
          />
          <kbd
            className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium lg:flex
                       border-black/10 text-neutral-400 dark:border-white/15 dark:text-white/40"
          >
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </form>

        {/* Right cluster */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
          <GlareHover className="hidden rounded-full sm:inline-flex">
            <button
              onClick={() =>
                toast(tx('No new notifications', 'कोई नई सूचना नहीं'), {
                  description: tx("You're all caught up 🌾", 'आप अप-टू-डेट हैं 🌾'),
                })
              }
              aria-label="Notifications"
              className={`${CTRL} relative h-10 w-10`}
            >
              <Bell strokeWidth={2} className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full accent-solid" />
            </button>
          </GlareHover>

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <GlareHover className="rounded-full">
            <button onClick={() => setSettingsOpen(true)} aria-label="Settings" className={`${CTRL} h-10 w-10`}>
              <SettingsIcon strokeWidth={2} className="h-4 w-4 transition-transform duration-500 hover:rotate-90" />
            </button>
          </GlareHover>

          <GlareHover className="hidden rounded-full sm:inline-flex">
            <button onClick={signOut} aria-label="Sign out" className={`${CTRL} h-10 w-10`}>
              <LogOut strokeWidth={2} className="h-4 w-4" />
            </button>
          </GlareHover>

          <StarBorder
            as="button"
            onClick={() => navigate('/settings')}
            title={user?.email ?? undefined}
            speed="5s"
            className="transition-transform duration-300 hover:scale-105"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full accent-grad accent-ink text-[11px] font-bold">
              {initials}
            </span>
          </StarBorder>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button aria-label="Menu" className={`${CTRL} h-10 w-10 lg:hidden`}>
                <Menu strokeWidth={2} className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm border-l border-border">
              <SheetHeader className="mb-6">
                <SheetTitle className="font-display text-xl font-bold">
                  <GradientText>{t('menu')}</GradientText>
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-2">
                <div className="mb-4 border-b border-border pb-4 sm:hidden">
                  <LanguageSwitcher />
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 ${
                        active
                          ? 'bg-foreground/10 font-semibold text-foreground'
                          : 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground'
                      }`}
                    >
                      <Icon strokeWidth={2} className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <Button variant="outline" onClick={signOut} className="mt-4 w-full justify-start gap-3 p-3.5">
                  <LogOut strokeWidth={2} className="h-5 w-5" />
                  <span className="font-semibold">{tx('Sign Out', 'साइन आउट')}</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SettingsSidebar open={settingsOpen} onOpenChange={setSettingsOpen} />
    </nav>
  );
};

export default Navigation;
