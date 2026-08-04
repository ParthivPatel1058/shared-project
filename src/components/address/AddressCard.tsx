import { Home, Briefcase, MapPin, Navigation2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { formatAddress, type Address } from '@/hooks/useAddresses';

const ICONS = { Home, Work: Briefcase, Other: MapPin } as const;
const LABEL_HI = { Home: 'घर', Work: 'काम', Other: 'अन्य' } as const;

interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  /** Edit / delete / set-default controls, rendered by the caller. */
  actions?: React.ReactNode;
  className?: string;
}

export default function AddressCard({
  address,
  selected,
  onSelect,
  actions,
  className,
}: AddressCardProps) {
  const { tx } = useLanguage();
  const Icon = ICONS[address.label as keyof typeof ICONS] ?? MapPin;

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-colors',
        selected ? 'border-primary bg-primary/5' : 'border-border bg-card',
        onSelect && 'cursor-pointer hover:border-primary/50',
        className,
      )}
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
          <Icon className="h-3.5 w-3.5" />
          {tx(address.label, LABEL_HI[address.label as keyof typeof LABEL_HI] ?? address.label)}
        </span>

        {address.is_default && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {tx('Default', 'डिफ़ॉल्ट')}
          </span>
        )}

        {address.lat != null && address.lng != null && (
          <span
            className="inline-flex items-center gap-1 text-xs text-muted-foreground"
            title={tx('Coordinates saved for navigation', 'नेविगेशन के लिए लोकेशन सहेजी है')}
          >
            <Navigation2 className="h-3 w-3 text-primary" />
            {tx('Pinned', 'पिन')}
          </span>
        )}
      </div>

      <p className="text-sm font-semibold text-foreground">{address.receiver_name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{formatAddress(address)}</p>
      <p className="mt-1 text-xs text-muted-foreground">{address.phone}</p>

      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
