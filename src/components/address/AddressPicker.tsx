import { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import AddressCard from '@/components/address/AddressCard';
import AddressForm from '@/components/address/AddressForm';
import { useAddresses, type Address, type AddressDraft } from '@/hooks/useAddresses';

interface AddressPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string | null;
  onSelect: (address: Address) => void;
}

/** Choose which saved address an order ships to, or add one inline. */
export default function AddressPicker({
  open,
  onOpenChange,
  selectedId,
  onSelect,
}: AddressPickerProps) {
  const { tx } = useLanguage();
  const { addresses, loading, create } = useAddresses();
  const [adding, setAdding] = useState(false);

  const handleCreate = async (draft: AddressDraft) => {
    const created = await create(draft);
    // Adding an address mid-checkout means the user wants to use it now.
    if (created) onSelect(created as Address);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-full max-w-md flex-col gap-0 p-0">
          <SheetHeader className="border-b border-border p-5">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              {tx('Deliver to', 'यहाँ भेजें')}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {loading ? (
              <div className="py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-10 text-center">
                <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="font-semibold text-foreground">
                  {tx('No saved addresses', 'कोई सहेजा पता नहीं')}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tx('Add one to place your order', 'ऑर्डर देने के लिए पता जोड़ें')}
                </p>
              </div>
            ) : (
              addresses.map((a) => (
                <AddressCard
                  key={a.id}
                  address={a}
                  selected={a.id === selectedId}
                  onSelect={() => {
                    onSelect(a);
                    onOpenChange(false);
                  }}
                />
              ))
            )}
          </div>

          <div className="border-t border-border p-5">
            <Button variant="outline" className="h-12 w-full text-base" onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4" />
              {tx('Add a new address', 'नया पता जोड़ें')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AddressForm open={adding} onOpenChange={setAdding} onSave={handleCreate} />
    </>
  );
}
