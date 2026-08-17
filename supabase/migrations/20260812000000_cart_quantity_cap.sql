-- =============================================================
-- Per-line quantity ceiling on the cart.
--
-- The app caps a line at 100 in CartContext, but that is a courtesy: any
-- signed-in user holds a token and can write to `cart_items` directly, so the
-- only cap that actually holds is this one. Also rejects zero and negative
-- quantities, which the UI cannot produce but a hand-written request can.
-- =============================================================

-- Bring any existing row inside the new bounds first: adding a CHECK to a
-- table that already violates it fails outright.
UPDATE public.cart_items SET quantity = 100 WHERE quantity > 100;
UPDATE public.cart_items SET quantity = 1   WHERE quantity < 1;

ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_quantity_range;

ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_quantity_range
  CHECK (quantity >= 1 AND quantity <= 100);

COMMENT ON CONSTRAINT cart_items_quantity_range ON public.cart_items IS
  'Matches MAX_LINE_QUANTITY in src/contexts/CartContext.tsx. Change both together.';
