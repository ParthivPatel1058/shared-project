import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf, Droplets, Sun, Wrench } from 'lucide-react';
import tomatoesImg from '@/assets/tomatoes.jpg';
import potatoesImg from '@/assets/potatoes.jpg';
import onionsImg from '@/assets/onions.jpg';
import cauliflowerImg from '@/assets/cauliflower.jpg';
import cabbageImg from '@/assets/cabbage.jpg';
import eggplantImg from '@/assets/eggplant.jpg';
import okraImg from '@/assets/okra.jpg';
import spinachImg from '@/assets/spinach.jpg';
import carrotsImg from '@/assets/carrots.jpg';
import peppersImg from '@/assets/peppers.jpg';
import cucumberImg from '@/assets/cucumber.jpg';
import radishImg from '@/assets/radish.jpg';
const VegetableFarming = () => {
  const {
    t
  } = useLanguage();
  const vegetables = [{
    name: 'Tomato',
    season: 'Kharif & Rabi',
    duration: '60-80 days',
    method: 'Transplanting',
    seeds: '200-250g/acre',
    tools: ['Trowel', 'Pruning shears', 'Stakes'],
    water: 'Regular watering, drip irrigation recommended',
    spacing: '60x45 cm',
    image: tomatoesImg
  }, {
    name: 'Potato',
    season: 'Rabi',
    duration: '90-120 days',
    method: 'Tuber planting',
    seeds: '15-20 quintals/acre',
    tools: ['Potato planter', 'Ridger', 'Harvester'],
    water: 'Moderate, avoid waterlogging',
    spacing: '60x20 cm',
    image: potatoesImg
  }, {
    name: 'Onion',
    season: 'Rabi',
    duration: '120-150 days',
    method: 'Transplanting',
    seeds: '8-10 kg/acre',
    tools: ['Seed drill', 'Weeder', 'Bulb harvester'],
    water: 'Regular light irrigation',
    spacing: '15x10 cm',
    image: onionsImg
  }, {
    name: 'Cabbage',
    season: 'Rabi',
    duration: '70-120 days',
    method: 'Transplanting',
    seeds: '250-300g/acre',
    tools: ['Transplanter', 'Cultivator'],
    water: 'Frequent irrigation',
    spacing: '45x45 cm',
    image: cabbageImg
  }, {
    name: 'Cauliflower',
    season: 'Rabi',
    duration: '70-100 days',
    method: 'Transplanting',
    seeds: '250-300g/acre',
    tools: ['Transplanter', 'Hand hoe'],
    water: 'Regular irrigation',
    spacing: '45x45 cm',
    image: cauliflowerImg
  }, {
    name: 'Brinjal (Eggplant)',
    season: 'Year-round',
    duration: '120-140 days',
    method: 'Transplanting',
    seeds: '200g/acre',
    tools: ['Stakes', 'Pruning shears'],
    water: 'Regular, avoid water stress',
    spacing: '60x60 cm',
    image: eggplantImg
  }, {
    name: 'Okra (Bhindi)',
    season: 'Kharif & Summer',
    duration: '50-60 days',
    method: 'Direct seeding',
    seeds: '4-5 kg/acre',
    tools: ['Seed drill', 'Weeder'],
    water: 'Regular watering',
    spacing: '30x15 cm',
    image: okraImg
  }, {
    name: 'Carrot',
    season: 'Rabi',
    duration: '90-120 days',
    method: 'Direct seeding',
    seeds: '4-5 kg/acre',
    tools: ['Seed drill', 'Harvester'],
    water: 'Moderate, consistent',
    spacing: '20x5 cm',
    image: carrotsImg
  }, {
    name: 'Cucumber',
    season: 'Summer',
    duration: '50-70 days',
    method: 'Direct seeding',
    seeds: '2-3 kg/acre',
    tools: ['Trellis', 'Drip system'],
    water: 'Frequent irrigation',
    spacing: '100x60 cm',
    image: cucumberImg
  }, {
    name: 'Spinach',
    season: 'Winter',
    duration: '40-50 days',
    method: 'Direct seeding',
    seeds: '8-10 kg/acre',
    tools: ['Seed drill', 'Hand harvester'],
    water: 'Light, frequent',
    spacing: '20x5 cm',
    image: spinachImg
  }, {
    name: 'Radish',
    season: 'Winter',
    duration: '30-40 days',
    method: 'Direct seeding',
    seeds: '8-10 kg/acre',
    tools: ['Seed drill'],
    water: 'Regular irrigation',
    spacing: '20x5 cm',
    image: radishImg
  }, {
    name: 'Bell Pepper',
    season: 'Summer',
    duration: '90-120 days',
    method: 'Transplanting',
    seeds: '2-3 kg/acre',
    tools: ['Stakes', 'Mulcher'],
    water: 'Moderate irrigation',
    spacing: '60x45 cm',
    image: peppersImg
  }];
  const commonTools = [{
    name: 'Hand Trowel',
    price: '₹150',
    use: 'Planting, weeding'
  }, {
    name: 'Garden Fork',
    price: '₹400',
    use: 'Soil preparation'
  }, {
    name: 'Pruning Shears',
    price: '₹350',
    use: 'Trimming plants'
  }, {
    name: 'Watering Can',
    price: '₹250',
    use: 'Manual watering'
  }, {
    name: 'Drip Irrigation Kit',
    price: '₹5,000/acre',
    use: 'Automated irrigation'
  }, {
    name: 'Sprinkler System',
    price: '₹8,000/acre',
    use: 'Overhead irrigation'
  }, {
    name: 'Rotavator',
    price: '₹75,000',
    use: 'Soil preparation'
  }, {
    name: 'Vegetable Transplanter',
    price: '₹1,20,000',
    use: 'Mechanized transplanting'
  }];
  return <div className="min-h-screen">
      <Navigation />

      <div className="px-4 lg:px-6 pt-5">
        <BackButton />
      </div>
      
      <div className="pt-8 pb-12 px-4 container mx-auto">
        <div className="text-center mb-12">
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete information on all types of vegetables, farming methods, and tools used
          </p>
        </div>

        {/* Vegetables Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {vegetables.map((veg, idx) => <div key={idx} className="glass rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:scale-105 animate-slide-up">
              <div className="h-48 overflow-hidden rounded-t-[2rem]">
                <img src={veg.image} alt={veg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-4">{veg.name}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Sun className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Season</p>
                      <p className="text-foreground font-semibold">{veg.season}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Leaf className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration & Method</p>
                      <p className="text-foreground">{veg.duration}</p>
                      <p className="text-foreground">{veg.method}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Droplets className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Water Requirements</p>
                      <p className="text-foreground text-sm">{veg.water}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Seeds Required</p>
                    <p className="text-foreground font-semibold">{veg.seeds}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Spacing</p>
                    <p className="text-foreground font-semibold">{veg.spacing}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tools Needed</p>
                    <div className="flex flex-wrap gap-2">
                      {veg.tools.map((tool, toolIdx) => <span key={toolIdx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {tool}
                        </span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>)}
        </div>

        {/* Common Tools Section */}
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Common Tools for Vegetable Farming</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {commonTools.map((tool, idx) => <div key={idx} className="glass rounded-xl p-4">
                <h3 className="text-lg font-bold text-foreground mb-2">{tool.name}</h3>
                <p className="text-xl font-bold text-primary mb-2">{tool.price}</p>
                <p className="text-sm text-muted-foreground">{tool.use}</p>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default VegetableFarming;