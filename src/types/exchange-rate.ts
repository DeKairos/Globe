import { z } from 'zod';

export const ExchangeRateResponseSchema = z.object({
  result: z.literal('success'),
  documentation: z.string(),
  terms_of_use: z.string(),
  time_last_update_unix: z.number(),
  time_last_update_utc: z.string(),
  time_next_update_unix: z.number(),
  time_next_update_utc: z.string(),
  base_code: z.string(),
  rates: z.record(z.string(), z.number()),
});

export type ExchangeRateResponse = z.infer<typeof ExchangeRateResponseSchema>;

export const CurrencyConversionSchema = z.object({
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  amount: z.number().positive(),
  convertedAmount: z.number(),
  rate: z.number(),
  timestamp: z.string().datetime(),
});

export type CurrencyConversion = z.infer<typeof CurrencyConversionSchema>;

export const CACHE_TTL = 10 * 60 * 1000; // 10 minutes