import { useRef, useState } from 'react';
import {
  ScanSearch,
  Upload,
  ImageIcon,
  Loader2,
  Stethoscope,
  Leaf,
  ShieldCheck,
  FlaskConical,
  ArrowRight,
  X,
  Sprout,
  ShoppingCart,
  MapPin,
  Star,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Shared photo-scan panel (used by Crop Detection and Disease scan)  */
/* ------------------------------------------------------------------ */

interface PhotoScanProps {
  id: string;
  title: string;
  hint: string;
  analyzeLabel: string;
  resultTitle: string;
  resultBody: string;
  resultAction?: { label: string; onClick: () => void };
}

function PhotoScan({ id, title, hint, analyzeLabel, resultTitle, resultBody, resultAction }: PhotoScanProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileSelected = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
    setAnalyzed(false);
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setAnalyzed(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const analyze = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    window.setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1600);
  };

  return (
    <div className="glass p-6 md:p-8">
      {!preview ? (
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl py-14 px-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
        >
          <div className="p-3.5 rounded-full bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{hint}</p>
          </div>
          <span className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
            <ImageIcon className="h-4 w-4" />
            {analyzeLabel}
          </span>
        </label>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="relative">
            <img
              src={preview}
              alt={title}
              className="w-full max-h-80 object-contain rounded-xl border border-border bg-muted/40"
            />
            <button
              onClick={clearImage}
              aria-label="Remove photo"
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 border border-border text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {!analyzed ? (
              <Button onClick={analyze} disabled={analyzing} className="w-full sm:w-auto">
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-4 w-4" />
                    {analyzeLabel}
                  </>
                )}
              </Button>
            ) : (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <p className="font-semibold text-foreground mb-1">{resultTitle}</p>
                <p className="text-sm text-muted-foreground mb-4">{resultBody}</p>
                {resultAction && (
                  <Button variant="outline" size="sm" onClick={resultAction.onClick}>
                    {resultAction.label}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0])}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Plant Buyer data                                                    */
/* ------------------------------------------------------------------ */

interface Plant {
  name: string;
  hindiName: string;
  emoji: string;
  price: number;
  unit: string;
  partner: string;
  distanceKm: number;
  rating: number;
}

const PLANTS: Plant[] = [
  { name: 'Mint', hindiName: 'पुदीना', emoji: '🌿', price: 25, unit: 'bundle', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.7 },
  { name: 'Tulsi', hindiName: 'तुलसी', emoji: '🪴', price: 40, unit: 'plant', partner: 'Shakti Agro Farm', distanceKm: 3.1, rating: 4.8 },
  { name: 'Curry Leaf', hindiName: 'करी पत्ता', emoji: '🌱', price: 60, unit: 'plant', partner: 'GreenLeaf Nursery', distanceKm: 2.4, rating: 4.6 },
  { name: 'Aloe Vera', hindiName: 'एलोवेरा', emoji: '🌵', price: 50, unit: 'plant', partner: 'Vasudha Organics', distanceKm: 5.8, rating: 4.5 },
  { name: 'Lemongrass', hindiName: 'लेमनग्रास', emoji: '🎋', price: 35, unit: 'bundle', partner: 'Shakti Agro Farm', distanceKm: 3.1, rating: 4.4 },
  { name: 'Stevia', hindiName: 'स्टीविया', emoji: '🍃', price: 80, unit: 'plant', partner: 'Vasudha Organics', distanceKm: 5.8, rating: 4.3 },
  { name: 'Ashwagandha', hindiName: 'अश्वगंधा', emoji: '🌾', price: 90, unit: 'plant', partner: 'Himalaya Herbs Co.', distanceKm: 8.2, rating: 4.6 },
  { name: 'Rosemary', hindiName: 'रोज़मेरी', emoji: '🌲', price: 70, unit: 'plant', partner: 'Himalaya Herbs Co.', distanceKm: 8.2, rating: 4.5 },
];

/* ------------------------------------------------------------------ */
/* Disease library data                                                */
/* ------------------------------------------------------------------ */

type Severity = 'High' | 'Medium';

interface Disease {
  name: string;
  hindiName: string;
  crops: string;
  severity: Severity;
  symptoms: string;
  quickAction: string;
}

const DISEASES: Disease[] = [
  {
    name: 'Late Blight',
    hindiName: 'पछेती झुलसा',
    crops: 'Potato, Tomato',
    severity: 'High',
    symptoms: 'Dark water-soaked spots on leaves; white mould on the underside in humid weather.',
    quickAction: 'Remove infected plants, improve drainage, spray copper-based fungicide.',
  },
  {
    name: 'Rice Blast',
    hindiName: 'धान का ब्लास्ट',
    crops: 'Rice',
    severity: 'High',
    symptoms: 'Diamond-shaped grey lesions with brown borders on leaves and nodes.',
    quickAction: 'Avoid excess nitrogen, keep field evenly flooded, use resistant varieties.',
  },
  {
    name: 'Wheat Rust',
    hindiName: 'गेहूं का रतुआ',
    crops: 'Wheat',
    severity: 'High',
    symptoms: 'Orange-brown powdery pustules on leaves and stems that rub off on fingers.',
    quickAction: 'Sow rust-resistant varieties; spray propiconazole at first sign.',
  },
  {
    name: 'Leaf Curl Virus',
    hindiName: 'पत्ती मरोड़ वायरस',
    crops: 'Tomato, Chilli',
    severity: 'High',
    symptoms: 'Upward-curling yellow leaves, stunted growth; spread by whitefly.',
    quickAction: 'Control whitefly with neem oil or sticky traps; remove infected plants.',
  },
  {
    name: 'Powdery Mildew',
    hindiName: 'चूर्णिल आसिता',
    crops: 'Vegetables, Pulses',
    severity: 'Medium',
    symptoms: 'White powdery patches on leaf surfaces that spread and yellow the leaf.',
    quickAction: 'Improve air flow, avoid overhead watering, spray sulphur or neem oil.',
  },
  {
    name: 'Bacterial Leaf Blight',
    hindiName: 'जीवाणु पत्ती झुलसा',
    crops: 'Rice',
    severity: 'Medium',
    symptoms: 'Yellowing that starts at leaf tips and edges, turning white-grey as it dries.',
    quickAction: 'Drain the field, avoid excess nitrogen, use certified disease-free seed.',
  },
];

const severityStyles: Record<Severity, string> = {
  High: 'bg-destructive/10 text-destructive',
  Medium: 'bg-secondary/20 text-secondary-foreground',
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const CropDisease = () => {
  const { language } = useLanguage();
  const en = language === 'en';

  const [tab, setTab] = useState('crop');
  const [plantQuery, setPlantQuery] = useState('');

  const filteredPlants = PLANTS.filter((p) => {
    const q = plantQuery.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.hindiName.includes(q);
  });

  const orderPlant = (plant: Plant) => {
    toast.success(
      en
        ? `Order request for ${plant.name} sent to ${plant.partner}`
        : `${plant.hindiName} का ऑर्डर ${plant.partner} को भेजा गया`,
      {
        description: en
          ? `₹${plant.price}/${plant.unit} · ${plant.distanceKm} km away — the partner will confirm shortly.`
          : `₹${plant.price}/${plant.unit} · ${plant.distanceKm} किमी दूर — पार्टनर जल्द पुष्टि करेगा।`,
      },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-16 max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <ScanSearch className="h-4 w-4" />
            {en ? 'Crop AI' : 'फसल एआई'}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
            {en ? 'Crop Intelligence Center' : 'फसल इंटेलिजेंस केंद्र'}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {en
              ? 'Identify crops, buy plants from nearby partners, and diagnose diseases — all in one place.'
              : 'फसल पहचानें, नज़दीकी पार्टनर से पौधे खरीदें और रोगों की जांच करें — सब एक जगह।'}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8 h-11">
            <TabsTrigger value="crop" className="gap-2">
              <Sprout className="h-4 w-4" />
              <span className="hidden sm:inline">{en ? 'Crop Detection' : 'फसल पहचान'}</span>
              <span className="sm:hidden">{en ? 'Crop' : 'फसल'}</span>
            </TabsTrigger>
            <TabsTrigger value="buyer" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">{en ? 'Plant Buyer' : 'पौधा खरीदें'}</span>
              <span className="sm:hidden">{en ? 'Buy' : 'खरीदें'}</span>
            </TabsTrigger>
            <TabsTrigger value="disease" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">{en ? 'Disease' : 'रोग'}</span>
              <span className="sm:hidden">{en ? 'Disease' : 'रोग'}</span>
            </TabsTrigger>
          </TabsList>

          {/* ---- Part 1: Crop Detection ---- */}
          <TabsContent value="crop">
            <PhotoScan
              id="crop-detect-photo"
              title={en ? 'Upload a photo of the crop' : 'फसल की फोटो अपलोड करें'}
              hint={
                en
                  ? 'The AI identifies the crop and its growth stage from a clear field photo'
                  : 'एआई साफ फोटो से फसल और उसकी वृद्धि अवस्था पहचानता है'
              }
              analyzeLabel={en ? 'Detect Crop' : 'फसल पहचानें'}
              resultTitle={en ? 'AI crop detection coming soon' : 'एआई फसल पहचान जल्द आ रही है'}
              resultBody={
                en
                  ? 'The detection model is being connected. Your photo format works — check back soon.'
                  : 'पहचान मॉडल जोड़ा जा रहा है। आपकी फोटो सही है — जल्द वापस देखें।'
              }
            />
          </TabsContent>

          {/* ---- Part 2: Plant Buyer ---- */}
          <TabsContent value="buyer">
            <div className="mb-5 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={plantQuery}
                onChange={(e) => setPlantQuery(e.target.value)}
                placeholder={en ? 'Search plants — mint, tulsi, aloe vera…' : 'पौधे खोजें — पुदीना, तुलसी…'}
                className="pl-9"
              />
            </div>

            {filteredPlants.length === 0 ? (
              <div className="glass p-10 text-center text-muted-foreground">
                {en ? `No plants found for "${plantQuery}"` : `"${plantQuery}" के लिए कोई पौधा नहीं मिला`}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlants.map((plant) => (
                  <div
                    key={plant.name}
                    className="glass p-5 flex flex-col transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl leading-none">{plant.emoji}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-foreground bg-secondary/20 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3 fill-current" />
                        {plant.rating}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground leading-tight">
                      {en ? plant.name : plant.hindiName}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {en ? plant.hindiName : plant.name}
                    </p>
                    <p className="text-lg font-bold text-foreground mb-1">
                      ₹{plant.price}
                      <span className="text-xs font-medium text-muted-foreground"> / {plant.unit}</span>
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {plant.partner} · {plant.distanceKm} km
                    </p>
                    <Button size="sm" className="mt-auto" onClick={() => orderPlant(plant)}>
                      <ShoppingCart className="h-4 w-4" />
                      {en ? 'Order from Partner' : 'पार्टनर से ऑर्डर करें'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---- Part 3: Disease ---- */}
          <TabsContent value="disease" className="space-y-10">
            <PhotoScan
              id="disease-photo"
              title={en ? 'Upload a photo of the affected crop' : 'प्रभावित फसल की फोटो अपलोड करें'}
              hint={
                en
                  ? 'Clear, close-up photo of the affected leaf or plant works best'
                  : 'प्रभावित पत्ती या पौधे की साफ, नज़दीकी फोटो सबसे अच्छी रहती है'
              }
              analyzeLabel={en ? 'Detect Disease' : 'रोग पहचानें'}
              resultTitle={en ? 'AI disease analysis coming soon' : 'एआई रोग विश्लेषण जल्द आ रहा है'}
              resultBody={
                en
                  ? 'The AI model is being connected. Meanwhile, match your crop’s symptoms in the library below.'
                  : 'एआई मॉडल जोड़ा जा रहा है। तब तक नीचे पुस्तकालय में लक्षण मिलाएं।'
              }
            />

            {/* Disease library */}
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-1">
                {en ? 'Common Disease Library' : 'सामान्य रोग पुस्तकालय'}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                {en ? 'Match symptoms and act fast' : 'लक्षण मिलाएं और तुरंत कदम उठाएं'}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {DISEASES.map((d) => (
                  <div
                    key={d.name}
                    className="glass p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-foreground leading-tight">
                          {en ? d.name : d.hindiName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {en ? d.hindiName : d.name} · {d.crops}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                          severityStyles[d.severity],
                        )}
                      >
                        {en ? d.severity : d.severity === 'High' ? 'गंभीर' : 'मध्यम'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{d.symptoms}</p>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-primary">
                        {en ? 'Quick action: ' : 'त्वरित कदम: '}
                      </span>
                      {d.quickAction}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Treatment & advisory */}
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-5">
                {en ? 'Treatment & Advisory' : 'उपचार और सलाह'}
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="glass p-5">
                  <div className="inline-flex p-2.5 rounded-lg gradient-primary mb-4">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {en ? 'Prevention First' : 'पहले रोकथाम'}
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1.5 leading-relaxed list-disc list-inside">
                    <li>{en ? 'Use certified, disease-free seeds' : 'प्रमाणित, रोग-मुक्त बीज उपयोग करें'}</li>
                    <li>{en ? 'Rotate crops every season' : 'हर मौसम फसल चक्र अपनाएं'}</li>
                    <li>{en ? 'Keep proper plant spacing & drainage' : 'उचित दूरी और जल निकासी रखें'}</li>
                    <li>{en ? 'Remove and burn infected residue' : 'संक्रमित अवशेष हटाकर नष्ट करें'}</li>
                  </ul>
                </div>
                <div className="glass p-5">
                  <div className="inline-flex p-2.5 rounded-lg gradient-accent mb-4">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {en ? 'Organic Treatment' : 'जैविक उपचार'}
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1.5 leading-relaxed list-disc list-inside">
                    <li>{en ? 'Neem oil spray for pests & fungus' : 'कीट व फफूंद के लिए नीम तेल छिड़काव'}</li>
                    <li>{en ? 'Trichoderma for soil-borne disease' : 'मिट्टी-जनित रोगों के लिए ट्राइकोडर्मा'}</li>
                    <li>{en ? 'Panchagavya as a plant tonic' : 'पौध टॉनिक के रूप में पंचगव्य'}</li>
                    <li>{en ? 'Sticky traps for whitefly control' : 'सफेद मक्खी के लिए चिपचिपे जाल'}</li>
                  </ul>
                </div>
                <div className="glass p-5">
                  <div className="inline-flex p-2.5 rounded-lg gradient-secondary mb-4">
                    <FlaskConical className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {en ? 'Chemical — Use with Care' : 'रसायन — सावधानी से'}
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1.5 leading-relaxed list-disc list-inside">
                    <li>{en ? 'Follow the label dose exactly' : 'लेबल पर दी खुराक का ही पालन करें'}</li>
                    <li>{en ? 'Wear gloves and a mask while spraying' : 'छिड़काव में दस्ताने व मास्क पहनें'}</li>
                    <li>{en ? 'Respect the pre-harvest interval' : 'कटाई-पूर्व अंतराल का पालन करें'}</li>
                    <li>{en ? 'Consult your local KVK for guidance' : 'मार्गदर्शन हेतु निकट KVK से संपर्क करें'}</li>
                  </ul>
                </div>
              </div>

              <div className="glass p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    {en ? 'Need organic inputs?' : 'जैविक सामग्री चाहिए?'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {en
                      ? 'Neem cake, Trichoderma, Panchagavya and more in our organic store.'
                      : 'नीम खली, ट्राइकोडर्मा, पंचगव्य और बहुत कुछ हमारे जैविक स्टोर में।'}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/organic-farming">
                    {en ? 'Shop Organic Store' : 'जैविक स्टोर देखें'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CropDisease;
