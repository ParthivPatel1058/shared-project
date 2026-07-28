import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  HelpCircle,
  Store,
  Settings as SettingsIcon,
  Menu,
  Package,
  LogOut,
  Search,
  Bell,
} from 'lucide-react';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWeather } from '@/hooks/useWeather';
import { WeatherIcon } from './WeatherWidget';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import logo from '@/assets/bhoomix-logo.jpeg';
import SettingsSidebar from './SettingsSidebar';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { signOut, user } = useAuth();
  const { weather } = useWeather();
  const [settingsSidebarOpen, setSettingsSidebarOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const en = language === 'en';

  const initials = (user?.email ?? 'BX').slice(0, 2).toUpperCase();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/agri-market?search=${encodeURIComponent(query.trim())}`);
    }
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
      <div className="glass-strong !rounded-2xl px-3 sm:px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand — the dock shows it on lg+, so only for mobile/tablet */}
        <Link to="/" className="flex lg:hidden items-center gap-2.5 group flex-shrink-0">
          <img
            src={logo}
            alt="BhoomiX Logo"
            className="h-8 w-8 object-cover rounded-lg ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden sm:inline font-display text-base font-bold text-foreground">BhoomiX</span>
        </Link>

        {/* Weather capsules — location · temp · condition */}
        <div className="hidden xl:flex items-center gap-1.5 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/10 border border-white/20 text-sm text-white">
            <MapPin strokeWidth={1.75} className="h-3.5 w-3.5 text-primary" />
            {weather.city}
          </span>
          <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/10 border border-white/20 text-sm text-white">
            <WeatherIcon icon={weather.conditionIcon} className="h-4 w-4" />
            <span className="font-semibold">{weather.temperature}°C</span>
            <span className="text-muted-foreground text-xs">{weather.condition}</span>
          </span>
        </div>

        {/* Apple-style search — grows on focus */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-md group relative transition-all duration-500 focus-within:max-w-xl"
        >
          <Search
            strokeWidth={1.75}
            className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={en ? 'Search crops, products, advisory...' : 'फसल, उत्पाद, सलाह खोजें...'}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/50 outline-none transition-all duration-300 focus:bg-white/20 focus:border-primary/40 focus:shadow-[0_0_20px_rgba(45,212,191,0.15)]"
          />
        </form>

        {/* Right controls — glass capsules */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9 hidden sm:flex"
            onClick={() =>
              toast(en ? 'No new notifications' : 'कोई नई सूचना नहीं', {
                description: en ? "You're all caught up 🌾" : 'आप अप-टू-डेट हैं 🌾',
              })
            }
          >
            <Bell strokeWidth={1.75} className="h-4 w-4" />
          </Button>

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9"
            onClick={() => setSettingsSidebarOpen(true)}
          >
            <SettingsIcon strokeWidth={1.75} className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9 hidden sm:flex"
            onClick={signOut}
          >
            <LogOut strokeWidth={1.75} className="h-4 w-4" />
          </Button>

          {/* Profile capsule */}
          <button
            onClick={() => navigate('/settings')}
            className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_14px_rgba(45,212,191,0.35)] hover:scale-105 transition-transform duration-200"
            title={user?.email ?? undefined}
          >
            {initials}
          </button>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full lg:hidden h-9 w-9">
                <Menu strokeWidth={1.75} className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm glass-strong border-l border-border">
              <SheetHeader className="mb-6">
                <SheetTitle className="font-display text-xl font-bold text-gradient">
                  {t('menu')}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-3">
                <div className="sm:hidden mb-4 pb-4 border-b border-border">
                  <LanguageSwitcher />
                </div>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'gradient-primary text-primary-foreground shadow-glow-primary'
                          : 'hover:bg-foreground/[0.07] text-foreground'
                      }`}
                    >
                      <Icon strokeWidth={1.75} className="h-5 w-5" />
                      <span className="font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="w-full justify-start gap-3 p-3.5 rounded-2xl mt-4"
                >
                  <LogOut strokeWidth={1.75} className="h-5 w-5" />
                  <span className="font-semibold">Sign Out</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SettingsSidebar
        open={settingsSidebarOpen}
        onOpenChange={setSettingsSidebarOpen}
      />
    </nav>
  );
};

export default Navigation;
