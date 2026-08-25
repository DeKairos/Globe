import type { ExchangeRateResponse } from '@app-types/exchange-rate';

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110,
  CAD: 1.25,
  AUD: 1.35,
  INR: 74,
  CNY: 6.45,
  BRL: 5.2,
  MXN: 20,
  ZAR: 14.5,
  EGP: 15.7,
  SGD: 1.35,
  NZD: 1.42,
  ISK: 129,
  SEK: 8.6,
  RUB: 74,
  NOK: 8.5,
  TRY: 8.5,
  KRW: 1200,
  PKR: 160,
  AED: 3.67,
  PHP: 50,
  IRR: 42000,
  CHF: 0.92,
  THB: 33,
  VND: 23000,
  IDR: 14000,
  MYR: 4.2,
  BND: 1.35,
  BDT: 85,
  LKR: 200,
  TND: 2.8,
  MAD: 9,
  NGN: 410,
  KES: 110,
  GHS: 6,
  ARS: 100,
  PEN: 3.7,
  COP: 3800,
  CLP: 800,
};

interface CacheEntry {
  rates: Record<string, number>;
  timestamp: number;
}

let memoryCache: CacheEntry | null = null;

async function fetchFromAPI(): Promise<Record<string, number>> {
  const response = await fetch(EXCHANGE_RATE_API);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ExchangeRateResponse = await response.json();
  const rates = { ...data.rates, USD: 1 };
  return rates;
}

async function fetchFromIndexedDB(): Promise<Record<string, number> | null> {
  try {
    const { openDB } = await import('idb');
    const db = await openDB('globe-connect', 1, {
      upgrade(db) {
        db.createObjectStore('exchange-rates');
      },
    });
    const entry = await db.get('exchange-rates', 'latest');
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.rates;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveToIndexedDB(rates: Record<string, number>): Promise<void> {
  try {
    const { openDB } = await import('idb');
    const db = await openDB('globe-connect', 1, {
      upgrade(db) {
        db.createObjectStore('exchange-rates');
      },
    });
    await db.put('exchange-rates', { rates, timestamp: Date.now() }, 'latest');
  } catch {
    // Silently fail - IndexedDB not available
  }
}

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL) {
    return memoryCache.rates;
  }

  const indexedRates = await fetchFromIndexedDB();
  if (indexedRates) {
    memoryCache = { rates: indexedRates, timestamp: Date.now() };
    return indexedRates;
  }

  try {
    const rates = await fetchFromAPI();
    memoryCache = { rates, timestamp: Date.now() };
    await saveToIndexedDB(rates);
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    memoryCache = { rates: FALLBACK_RATES, timestamp: Date.now() };
    return FALLBACK_RATES;
  }
}

export function calculateCurrencyConversion(
  fromCurrency: string,
  toCurrency: string,
  amount: number,
  rates: Record<string, number>
): number | null {
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return null;
  }
  const usdAmount = amount / rates[fromCurrency];
  return usdAmount * rates[toCurrency];
}

export function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number | null {
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return null;
  }
  return rates[toCurrency] / rates[fromCurrency];
}

export function getFallbackRates(): Record<string, number> {
  return { ...FALLBACK_RATES };
}

export function isUsingFallback(rates: Record<string, number>): boolean {
  return JSON.stringify(rates) === JSON.stringify(FALLBACK_RATES);
}