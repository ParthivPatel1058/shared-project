import moneyPlant from '@/assets/plants/money-plant.jpg';
import snakePlant from '@/assets/plants/snake-plant.jpg';
import peaceLily from '@/assets/plants/peace-lily.jpg';
import jadePlant from '@/assets/plants/jade-plant.jpg';
import arecaPalm from '@/assets/plants/areca-palm.jpg';
import spiderPlant from '@/assets/plants/spider-plant.jpg';
import rubberPlant from '@/assets/plants/rubber-plant.jpg';
import zzPlant from '@/assets/plants/zz-plant.jpg';
import monstera from '@/assets/plants/monstera.jpg';
import luckyBamboo from '@/assets/plants/lucky-bamboo.jpg';
import aloeVera from '@/assets/plants/aloe-vera.jpg';
import tulsi from '@/assets/plants/tulsi.jpg';
import mint from '@/assets/plants/mint.jpg';
import curryLeaf from '@/assets/plants/curry-leaf.jpg';
import lemongrass from '@/assets/plants/lemongrass.jpg';
import coriander from '@/assets/plants/coriander.jpg';
import ashwagandha from '@/assets/plants/ashwagandha.jpg';
import stevia from '@/assets/plants/stevia.jpg';
import rosemary from '@/assets/plants/rosemary.jpg';
import giloy from '@/assets/plants/giloy.jpg';
import hibiscus from '@/assets/plants/hibiscus.jpg';

/**
 * Plants offered through nearby partner nurseries.
 *
 * Photographs come from Wikimedia Commons, each under a free licence with the
 * photographer recorded below. Commercial nursery product shots are
 * copyrighted, and lifting them into a public app is a real legal exposure —
 * `credit` exists so the CC-BY family's attribution requirement is actually
 * met rather than quietly ignored.
 */
export type PlantCategory = 'indoor' | 'herb' | 'medicinal' | 'flowering';

export interface Plant {
  id: number;
  name: string;
  hindiName: string;
  category: PlantCategory;
  /** One line on why someone would want it at home. */
  blurb: string;
  blurbHi: string;
  price: number;
  unit: string;
  partner: string;
  distanceKm: number;
  rating: number;
  image: string;
  /** Photographer and licence — displayed, not decorative. */
  credit: string;
}

export const PLANT_CATEGORIES: Array<{ key: PlantCategory | 'all'; en: string; hi: string }> = [
  { key: 'all', en: 'All plants', hi: 'सभी पौधे' },
  { key: 'indoor', en: 'Indoor & decor', hi: 'इनडोर और सजावट' },
  { key: 'herb', en: 'Kitchen herbs', hi: 'रसोई की जड़ी-बूटी' },
  { key: 'medicinal', en: 'Medicinal', hi: 'औषधीय' },
  { key: 'flowering', en: 'Flowering', hi: 'फूल वाले' },
];

export const PLANTS: Plant[] = [
  {
    id: 1, name: 'Money Plant', hindiName: 'मनी प्लांट', category: 'indoor',
    blurb: 'Hardest indoor plant to kill — grows in a water bottle or soil.',
    blurbHi: 'सबसे आसान इनडोर पौधा — पानी की बोतल या मिट्टी दोनों में उगता है।',
    price: 149, unit: 'pot', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.7,
    image: moneyPlant, credit: 'Mokkie · CC BY-SA 3.0 · Wikimedia Commons',
  },
  {
    id: 2, name: 'Snake Plant', hindiName: 'स्नेक प्लांट', category: 'indoor',
    blurb: 'Releases oxygen at night. Needs water roughly once a fortnight.',
    blurbHi: 'रात में ऑक्सीजन देता है। लगभग पंद्रह दिन में एक बार पानी।',
    price: 299, unit: 'pot', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.8,
    image: snakePlant, credit: 'Richard Fuller · CC0 · Wikimedia Commons',
  },
  {
    id: 3, name: 'Peace Lily', hindiName: 'पीस लिली', category: 'indoor',
    blurb: 'White blooms indoors, and it droops visibly when it wants water.',
    blurbHi: 'घर के अंदर सफेद फूल, और पानी चाहिए तो पत्तियां झुक जाती हैं।',
    price: 349, unit: 'pot', partner: 'Vasudha Organics', distanceKm: 5.8, rating: 4.6,
    image: peaceLily, credit: 'Mokkie · CC BY 2.0 · Wikimedia Commons',
  },
  {
    id: 4, name: 'Jade Plant', hindiName: 'जेड प्लांट', category: 'indoor',
    blurb: 'Thick succulent leaves. Considered lucky, and forgives neglect.',
    blurbHi: 'मोटी रसीली पत्तियां। शुभ माना जाता है, कम देखभाल में चलता है।',
    price: 249, unit: 'pot', partner: 'Shakti Agro Farm', distanceKm: 3.1, rating: 4.5,
    image: jadePlant, credit: 'Public domain · Wikimedia Commons',
  },
  {
    id: 5, name: 'Areca Palm', hindiName: 'एरिका पाम', category: 'indoor',
    blurb: 'Tall corner palm that filters indoor air and lifts a whole room.',
    blurbHi: 'कोने के लिए लंबा पाम, हवा साफ करता है और कमरा भर देता है।',
    price: 599, unit: 'plant', partner: 'Himalaya Herbs Co.', distanceKm: 8.2, rating: 4.4,
    image: arecaPalm, credit: 'CC0 · Wikimedia Commons',
  },
  {
    id: 6, name: 'Spider Plant', hindiName: 'स्पाइडर प्लांट', category: 'indoor',
    blurb: 'Grows baby plants you can pot separately and give away.',
    blurbHi: 'छोटे पौधे निकालता है जिन्हें अलग गमले में लगा सकते हैं।',
    price: 179, unit: 'pot', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.6,
    image: spiderPlant, credit: 'CC0 · Wikimedia Commons',
  },
  {
    id: 7, name: 'Rubber Plant', hindiName: 'रबर प्लांट', category: 'indoor',
    blurb: 'Broad glossy leaves. A single plant fills an empty corner.',
    blurbHi: 'चौड़ी चमकदार पत्तियां। एक ही पौधा खाली कोना भर देता है।',
    price: 449, unit: 'plant', partner: 'Vasudha Organics', distanceKm: 5.8, rating: 4.5,
    image: rubberPlant, credit: 'CC BY 4.0 · Wikimedia Commons',
  },
  {
    id: 8, name: 'ZZ Plant', hindiName: 'ज़ेडज़ेड प्लांट', category: 'indoor',
    blurb: 'Survives low light and missed watering — ideal for a busy home.',
    blurbHi: 'कम रोशनी और भूली हुई सिंचाई में भी टिकता है।',
    price: 399, unit: 'pot', partner: 'Shakti Agro Farm', distanceKm: 3.1, rating: 4.7,
    image: zzPlant, credit: 'CC0 · Wikimedia Commons',
  },
  {
    id: 9, name: 'Monstera', hindiName: 'मॉन्स्टेरा', category: 'indoor',
    blurb: 'Large split leaves — the statement plant for a living room.',
    blurbHi: 'बड़ी कटी हुई पत्तियां — बैठक के लिए आकर्षक पौधा।',
    price: 649, unit: 'plant', partner: 'Himalaya Herbs Co.', distanceKm: 8.2, rating: 4.6,
    image: monstera, credit: 'CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 10, name: 'Lucky Bamboo', hindiName: 'लकी बैम्बू', category: 'indoor',
    blurb: 'Grows in a glass of water. No soil, no mess, very little care.',
    blurbHi: 'पानी के गिलास में उगता है। न मिट्टी, न गंदगी।',
    price: 199, unit: 'stalk set', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.3,
    image: luckyBamboo, credit: 'CC BY 4.0 · Wikimedia Commons',
  },
  {
    id: 11, name: 'Aloe Vera', hindiName: 'एलोवेरा', category: 'medicinal',
    blurb: 'Cut a leaf for burns and skin. Needs sun and almost no water.',
    blurbHi: 'जलन और त्वचा के लिए पत्ती काटें। धूप चाहिए, पानी कम।',
    price: 129, unit: 'pot', partner: 'Vasudha Organics', distanceKm: 5.8, rating: 4.8,
    image: aloeVera, credit: 'CC BY-SA 3.0 · Wikimedia Commons',
  },
  {
    id: 12, name: 'Tulsi', hindiName: 'तुलसी', category: 'medicinal',
    blurb: 'Daily-use leaves for tea and cough. Kept at the door in most homes.',
    blurbHi: 'चाय और खांसी के लिए रोज़ की पत्तियां। अधिकतर घरों में द्वार पर।',
    price: 99, unit: 'pot', partner: 'Shakti Agro Farm', distanceKm: 3.1, rating: 4.9,
    image: tulsi, credit: 'Vaikoovery · CC BY 3.0 · Wikimedia Commons',
  },
  {
    id: 13, name: 'Mint', hindiName: 'पुदीना', category: 'herb',
    blurb: 'Chutney and tea from your own balcony. Spreads fast in a wide pot.',
    blurbHi: 'अपनी बालकनी से चटनी और चाय। चौड़े गमले में तेज़ी से फैलता है।',
    price: 79, unit: 'bundle', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.7,
    image: mint, credit: 'Public domain · Wikimedia Commons',
  },
  {
    id: 14, name: 'Curry Leaf', hindiName: 'करी पत्ता', category: 'herb',
    blurb: 'Fresh curry leaves on demand — far better than the dried packet.',
    blurbHi: 'ज़रूरत पर ताज़े करी पत्ते — सूखे पैकेट से कहीं बेहतर।',
    price: 189, unit: 'plant', partner: 'Shakti Agro Farm', distanceKm: 3.1, rating: 4.6,
    image: curryLeaf, credit: 'CC BY 4.0 · Wikimedia Commons',
  },
  {
    id: 15, name: 'Lemongrass', hindiName: 'लेमनग्रास', category: 'herb',
    blurb: 'Cut stalks for tea. Also keeps mosquitoes off a balcony.',
    blurbHi: 'चाय के लिए डंठल काटें। बालकनी से मच्छर भी दूर रखता है।',
    price: 119, unit: 'bundle', partner: 'Vasudha Organics', distanceKm: 5.8, rating: 4.4,
    image: lemongrass, credit: 'CC BY 2.0 · Wikimedia Commons',
  },
  {
    id: 16, name: 'Coriander', hindiName: 'धनिया', category: 'herb',
    blurb: 'Ready to cut in about a month. Regrows through the cool season.',
    blurbHi: 'लगभग एक महीने में कटाई। ठंड के मौसम भर दोबारा उगता है।',
    price: 59, unit: 'tray', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.5,
    image: coriander, credit: 'Public domain · Wikimedia Commons',
  },
  {
    id: 17, name: 'Ashwagandha', hindiName: 'अश्वगंधा', category: 'medicinal',
    blurb: 'Grown for its root. Standard subject in any pharmacognosy course.',
    blurbHi: 'जड़ के लिए उगाया जाता है। औषधि विज्ञान का प्रमुख विषय।',
    price: 229, unit: 'plant', partner: 'Himalaya Herbs Co.', distanceKm: 8.2, rating: 4.5,
    image: ashwagandha, credit: 'CC BY-SA 3.0 · Wikimedia Commons',
  },
  {
    id: 18, name: 'Stevia', hindiName: 'स्टीविया', category: 'medicinal',
    blurb: 'Leaves sweeten tea with no sugar. Useful in a diabetic household.',
    blurbHi: 'पत्तियां बिना चीनी चाय मीठी करती हैं। मधुमेह वाले घर में उपयोगी।',
    price: 199, unit: 'plant', partner: 'Vasudha Organics', distanceKm: 5.8, rating: 4.3,
    image: stevia, credit: 'CC BY-SA 3.0 · Wikimedia Commons',
  },
  {
    id: 19, name: 'Rosemary', hindiName: 'रोज़मेरी', category: 'herb',
    blurb: 'Woody kitchen herb that likes sun and dislikes being overwatered.',
    blurbHi: 'रसोई की लकड़ीदार जड़ी-बूटी। धूप पसंद, ज़्यादा पानी नहीं।',
    price: 249, unit: 'pot', partner: 'Himalaya Herbs Co.', distanceKm: 8.2, rating: 4.4,
    image: rosemary, credit: 'Public domain · Wikimedia Commons',
  },
  {
    id: 20, name: 'Giloy', hindiName: 'गिलोय', category: 'medicinal',
    blurb: 'Climbing vine used in traditional immunity preparations.',
    blurbHi: 'चढ़ने वाली बेल, पारंपरिक रोग-प्रतिरोधक नुस्खों में उपयोग।',
    price: 159, unit: 'plant', partner: 'Shakti Agro Farm', distanceKm: 3.1, rating: 4.4,
    image: giloy, credit: 'Public domain · Wikimedia Commons',
  },
  {
    id: 21, name: 'Hibiscus', hindiName: 'गुड़हल', category: 'flowering',
    blurb: 'Flowers most of the year. Petals also dry well for tea.',
    blurbHi: 'साल भर फूल देता है। पंखुड़ियां चाय के लिए भी सुखाई जाती हैं।',
    price: 179, unit: 'plant', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.6,
    image: hibiscus, credit: 'CC BY-SA 4.0 · Wikimedia Commons',
  },
];
