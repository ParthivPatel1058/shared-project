import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Palette, 
  Globe, 
  Bell, 
  HelpCircle, 
  Info, 
  Package,
  Moon,
  Sun,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: t('appearance'), icon: Palette },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'support', label: t('support'), icon: HelpCircle },
    { id: 'orders', label: t('orders'), icon: Package },
    { id: 'about', label: t('about'), icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Navigation />
      
      <div className="pt-8 pb-12 px-4 container mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {t('settingsTitle')}
        </h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="glass rounded-3xl border-2 border-primary/10 lg:col-span-1 h-fit">
            <CardContent className="p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                          : 'hover:bg-accent/50 text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'appearance' && (
              <Card className="glass rounded-3xl border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Palette className="h-6 w-6 text-primary" />
                    {t('appearance')}
                  </CardTitle>
                  <CardDescription>Customize how KisanSmart looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Toggle */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">{t('theme')}</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`glass rounded-2xl p-6 border-2 transition-all ${
                          theme === 'light'
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Sun className="h-8 w-8 mx-auto mb-3 text-amber-500" />
                        <p className="font-semibold">{t('light')}</p>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`glass rounded-2xl p-6 border-2 transition-all ${
                          theme === 'dark'
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Moon className="h-8 w-8 mx-auto mb-3 text-indigo-500" />
                        <p className="font-semibold">{t('dark')}</p>
                      </button>
                    </div>
                  </div>

                  <Separator />

                  {/* Language Selection */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t('language')}
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`glass rounded-2xl p-6 border-2 transition-all ${
                          language === 'en'
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="text-3xl mb-2">🇬🇧</p>
                        <p className="font-semibold">{t('english')}</p>
                      </button>
                      <button
                        onClick={() => setLanguage('hi')}
                        className={`glass rounded-2xl p-6 border-2 transition-all ${
                          language === 'hi'
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="text-3xl mb-2">🇮🇳</p>
                        <p className="font-semibold">{t('hindi')}</p>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="glass rounded-3xl border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Bell className="h-6 w-6 text-primary" />
                    {t('notifications')}
                  </CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between glass rounded-2xl p-4">
                    <div className="space-y-1">
                      <Label htmlFor="order-updates">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about your order status</p>
                    </div>
                    <Switch id="order-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between glass rounded-2xl p-4">
                    <div className="space-y-1">
                      <Label htmlFor="weather-alerts">Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive weather updates for farming</p>
                    </div>
                    <Switch id="weather-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between glass rounded-2xl p-4">
                    <div className="space-y-1">
                      <Label htmlFor="crop-tips">Farming Tips</Label>
                      <p className="text-sm text-muted-foreground">Get helpful farming tips and advice</p>
                    </div>
                    <Switch id="crop-tips" />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'support' && (
              <Card className="glass rounded-3xl border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    {t('support')}
                  </CardTitle>
                  <CardDescription>Get help and support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start glass rounded-2xl h-auto p-6 border-2 border-primary/20 hover:border-primary/50" variant="outline">
                    <Mail className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">{t('contactSupport')}</p>
                      <p className="text-sm text-muted-foreground">support@kisansmart.com</p>
                    </div>
                  </Button>
                  <Button className="w-full justify-start glass rounded-2xl h-auto p-6 border-2 border-primary/20 hover:border-primary/50" variant="outline">
                    <Phone className="h-5 w-5 mr-3 text-secondary" />
                    <div className="text-left">
                      <p className="font-semibold">{t('helpCenter')}</p>
                      <p className="text-sm text-muted-foreground">1800-123-4567 (Toll Free)</p>
                    </div>
                  </Button>
                  <Button className="w-full justify-start glass rounded-2xl h-auto p-6 border-2 border-primary/20 hover:border-primary/50" variant="outline">
                    <MessageSquare className="h-5 w-5 mr-3 text-accent" />
                    <div className="text-left">
                      <p className="font-semibold">{t('reportIssue')}</p>
                      <p className="text-sm text-muted-foreground">Submit a support ticket</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'orders' && (
              <Card className="glass rounded-3xl border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Package className="h-6 w-6 text-primary" />
                    {t('orders')}
                  </CardTitle>
                  <CardDescription>{t('orderHistory')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold mb-2">No orders yet</p>
                    <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                    <Button className="gradient-primary text-white rounded-2xl">
                      {t('shopNow')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'about' && (
              <Card className="glass rounded-3xl border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Info className="h-6 w-6 text-primary" />
                    {t('about')}
                  </CardTitle>
                  <CardDescription>{t('aboutApp')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="glass rounded-2xl p-6 text-center">
                    <div className="text-6xl mb-4">🌾</div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      KisanSmart
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Empowering farmers with technology and AI-powered solutions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('version')} 1.0.0
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 space-y-3">
                    <h4 className="font-semibold text-lg">Features:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>✅ AI-powered crop disease detection</li>
                      <li>✅ Quality agricultural products marketplace</li>
                      <li>✅ Quick grocery delivery</li>
                      <li>✅ Multi-language support (English & Hindi)</li>
                      <li>✅ Weather updates and farming tips</li>
                      <li>✅ Government schemes information</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
