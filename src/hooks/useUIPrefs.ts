import { useCallback, useEffect, useSyncExternalStore } from 'react';

export interface UIPrefs {
  /** Play entrance/hover animations. */
  motion: boolean;
  /** Tighter spacing and smaller radii across the app. */
  compact: boolean;
  /** Sidebar starts collapsed on load. */
  sidebarCollapsed: boolean;
  /** Larger base font for readability in the field. */
  largeText: boolean;
  /** Stronger borders and contrast. */
  highContrast: boolean;
  /** Ask for location to show local weather. */
  useLocation: boolean;
}

const DEFAULTS: UIPrefs = {
  motion: true,
  compact: false,
  sidebarCollapsed: true,
  largeText: false,
  highContrast: false,
  useLocation: true,
};

const KEY = 'bhoomix-ui-prefs';

function read(): UIPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

let current: UIPrefs = typeof localStorage === 'undefined' ? DEFAULTS : read();
const listeners = new Set<() => void>();

/** Reflect prefs onto <html> so plain CSS can respond without prop drilling. */
export function applyPrefs(p: UIPrefs) {
  const root = document.documentElement;
  root.classList.toggle('prefs-no-motion', !p.motion);
  root.classList.toggle('prefs-compact', p.compact);
  root.classList.toggle('prefs-large-text', p.largeText);
  root.classList.toggle('prefs-high-contrast', p.highContrast);
}

function emit() {
  listeners.forEach((l) => l());
}

export function setPref<K extends keyof UIPrefs>(key: K, value: UIPrefs[K]) {
  current = { ...current, [key]: value };
  localStorage.setItem(KEY, JSON.stringify(current));
  applyPrefs(current);
  emit();
}

export function resetPrefs() {
  current = { ...DEFAULTS };
  localStorage.setItem(KEY, JSON.stringify(current));
  applyPrefs(current);
  emit();
}

/**
 * App-wide UI preferences, persisted to localStorage and mirrored onto the
 * <html> element. Uses an external store so every consumer stays in sync
 * without a context provider.
 */
export function useUIPrefs() {
  const prefs = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => DEFAULTS,
  );

  useEffect(() => {
    applyPrefs(prefs);
  }, [prefs]);

  const set = useCallback(<K extends keyof UIPrefs>(k: K, v: UIPrefs[K]) => setPref(k, v), []);

  return { prefs, set, reset: resetPrefs };
}
