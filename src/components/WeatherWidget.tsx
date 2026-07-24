import { useState, useEffect, useCallback } from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Droplets,
  MapPin,
  Wind,
  Sun,
  CloudFog,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  conditionIcon: string; // OpenWeatherMap icon code
  windSpeed: number;
  feelsLike: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/** Fallback shown when the API is unavailable or geolocation is denied. */
const FALLBACK: WeatherData = {
  city: "Indore",
  temperature: 28,
  humidity: 65,
  condition: "Partly Cloudy",
  conditionIcon: "02d",
  windSpeed: 12,
  feelsLike: 30,
};

/** Map OpenWeatherMap condition codes to human-readable labels (bilingual). */
function conditionLabel(code: string, lang: string): string {
  const id = Number(code);
  if (id >= 200 && id < 300) return lang === "hi" ? "बिजली गरजना" : "Thunderstorm";
  if (id >= 300 && id < 400) return lang === "hi" ? "बूँदा बाँदी" : "Drizzle";
  if (id >= 500 && id < 600) return lang === "hi" ? "बारिश" : "Rain";
  if (id >= 600 && id < 700) return lang === "hi" ? "बर्फबारी" : "Snow";
  if (id >= 700 && id < 800) return lang === "hi" ? "धुंध" : "Mist";
  if (id === 800) return lang === "hi" ? "साफ मौसम" : "Clear Sky";
  return lang === "hi" ? "आंशिक बादल" : "Partly Cloudy";
}

/* ------------------------------------------------------------------ */
/*  Weather icon mapping (lucide)                                      */
/* ------------------------------------------------------------------ */

function WeatherIcon({ icon }: { icon: string }) {
  const prefix = icon?.startsWith("0") ? icon : "";
  // Night icons: 01n, 02n, etc.  → treat like day for simplicity
  if (prefix === "01") return <Sun className="h-8 w-8 text-yellow-500" />;
  if (prefix === "02" || prefix === "03" || prefix === "04")
    return <Cloud className="h-8 w-8 text-sky-400" />;
  if (icon?.startsWith("09") || icon?.startsWith("10"))
    return <CloudRain className="h-8 w-8 text-blue-400" />;
  if (icon?.startsWith("11"))
    return <CloudLightning className="h-8 w-8 text-amber-500" />;
  if (icon?.startsWith("13")) return <CloudSnow className="h-8 w-8 text-slate-300" />;
  if (icon?.startsWith("50")) return <CloudFog className="h-8 w-8 text-gray-400" />;
  return <Cloud className="h-8 w-8 text-sky-400" />;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const WeatherWidget = () => {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(
    async (lat: number, lon: number) => {
      if (!API_KEY) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        setWeather({
          city: json.name ?? FALLBACK.city,
          temperature: Math.round(json.main.temp),
          humidity: json.main.humidity,
          condition: conditionLabel(String(json.weather?.[0]?.id ?? 802), language),
          conditionIcon: json.weather?.[0]?.icon ?? "02d",
          windSpeed: Math.round(json.wind.speed * 3.6), // m/s → km/h
          feelsLike: Math.round(json.main.feels_like),
        });
      } catch {
        toast.error(
          language === "hi"
            ? "मौसम डेटा लोड करने में विफल"
            : "Failed to load weather data",
        );
        // keep fallback data
      } finally {
        setLoading(false);
      }
    },
    [language],
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Location denied — fall back to showing dummy data silently
        setLoading(false);
      },
      { timeout: 8000 },
    );
  }, [fetchWeather]);

  /* ---- UI ---- */

  if (loading) {
    return (
      <div className="glass rounded-3xl p-6 flex items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          {language === "hi" ? "मौसम लोड हो रहा है…" : "Loading weather…"}
        </span>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
      {/* Top row: city + icon */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="text-xl font-bold text-foreground">{weather.city}</h3>
          </div>
        </div>
        <WeatherIcon icon={weather.conditionIcon} />
      </div>

      {/* Temperature + condition */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-5xl font-bold text-foreground mb-1">
            {weather.temperature}°C
          </div>
          <p className="text-sm text-muted-foreground">
            {language === "hi"
              ? `महसूस होता है ${weather.feelsLike}°C`
              : `Feels like ${weather.feelsLike}°C`}
          </p>
        </div>
        <p className="text-sm font-medium text-foreground text-right">
          {weather.condition}
        </p>
      </div>

      {/* Humidity + wind grid */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">
              {language === "hi" ? "आर्द्रता" : "Humidity"}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {weather.humidity}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">
              {language === "hi" ? "हवा की गति" : "Wind Speed"}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {weather.windSpeed} km/h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
