-- =============================================================
-- Staff roles — enum values only.
--
-- Postgres will not let a newly added enum value be *used* in the same
-- transaction that adds it, and Supabase runs each migration file in one
-- transaction. So the values land here and everything that references them
-- lives in the next migration.
-- =============================================================

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'partner';
