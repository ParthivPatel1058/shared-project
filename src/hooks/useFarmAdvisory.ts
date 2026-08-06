import { useMemo } from 'react';
import { useWeather, type ForecastHour, type ForecastDay } from '@/hooks/useWeather';

export type AdvisoryLevel = 'danger' | 'warn' | 'ok' | 'info';

export interface Advisory {
  id: string;
  level: AdvisoryLevel;
  title: string;
  titleHi: string;
  detail: string;
  detailHi: string;
}

/*
 * Thresholds. Kept together and named so the reasoning is inspectable rather
 * than buried in the logic below.
 */
/** Spraying before rain wastes the chemical — it washes straight off. */
const RAIN_MM_THAT_WASHES_OFF = 0.4;
/** Above this, spray drifts off-target instead of landing on the crop. */
const SPRAY_WIND_LIMIT_KMH = 15;
/** How far ahead a spray window must stay dry, in hours. */
const SPRAY_DRY_HOURS = 6;
const HEAT_STRESS_C = 38;
const FROST_C = 4;
const HEAVY_RAIN_MM_PER_DAY = 50;
/** No meaningful rain over this many days suggests irrigation. */
const DRY_SPELL_DAYS = 3;
const DRY_SPELL_MM = 2;

const fmtHour = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', hour12: true });

const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

/** Hours from now onward, since past hours are returned too. */
function upcoming(hourly: ForecastHour[], count: number): ForecastHour[] {
  const now = Date.now();
  return hourly.filter((h) => new Date(h.time).getTime() >= now).slice(0, count);
}

function sprayAdvisory(hourly: ForecastHour[]): Advisory | null {
  const next = upcoming(hourly, 48);
  if (next.length < SPRAY_DRY_HOURS) return null;

  const safe = (h: ForecastHour) =>
    h.precipitation < RAIN_MM_THAT_WASHES_OFF && h.windSpeed < SPRAY_WIND_LIMIT_KMH;

  // A window is only usable if it stays safe for the whole drying period.
  const windowFrom = (i: number) => next.slice(i, i + SPRAY_DRY_HOURS).every(safe);

  if (windowFrom(0)) {
    return {
      id: 'spray',
      level: 'ok',
      title: 'Good time to spray',
      titleHi: 'छिड़काव का अच्छा समय',
      detail: `No rain and low wind expected for the next ${SPRAY_DRY_HOURS} hours.`,
      detailHi: `अगले ${SPRAY_DRY_HOURS} घंटे बारिश नहीं और हवा कम रहेगी।`,
    };
  }

  const nextGood = next.findIndex((_, i) => i + SPRAY_DRY_HOURS <= next.length && windowFrom(i));
  const blocker = next.slice(0, SPRAY_DRY_HOURS).find((h) => !safe(h));
  const windy = blocker && blocker.windSpeed >= SPRAY_WIND_LIMIT_KMH;

  return {
    id: 'spray',
    level: 'warn',
    title: windy ? 'Too windy to spray' : 'Do not spray — rain expected',
    titleHi: windy ? 'छिड़काव के लिए हवा तेज़ है' : 'छिड़काव न करें — बारिश आ रही है',
    detail:
      nextGood > 0
        ? `Wait until about ${fmtHour(next[nextGood].time)}, when it should stay dry and calm.`
        : 'No clear window in the next two days. Check again tomorrow.',
    detailHi:
      nextGood > 0
        ? `लगभग ${fmtHour(next[nextGood].time)} तक रुकें, तब मौसम सूखा और शांत रहेगा।`
        : 'अगले दो दिन कोई सही समय नहीं। कल फिर देखें।',
  };
}

function irrigationAdvisory(daily: ForecastDay[]): Advisory | null {
  const window = daily.slice(0, DRY_SPELL_DAYS);
  if (!window.length) return null;

  const total = window.reduce((s, d) => s + d.precipitation, 0);
  const wet = daily.slice(0, 2).find((d) => d.precipitation >= HEAVY_RAIN_MM_PER_DAY);

  if (wet) {
    return {
      id: 'irrigation',
      level: 'info',
      title: 'Skip irrigation',
      titleHi: 'सिंचाई टालें',
      detail: `Heavy rain expected ${fmtDay(wet.date)} — about ${Math.round(wet.precipitation)}mm. Save the water and the diesel.`,
      detailHi: `${fmtDay(wet.date)} को तेज़ बारिश — लगभग ${Math.round(wet.precipitation)}mm। पानी और डीज़ल बचाएं।`,
    };
  }

  if (total < DRY_SPELL_MM) {
    return {
      id: 'irrigation',
      level: 'warn',
      title: 'Dry spell ahead — plan irrigation',
      titleHi: 'सूखा दौर आ रहा है — सिंचाई की योजना बनाएं',
      detail: `Almost no rain expected over the next ${DRY_SPELL_DAYS} days.`,
      detailHi: `अगले ${DRY_SPELL_DAYS} दिन लगभग बारिश नहीं होगी।`,
    };
  }

  return null;
}

function extremeAdvisories(daily: ForecastDay[]): Advisory[] {
  const out: Advisory[] = [];

  const hot = daily.slice(0, 5).find((d) => d.tempMax >= HEAT_STRESS_C);
  if (hot) {
    out.push({
      id: 'heat',
      level: 'danger',
      title: 'Heat stress risk',
      titleHi: 'गर्मी से नुकसान का खतरा',
      detail: `${Math.round(hot.tempMax)}°C expected ${fmtDay(hot.date)}. Irrigate early morning or evening, not midday.`,
      detailHi: `${fmtDay(hot.date)} को ${Math.round(hot.tempMax)}°C। सुबह जल्दी या शाम को सिंचाई करें, दोपहर में नहीं।`,
    });
  }

  const cold = daily.slice(0, 5).find((d) => d.tempMin <= FROST_C);
  if (cold) {
    out.push({
      id: 'frost',
      level: 'danger',
      title: 'Frost risk',
      titleHi: 'पाले का खतरा',
      detail: `Low of ${Math.round(cold.tempMin)}°C on ${fmtDay(cold.date)}. Light irrigation the evening before helps protect the crop.`,
      detailHi: `${fmtDay(cold.date)} को न्यूनतम ${Math.round(cold.tempMin)}°C। एक शाम पहले हल्की सिंचाई फसल बचाती है।`,
    });
  }

  const storm = daily.slice(0, 5).find((d) => d.precipitation >= HEAVY_RAIN_MM_PER_DAY);
  if (storm) {
    out.push({
      id: 'heavy-rain',
      level: 'warn',
      title: 'Heavy rain expected',
      titleHi: 'भारी बारिश की संभावना',
      detail: `About ${Math.round(storm.precipitation)}mm on ${fmtDay(storm.date)}. Check drainage, and harvest anything ready.`,
      detailHi: `${fmtDay(storm.date)} को लगभग ${Math.round(storm.precipitation)}mm। जल निकासी देखें, और तैयार फसल काट लें।`,
    });
  }

  return out;
}

/**
 * Turns the raw forecast into things a farmer can act on today.
 *
 * All of it is derived from the free Open-Meteo forecast — no sensors, no
 * subscription, no field hardware. Ordered most urgent first, since the first
 * card is the one that actually gets read.
 */
export function useFarmAdvisory() {
  const { hourly, daily, loading, isLive } = useWeather();

  const advisories = useMemo(() => {
    if (!hourly.length && !daily.length) return [];

    const list = [
      ...extremeAdvisories(daily),
      sprayAdvisory(hourly),
      irrigationAdvisory(daily),
    ].filter(Boolean) as Advisory[];

    const rank: Record<AdvisoryLevel, number> = { danger: 0, warn: 1, ok: 2, info: 3 };
    return list.sort((a, b) => rank[a.level] - rank[b.level]);
  }, [hourly, daily]);

  return { advisories, daily, loading, isLive };
}
