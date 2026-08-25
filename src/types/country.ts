import { z } from 'zod';

export const CountrySchema = z.object({
  code: z.string().length(2),
  name: z.string(),
  flag: z.string(),
  capital: z.string(),
  population: z.string(),
  continent: z.string(),
  timezone: z.string(),
  currency: z.string().length(3),
  currencyName: z.string(),
  currencySymbol: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export type Country = z.infer<typeof CountrySchema>;

export const CountriesDataSchema = z.object({
  countries: z.array(CountrySchema),
});

export type CountriesData = z.infer<typeof CountriesDataSchema>;

export const COUNTRY_CODES = [
  'US', 'GB', 'IN', 'AU', 'JP', 'RU', 'CN', 'DE', 'FR', 'BR',
  'CA', 'MX', 'ZA', 'EG', 'SG', 'IT', 'ES', 'NZ', 'IS', 'SE',
  'NO', 'FI', 'TR', 'KR', 'PK', 'AE', 'IE', 'AT', 'PH', 'BE',
  'IR', 'CH', 'NL', 'TH', 'VN', 'ID', 'MY', 'BN', 'BD', 'LK',
  'TN', 'MA', 'NG', 'KE', 'GH', 'AR', 'PE', 'CO', 'CL',
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export function isValidCountryCode(code: string): code is CountryCode {
  return COUNTRY_CODES.includes(code as CountryCode);
}