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