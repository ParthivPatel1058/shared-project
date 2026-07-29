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
/* Newly stocked lines */
import cabbageImg from '@/assets/cabbage.jpg';
import cauliflowerImg from '@/assets/cauliflower.jpg';
import cucumberImg from '@/assets/cucumber.jpg';
import eggplantImg from '@/assets/eggplant.jpg';
import okraImg from '@/assets/okra.jpg';
import radishImg from '@/assets/radish.jpg';
import eggsImg from '@/assets/eggs.jpg';
import cheeseImg from '@/assets/cheese.jpg';
import yogurtImg from '@/assets/yogurt.jpg';
import milkImg from '@/assets/milk.jpg';
import breadImg from '@/assets/bread.jpg';
import cookiesImg from '@/assets/cookies.jpg';
import chipsImg from '@/assets/chips.jpg';
import sodaImg from '@/assets/soda.jpg';
import juiceImg from '@/assets/juice.jpg';
import teaImg from '@/assets/tea.jpg';
import riceImg from '@/assets/rice.jpg';
import oilImg from '@/assets/oil.jpg';

export interface MartProduct {
  id: number;
  name: string;
  nameHi: string;
  price: number;
  image: string;
  tag: string;
  tagHi: string;
  category: string;
}

export const MART_CATEGORIES = [
  { id: 1, name: 'Vegetables', nameHi: 'सब्जियां', emoji: '🥬' },
  { id: 2, name: 'Fruits', nameHi: 'फल', emoji: '🍎' },
  { id: 3, name: 'Dairy', nameHi: 'डेयरी', emoji: '🥛' },
  { id: 4, name: 'Snacks', nameHi: 'स्नैक्स', emoji: '🍪' },
  { id: 5, name: 'Beverages', nameHi: 'पेय पदार्थ', emoji: '🥤' },
  { id: 6, name: 'Bakery', nameHi: 'बेकरी', emoji: '🍞' },
  { id: 7, name: 'Staples', nameHi: 'मुख्य खाद्य', emoji: '🌾' },
  { id: 8, name: 'Household', nameHi: 'घरेलू सामान', emoji: '🧹' },
];

export const MART_PRODUCTS: MartProduct[] = [
  // Snacks
  { id: 1, name: 'Lays Classic Salted', nameHi: 'लेज़ क्लासिक नमकीन', price: 20, image: laysImg, tag: '50g', tagHi: '50 ग्राम', category: 'Snacks' },
  { id: 2, name: 'Kurkure Masala Munch', nameHi: 'कुरकुरे मसाला मंच', price: 20, image: kurkureImg, tag: '82g', tagHi: '82 ग्राम', category: 'Snacks' },
  { id: 3, name: 'Haldiram Bhujia', nameHi: 'हल्दीराम भुजिया', price: 45, image: haldiramImg, tag: '200g', tagHi: '200 ग्राम', category: 'Snacks' },
  { id: 4, name: 'Britannia Good Day', nameHi: 'ब्रिटानिया गुड डे', price: 35, image: britanniaImg, tag: '100g', tagHi: '100 ग्राम', category: 'Snacks' },
  { id: 5, name: 'Parle-G Biscuits', nameHi: 'पारले-जी बिस्किट', price: 10, image: parleGImg, tag: '75g', tagHi: '75 ग्राम', category: 'Snacks' },
  { id: 29, name: 'Salted Potato Chips', nameHi: 'नमकीन आलू चिप्स', price: 30, image: chipsImg, tag: '90g', tagHi: '90 ग्राम', category: 'Snacks' },
  { id: 30, name: 'Butter Cookies', nameHi: 'बटर कुकीज़', price: 55, image: cookiesImg, tag: '150g', tagHi: '150 ग्राम', category: 'Snacks' },

  // Beverages
  { id: 6, name: 'Pepsi', nameHi: 'पेप्सी', price: 40, image: pepsiImg, tag: '1L', tagHi: '1 लीटर', category: 'Beverages' },
  { id: 7, name: 'Coca Cola', nameHi: 'कोका कोला', price: 40, image: cocaColaImg, tag: '1L', tagHi: '1 लीटर', category: 'Beverages' },
  { id: 8, name: 'Real Fruit Juice', nameHi: 'रियल फ्रूट जूस', price: 85, image: realJuiceImg, tag: '1L', tagHi: '1 लीटर', category: 'Beverages' },
  { id: 9, name: 'Tata Tea Gold', nameHi: 'टाटा टी गोल्ड', price: 250, image: tataTeaImg, tag: '500g', tagHi: '500 ग्राम', category: 'Beverages' },
  { id: 31, name: 'Mixed Fruit Juice', nameHi: 'मिक्स फ्रूट जूस', price: 70, image: juiceImg, tag: '1L', tagHi: '1 लीटर', category: 'Beverages' },
  { id: 32, name: 'Lemon Soda', nameHi: 'नींबू सोडा', price: 25, image: sodaImg, tag: '750ml', tagHi: '750 मिली', category: 'Beverages' },
  { id: 33, name: 'Loose Leaf Tea', nameHi: 'खुली पत्ती चाय', price: 180, image: teaImg, tag: '250g', tagHi: '250 ग्राम', category: 'Beverages' },

  // Dairy
  { id: 10, name: 'Amul Milk', nameHi: 'अमूल दूध', price: 60, image: amulMilkImg, tag: '1L', tagHi: '1 लीटर', category: 'Dairy' },
  { id: 11, name: 'Amul Butter', nameHi: 'अमूल मक्खन', price: 55, image: amulButterImg, tag: '100g', tagHi: '100 ग्राम', category: 'Dairy' },
  { id: 12, name: 'Mother Dairy Curd', nameHi: 'मदर डेयरी दही', price: 30, image: motherDairyImg, tag: '400g', tagHi: '400 ग्राम', category: 'Dairy' },
  { id: 34, name: 'Fresh Toned Milk', nameHi: 'ताजा टोंड दूध', price: 54, image: milkImg, tag: '1L', tagHi: '1 लीटर', category: 'Dairy' },
  { id: 35, name: 'Processed Cheese', nameHi: 'प्रोसेस्ड चीज़', price: 125, image: cheeseImg, tag: '200g', tagHi: '200 ग्राम', category: 'Dairy' },
  { id: 36, name: 'Fresh Yogurt', nameHi: 'ताजा दही', price: 40, image: yogurtImg, tag: '400g', tagHi: '400 ग्राम', category: 'Dairy' },
  { id: 37, name: 'Farm Eggs', nameHi: 'फार्म अंडे', price: 84, image: eggsImg, tag: '12 pcs', tagHi: '12 नग', category: 'Dairy' },

  // Bakery
  { id: 13, name: 'Britannia Bread', nameHi: 'ब्रिटानिया ब्रेड', price: 35, image: britanniaBreadImg, tag: '400g', tagHi: '400 ग्राम', category: 'Bakery' },
  { id: 38, name: 'Whole Wheat Bread', nameHi: 'गेहूं ब्रेड', price: 45, image: breadImg, tag: '400g', tagHi: '400 ग्राम', category: 'Bakery' },

  // Staples
  { id: 14, name: 'India Gate Basmati', nameHi: 'इंडिया गेट बासमती', price: 350, image: indiaGateRiceImg, tag: '5kg', tagHi: '5 किलो', category: 'Staples' },
  { id: 15, name: 'Fortune Sunlite Oil', nameHi: 'फॉर्च्यून सनलाइट तेल', price: 180, image: fortuneOilImg, tag: '1L', tagHi: '1 लीटर', category: 'Staples' },
  { id: 16, name: 'Tata Salt', nameHi: 'टाटा नमक', price: 22, image: tataSaltImg, tag: '1kg', tagHi: '1 किलो', category: 'Staples' },
  { id: 17, name: 'Maggi Noodles', nameHi: 'मैगी नूडल्स', price: 12, image: maggiImg, tag: '70g', tagHi: '70 ग्राम', category: 'Staples' },
  { id: 18, name: 'Maggi Ketchup', nameHi: 'मैगी केचप', price: 85, image: maggiKetchupImg, tag: '500g', tagHi: '500 ग्राम', category: 'Staples' },
  { id: 19, name: 'Everest Turmeric', nameHi: 'एवरेस्ट हल्दी', price: 45, image: everestTurmericImg, tag: '100g', tagHi: '100 ग्राम', category: 'Staples' },
  { id: 39, name: 'Sona Masoori Rice', nameHi: 'सोना मसूरी चावल', price: 260, image: riceImg, tag: '5kg', tagHi: '5 किलो', category: 'Staples' },
  { id: 40, name: 'Mustard Cooking Oil', nameHi: 'सरसों तेल', price: 165, image: oilImg, tag: '1L', tagHi: '1 लीटर', category: 'Staples' },

  // Vegetables
  { id: 20, name: 'Fresh Tomatoes', nameHi: 'ताजा टमाटर', price: 40, image: tomatoesImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 21, name: 'Red Onions', nameHi: 'लाल प्याज', price: 35, image: onionsImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 22, name: 'Fresh Carrots', nameHi: 'ताजा गाजर', price: 45, image: carrotsImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 23, name: 'Bell Peppers', nameHi: 'शिमला मिर्च', price: 80, image: peppersImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 24, name: 'Fresh Spinach', nameHi: 'ताजा पालक', price: 30, image: spinachImg, tag: 'bunch', tagHi: 'गट्ठा', category: 'Vegetables' },
  { id: 25, name: 'Potatoes', nameHi: 'आलू', price: 25, image: potatoesImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 41, name: 'Cabbage', nameHi: 'पत्ता गोभी', price: 30, image: cabbageImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 42, name: 'Cauliflower', nameHi: 'फूल गोभी', price: 40, image: cauliflowerImg, tag: 'per pc', tagHi: 'प्रति नग', category: 'Vegetables' },
  { id: 43, name: 'Cucumber', nameHi: 'खीरा', price: 28, image: cucumberImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 44, name: 'Brinjal', nameHi: 'बैंगन', price: 35, image: eggplantImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 45, name: 'Lady Finger (Okra)', nameHi: 'भिंडी', price: 48, image: okraImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },
  { id: 46, name: 'Radish', nameHi: 'मूली', price: 22, image: radishImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Vegetables' },

  // Fruits
  { id: 26, name: 'Green Apples', nameHi: 'हरे सेब', price: 120, image: applesImg, tag: 'per kg', tagHi: 'प्रति किलो', category: 'Fruits' },
  { id: 27, name: 'Fresh Bananas', nameHi: 'ताजा केले', price: 50, image: bananasImg, tag: 'dozen', tagHi: 'दर्जन', category: 'Fruits' },

  // Household
  { id: 28, name: 'Vim Dishwash Gel', nameHi: 'विम बर्तन धोने जेल', price: 120, image: vimDishwashImg, tag: '500ml', tagHi: '500 मिली', category: 'Household' },
];
