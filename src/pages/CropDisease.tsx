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
import BackButton from '@/components/BackButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Shared photo-scan panel (used by Crop Detection and Disease scan)  */
/* ------------------------------------------------------------------ */

/** Shape returned by the `crop-vision` edge function. */
interface VisionResult {
  isPlant: boolean;
  crop: string;
  confidence: number;
  summary: string;
  advisory: string[];
  /* crop mode */
  stage?: string;
  health?: string;
  /* disease mode */
  disease?: string;
  severity?: string;
  symptoms?: string;
  treatment?: string[];
}

const HEALTH_TONE: Record<string, string> = {
  Healthy: 'bg-primary/10 text-primary',
  Stressed: 'bg-secondary/20 text-secondary-foreground',
  Diseased: 'bg-destructive/10 text-destructive',
  Unknown: 'bg-muted text-muted-foreground',
};

const SEVERITY_TONE: Record<string, string> = {
  High: 'bg-destructive/10 text-destructive',
  Medium: 'bg-secondary/20 text-secondary-foreground',
  Low: 'bg-primary/10 text-primary',
  None: 'bg-primary/10 text-primary',
};

/** Read as a data URL — the API needs the bytes, not an object URL. */
function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

interface PhotoScanProps {
  id: string;
  mode: 'crop' | 'disease';
  title: string;
  hint: string;
  analyzeLabel: string;
}

function PhotoScan({ id, mode, title, hint, analyzeLabel }: PhotoScanProps) {
  const { language } = useLanguage();
  const en = language === 'en';

  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<VisionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileSelected = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(en ? 'Photo must be under 5 MB' : 'फोटो 5 MB से कम होनी चाहिए');
      return;
    }
    try {
      setPreview(await readAsDataUrl(file));
      setResult(null);
    } catch {
      toast.error(en ? 'Could not read that photo' : 'यह फोटो पढ़ी नहीं जा सकी');
    }
  };

  const clearImage = () => {
    setPreview(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const analyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('crop-vision', {
        body: { image: preview, mode, language },
      });
      if (error) throw error;
      if (!data?.result) throw new Error('empty response');
      setResult(data.result as VisionResult);
    } catch {
      toast.error(
        en ? 'Could not analyse the photo. Please try again.' : 'फोटो का विश्लेषण नहीं हो सका। दोबारा कोशिश करें।',
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const pct = result ? Math.round((result.confidence ?? 0) * 100) : 0;

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
              className="absolute top-2 right-2 p-1.5 rounded-full bg-card/90 border border-border text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {!result ? (
              <Button onClick={analyze} disabled={analyzing} className="w-full sm:w-auto">
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {en ? 'Analysing…' : 'विश्लेषण हो रहा है…'}
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-4 w-4" />
                    {analyzeLabel}
                  </>
                )}
              </Button>
            ) : !result.isPlant ? (
              <div className="rounded-xl border border-border bg-muted/40 p-5">
                <p className="font-semibold text-foreground mb-1">
                  {en ? 'No crop found in this photo' : 'इस फोटो में कोई फसल नहीं मिली'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">{result.summary}</p>
                <Button variant="outline" size="sm" onClick={clearImage}>
                  {en ? 'Try another photo' : 'दूसरी फोटो आज़माएं'}
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
                {/* Headline finding */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">
                    {mode === 'crop'
                      ? en ? 'Crop identified' : 'पहचानी गई फसल'
                      : en ? 'Likely diagnosis' : 'संभावित निदान'}
                  </p>
                  <p className="font-display text-lg font-bold text-foreground leading-tight">
                    {mode === 'crop' ? result.crop : result.disease}
                  </p>
                  {mode === 'disease' && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {en ? 'On' : 'फसल'}: {result.crop}
                    </p>
                  )}
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2">
                  {mode === 'crop' && result.stage && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      <Leaf className="h-3 w-3" />
                      {result.stage}
                    </span>
                  )}
                  {mode === 'crop' && result.health && (
                    <span
                      className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-full',
                        HEALTH_TONE[result.health] ?? HEALTH_TONE.Unknown,
                      )}
                    >
                      {result.health}
                    </span>
                  )}
                  {mode === 'disease' && result.severity && (
                    <span
                      className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-full',
                        SEVERITY_TONE[result.severity] ?? SEVERITY_TONE.None,
                      )}
                    >
                      {en ? 'Severity' : 'गंभीरता'}: {result.severity}
                    </span>
                  )}
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    {en ? 'Confidence' : 'विश्वास'} {pct}%
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">{result.summary}</p>

                {mode === 'disease' && result.symptoms && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      {en ? 'Symptoms seen' : 'दिखे लक्षण'}
                    </p>
                    <p className="text-sm text-foreground">{result.symptoms}</p>
                  </div>
                )}

                {mode === 'disease' && result.treatment?.length ? (
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      <FlaskConical className="h-3.5 w-3.5" />
                      {en ? 'Treatment' : 'उपचार'}
                    </p>
                    <ol className="space-y-1.5">
                      {result.treatment.map((t, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold grid place-items-center mt-0.5">
                            {i + 1}
                          </span>
                          {t}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {result.advisory?.length ? (
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {mode === 'crop'
                        ? en ? 'Advisory' : 'सलाह'
                        : en ? 'Prevent it next season' : 'अगली बार रोकथाम'}
                    </p>
                    <ul className="space-y-1.5">
                      {result.advisory.map((a, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground">
                          <Leaf className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-1" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={clearImage}>
                    {en ? 'Scan another photo' : 'दूसरी फोटो स्कैन करें'}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/kisan-help">
                      {en ? 'Ask the AI assistant' : 'एआई सहायक से पूछें'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <p className="text-[11px] leading-snug text-muted-foreground border-t border-border pt-3">
                  {en
                    ? 'AI guidance based on one photo — confirm with your local agriculture officer before spraying.'
                    : 'एक फोटो पर आधारित एआई सलाह — छिड़काव से पहले अपने कृषि अधिकारी से पुष्टि करें।'}
                </p>
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
    <div className="min-h-screen">
      <Navigation />

      <div className="px-4 lg:px-6 pt-5">
        <BackButton />
      </div>

      <main className="container mx-auto px-4 pt-8 md:pt-12 pb-16 max-w-5xl">
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
              mode="crop"
              title={en ? 'Upload a photo of the crop' : 'फसल की फोटो अपलोड करें'}
              hint={
                en
                  ? 'The AI identifies the crop and its growth stage from a clear field photo'
                  : 'एआई साफ फोटो से फसल और उसकी वृद्धि अवस्था पहचानता है'
              }
              analyzeLabel={en ? 'Detect Crop' : 'फसल पहचानें'}
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
              mode="disease"
              title={en ? 'Upload a photo of the affected crop' : 'प्रभावित फसल की फोटो अपलोड करें'}
              hint={
                en
                  ? 'Clear, close-up photo of the affected leaf or plant works best'
                  : 'प्रभावित पत्ती या पौधे की साफ, नज़दीकी फोटो सबसे अच्छी रहती है'
              }
              analyzeLabel={en ? 'Detect Disease' : 'रोग पहचानें'}
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
