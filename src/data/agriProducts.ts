/**
 * Agri Market catalog.
 *
 * Kept in its own module rather than exported from the page component: the
 * shared image/unit resolver in `data/catalog.ts` needs this list, and importing
 * it from the page created a cycle
 * (catalog -> AgriMarket -> CartDrawer -> catalog) which crashed the app at
 * startup with "Cannot access 'AGRI_PRODUCTS' before initialization".
 */
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

export interface Product {
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

export const AGRI_PRODUCTS: Product[] = [
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
