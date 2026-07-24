-- Change is_active default to false for partner self-registration security
-- New partners will require admin approval before they can access orders
ALTER TABLE public.partners ALTER COLUMN is_active SET DEFAULT false;