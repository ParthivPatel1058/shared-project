import { useEffect, useState } from 'react';
import { Loader2, LocateFixed, Search, Home, Briefcase, MapPin, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  locateMe,
  searchAddress,
  type Address,
  type AddressDraft,
  type AddressLabel,
  type GeocodedAddress,
} from '@/hooks/useAddresses';

const LABELS: { key: AddressLabel; icon: typeof Home; en: string; hi: string }[] = [
  { key: 'Home', icon: Home, en: 'Home', hi: 'घर' },
  { key: 'Work', icon: Briefcase, en: 'Work', hi: 'काम' },
  { key: 'Other', icon: MapPin, en: 'Other', hi: 'अन्य' },
];

const EMPTY: AddressDraft = {
  label: 'Home',
  receiver_name: '',
  phone: '',
  house: '',
  area: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  lat: null,
  lng: null,
  is_default: false,
};

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing; omitted when adding. */
  existing?: Address | null;
  onSave: (draft: AddressDraft) => Promise<unknown>;
}

export default function AddressForm({ open, onOpenChange, existing, onSave }: AddressFormProps) {
  const { language } = useLanguage();
  const en = language === 'en';

  const [draft, setDraft] = useState<AddressDraft>(EMPTY);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<GeocodedAddress[]>([]);

  // Reset every time the sheet opens so a previous edit never bleeds through.
  useEffect(() => {
    if (!open) return;
    setDraft(
      existing
        ? {
            label: existing.label,
            receiver_name: existing.receiver_name,
            phone: existing.phone,
            house: existing.house,
            area: existing.area,
            landmark: existing.landmark ?? '',
            city: existing.city,
            state: existing.state,
            pincode: existing.pincode,
            lat: existing.lat,
            lng: existing.lng,
            is_default: existing.is_default,
          }
        : EMPTY,
    );
    setQuery('');
    setResults([]);
  }, [open, existing]);

  const set = <K extends keyof AddressDraft>(k: K, v: AddressDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const applyGeocoded = (g: GeocodedAddress) => {
    setDraft((d) => ({
      ...d,
      // Never clobber a house number the user already typed — reverse geocoding
      // rarely resolves to the building.
      house: d.house || g.house,
      area: g.area || d.area,
      city: g.city || d.city,
      state: g.state || d.state,
      pincode: g.pincode || d.pincode,
      lat: g.lat,
      lng: g.lng,
    }));
    setResults([]);
    setQuery('');
  };

  const detect = async () => {
    setLocating(true);
    try {
      applyGeocoded(await locateMe());
      toast.success(en ? 'Location detected' : 'लोकेशन मिल गई');
    } catch (e) {
      const msg = (e as Error).message;
      toast.error(
        msg === 'no-geolocation'
          ? en ? 'This device cannot share location' : 'यह डिवाइस लोकेशन साझा नहीं कर सकता'
          : en
            ? 'Could not get your location. Allow location access or search instead.'
            : 'लोकेशन नहीं मिली। अनुमति दें या खोजें।',
      );
    } finally {
      setLocating(false);
    }
  };

  const runSearch = async () => {
    const q = query.trim();
    if (q.length < 3) return;
    setSearching(true);
    try {
      const r = await searchAddress(q);
      setResults(r);
      if (r.length === 0) toast.info(en ? 'No matching locality found' : 'कोई मिलती जगह नहीं मिली');
    } finally {
      setSearching(false);
    }
  };

  const missing = (): string | null => {
    if (!draft.receiver_name.trim()) return en ? 'Add the receiver’s name' : 'पाने वाले का नाम भरें';
    if (!/^[0-9]{10}$/.test(draft.phone.replace(/\D/g, '')))
      return en ? 'Enter a 10-digit phone number' : '10 अंकों का फ़ोन नंबर भरें';
    if (!draft.house.trim()) return en ? 'Add the house or flat number' : 'मकान/फ्लैट नंबर भरें';
    if (!draft.area.trim()) return en ? 'Add the area or street' : 'क्षेत्र या गली भरें';
    if (!draft.city.trim()) return en ? 'Add the city' : 'शहर भरें';
    if (!draft.state.trim()) return en ? 'Add the state' : 'राज्य भरें';
    if (!/^[1-9][0-9]{5}$/.test(draft.pincode.trim()))
      return en ? 'Enter a valid 6-digit PIN code' : 'सही 6 अंकों का पिन कोड भरें';
    return null;
  };

  const submit = async () => {
    const problem = missing();
    if (problem) {
      toast.error(problem);
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...draft,
        receiver_name: draft.receiver_name.trim(),
        phone: draft.phone.replace(/\D/g, ''),
        house: draft.house.trim(),
        area: draft.area.trim(),
        landmark: draft.landmark?.trim() || null,
        city: draft.city.trim(),
        state: draft.state.trim(),
        pincode: draft.pincode.trim(),
      });
      toast.success(
        existing
          ? en ? 'Address updated' : 'पता अपडेट हुआ'
          : en ? 'Address saved' : 'पता सहेजा गया',
      );
      onOpenChange(false);
    } catch {
      toast.error(en ? 'Could not save the address' : 'पता सहेजा नहीं जा सका');
    } finally {
      setSaving(false);
    }
  };

  const field = (
    key: keyof AddressDraft,
    labelEn: string,
    labelHi: string,
    placeholder: string,
    extra?: { inputMode?: 'tel' | 'numeric'; maxLength?: number },
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={`addr-${key}`}>{en ? labelEn : labelHi}</Label>
      <Input
        id={`addr-${key}`}
        value={(draft[key] as string) ?? ''}
        placeholder={placeholder}
        inputMode={extra?.inputMode}
        maxLength={extra?.maxLength}
        onChange={(e) => set(key, e.target.value as AddressDraft[typeof key])}
      />
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="text-xl">
            {existing
              ? en ? 'Edit address' : 'पता बदलें'
              : en ? 'Add a new address' : 'नया पता जोड़ें'}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Pin the location */}
          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
            <Button onClick={detect} disabled={locating} className="w-full" variant="default">
              {locating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {en ? 'Finding you…' : 'खोज रहे हैं…'}
                </>
              ) : (
                <>
                  <LocateFixed className="h-4 w-4" />
                  {en ? 'Use my current location' : 'मेरी वर्तमान लोकेशन लें'}
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{en ? 'or search' : 'या खोजें'}</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                placeholder={en ? 'Village, area or PIN code' : 'गाँव, क्षेत्र या पिन कोड'}
              />
              <Button variant="outline" size="icon" onClick={runSearch} disabled={searching}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {results.length > 0 && (
              <ul className="space-y-1">
                {results.map((r, i) => (
                  <li key={i}>
                    <button
                      onClick={() => applyGeocoded(r)}
                      className="flex w-full gap-2 rounded-lg p-2 text-left text-xs transition-colors hover:bg-foreground/[0.06]"
                    >
                      <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{r.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {draft.lat != null && draft.lng != null && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Check className="h-3.5 w-3.5" />
                {en ? 'Location pinned for the delivery partner' : 'डिलीवरी पार्टनर के लिए लोकेशन सेट है'}
              </p>
            )}
          </div>

          {/* Address */}
          {field('house', 'House / flat / building', 'मकान / फ्लैट / इमारत', en ? 'e.g. H. No. 42' : 'जैसे मकान नं. 42')}
          {field('area', 'Area / street / village', 'क्षेत्र / गली / गाँव', en ? 'e.g. Anand Nagar' : 'जैसे आनंद नगर')}
          {field('landmark', 'Landmark (optional)', 'लैंडमार्क (वैकल्पिक)', en ? 'e.g. near the mandi' : 'जैसे मंडी के पास')}

          <div className="grid grid-cols-2 gap-3">
            {field('city', 'City / district', 'शहर / जिला', en ? 'Bhopal' : 'भोपाल')}
            {field('pincode', 'PIN code', 'पिन कोड', '462022', { inputMode: 'numeric', maxLength: 6 })}
          </div>
          {field('state', 'State', 'राज्य', en ? 'Madhya Pradesh' : 'मध्य प्रदेश')}

          {/* Receiver */}
          <div className="grid grid-cols-2 gap-3">
            {field('receiver_name', 'Receiver’s name', 'पाने वाले का नाम', en ? 'Full name' : 'पूरा नाम')}
            {field('phone', 'Phone number', 'फ़ोन नंबर', '98765 43210', { inputMode: 'tel', maxLength: 14 })}
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label>{en ? 'Save this address as' : 'पता इस रूप में सहेजें'}</Label>
            <div className="flex gap-2">
              {LABELS.map(({ key, icon: Icon, en: le, hi: lh }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('label', key)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    draft.label === key
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {en ? le : lh}
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              checked={!!draft.is_default}
              onCheckedChange={(v) => set('is_default', v === true)}
            />
            <span className="text-sm text-foreground">
              {en ? 'Make this my default address' : 'इसे मेरा डिफ़ॉल्ट पता बनाएं'}
            </span>
          </label>
        </div>

        <div className="border-t border-border p-5">
          <Button onClick={submit} disabled={saving} className="h-12 w-full text-base">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {en ? 'Saving…' : 'सहेजा जा रहा है…'}
              </>
            ) : existing ? (
              en ? 'Save changes' : 'बदलाव सहेजें'
            ) : (
              en ? 'Save address' : 'पता सहेजें'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
