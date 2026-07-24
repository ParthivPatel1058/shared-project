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