import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  conditionIcon: string; // OpenWeatherMap icon code
  windSpeed: number;
  feelsLike: number;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/** Fallback shown when the API is unavailable or geolocation is denied. */
export const WEATHER_FALLBACK: WeatherData = {
  city: "Indore",
  temperature: 28,
  humidity: 65,
  condition: "Partly Cloudy",
  conditionIcon: "02d",
  windSpeed: 12,
  feelsLike: 30,
};

/** Map OpenWeatherMap condition codes to human-readable labels (bilingual). */
export function conditionLabel(code: string, lang: string): string {
  const id = Number(code);
  if (id >= 200 && id < 300) return lang === "hi" ? "बिजली गरजना" : "Thunderstorm";
  if (id >= 300 && id < 400) return lang === "hi" ? "बूँदा बाँदी" : "Drizzle";
  if (id >= 500 && id < 600) return lang === "hi" ? "बारिश" : "Rain";
  if (id >= 600 && id < 700) return lang === "hi" ? "बर्फबारी" : "Snow";
  if (id >= 700 && id < 800) return lang === "hi" ? "धुंध" : "Mist";
  if (id === 800) return lang === "hi" ? "साफ मौसम" : "Clear Sky";
  return lang === "hi" ? "आंशिक बादल" : "Partly Cloudy";
}

/* -- Module-level cache so every consumer shares one network call -- */
let cachedRaw: Record<string, unknown> | null = null;
let inFlight: Promise<Record<string, unknown> | null> | null = null;
const subscribers = new Set<() => void>();

function getCoords(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000 },
    );
  });
}

async function loadWeather(): Promise<Record<string, unknown> | null> {
  if (cachedRaw) return cachedRaw;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    if (!API_KEY) return null;
    const coords = await getCoords();
    if (!coords) return null;
    try {
      const res = await fetch(
        `${BASE_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      cachedRaw = await res.json();
      subscribers.forEach((fn) => fn());
      return cachedRaw;
    } catch {
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Shared weather hook. First mount triggers a single geolocation + API call;
 * the result is cached at module scope and reused by every other consumer, so
 * the top-bar capsule and any weather card never double-hit the rate-limited
 * OpenWeather endpoint. Falls back to sample data silently.
 */
export function useWeather() {
  const { language } = useLanguage();
  const [raw, setRaw] = useState<Record<string, unknown> | null>(cachedRaw);
  const [loading, setLoading] = useState(!cachedRaw);

  useEffect(() => {
    let active = true;
    const sync = () => active && setRaw(cachedRaw);
    subscribers.add(sync);
    loadWeather().then(() => {
      if (!active) return;
      setRaw(cachedRaw);
      setLoading(false);
    });
    return () => {
      active = false;
      subscribers.delete(sync);
    };
  }, []);

  const weather: WeatherData = raw
    ? {
        city: (raw.name as string) ?? WEATHER_FALLBACK.city,
        temperature: Math.round((raw.main as any)?.temp ?? WEATHER_FALLBACK.temperature),
        humidity: (raw.main as any)?.humidity ?? WEATHER_FALLBACK.humidity,
        condition: conditionLabel(String((raw.weather as any)?.[0]?.id ?? 802), language),
        conditionIcon: (raw.weather as any)?.[0]?.icon ?? "02d",
        windSpeed: Math.round(((raw.wind as any)?.speed ?? 3.3) * 3.6),
        feelsLike: Math.round((raw.main as any)?.feels_like ?? WEATHER_FALLBACK.feelsLike),
      }
    : WEATHER_FALLBACK;

  return { weather, loading, isLive: !!raw };
}
