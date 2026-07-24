-- ============================================================
-- Migration: 20251102084714_608c6cb1-5754-41e6-aecd-1bfc4c943256.sql
-- ============================================================
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for profiles updated_at
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
-- ============================================================
-- Migration: 20251102085031_5b33f17d-e66f-4f7d-abc3-f775fd8a079f.sql
-- ============================================================
-- Fix security warning: Add search_path to handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
-- ============================================================
-- Migration: 20251102085912_72e580b4-daa7-4da6-98ee-2075c22bec7f.sql
-- ============================================================
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create a restricted policy for authenticated users to view only their own profile
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);
-- ============================================================
-- Migration: 20251105103519_8a96042c-b565-4d8a-8100-375fc8b5b82d.sql
-- ============================================================
-- Add user_id column to orders table to link orders to customers
ALTER TABLE public.orders ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

-- Add RLS policy for customers to view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Enable full replica identity for realtime updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;
-- ============================================================
-- Migration: 20251105113947_31324434-5b90-4139-a86e-9295bb06b23d.sql
-- ============================================================
-- Make user_id NOT NULL in orders table to prevent anonymous orders
-- First, ensure all existing orders have a user_id (update orphaned records if any exist)
-- Then make the column NOT NULL

ALTER TABLE orders 
ALTER COLUMN user_id SET NOT NULL;
-- ============================================================
-- Migration: 20251105161928_54553a00-8a06-4085-9abe-a676cb126137.sql
-- ============================================================
-- Allow users to create their own orders
CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
-- ============================================================
-- Migration: 20251105234513_6bd68a1f-866d-4dc7-aff9-1a408d9927cd.sql
-- ============================================================
-- Fix login error by removing the problematic rider trigger
-- Drop the trigger first, then the function

-- Drop the trigger
DROP TRIGGER IF EXISTS on_auth_rider_created ON auth.users;

-- Now drop the function
DROP FUNCTION IF EXISTS public.handle_new_rider_user();

-- Update handle_new_user to prevent conflicts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;
-- ============================================================
-- Migration: 20251112173011_92a51642-b2e8-4550-b6de-3ea7440dae67.sql
-- ============================================================
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- ============================================================
-- Migration: 20251112173030_cf290180-9ed7-4280-a2ea-a4fee0c8fec7.sql
-- ============================================================
-- Fix function search path security issue with CASCADE
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
-- ============================================================
-- Migration: 20251112174651_aa9610af-f3f6-42b1-958a-f4d73213537a.sql
-- ============================================================
-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_name_hi TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  delivery_address TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Cart items policies
CREATE POLICY "Users can view their own cart items"
ON public.cart_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items FOR DELETE
USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster queries
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
-- ============================================================
-- Migration: 20251113044422_8c0603e9-a675-49ae-9cd1-dec19d8e5afe.sql
-- ============================================================
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
-- ============================================================
-- Migration: 20251208042317_ee0c1ef3-43b9-4b40-b948-5fe65941dbef.sql
-- ============================================================
-- Create a secure RPC function that hides customer PII for pending orders
-- Partners can only see full details (phone, address, GPS) after they accept an order

CREATE OR REPLACE FUNCTION public.get_partner_orders()
RETURNS TABLE (
  id uuid,
  order_number text,
  items jsonb,
  total_amount integer,
  status text,
  delivery_address text,
  phone_number text,
  gps_lat numeric,
  gps_lng numeric,
  created_at timestamptz,
  assigned_partner uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow partners to call this function
  IF NOT is_partner(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: User is not a registered partner';
  END IF;

  RETURN QUERY
  SELECT 
    o.id,
    o.order_number,
    o.items,
    o.total_amount,
    o.status,
    -- Only reveal delivery address if partner has accepted the order
    CASE 
      WHEN o.assigned_partner = auth.uid() THEN o.delivery_address
      ELSE NULL
    END as delivery_address,
    -- Only reveal phone number if partner has accepted the order
    CASE 
      WHEN o.assigned_partner = auth.uid() THEN o.phone_number
      ELSE NULL
    END as phone_number,
    -- Only reveal GPS coordinates if partner has accepted the order
    CASE 
      WHEN o.assigned_partner = auth.uid() THEN o.gps_lat
      ELSE NULL
    END as gps_lat,
    CASE 
      WHEN o.assigned_partner = auth.uid() THEN o.gps_lng
      ELSE NULL
    END as gps_lng,
    o.created_at,
    o.assigned_partner
  FROM orders o
  WHERE 
    -- Show pending orders (for accepting) or orders assigned to this partner
    (o.status = 'pending' OR o.assigned_partner = auth.uid())
    AND o.status IN ('pending', 'accepted', 'in_transit')
  ORDER BY o.created_at DESC;
END;
$$;
-- ============================================================
-- Migration: 20251208042716_ce1a575e-02cb-46fd-9f2f-93f6839c04d1.sql
-- ============================================================
-- Change is_active default to false for partner self-registration security
-- New partners will require admin approval before they can access orders
ALTER TABLE public.partners ALTER COLUMN is_active SET DEFAULT false;
-- ============================================================
-- Migration: 20260108144938_42a0e244-9f03-4ee2-918b-42c2b9a4bd2e.sql
-- ============================================================
-- Fix Security Issue 1: Customer Phone Numbers and Addresses Exposed to All Delivery Partners
-- The current SELECT policy exposes all pending orders to any partner.
-- Solution: Restrict direct SELECT to only orders assigned to the current partner.
-- Partners must use the secure get_partner_orders RPC function to view available pending orders.

DROP POLICY IF EXISTS "Partners can view pending and assigned orders" ON public.orders;

-- New policy: Partners can ONLY directly view orders that are assigned to them
CREATE POLICY "Partners can view their assigned orders" 
ON public.orders 
FOR SELECT 
USING (
  is_partner(auth.uid()) 
  AND assigned_partner = auth.uid()
);

-- Fix Security Issue 2: Partners Can Modify Orders They Shouldn't Access
-- The current UPDATE policy allows partners to modify ANY pending order.
-- Solution: Partners can only update an order if:
--   a) It's pending AND they're assigning themselves (accepting the order), OR
--   b) It's already assigned to them (for status updates like in_transit, delivered)

DROP POLICY IF EXISTS "Partners can update assigned orders" ON public.orders;

-- New policy: Strict conditions for partner updates
CREATE POLICY "Partners can accept or update their orders" 
ON public.orders 
FOR UPDATE 
USING (
  is_partner(auth.uid()) 
  AND (
    -- Can update pending orders (to accept them)
    status = 'pending'
    -- OR can update orders already assigned to them
    OR assigned_partner = auth.uid()
  )
)
WITH CHECK (
  is_partner(auth.uid())
  AND (
    -- When accepting: must set assigned_partner to themselves
    (assigned_partner = auth.uid())
  )
);
