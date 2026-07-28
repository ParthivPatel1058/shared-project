import { Phone, Mail, MapPin, MessageCircle, Clock, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Support = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'en' ? 'Message Sent!' : 'संदेश भेजा गया!',
      description: language === 'en' 
        ? 'We will get back to you soon'
        : 'हम जल्द ही आपसे संपर्क करेंगे'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <Navigation />

      <div className="px-4 lg:px-6 pt-5">
        <BackButton />
      </div>
      
      <div className="pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {language === 'en' ? 'Help & Support' : 'सहायता और समर्थन'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'en' 
                ? 'We\'re here to help! Reach out to us for any assistance'
                : 'हम मदद के लिए यहां हैं! किसी भी सहायता के लिए हमसे संपर्क करें'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="glass hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    {language === 'en' ? 'Call Us' : 'हमें कॉल करें'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Available 24/7' : '24/7 उपलब्ध'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href="tel:+911800123456" 
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    1800-123-456
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'en' ? 'Toll-free number' : 'टोल-फ्री नंबर'}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    {language === 'en' ? 'Email Us' : 'हमें ईमेल करें'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Response within 24 hours' : '24 घंटे के भीतर प्रतिक्रिया'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href="mailto:support@agrihub.com" 
                    className="text-xl font-semibold text-primary hover:underline"
                  >
                    support@agrihub.com
                  </a>
                </CardContent>
              </Card>

              <Card className="glass hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {language === 'en' ? 'Visit Us' : 'हमसे मिलें'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Office hours' : 'कार्यालय समय'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    AgriHub Office<br />
                    123 Kisan Bhawan<br />
                    Agricultural Complex<br />
                    Delhi - 110001
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {language === 'en' 
                        ? 'Mon-Sat: 9:00 AM - 6:00 PM'
                        : 'सोम-शनि: सुबह 9:00 - शाम 6:00'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass btn-metal hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MessageCircle className="h-5 w-5" />
                    {language === 'en' ? 'WhatsApp Support' : 'व्हाट्सएप सपोर्ट'}
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    {language === 'en' ? 'Chat with us instantly' : 'तुरंत हमसे चैट करें'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="secondary"
                    className="w-full"
                    onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    +91 98765-43210
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="glass hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    {language === 'en' ? 'Send us a Message' : 'हमें संदेश भेजें'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Fill out the form and we\'ll get back to you'
                      : 'फॉर्म भरें और हम आपसे संपर्क करेंगे'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'en' ? 'Name' : 'नाम'}
                      </label>
                      <Input 
                        placeholder={language === 'en' ? 'Your name' : 'आपका नाम'}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'en' ? 'Email' : 'ईमेल'}
                      </label>
                      <Input 
                        type="email"
                        placeholder={language === 'en' ? 'your.email@example.com' : 'आपका.ईमेल@example.com'}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'en' ? 'Phone' : 'फोन'}
                      </label>
                      <Input 
                        type="tel"
                        placeholder="+91 98765-43210"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'en' ? 'Subject' : 'विषय'}
                      </label>
                      <Input 
                        placeholder={language === 'en' ? 'What is this about?' : 'यह किस बारे में है?'}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'en' ? 'Message' : 'संदेश'}
                      </label>
                      <Textarea 
                        placeholder={language === 'en' ? 'Your message...' : 'आपका संदेश...'}
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full btn-metal border-0 hover:shadow-lg"
                      size="lg"
                    >
                      {language === 'en' ? 'Send Message' : 'संदेश भेजें'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="glass mt-6 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'en' ? 'Quick Help' : 'त्वरित सहायता'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    {language === 'en' ? 'How to place an order?' : 'ऑर्डर कैसे दें?'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    {language === 'en' ? 'Track my order' : 'मेरा ऑर्डर ट्रैक करें'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    {language === 'en' ? 'Return & Refund Policy' : 'वापसी और रिफंड नीति'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    {language === 'en' ? 'Payment Options' : 'भुगतान विकल्प'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;