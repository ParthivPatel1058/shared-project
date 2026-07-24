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