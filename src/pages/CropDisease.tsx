import { useRef, useState } from 'react';
import {
  ScanSearch,
  Upload,
  ImageIcon,
  Loader2,
  BookOpen,
  Stethoscope,
  Leaf,
  ShieldCheck,
  FlaskConical,
  ArrowRight,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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

const CropDisease = () => {
  const { language } = useLanguage();
  const en = language === 'en';

  const [tab, setTab] = useState('scan');
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-16 max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <ScanSearch className="h-4 w-4" />
            {en ? 'AI Crop Doctor' : 'एआई फसल डॉक्टर'}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
            {en ? 'Crop Disease Detection' : 'फसल रोग पहचान'}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {en
              ? 'Scan a photo of your crop, identify the problem, and get clear treatment steps.'
              : 'अपनी फसल की फोटो स्कैन करें, समस्या पहचानें और उपचार के स्पष्ट कदम पाएं।'}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8 h-11">
            <TabsTrigger value="scan" className="gap-2">
              <ScanSearch className="h-4 w-4" />
              <span className="hidden sm:inline">{en ? 'Scan & Detect' : 'स्कैन करें'}</span>
              <span className="sm:hidden">{en ? 'Scan' : 'स्कैन'}</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{en ? 'Disease Library' : 'रोग पुस्तकालय'}</span>
              <span className="sm:hidden">{en ? 'Library' : 'रोग'}</span>
            </TabsTrigger>
            <TabsTrigger value="treatment" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">{en ? 'Treatment & Advisory' : 'उपचार सलाह'}</span>
              <span className="sm:hidden">{en ? 'Treatment' : 'उपचार'}</span>
            </TabsTrigger>
          </TabsList>

          {/* ---- Section 1: Scan & Detect ---- */}
          <TabsContent value="scan">
            <div className="glass p-6 md:p-8">
              {!preview ? (
                <label
                  htmlFor="crop-photo"
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl py-14 px-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
                >
                  <div className="p-3.5 rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {en ? 'Upload a crop photo' : 'फसल की फोटो अपलोड करें'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {en
                        ? 'Clear, close-up photo of the affected leaf or plant works best'
                        : 'प्रभावित पत्ती या पौधे की साफ, नज़दीकी फोटो सबसे अच्छी रहती है'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                    <ImageIcon className="h-4 w-4" />
                    {en ? 'Choose Photo' : 'फोटो चुनें'}
                  </span>
                </label>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div className="relative">
                    <img
                      src={preview}
                      alt={en ? 'Selected crop' : 'चयनित फसल'}
                      className="w-full max-h-80 object-contain rounded-xl border border-border bg-muted/40"
                    />
                    <button
                      onClick={clearImage}
                      aria-label={en ? 'Remove photo' : 'फोटो हटाएं'}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 border border-border text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {!analyzed ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          {en
                            ? 'Photo ready. Run the scan to analyze it for common crop diseases.'
                            : 'फोटो तैयार है। सामान्य फसल रोगों की जांच के लिए स्कैन चलाएं।'}
                        </p>
                        <Button onClick={analyze} disabled={analyzing} className="w-full sm:w-auto">
                          {analyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {en ? 'Analyzing…' : 'विश्लेषण हो रहा है…'}
                            </>
                          ) : (
                            <>
                              <ScanSearch className="h-4 w-4" />
                              {en ? 'Analyze Photo' : 'फोटो का विश्लेषण करें'}
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                        <p className="font-semibold text-foreground mb-1">
                          {en ? 'AI analysis coming soon' : 'एआई विश्लेषण जल्द आ रहा है'}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {en
                            ? 'The AI model is being connected. Meanwhile, match your crop’s symptoms in the Disease Library.'
                            : 'एआई मॉडल जोड़ा जा रहा है। तब तक रोग पुस्तकालय में लक्षण मिलाएं।'}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setTab('library')}>
                          {en ? 'Open Disease Library' : 'रोग पुस्तकालय खोलें'}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="crop-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileSelected(e.target.files?.[0])}
              />
            </div>
          </TabsContent>

          {/* ---- Section 2: Disease Library ---- */}
          <TabsContent value="library">
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
          </TabsContent>

          {/* ---- Section 3: Treatment & Advisory ---- */}
          <TabsContent value="treatment">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CropDisease;
