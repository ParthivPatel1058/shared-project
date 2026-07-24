import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Truck, Wallet, Clock, MapPin, Zap, Calculator, IndianRupee } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const PartnerRegistration = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hoursPerDay, setHoursPerDay] = useState([6]);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    vehicle_type: ''
  });

  // Earnings calculation (₹50 per delivery, avg 2 deliveries per hour)
  const deliveriesPerHour = 2;
  const earningsPerDelivery = 50;
  const dailyEarnings = hoursPerDay[0] * deliveriesPerHour * earningsPerDelivery;
  const weeklyEarnings = dailyEarnings * 6;
  const monthlyEarnings = dailyEarnings * 26;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(language === 'en' ? 'Please login first' : 'कृपया पहले लॉगिन करें');
      navigate('/auth/login');
      return;
    }

    if (!formData.full_name || !formData.phone_number || !formData.vehicle_type) {
      toast.error(language === 'en' ? 'Please fill all fields' : 'कृपया सभी फ़ील्ड भरें');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('partners')
        .insert([{
          user_id: user.id,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          vehicle_type: formData.vehicle_type,
          is_active: true
        }]);

      if (error) throw error;

      toast.success(language === 'en' 
        ? 'Registration successful! Welcome to BhoomiX Partners' 
        : 'पंजीकरण सफल! BhoomiX पार्टनर्स में आपका स्वागत है'
      );
      
      navigate('/partner-orders');
    } catch (error: any) {
      console.error('Error registering partner:', error);
      
      if (error.code === '23505') {
        toast.error(language === 'en' 
          ? 'You are already registered as a partner' 
          : 'आप पहले से ही पार्टनर के रूप में पंजीकृत हैं'
        );
      } else {
        toast.error(language === 'en' 
          ? 'Registration failed. Please try again.' 
          : 'पंजीकरण विफल। कृपया पुनः प्रयास करें।'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Wallet,
      label: language === 'en' ? 'Great Earnings' : 'अच्छी कमाई',
      delay: '0.1s'
    },
    {
      icon: Clock,
      label: language === 'en' ? 'Flexible Hours' : 'लचीला समय',
      delay: '0.2s'
    },
    {
      icon: MapPin,
      label: language === 'en' ? 'Easy Navigation' : 'आसान नेविगेशन',
      delay: '0.3s'
    },
    {
      icon: Zap,
      label: language === 'en' ? 'Fast Payments' : 'तेज़ भुगतान',
      delay: '0.4s'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-float">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full blur-md animate-pulse opacity-70" />
            <div className="relative w-full h-full bg-card/95 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Truck className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {language === 'en' ? 'Become a Delivery Partner' : 'डिलीवरी पार्टनर बनें'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'en' 
              ? 'Join our delivery network and start earning' 
              : 'हमारे डिलीवरी नेटवर्क में शामिल हों और कमाई शुरू करें'}
          </p>
        </div>

        {/* Animated Features Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto mb-8">
          {features.map((feature) => (
            <div 
              key={feature.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 animate-fade-in border border-border/50" 
              style={{ animationDelay: feature.delay }}
            >
              <div className="p-3 rounded-full bg-primary/10 hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center text-foreground">
                {feature.label}
              </span>
            </div>
          ))}
        </div>

        {/* Earnings Calculator */}
        <Card className="glass p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {language === 'en' ? 'Earnings Calculator' : 'कमाई कैलकुलेटर'}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-muted-foreground">
                  {language === 'en' ? 'Hours per day' : 'प्रतिदिन घंटे'}
                </Label>
                <span className="font-bold text-primary">{hoursPerDay[0]} {language === 'en' ? 'hrs' : 'घंटे'}</span>
              </div>
              <Slider
                value={hoursPerDay}
                onValueChange={setHoursPerDay}
                min={1}
                max={12}
                step={1}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'en' ? 'Daily' : 'दैनिक'}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-foreground">{dailyEarnings}</span>
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'en' ? 'Weekly' : 'साप्ताहिक'}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-foreground">{weeklyEarnings.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'en' ? 'Monthly' : 'मासिक'}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-primary">{monthlyEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              {language === 'en' 
                ? '* Based on avg. 2 deliveries/hour at ₹50 each' 
                : '* औसत 2 डिलीवरी/घंटे ₹50 प्रति के आधार पर'}
            </p>
          </div>
        </Card>

        <Card className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                {language === 'en' ? 'Full Name' : 'पूरा नाम'}
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder={language === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">
                {language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}
              </Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder={language === 'en' ? 'Enter your phone number' : 'अपना फ़ोन नंबर दर्ज करें'}
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_type">
                {language === 'en' ? 'Vehicle Type' : 'वाहन का प्रकार'}
              </Label>
              <Select
                value={formData.vehicle_type}
                onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select vehicle type' : 'वाहन का प्रकार चुनें'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bike">
                    {language === 'en' ? 'Bike / Motorcycle' : 'बाइक / मोटरसाइकिल'}
                  </SelectItem>
                  <SelectItem value="scooter">
                    {language === 'en' ? 'Scooter' : 'स्कूटर'}
                  </SelectItem>
                  <SelectItem value="car">
                    {language === 'en' ? 'Car' : 'कार'}
                  </SelectItem>
                  <SelectItem value="van">
                    {language === 'en' ? 'Van / Tempo' : 'वैन / टेम्पो'}
                  </SelectItem>
                  <SelectItem value="bicycle">
                    {language === 'en' ? 'Bicycle' : 'साइकिल'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading 
                ? (language === 'en' ? 'Registering...' : 'पंजीकरण हो रहा है...')
                : (language === 'en' ? 'Register as Partner' : 'पार्टनर के रूप में पंजीकरण करें')
              }
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground">
              {language === 'en' ? 'Already a partner?' : 'पहले से पार्टनर हैं?'}{' '}
              <button
                onClick={() => navigate('/partner-orders')}
                className="text-primary font-semibold hover:underline"
              >
                {language === 'en' ? 'Go to Dashboard' : 'डैशबोर्ड पर जाएं'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerRegistration;
