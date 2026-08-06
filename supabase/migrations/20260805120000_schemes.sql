-- Optional: government scheme catalogue.
--
-- The app ships a bundled catalogue in src/data/schemes.ts and works fully
-- without this table. Applying this migration lets schemes be corrected or
-- added without a redeploy: useSchemes() prefers these rows when present.
--
-- Seed it by exporting ALL_SCHEMES to CSV, or insert rows by hand.

create table if not exists public.schemes (
  id            text primary key,
  name          text not null,
  name_hi       text not null,
  description   text not null,
  description_hi text not null,
  eligibility   text not null,
  eligibility_hi text not null,
  benefits      text not null,
  benefits_hi   text not null,
  link          text not null,
  category      text not null,
  -- Null for central schemes; a state name for state-specific ones.
  state         text,
  updated_at    timestamptz not null default now()
);

alter table public.schemes enable row level security;

-- Scheme information is public by design: any visitor, signed in or not,
-- should be able to read it. Writes stay restricted to the service role,
-- which RLS denies by default since no insert/update policy is defined.
drop policy if exists "schemes are readable by everyone" on public.schemes;
create policy "schemes are readable by everyone"
  on public.schemes
  for select
  using (true);

create index if not exists schemes_category_idx on public.schemes (category);
create index if not exists schemes_state_idx on public.schemes (state);
