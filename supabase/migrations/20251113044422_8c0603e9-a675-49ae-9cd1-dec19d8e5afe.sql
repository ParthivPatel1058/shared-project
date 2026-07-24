-- Add GPS coordinates and partner assignment to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS gps_lat numeric,
ADD COLUMN IF NOT EXISTS gps_lng numeric,
ADD COLUMN IF NOT EXISTS assigned_partner uuid;

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create a partners table to track delivery partners
CREATE TABLE IF NOT EXISTS public.partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone_number text,
  vehicle_type text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on partners table
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partners table
CREATE POLICY "Partners can view their own profile"
ON public.partners FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Partners can update their own profile"
ON public.partners FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Partners can insert their own profile"
ON public.partners FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create helper function to check if user is a partner
CREATE OR REPLACE FUNCTION public.is_partner(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.partners
    WHERE user_id = check_user_id AND is_active = true
  )
$$;

-- Update RLS policies for orders to allow partners to view pending orders
CREATE POLICY "Partners can view pending and assigned orders"
ON public.orders FOR SELECT
USING (
  public.is_partner(auth.uid()) AND 
  (status IN ('pending', 'accepted', 'in_transit') OR assigned_partner = auth.uid())
);

CREATE POLICY "Partners can update assigned orders"
ON public.orders FOR UPDATE
USING (
  public.is_partner(auth.uid()) AND 
  (status = 'pending' OR assigned_partner = auth.uid())
);

-- Add trigger for partners updated_at
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();