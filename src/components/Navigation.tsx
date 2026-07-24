import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, HelpCircle, Store, Settings as SettingsIcon, Menu, Package, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import logo from '@/assets/bhoomix-logo.jpeg';
import SettingsSidebar from './SettingsSidebar';
const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const [settingsSidebarOpen, setSettingsSidebarOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navItems = [{
    path: '/',
    icon: Home,
    label: t('home')
  }, {
    path: '/agri-market',
    icon: ShoppingBag,
    label: t('agriMarket')
  }, {
    path: '/kisan-help',
    icon: HelpCircle,
    label: t('kisanHelp')
  }, {
    path: '/kisan-mart',
    icon: Store,
    label: t('kisanMart')
  }, {
    path: '/orders',
    icon: Package,
    label: t('myOrders') || 'My Orders'
  }];
  return <nav className="glass-strong fixed top-0 left-0 right-0 z-50 !rounded-none border-x-0 border-t-0 border-b border-primary/15">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img src={logo} alt="BhoomiX Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 object-contain transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_hsl(var(--primary)/0.4)] cursor-pointer drop-shadow-xl rounded-2xl" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center max-w-3xl">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-2 px-4 lg:px-5 py-2 rounded-full transition-all duration-300 text-sm lg:text-base ${isActive ? 'gradient-primary text-primary-foreground shadow-glow-primary scale-105' : 'hover:bg-primary/10 hover:text-primary text-foreground'}`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium hidden lg:inline">{item.label}</span>
              </Link>;
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-9 w-9"
              onClick={() => setSettingsSidebarOpen(true)}
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-9 w-9 hidden sm:flex"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full md:hidden h-9 w-9">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm glass-strong border-l border-primary/20">
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-display text-xl font-bold text-gradient">
                    {t('menu')}
                  </SheetTitle>
                </SheetHeader>
                <div className="space-y-3">
                  <div className="sm:hidden mb-4 pb-4 border-b border-border/50">
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
                            : 'hover:bg-primary/10 hover:text-primary text-foreground active:bg-primary/20'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-semibold">{item.label}</span>
                      </Link>
                    );
                  })}
                  <Button
                    variant="outline"
                    onClick={signOut}
                    className="w-full justify-start gap-3 p-3.5 rounded-[1.5rem] mt-4"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-semibold">Sign Out</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <SettingsSidebar 
        open={settingsSidebarOpen} 
        onOpenChange={setSettingsSidebarOpen} 
      />
    </nav>;
};
export default Navigation;