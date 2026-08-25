import { computed } from 'nanostores';
import { fromCountry, toCountry, selectedFrom, selectedTo } from './countries';
import { calculateDistance, estimateFlightTime, formatDistance } from '@services/geo';
import { calculateTimeDifference, formatTime } from '@services/geo/timezone';

export const distance = computed([fromCountry, toCountry], (from, to) => {
  if (!from || !to) return null;
  return calculateDistance(from.lat, from.lng, to.lat, to.lng);
});

export const flightTime = computed([fromCountry, toCountry], (from, to) => {
  if (!from || !to) return null;
  return estimateFlightTime(from.lat, from.lng, to.lat, to.lng);
});

export const timeDifference = computed([selectedFrom, selectedTo], (from, to) => {
  if (!from || !to) return null;
  const fromC = fromCountry.get();
  const toC = toCountry.get();
  if (!fromC || !toC) return null;
  return calculateTimeDifference(fromC.timezone, toC.timezone);
});

export const route = computed([fromCountry, toCountry], (from, to) => {
  if (!from || !to) return null;
  return `${from.capital} → ${to.capital}`;
});

export const formattedDistance = computed([distance], (dist) =>
  dist !== null ? formatDistance(dist) : null
);

export const currentTimes = computed([fromCountry, toCountry], (from, to) => {
  const now = new Date();
  return {
    from: from ? formatTime(now, from.timezone) : '--:--:--',
    to: to ? formatTime(now, to.timezone) : '--:--:--',
  };
});

export const quickFacts = computed([fromCountry, toCountry], (from, to) => {
  if (!from || !to) return [];

  const facts: Array<{ icon: string; text: string }> = [];

  const dist = distance.get();
  if (dist !== null) {
    if (dist > 10000) {
      facts.push({
        icon: '🌏',
        text: `These countries are ${Math.round(dist)} km apart - that's ${Math.round((dist / 40075) * 100)}% of Earth's circumference!`,
      });
    } else if (dist < 1000) {
      facts.push({
        icon: '🚗',
        text: `These countries are very close at only ${Math.round(dist)} km - you could drive it!`,
      });
    }
  }

  const timeDiff = timeDifference.get();
  if (timeDiff && timeDiff !== 'Same time') {
    facts.push({
      icon: '🕐',
      text: `There's a ${timeDiff} time difference between these countries`,
    });
  } else if (timeDiff === 'Same time') {
    facts.push({
      icon: '🕐',
      text: 'Both countries share the same timezone!',
    });
  }

  if (from.currency === to.currency) {
    facts.push({
      icon: '💱',
      text: `Both countries use the ${from.currencyName}`,
    });
  } else {
    facts.push({
      icon: '💱',
      text: `${from.name} uses ${from.currency} while ${to.name} uses ${to.currency}`,
    });
  }

  if (from.continent === to.continent) {
    facts.push({
      icon: '🗺️',
      text: `Both countries are located in ${from.continent}`,
    });
  } else {
    facts.push({
      icon: '🗺️',
      text: `Comparing ${from.continent} with ${to.continent}`,
    });
  }

  const fromPop = parseFloat(from.population.replace(/[MBK]/g, ''));
  const toPop = parseFloat(to.population.replace(/[MBK]/g, ''));
  const fromMult = from.population.includes('B') ? 1e9 : from.population.includes('M') ? 1e6 : 1e3;
  const toMult = to.population.includes('B') ? 1e9 : to.population.includes('M') ? 1e6 : 1e3;

  const fromPopNum = fromPop * fromMult;
  const toPopNum = toPop * toMult;

  if (!isNaN(fromPopNum) && !isNaN(toPopNum)) {
    const ratio = Math.max(fromPopNum, toPopNum) / Math.min(fromPopNum, toPopNum);
    if (ratio > 5) {
      const larger = fromPopNum > toPopNum ? from.name : to.name;
      facts.push({
        icon: '👥',
        text: `${larger} has ${ratio.toFixed(1)}x more population`,
      });
    }
  }

  return facts;
});

export const exchangeRate = computed(
  [fromCountry, toCountry],
  (from, to) => {
    if (!from || !to) return null;
    // This will be updated by the currency service
    return { fromCurrency: from.currency, toCurrency: to.currency };
  }
);

export type ComparisonData = {
  distance: number | null;
  flightTime: string | null;
  timeDifference: string | null;
  route: string | null;
  formattedDistance: string | null;
  currentTimes: { from: string; to: string };
  quickFacts: Array<{ icon: string; text: string }>;
  exchangeRate: { fromCurrency: string; toCurrency: string } | null;
};