import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf, Package, ShoppingBag, BookOpen } from 'lucide-react';
import organicWheatSeeds from '@/assets/organic-wheat-seeds.jpg';
import organicPaddySeeds from '@/assets/organic-paddy-seeds.jpg';
import organicVegetableSeeds from '@/assets/organic-vegetable-seeds.jpg';
import organicMaizeSeeds from '@/assets/organic-maize-seeds.jpg';
import vermicompost from '@/assets/vermicompost.jpg';
import neemCake from '@/assets/neem-cake.jpg';
import boneMeal from '@/assets/bone-meal.jpg';
import cowDungManure from '@/assets/cow-dung-manure.jpg';
import compost from '@/assets/compost.jpg';
import greenManure from '@/assets/green-manure.jpg';
import neemOil from '@/assets/neem-oil.jpg';
import panchagavya from '@/assets/panchagavya.jpg';
import garlicExtract from '@/assets/garlic-extract.jpg';
import tobaccoDecoction from '@/assets/tobacco-decoction.jpg';
import manualWeeder from '@/assets/manual-weeder.jpg';
import organicSprayer from '@/assets/organic-sprayer.jpg';
import compostMaker from '@/assets/compost-maker.jpg';
import mulchSpreader from '@/assets/mulch-spreader.jpg';
const OrganicFarming = () => {
  const {
    t
  } = useLanguage();
  const organicProducts = [{
    category: 'Organic Seeds',
    icon: Package,
    items: [{
      name: 'Organic Wheat Seeds',
      price: '₹80/kg',
      description: 'Certified organic wheat seeds, high yield',
      image: organicWheatSeeds
    }, {
      name: 'Organic Paddy Seeds',
      price: '₹120/kg',
      description: 'Chemical-free paddy seeds',
      image: organicPaddySeeds
    }, {
      name: 'Organic Vegetable Seeds Mix',
      price: '₹200/pack',
      description: 'Assorted organic vegetable seeds',
      image: organicVegetableSeeds
    }, {
      name: 'Organic Maize Seeds',
      price: '₹90/kg',
      description: 'Non-GMO organic maize',
      image: organicMaizeSeeds
    }]
  }, {
    category: 'Organic Fertilizers',
    icon: Leaf,
    items: [{
      name: 'Vermicompost',
      price: '₹15/kg',
      description: 'Rich in nutrients, improves soil health',
      image: vermicompost
    }, {
      name: 'Neem Cake',
      price: '₹40/kg',
      description: 'Natural pest control and fertilizer',
      image: neemCake
    }, {
      name: 'Bone Meal',
      price: '₹50/kg',
      description: 'High phosphorus organic fertilizer',
      image: boneMeal
    }, {
      name: 'Cow Dung Manure',
      price: '₹8/kg',
      description: 'Traditional organic manure',
      image: cowDungManure
    }, {
      name: 'Compost',
      price: '₹12/kg',
      description: 'Decomposed organic matter',
      image: compost
    }, {
      name: 'Green Manure',
      price: '₹25/kg',
      description: 'Plant-based organic fertilizer',
      image: greenManure
    }]
  }, {
    category: 'Organic Pest Control',
    icon: ShoppingBag,
    items: [{
      name: 'Neem Oil',
      price: '₹350/liter',
      description: 'Natural pesticide and fungicide',
      image: neemOil
    }, {
      name: 'Panchagavya',
      price: '₹200/liter',
      description: 'Traditional organic growth promoter',
      image: panchagavya
    }, {
      name: 'Garlic Extract',
      price: '₹180/liter',
      description: 'Natural pest repellent',
      image: garlicExtract
    }, {
      name: 'Tobacco Decoction',
      price: '₹150/liter',
      description: 'Organic insecticide',
      image: tobaccoDecoction
    }]
  }, {
    category: 'Organic Tools',
    icon: BookOpen,
    items: [{
      name: 'Manual Weeder',
      price: '₹450',
      description: 'Chemical-free weed removal',
      image: manualWeeder
    }, {
      name: 'Organic Sprayer',
      price: '₹1,200',
      description: 'For applying organic pesticides',
      image: organicSprayer
    }, {
      name: 'Compost Maker',
      price: '₹3,500',
      description: 'DIY composting system',
      image: compostMaker
    }, {
      name: 'Mulch Spreader',
      price: '₹2,800',
      description: 'Organic mulch application',
      image: mulchSpreader
    }]
  }];
  const benefits = ['No synthetic chemicals or pesticides', 'Improves soil health naturally', 'Better nutrition and taste', 'Environmentally sustainable', 'Higher market value', 'Safe for farmers and consumers'];
  return <div className="min-h-screen">
      <Navigation />

      <div className="px-4 lg:px-6 pt-5">
        <BackButton />
      </div>
      
      <div className="pt-8 pb-12 px-4 container mx-auto">
        <div className="text-center mb-12">
          
          
        </div>

        {/* Benefits Section */}
        <div className="glass rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Benefits of Organic Farming</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-3 glass rounded-xl p-4">
                <Leaf className="h-6 w-6 text-primary flex-shrink-0" />
                <p className="text-foreground">{benefit}</p>
              </div>)}
          </div>
        </div>

        {/* Products Categories */}
        {organicProducts.map((category, idx) => {
        const IconComponent = category.icon;
        return <div key={idx} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <IconComponent className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">{category.category}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIdx) => <div key={itemIdx} className="glass rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:scale-105 animate-slide-up">
                    <div className="h-48 overflow-hidden rounded-t-[2rem]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-2xl font-bold text-primary mb-3">{item.price}</p>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>;
      })}

        {/* Certification Info */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Organic Certification</h2>
          <div className="space-y-4">
            <p className="text-foreground">
              <strong>NPOP (National Programme for Organic Production):</strong> Official organic certification by Government of India
            </p>
            <p className="text-foreground">
              <strong>Contact for Certification:</strong> Agricultural and Processed Food Products Export Development Authority (APEDA)
            </p>
            <p className="text-foreground">
              <strong>Website:</strong> <a href="https://apeda.gov.in" className="text-primary hover:underline">apeda.gov.in</a>
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default OrganicFarming;