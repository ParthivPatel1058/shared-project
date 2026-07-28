import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Building2, MapPin } from 'lucide-react';
const GovSchemes = () => {
  const { language } = useLanguage();
  const en = language === 'en';
  const centralSchemes = [{
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: '₹6,000 annual income support to all farmer families in 3 equal installments',
    descriptionHi: 'सभी किसान परिवारों को 3 समान किस्तों में ₹6,000 वार्षिक आय सहायता',
    eligibility: 'All landholding farmers',
    eligibilityHi: 'सभी भूमिधारक किसान',
    link: 'https://pmkisan.gov.in/',
    benefits: '₹2,000 every 4 months directly to bank account',
    benefitsHi: 'हर 4 महीने में ₹2,000 सीधे बैंक खाते में'
  }, {
    name: 'Kisan Credit Card (KCC)',
    description: 'Provides adequate and timely credit support for agriculture needs',
    descriptionHi: 'कृषि आवश्यकताओं हेतु पर्याप्त और समय पर ऋण सहायता',
    eligibility: 'All farmers including tenant farmers, oral lessees, and sharecroppers',
    eligibilityHi: 'सभी किसान, जिनमें किरायेदार किसान और बटाईदार शामिल हैं',
    link: 'https://www.india.gov.in/spotlight/kisan-credit-card-kcc',
    benefits: 'Low interest loans up to ₹3 lakh at 4% interest',
    benefitsHi: '4% ब्याज पर ₹3 लाख तक का कम ब्याज ऋण'
  }, {
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Comprehensive crop insurance scheme',
    descriptionHi: 'व्यापक फसल बीमा योजना',
    eligibility: 'All farmers growing notified crops',
    eligibilityHi: 'अधिसूचित फसल उगाने वाले सभी किसान',
    link: 'https://pmfby.gov.in/',
    benefits: 'Maximum 2% premium for all Kharif crops, 1.5% for Rabi crops',
    benefitsHi: 'खरीफ फसलों पर अधिकतम 2% और रबी पर 1.5% प्रीमियम'
  }, {
    name: 'Soil Health Card Scheme',
    description: 'Provides soil nutrient status and recommendations',
    descriptionHi: 'मिट्टी की पोषक स्थिति और सिफारिशें देता है',
    eligibility: 'All farmers across India',
    eligibilityHi: 'भारत भर के सभी किसान',
    link: 'https://soilhealth.dac.gov.in/',
    benefits: 'Free soil testing and customized fertilizer recommendations',
    benefitsHi: 'निःशुल्क मिट्टी जांच और अनुकूलित उर्वरक सिफारिश'
  }, {
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'Promotes organic farming practices',
    descriptionHi: 'जैविक खेती को बढ़ावा देता है',
    eligibility: 'Farmers practicing organic farming in clusters',
    eligibilityHi: 'समूह में जैविक खेती करने वाले किसान',
    link: 'https://pgsindia-ncof.gov.in/',
    benefits: '₹50,000 per hectare for 3 years',
    benefitsHi: '3 वर्षों तक ₹50,000 प्रति हेक्टेयर'
  }, {
    name: 'National Agriculture Market (e-NAM)',
    description: 'Online trading platform for agricultural commodities',
    descriptionHi: 'कृषि उपजों हेतु ऑनलाइन व्यापार मंच',
    eligibility: 'All farmers and traders',
    eligibilityHi: 'सभी किसान और व्यापारी',
    link: 'https://www.enam.gov.in/',
    benefits: 'Better price discovery and transparent auction system',
    benefitsHi: 'बेहतर मूल्य निर्धारण और पारदर्शी नीलामी प्रणाली'
  }, {
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    description: 'Enhancing irrigation facilities and water use efficiency',
    descriptionHi: 'सिंचाई सुविधाओं और जल उपयोग दक्षता में सुधार',
    eligibility: 'All farmers',
    eligibilityHi: 'सभी किसान',
    link: 'https://pmksy.gov.in/',
    benefits: 'Subsidies for drip/sprinkler irrigation systems',
    benefitsHi: 'ड्रिप/स्प्रिंकलर सिंचाई प्रणाली पर सब्सिडी'
  }, {
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    description: 'Promotes farm mechanization',
    descriptionHi: 'कृषि यंत्रीकरण को बढ़ावा',
    eligibility: 'Individual farmers and cooperative societies',
    eligibilityHi: 'व्यक्तिगत किसान और सहकारी समितियां',
    link: 'https://agrimachinery.nic.in/',
    benefits: '40-50% subsidy on agricultural machinery',
    benefitsHi: 'कृषि मशीनरी पर 40-50% सब्सिडी'
  }];
  const stateSchemes = [{
    state: 'Punjab',
    schemes: [{
      name: 'Pani Bachao Paise Kamao',
      benefit: 'Incentive for water conservation - ₹2000/acre',
      link: 'https://punjab.gov.in/'
    }, {
      name: 'Crop Diversification Scheme',
      benefit: 'Subsidy for growing pulses, maize, cotton instead of paddy',
      link: 'https://punjab.gov.in/'
    }]
  }, {
    state: 'Haryana',
    schemes: [{
      name: 'Mera Pani Meri Virasat',
      benefit: 'Cash incentive ₹7000/acre for crop diversification',
      link: 'https://agriharyanacrm.com/'
    }, {
      name: 'Mukhyamantri Parivar Samridhi Yojana',
      benefit: '₹6000 annual income support to small farmers',
      link: 'https://cm-psy.haryana.gov.in/'
    }]
  }, {
    state: 'Uttar Pradesh',
    schemes: [{
      name: 'Kisan Kalyan Mission',
      benefit: 'Comprehensive farmer welfare program',
      link: 'https://upagripardarshi.gov.in/'
    }, {
      name: 'Mukhyamantri Khet Suraksha Yojana',
      benefit: 'Protecting crops from stray animals',
      link: 'https://upagripardarshi.gov.in/'
    }]
  }, {
    state: 'Maharashtra',
    schemes: [{
      name: 'Jalyukt Shivar Abhiyan',
      benefit: 'Water conservation and drought-proofing',
      link: 'https://mahapocra.gov.in/'
    }, {
      name: 'Baliraja Sanjivani Yojana',
      benefit: 'Free electricity connection to farmers',
      link: 'https://mahavitaran.co.in/'
    }]
  }, {
    state: 'Karnataka',
    schemes: [{
      name: 'Raita Samparka Kendra',
      benefit: 'One-stop solution for farmer queries',
      link: 'https://raitamitra.karnataka.gov.in/'
    }, {
      name: 'Krishi Bhagya',
      benefit: 'Subsidized irrigation systems',
      link: 'https://raitamitra.karnataka.gov.in/'
    }]
  }, {
    state: 'Tamil Nadu',
    schemes: [{
      name: 'Uzhavar Sandhai',
      benefit: 'Direct farmer markets in 400+ locations',
      link: 'https://www.tn.gov.in/'
    }, {
      name: 'Integrated Coconut Cultivation',
      benefit: 'Subsidy for coconut farming',
      link: 'https://www.tn.gov.in/'
    }]
  }, {
    state: 'West Bengal',
    schemes: [{
      name: 'Krishak Bandhu',
      benefit: '₹5000 twice a year for cultivation + ₹2 lakh life insurance',
      link: 'https://krishakbandhu.net/'
    }, {
      name: 'Bangla Shasya Bima',
      benefit: 'Subsidized crop insurance',
      link: 'https://wb.gov.in/'
    }]
  }, {
    state: 'Rajasthan',
    schemes: [{
      name: 'Mukhyamantri Kisan Mitra Urja Yojana',
      benefit: '₹1000/month electricity bill subsidy',
      link: 'https://energy.rajasthan.gov.in/'
    }, {
      name: 'Rajasthan Agriculture Competitiveness Project',
      benefit: 'Enhancing productivity and market access',
      link: 'https://agriculture.rajasthan.gov.in/'
    }]
  }, {
    state: 'Gujarat',
    schemes: [{
      name: 'Krishi Mahotsav',
      benefit: 'Awareness campaigns and technology dissemination',
      link: 'https://dag.gujarat.gov.in/'
    }, {
      name: 'Soil Health Card Scheme',
      benefit: 'Free soil testing',
      link: 'https://gsscl.gujarat.gov.in/'
    }]
  }, {
    state: 'Madhya Pradesh',
    schemes: [{
      name: 'Bhavantar Bhugtan Yojana',
      benefit: 'Price deficiency payment to farmers',
      link: 'https://mpeuparjan.nic.in/'
    }, {
      name: 'Mukhyamantri Kisan Kalyan Yojana',
      benefit: 'Additional ₹4000 to PM-KISAN beneficiaries',
      link: 'https://mpeuparjan.nic.in/'
    }]
  }, {
    state: 'Andhra Pradesh',
    schemes: [{
      name: 'YSR Rythu Bharosa',
      benefit: '₹13,500 per year to every farmer family',
      link: 'https://ysrrythubharosa.ap.gov.in/'
    }, {
      name: 'YSR Free Crop Insurance',
      benefit: 'Zero-premium crop insurance',
      link: 'https://www.apagrisnet.gov.in/'
    }]
  }, {
    state: 'Telangana',
    schemes: [{
      name: 'Rythu Bandhu',
      benefit: '₹5000 per acre per season as investment support',
      link: 'https://rythubandhu.telangana.gov.in/'
    }, {
      name: 'Rythu Bima',
      benefit: '₹5 lakh life insurance to farmers',
      link: 'https://rythubandhu.telangana.gov.in/'
    }]
  }, {
    state: 'Odisha',
    schemes: [{
      name: 'KALIA (Krushak Assistance for Livelihood and Income)',
      benefit: '₹25,000 over 5 seasons for cultivation',
      link: 'https://kalia.co.in/'
    }, {
      name: 'Balaram Yojana',
      benefit: 'Interest-free crop loans up to ₹1 lakh',
      link: 'https://agriculture.odisha.gov.in/'
    }]
  }, {
    state: 'Bihar',
    schemes: [{
      name: 'Diesel Anudan Yojana',
      benefit: 'Subsidy on diesel for irrigation',
      link: 'https://dbtagriculture.bihar.gov.in/'
    }, {
      name: 'Bihar Krishi Input Anudan Yojana',
      benefit: 'Subsidy for agricultural inputs',
      link: 'https://dbtagriculture.bihar.gov.in/'
    }]
  }, {
    state: 'Assam',
    schemes: [{
      name: 'Mukhyamantri Krishi Sa-Sajuli Yojana',
      benefit: 'Agricultural equipment subsidy',
      link: 'https://agri-horti.assam.gov.in/'
    }, {
      name: 'Assam Micro Finance Scheme',
      benefit: 'Easy loans for farmers',
      link: 'https://agri-horti.assam.gov.in/'
    }]
  }, {
    state: 'Kerala',
    schemes: [{
      name: 'POKKALI',
      benefit: 'Promoting traditional rice farming',
      link: 'https://keralaagriculture.gov.in/'
    }, {
      name: 'Subhiksha Keralam',
      benefit: 'Food self-sufficiency program',
      link: 'https://keralaagriculture.gov.in/'
    }]
  }];
  return <div className="min-h-screen">
      <Navigation />

      <div className="px-4 lg:px-6 pt-5">
        <BackButton />
      </div>
      
      <div className="pt-8 pb-12 px-4 container mx-auto">
        <div className="max-w-3xl pb-10">
          <h1 className="font-serif-display mb-3 text-4xl text-foreground md:text-5xl lg:text-6xl">
            {en ? 'Government Schemes' : 'सरकारी योजनाएं'}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {en
              ? 'Central and state schemes for farmers — eligibility, benefits, and direct links to apply.'
              : 'किसानों के लिए केंद्र और राज्य की योजनाएं — पात्रता, लाभ और आवेदन के सीधे लिंक।'}
          </p>
        </div>

        {/* Central Schemes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            {en ? 'Central Government Schemes' : 'केंद्र सरकार की योजनाएं'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centralSchemes.map((scheme, idx) => <div key={idx} className="glass rounded-2xl p-6 hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-foreground mb-3">{scheme.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{en ? scheme.description : (scheme as any).descriptionHi ?? scheme.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">{en ? 'Eligibility:' : 'पात्रता:'}</p>
                    <p className="text-sm text-muted-foreground">{en ? scheme.eligibility : (scheme as any).eligibilityHi ?? scheme.eligibility}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{en ? 'Benefits:' : 'लाभ:'}</p>
                    <p className="text-sm text-muted-foreground">{en ? scheme.benefits : (scheme as any).benefitsHi ?? scheme.benefits}</p>
                  </div>
                </div>
                
                <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold">
                  <ExternalLink className="h-4 w-4" />
                  {en ? 'Apply Now' : 'अभी आवेदन करें'}
                </a>
              </div>)}
          </div>
        </div>

        {/* State Schemes */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
            <MapPin className="h-8 w-8 text-primary" />
            {en ? 'State Government Schemes' : 'राज्य सरकार की योजनाएं'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {stateSchemes.map((stateData, idx) => <div key={idx} className="glass rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  {stateData.state}
                </h3>
                <div className="space-y-3">
                  {stateData.schemes.map((scheme, schemeIdx) => <div key={schemeIdx} className="glass rounded-xl p-4 hover:shadow-lg transition-all">
                      <h4 className="font-bold text-foreground mb-2">{scheme.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{scheme.benefit}</p>
                      <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold">
                        <ExternalLink className="h-4 w-4" />
                        {en ? 'Apply Now' : 'अभी आवेदन करें'}
                      </a>
                    </div>)}
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default GovSchemes;