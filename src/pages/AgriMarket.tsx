import { ShoppingBag, Leaf, Droplet, Wrench, Bug, Star, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import { FancyButton } from '@/components/ui/fancy-button';
import CartSheet from '@/components/CartSheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Import product images
import organicWheatSeeds from '@/assets/organic-wheat-seeds.jpg';
import organicPaddySeeds from '@/assets/organic-paddy-seeds.jpg';
import organicMaizeSeeds from '@/assets/organic-maize-seeds.jpg';
import organicVegetableSeeds from '@/assets/organic-vegetable-seeds.jpg';
import vermicompost from '@/assets/vermicompost.jpg';
import neemCake from '@/assets/neem-cake.jpg';
import cowDungManure from '@/assets/cow-dung-manure.jpg';
import compost from '@/assets/compost.jpg';
import boneMeal from '@/assets/bone-meal.jpg';
import organicSprayer from '@/assets/organic-sprayer.jpg';
import manualWeeder from '@/assets/manual-weeder.jpg';
import mulchSpreader from '@/assets/mulch-spreader.jpg';
import compostMaker from '@/assets/compost-maker.jpg';
import neemOil from '@/assets/neem-oil.jpg';
import garlicExtract from '@/assets/garlic-extract.jpg';
import tobaccoDecoction from '@/assets/tobacco-decoction.jpg';
import panchagavya from '@/assets/panchagavya.jpg';
import greenManure from '@/assets/green-manure.jpg';

const categories = [
  { id: 'all', name: 'All', nameHi: 'सभी', icon: ShoppingBag, color: 'from-primary to-primary/80' },
  { id: 'seeds', name: 'Seeds', nameHi: 'बीज', icon: Leaf, color: 'from-green-500 to-emerald-600' },
  { id: 'fertilizers', name: 'Fertilizers', nameHi: 'उर्वरक', icon: Droplet, color: 'from-blue-500 to-cyan-600' },
  { id: 'tools', name: 'Tools', nameHi: 'उपकरण', icon: Wrench, color: 'from-orange-500 to-amber-600' },
  { id: 'pesticides', name: 'Pesticides', nameHi: 'कीटनाशक', icon: Bug, color: 'from-red-500 to-rose-600' },
];

interface Product {
  id: number;
  name: string;
  nameHi: string;
  category: string;
  description: string;
  descriptionHi: string;
  price: string;
  unit: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
}

const products: Product[] = [
  // Seeds
  {
    id: 1,
    name: 'Premium Wheat Seeds (HD-2967)',
    nameHi: 'प्रीमियम गेहूं के बीज (HD-2967)',
    category: 'seeds',
    description: 'High-yield variety, suitable for irrigated areas. Matures in 140-150 days. Disease resistant.',
    descriptionHi: 'उच्च उपज वाली किस्म, सिंचित क्षेत्रों के लिए उपयुक्त। 140-150 दिनों में परिपक्व। रोग प्रतिरोधी।',
    price: '₹450',
    unit: '/kg',
    rating: 4.5,
    reviews: 234,
    inStock: true,
    image: organicWheatSeeds
  },
  {
    id: 2,
    name: 'Basmati Rice Seeds (Pusa-1121)',
    nameHi: 'बासमती चावल के बीज (पूसा-1121)',
    category: 'seeds',
    description: 'Extra-long grain basmati. Premium quality, aromatic. Ideal for export. 140-145 days maturity.',
    descriptionHi: 'अतिरिक्त लंबे अनाज बासमती। प्रीमियम गुणवत्ता, सुगंधित। निर्यात के लिए आदर्श। 140-145 दिनों में परिपक्व।',
    price: '₹850',
    unit: '/kg',
    rating: 4.8,
    reviews: 456,
    inStock: true,
    image: organicPaddySeeds
  },
  {
    id: 3,
    name: 'Hybrid Maize Seeds (NK-30)',
    nameHi: 'हाइब्रिड मक्का के बीज (NK-30)',
    category: 'seeds',
    description: 'High-yield hybrid corn. Excellent for fodder and grain. Drought resistant. 85-90 days.',
    descriptionHi: 'उच्च उपज वाला हाइब्रिड मक्का। चारे और अनाज के लिए उत्कृष्ट। सूखा प्रतिरोधी। 85-90 दिन।',
    price: '₹320',
    unit: '/kg',
    rating: 4.6,
    reviews: 189,
    inStock: true,
    image: organicMaizeSeeds
  },
  {
    id: 4,
    name: 'Organic Vegetable Seeds Mix',
    nameHi: 'जैविक सब्जी बीज मिक्स',
    category: 'seeds',
    description: 'Mixed vegetable seeds. High germination rate. Perfect for kitchen garden.',
    descriptionHi: 'मिश्रित सब्जी के बीज। उच्च अंकुरण दर। किचन गार्डन के लिए बिल्कुल सही।',
    price: '₹450',
    unit: '/packet',
    rating: 4.7,
    reviews: 312,
    inStock: true,
    image: organicVegetableSeeds
  },
  
  // Fertilizers
  {
    id: 6,
    name: 'Organic Vermicompost',
    nameHi: 'ऑर्गेनिक वर्मीकम्पोस्ट',
    category: 'fertilizers',
    description: '100% organic. Rich in nutrients. Improves soil structure and water retention.',
    descriptionHi: '100% जैविक। पोषक तत्वों से भरपूर। मिट्टी की संरचना और जल प्रतिधारण में सुधार करता है।',
    price: '₹320',
    unit: '/40kg bag',
    rating: 4.9,
    reviews: 421,
    inStock: true,
    image: vermicompost
  },
  {
    id: 7,
    name: 'Neem Cake Organic Fertilizer',
    nameHi: 'नीम खली जैविक उर्वरक',
    category: 'fertilizers',
    description: 'Natural pest repellent. Rich in nitrogen. Improves soil health and plant growth.',
    descriptionHi: 'प्राकृतिक कीट प्रतिरोधी। नाइट्रोजन से भरपूर। मिट्टी के स्वास्थ्य और पौधों की वृद्धि में सुधार करता है।',
    price: '₹450',
    unit: '/50kg bag',
    rating: 4.8,
    reviews: 356,
    inStock: true,
    image: neemCake
  },
  {
    id: 8,
    name: 'Cow Dung Manure',
    nameHi: 'गोबर की खाद',
    category: 'fertilizers',
    description: 'Traditional organic manure. Enriches soil with essential nutrients. Perfect for all crops.',
    descriptionHi: 'पारंपरिक जैविक खाद। आवश्यक पोषक तत्वों से मिट्टी को समृद्ध करता है। सभी फसलों के लिए बिल्कुल सही।',
    price: '₹250',
    unit: '/50kg bag',
    rating: 4.7,
    reviews: 489,
    inStock: true,
    image: cowDungManure
  },
  {
    id: 9,
    name: 'Premium Compost',
    nameHi: 'प्रीमियम कम्पोस्ट',
    category: 'fertilizers',
    description: 'Well-decomposed organic matter. Improves soil texture. Rich in micronutrients.',
    descriptionHi: 'अच्छी तरह से विघटित जैविक पदार्थ। मिट्टी की बनावट में सुधार करता है। सूक्ष्म पोषक तत्वों से भरपूर।',
    price: '₹280',
    unit: '/40kg bag',
    rating: 4.6,
    reviews: 298,
    inStock: true,
    image: compost
  },
  {
    id: 10,
    name: 'Bone Meal Fertilizer',
    nameHi: 'हड्डी की खाद',
    category: 'fertilizers',
    description: 'Slow-release phosphorus fertilizer. Promotes strong root development. 100% organic.',
    descriptionHi: 'धीमी गति से रिलीज़ होने वाली फास्फोरस खाद। मजबूत जड़ विकास को बढ़ावा देता है। 100% जैविक।',
    price: '₹380',
    unit: '/25kg bag',
    rating: 4.7,
    reviews: 234,
    inStock: true,
    image: boneMeal
  },

  // Tools
  {
    id: 11,
    name: 'Organic Sprayer (16L)',
    nameHi: 'जैविक स्प्रेयर (16L)',
    category: 'tools',
    description: 'Manual knapsack sprayer. Perfect for organic farming. Durable and easy to use.',
    descriptionHi: 'मैनुअल नैपसैक स्प्रेयर। जैविक खेती के लिए बिल्कुल सही। टिकाऊ और उपयोग में आसान।',
    price: '₹1,450',
    unit: '',
    rating: 4.6,
    reviews: 234,
    inStock: true,
    image: organicSprayer
  },
  {
    id: 12,
    name: 'Manual Weeder Tool',
    nameHi: 'मैनुअल वीडर उपकरण',
    category: 'tools',
    description: 'Efficient weeding tool. Eco-friendly. Reduces manual labor significantly.',
    descriptionHi: 'कुशल निराई उपकरण। पर्यावरण के अनुकूल। मैनुअल श्रम को काफी कम करता है।',
    price: '₹850',
    unit: '',
    rating: 4.5,
    reviews: 178,
    inStock: true,
    image: manualWeeder
  },
  {
    id: 13,
    name: 'Mulch Spreader',
    nameHi: 'मल्च स्प्रेडर',
    category: 'tools',
    description: 'Organic mulch application tool. Conserves soil moisture. Prevents weed growth.',
    descriptionHi: 'जैविक मल्च एप्लिकेशन टूल। मिट्टी की नमी को संरक्षित करता है। खरपतवार की वृद्धि को रोकता है।',
    price: '₹2,200',
    unit: '',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    image: mulchSpreader
  },
  {
    id: 14,
    name: 'Compost Maker Bin',
    nameHi: 'कम्पोस्ट मेकर बिन',
    category: 'tools',
    description: 'Large capacity composting bin. Accelerates decomposition. Perfect for organic farming.',
    descriptionHi: 'बड़ी क्षमता वाला कम्पोस्टिंग बिन। अपघटन को तेज करता है। जैविक खेती के लिए बिल्कुल सही।',
    price: '₹3,500',
    unit: '',
    rating: 4.8,
    reviews: 189,
    inStock: true,
    image: compostMaker
  },

  // Pesticides
  {
    id: 15,
    name: 'Neem Oil (Organic)',
    nameHi: 'नीम तेल (जैविक)',
    category: 'pesticides',
    description: 'Natural pesticide. Safe for organic farming. Controls aphids, mites, and whiteflies.',
    descriptionHi: 'प्राकृतिक कीटनाशक। जैविक खेती के लिए सुरक्षित। एफिड्स, माइट्स और व्हाइटफ्लाइज़ को नियंत्रित करता है।',
    price: '₹280',
    unit: '/liter',
    rating: 4.7,
    reviews: 567,
    inStock: true,
    image: '🧪'
  },
  {
    id: 16,
    name: 'Chlorpyrifos 20% EC',
    nameHi: 'क्लोरपाइरीफॉस 20% EC',
    category: 'pesticides',
    description: 'Broad-spectrum insecticide. Effective against termites, borers. For all crops.',
    descriptionHi: 'व्यापक-स्पेक्ट्रम कीटनाशक। दीमक, बोरर के खिलाफ प्रभावी। सभी फसलों के लिए।',
    price: '₹340',
    unit: '/liter',
    rating: 4.5,
    reviews: 423,
    inStock: true,
    image: '🧪'
  },
  {
    id: 17,
    name: 'Mancozeb 75% WP (Fungicide)',
    nameHi: 'मैनकोज़ेब 75% WP (फफूंदनाशी)',
    category: 'pesticides',
    description: 'Fungicide for leaf spot, blight, rust. Preventive action. Suitable for vegetables.',
    descriptionHi: 'लीफ स्पॉट, ब्लाइट, रस्ट के लिए फफूंदनाशी। निवारक कार्रवाई। सब्जियों के लिए उपयुक्त।',
    price: '₹450',
    unit: '/kg',
    rating: 4.6,
    reviews: 312,
    inStock: true,
    image: '🧪'
  },
  {
    id: 18,
    name: '2,4-D Herbicide',
    nameHi: '2,4-D हर्बीसाइड',
    category: 'pesticides',
    description: 'Selective herbicide for broadleaf weeds. Post-emergence application. For wheat, rice.',
    descriptionHi: 'चौड़ी पत्ती वाले खरपतवार के लिए चयनात्मक हर्बीसाइड। उभरने के बाद आवेदन। गेहूं, चावल के लिए।',
    price: '₹380',
    unit: '/liter',
    rating: 4.4,
    reviews: 267,
    inStock: true,
    image: '🧪'
  },
];

interface CartItem {
  id: number;
  name: string;
  nameHi: string;
  price: number;
  quantity: number;
  image: string;
}

const AgriMarket = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // Load cart from database
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setIsLoadingCart(false);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const items = data.map(item => ({
        id: item.product_id,
        name: item.product_name,
        nameHi: item.product_name_hi,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameHi.includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error(language === 'en' 
        ? 'Please login to add items to cart' 
        : 'कार्ट में आइटम जोड़ने के लिए कृपया लॉगिन करें'
      );
      return;
    }

    const price = parseInt(product.price.replace(/[₹,]/g, ''));
    const existingItem = cartItems.find(item => item.id === product.id);
    
    try {
      if (existingItem) {
        // Update quantity in database
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;

        setCartItems(cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        // Insert new item in database
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            product_name: product.name,
            product_name_hi: product.nameHi,
            price,
            quantity: 1,
            image: product.image
          });

        if (error) throw error;

        setCartItems([...cartItems, {
          id: product.id,
          name: product.name,
          nameHi: product.nameHi,
          price,
          quantity: 1,
          image: product.image
        }]);
      }
      
      toast.success(language === 'en' 
        ? `${product.name} added to cart!` 
        : `${product.nameHi} कार्ट में जोड़ा गया!`
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(language === 'en' 
        ? 'Failed to add item to cart' 
        : 'कार्ट में आइटम जोड़ने में विफल'
      );
    }
  };

  const updateCartQuantity = async (id: number, change: number) => {
    if (!user) return;

    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;

    try {
      if (newQuantity <= 0) {
        await removeFromCart(id);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;

      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(language === 'en' 
        ? 'Failed to update cart' 
        : 'कार्ट अपडेट करने में विफल'
      );
    }
  };

  const removeFromCart = async (id: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;

      setCartItems(cartItems.filter(item => item.id !== id));
      toast.success(language === 'en' ? 'Item removed from cart' : 'कार्ट से आइटम हटाया गया');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(language === 'en' 
        ? 'Failed to remove item' 
        : 'आइटम हटाने में विफल'
      );
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <Navigation />

      <div className="px-4 lg:px-6 pt-5">
        <BackButton />
      </div>
      
      <div className="pt-8 pb-12 px-4 container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('agriMarketTitle')}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">{t('agriMarketDesc')}</p>
          
          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={language === 'en' ? 'Search products...' : 'उत्पाद खोजें...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-full glass border-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`glass rounded-[2rem] p-6 hover:scale-105 transition-all ${
                  isActive ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''
                }`}
              >
                <div className={`inline-flex p-4 rounded-[1.5rem] bg-gradient-to-br ${category.color} mb-3 mx-auto`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="font-semibold text-foreground text-sm">
                  {language === 'en' ? category.name : category.nameHi}
                </div>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="glass hover:shadow-2xl transition-all hover:scale-[1.02] animate-fade-in rounded-[2rem] border-2 border-primary/10"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <img 
                    src={product.image} 
                    alt={language === 'en' ? product.name : product.nameHi}
                    className="w-24 h-24 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="text-right">
                    <Badge 
                      variant={product.inStock ? "default" : "secondary"}
                      className={product.inStock ? "btn-liquid-glass border-0" : ""}
                    >
                      {product.inStock 
                        ? (language === 'en' ? 'In Stock' : 'उपलब्ध')
                        : (language === 'en' ? 'Out of Stock' : 'स्टॉक खत्म')}
                    </Badge>
                  </div>
                </div>
                
                <CardTitle className="text-xl leading-tight">
                  {language === 'en' ? product.name : product.nameHi}
                </CardTitle>
                
                <CardDescription className="text-sm line-clamp-2">
                  {language === 'en' ? product.description : product.descriptionHi}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-1 text-sm">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-primary text-primary'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground ml-2">
                    {product.rating} ({product.reviews} {language === 'en' ? 'reviews' : 'समीक्षा'})
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">{product.price}</span>
                  <span className="text-sm text-muted-foreground">{product.unit}</span>
                </div>

                <FancyButton
                  className="w-full"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product)}
                  icon={<ShoppingBag className="h-4 w-4" />}
                  label={language === 'en' ? 'Add to Cart' : 'कार्ट में डालें'}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {language === 'en' ? 'No products found' : 'कोई उत्पाद नहीं मिला'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 glass-strong rounded-[2rem] p-4 shadow-2xl hover:scale-110 transition-all animate-scale-in"
        >
          <div className="relative">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </div>
        </button>
      )}

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
};

export default AgriMarket;