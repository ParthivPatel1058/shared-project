import { ShoppingCart, Zap, Search, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import CartSheet from '@/components/CartSheet';
import { toast } from 'sonner';

// Import real brand product images
import laysImg from '@/assets/lays-chips.jpg';
import kurkureImg from '@/assets/kurkure.jpg';
import pepsiImg from '@/assets/pepsi.jpg';
import cocaColaImg from '@/assets/coca-cola.jpg';
import britanniaImg from '@/assets/britannia-cookies.jpg';
import parleGImg from '@/assets/parle-g.jpg';
import amulMilkImg from '@/assets/amul-milk.jpg';
import amulButterImg from '@/assets/amul-butter.jpg';
import tataSaltImg from '@/assets/tata-salt.jpg';
import maggiImg from '@/assets/maggi.jpg';
import fortuneOilImg from '@/assets/fortune-oil.jpg';
import indiaGateRiceImg from '@/assets/india-gate-rice.jpg';
import tataTeaImg from '@/assets/tata-tea.jpg';
import realJuiceImg from '@/assets/real-juice.jpg';
import haldiramImg from '@/assets/haldiram-bhujia.jpg';
import motherDairyImg from '@/assets/mother-dairy-yogurt.jpg';
import britanniaBreadImg from '@/assets/britannia-bread.jpg';
import maggiKetchupImg from '@/assets/maggi-ketchup.jpg';
import everestTurmericImg from '@/assets/everest-turmeric.jpg';
import vimDishwashImg from '@/assets/vim-dishwash.jpg';
import tomatoesImg from '@/assets/tomatoes.jpg';
import onionsImg from '@/assets/onions.jpg';
import applesImg from '@/assets/apples.jpg';
import bananasImg from '@/assets/bananas.jpg';
import carrotsImg from '@/assets/carrots.jpg';
import peppersImg from '@/assets/peppers.jpg';
import spinachImg from '@/assets/spinach.jpg';
import potatoesImg from '@/assets/potatoes.jpg';

interface Product {
  id: number;
  name: string;
  nameHi: string;
  price: number;
  image: string;
  tag: string;
  tagHi: string;
  category: string;
}

const categories = [
  { id: 1, name: 'Vegetables', nameHi: 'सब्जियां', emoji: '🥬' },
  { id: 2, name: 'Fruits', nameHi: 'फल', emoji: '🍎' },
  { id: 3, name: 'Dairy', nameHi: 'डेयरी', emoji: '🥛' },
  { id: 4, name: 'Snacks', nameHi: 'स्नैक्स', emoji: '🍪' },
  { id: 5, name: 'Beverages', nameHi: 'पेय पदार्थ', emoji: '🥤' },
  { id: 6, name: 'Bakery', nameHi: 'बेकरी', emoji: '🍞' },
  { id: 7, name: 'Staples', nameHi: 'मुख्य खाद्य', emoji: '🌾' },
  { id: 8, name: 'Household', nameHi: 'घरेलू सामान', emoji: '🧹' },
];

const products: Product[] = [
  // Snacks
  { id: 1, name: 'Lays Classic Salted', nameHi: 'लेज़ क्लासिक नमकीन', price: 20, image: laysImg, tag: '50g', tagHi: '50 ग्राम', category: 'Snacks' },
  { id: 2, name: 'Kurkure Masala Munch', nameHi: 'कुरकुरे मसाला मंच', price: 20, image: kurkureImg, tag: '82g', tagHi: '82 ग्राम', category: 'Snacks' },
  { id: 3, name: 'Haldiram Bhujia', nameHi: 'हल्दीराम भुजिया', price: 45, image: haldiramImg, tag: '200g', tagHi: '200 ग्राम', category: 'Snacks' },
  { id: 4, name: 'Britannia Good Day', nameHi: 'ब्रिटानिया गुड डे', price: 35, image: britanniaImg, tag: '100g', tagHi: '100 ग्राम', category: 'Snacks' },
  { id: 5, name: 'Parle-G Biscuits', nameHi: 'पारले-जी बिस्किट', price: 10, image: parleGImg, tag: '75g', tagHi: '75 ग्राम', category: 'Snacks' },
  
  // Beverages
  { id: 6, name: 'Pepsi', nameHi: 'पेप्सी', price: 40, image: pepsiImg, tag: '1L', tagHi: '1 लीटर', category: 'Beverages' },
  { id: 7, name: 'Coca Cola', nameHi: 'कोका कोला', price: 40, image: cocaColaImg, tag: '1L', tagHi: '1 लीटर', category: 'Beverages' },
  { id: 8, name: 'Real Fruit Juice', nameHi: 'रियल फ्रूट जूस', price: 85, image: realJuiceImg, tag: '1L', tagHi: '1 लीटर', category: 'Beverages' },
  { id: 9, name: 'Tata Tea Gold', nameHi: 'टाटा टी गोल्ड', price: 250, image: tataTeaImg, tag: '500g', tagHi: '500 ग्राम', category: 'Beverages' },
  
  // Dairy
  { id: 10, name: 'Amul Milk', nameHi: 'अमूल दूध', price: 60, image: amulMilkImg, tag: '1L', tagHi: '1 लीटर', category: 'Dairy' },
  { id: 11, name: 'Amul Butter', nameHi: 'अमूल मक्खन', price: 55, image: amulButterImg, tag: '100g', tagHi: '100 ग्राम', category: 'Dairy' },
  { id: 12, name: 'Mother Dairy Curd', nameHi: 'मदर डेयरी दही', price: 30, image: motherDairyImg, tag: '400g', tagHi: '400 ग्राम', category: 'Dairy' },
  
  // Bakery
  { id: 13, name: 'Britannia Bread', nameHi: 'ब्रिटानिया ब्रेड', price: 35, image: britanniaBreadImg, tag: '400g', tagHi: '400 ग्राम', category: 'Bakery' },
  
  // Staples
  { id: 14, name: 'India Gate Basmati', nameHi: 'इंडिया गेट बासमती', price: 350, image: indiaGateRiceImg, tag: '5kg', tagHi: '5 किलो', category: 'Staples' },
  { id: 15, name: 'Fortune Sunlite Oil', nameHi: 'फॉर्च्यून सनलाइट तेल', price: 180, image: fortuneOilImg, tag: '1L', tagHi: '1 लीटर', category: 'Staples' },
  { id: 16, name: 'Tata Salt', nameHi: 'टाटा नमक', price: 22, image: tataSaltImg, tag: '1kg', tagHi: '1 किलो', category: 'Staples' },
  { id: 17, name: 'Maggi Noodles', nameHi: 'मैगी नूडल्स', price: 12, image: maggiImg, tag: '70g', tagHi: '70 ग्राम', category: 'Staples' },
  { id: 18, name: 'Maggi Ketchup', nameHi: 'मैगी केचप', price: 85, image: maggiKetchupImg, tag: '500g', tagHi: '500 ग्राम', category: 'Staples' },
  { id: 19, name: 'Everest Turmeric', nameHi: 'एवरेस्ट हल्दी', price: 45, image: everestTurmericImg, tag: '100g', tagHi: '100 ग्राम', category: 'Staples' },
  
  // Vegetables
  { id: 20, name: 'Fresh Tomatoes', nameHi: 'ताजा टमाटर', price: 40, image: tomatoesImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 21, name: 'Red Onions', nameHi: 'लाल प्याज', price: 35, image: onionsImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 22, name: 'Fresh Carrots', nameHi: 'ताजा गाजर', price: 45, image: carrotsImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 23, name: 'Bell Peppers', nameHi: 'शिमला मिर्च', price: 80, image: peppersImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 24, name: 'Fresh Spinach', nameHi: 'ताजा पालक', price: 30, image: spinachImg, tag: 'bunch', tagHi: 'गट्ठा', category: 'Vegetables' },
  { id: 25, name: 'Potatoes', nameHi: 'आलू', price: 25, image: potatoesImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  
  // Fruits
  { id: 26, name: 'Green Apples', nameHi: 'हरे सेब', price: 120, image: applesImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Fruits' },
  { id: 27, name: 'Fresh Bananas', nameHi: 'ताजा केले', price: 50, image: bananasImg, tag: 'dozen', tagHi: 'दर्जन', category: 'Fruits' },
  
  // Household
  { id: 28, name: 'Vim Dishwash Gel', nameHi: 'विम बर्तन धोने जेल', price: 120, image: vimDishwashImg, tag: '500ml', tagHi: '500 मिली', category: 'Household' },
];

const KisanMart = () => {
  const { t, language } = useLanguage();
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const addToCart = (productId: number, productName: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    toast.success(language === 'en' ? `${productName} added to cart` : `${productName} कार्ट में जोड़ा गया`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getCartItems = () => {
    return Object.entries(cart).map(([id, quantity]) => {
      const product = products.find(p => p.id === Number(id))!;
      return {
        id: product.id,
        name: product.name,
        nameHi: product.nameHi,
        price: product.price,
        quantity,
        image: product.image,
      };
    });
  };

  const handleUpdateCartQuantity = (id: number, change: number) => {
    if (change > 0) {
      const product = products.find(p => p.id === id);
      if (product) {
        addToCart(id, product.name);
      }
    } else {
      removeFromCart(id);
    }
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
    toast.info(language === 'en' ? 'Item removed from cart' : 'आइटम कार्ट से हटाया गया');
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navigation />
      
      {/* Fixed Header */}
      <div className="fixed top-[73px] left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Zap className="h-6 w-6 text-secondary" />
                {t('kisanMartTitle')}
              </h1>
              <p className="text-sm text-muted-foreground">Delivery in 10-15 mins</p>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative glass rounded-2xl px-4 py-3 flex items-center gap-2 hover:bg-primary/10 transition-all"
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">{getCartCount()}</span>
              {getCartCount() > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                  {getCartCount()}
                </div>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search groceries...' : 'किराना खोजें...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass rounded-2xl pl-12 pr-4 py-3 border-primary/20 focus:border-primary/40 outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass text-foreground hover:bg-primary/10'
              }`}
            >
              {language === 'en' ? 'All' : 'सभी'}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? 'bg-primary text-primary-foreground'
                    : 'glass text-foreground hover:bg-primary/10'
                }`}
              >
                <span>{category.emoji}</span>
                <span>{language === 'en' ? category.name : category.nameHi}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid - Mobile App Style */}
      <div className="pt-[280px] px-4 container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="aspect-square bg-white p-4 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-primary-foreground">
                  {language === 'en' ? product.tag : product.tagHi}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm mb-1 text-foreground line-clamp-2">
                  {language === 'en' ? product.name : product.nameHi}
                </h3>
                <div className="text-lg font-bold text-primary mb-3">₹{product.price}</div>
                
                {cart[product.id] ? (
                  <div className="flex items-center justify-between glass rounded-xl p-2">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary font-bold transition-all"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-foreground">{cart[product.id]}</span>
                    <button
                      onClick={() => addToCart(product.id, language === 'en' ? product.name : product.nameHi)}
                      className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground font-bold transition-all"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product.id, language === 'en' ? product.name : product.nameHi)}
                    className="w-full gradient-primary text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {language === 'en' ? 'Add' : 'जोड़ें'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              {language === 'en' ? 'No products found' : 'कोई उत्पाद नहीं मिला'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'en' ? 'Try adjusting your search or filters' : 'अपनी खोज या फ़िल्टर समायोजित करें'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="gradient-secondary text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
          >
            <ShoppingCart className="h-6 w-6" />
            {language === 'en' 
              ? `View Cart (${getCartCount()} items)` 
              : `कार्ट देखें (${getCartCount()} आइटम)`}
          </button>
        </div>
      )}

      {/* Cart Sheet */}
      <CartSheet
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        cartItems={getCartItems()}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
      />
    </div>
  );
};

export default KisanMart;
