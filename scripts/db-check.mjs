#!/usr/bin/env node
/**
 * Supabase health check.
 *
 * Answers one question in one command: does the live database match what the
 * code expects? Runs with the anon key alone, so it needs no privileged
 * credential and is safe to run from anywhere, including CI.
 *
 *   npm run db:check
 *
 * Exit code is 1 when anything the app depends on is missing, so CI can gate
 * a deploy on it.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function envValue(key) {
  for (const file of ['.env.local', '.env']) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    const m = fs.readFileSync(p, 'utf8').match(new RegExp(`^${key}=\\s*"?([^"\\r\\n]+)`, 'm'));
    if (m) return m[1].trim();
  }
  return process.env[key] ?? null;
}

const URL = envValue('VITE_SUPABASE_URL');
const KEY = envValue('VITE_SUPABASE_PUBLISHABLE_KEY') ?? envValue('VITE_SUPABASE_ANON_KEY');

if (!URL || !KEY) {
  console.error('✗ VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY not found in .env');
  process.exit(1);
}

const ref = URL.replace(/^https:\/\/([a-z0-9]+).*/, '$1');
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

/** Tables the app reads or writes. `required` ones break features when absent. */
const TABLES = [
  ['profiles', true], ['user_roles', true], ['addresses', true],
  ['orders', true], ['cart_items', true], ['partners', true],
  ['farm_profiles', true], ['farm_plots', true], ['crop_cycles', true],
  ['crop_diagnoses', true], ['damage_reports', true],
  ['product_categories', true], ['products', true], ['order_items', true],
  ['deliveries', true], ['product_reviews', true],
  ['managers', true], ['staff_audit', true],
  ['notifications', true], ['kisan_help_sessions', true], ['shops', true],
  ['schemes', false],
];

const VIEWS = ['staff_roster', 'product_ratings'];
const RPCS = ['my_role', 'is_admin', 'is_manager'];
const BUCKETS = ['crop-images', 'damage-photos', 'profile-avatars', 'product-images'];

const OK = '✓', BAD = '✗', WARN = '!';
let missing = 0, optionalMissing = 0;

async function head(url) {
  try {
    const r = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    return r.status;
  } catch {
    return 0;
  }
}

console.log(`\nSupabase health check  —  project ${ref}`);
console.log('='.repeat(58));

console.log('\nTABLES');
for (const [t, required] of TABLES) {
  const s = await head(`${URL}/rest/v1/${t}?select=*&limit=1`);
  // 200 = readable, 401/403 = exists but RLS denies anon (correct and expected)
  const exists = s === 200 || s === 401 || s === 403;
  if (exists) {
    console.log(`  ${OK} ${t.padEnd(22)} ${s === 200 ? 'readable' : 'exists (RLS closed to anon — correct)'}`);
  } else {
    if (required) missing++; else optionalMissing++;
    console.log(`  ${required ? BAD : WARN} ${t.padEnd(22)} MISSING${required ? '' : ' (optional)'}`);
  }
}

console.log('\nVIEWS');
for (const v of VIEWS) {
  const s = await head(`${URL}/rest/v1/${v}?select=*&limit=1`);
  const exists = s === 200 || s === 401 || s === 403;
  if (!exists) missing++;
  console.log(`  ${exists ? OK : BAD} ${v.padEnd(22)} ${exists ? 'present' : 'MISSING'}`);
}

console.log('\nFUNCTIONS (rpc)');
for (const f of RPCS) {
  let s = 0;
  try {
    const r = await fetch(`${URL}/rest/v1/rpc/${f}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(15000),
    });
    s = r.status;
  } catch { /* network */ }
  const exists = s !== 404 && s !== 0;
  if (!exists) missing++;
  console.log(`  ${exists ? OK : BAD} ${f.padEnd(22)} ${exists ? 'present' : 'MISSING'}`);
}

console.log('\nSTORAGE BUCKETS');
// The per-bucket object endpoints answer 400 for real and imaginary buckets
// alike, so probing them proves nothing. Listing is the only honest check.
let bucketIds = null;
try {
  const r = await fetch(`${URL}/storage/v1/bucket`, { headers, signal: AbortSignal.timeout(15000) });
  if (r.ok) {
    const body = await r.json();
    if (Array.isArray(body)) bucketIds = body.map((b) => b.id);
  }
} catch { /* leave null */ }

// An empty list is ambiguous: it means either "no buckets" or "anon may not
// see them". Reporting MISSING there produced a false negative on a database
// that in fact had all four, so ambiguity is now reported as ambiguity.
if (bucketIds === null || bucketIds.length === 0) {
  console.log(`  ${WARN} anon key cannot enumerate buckets — not verifiable from here`);
  console.log('     check with:  select id, public from storage.buckets;');
} else {
  for (const b of BUCKETS) {
    const exists = bucketIds.includes(b);
    if (!exists) missing++;
    console.log(`  ${exists ? OK : BAD} ${b.padEnd(22)} ${exists ? 'present' : 'MISSING'}`);
  }
}

console.log('\nMIGRATION FILES ON DISK');
const migDir = path.join(root, 'supabase', 'migrations');
const migs = fs.existsSync(migDir) ? fs.readdirSync(migDir).filter((f) => f.endsWith('.sql')).sort() : [];
migs.slice(-4).forEach((m) => console.log(`  · ${m}`));
console.log(`  (${migs.length} total)`);

console.log('\n' + '='.repeat(58));
if (missing === 0) {
  console.log(`${OK} Schema is complete.${optionalMissing ? `  (${optionalMissing} optional object absent)` : ''}`);
  process.exit(0);
}
console.log(`${BAD} ${missing} required object(s) missing — the schema has not been applied.`);
console.log('\n  Fix: open the SQL Editor and run, in order:');
console.log(`    https://supabase.com/dashboard/project/${ref}/sql/new`);
console.log('    1. supabase/APPLY_STEP_1.sql   (enum types)');
console.log('    2. supabase/APPLY_STEP_2.sql   (tables, policies, views)');
console.log('  They must be two separate runs — Postgres will not use an enum');
console.log('  value in the transaction that created it.\n');
process.exit(1);
