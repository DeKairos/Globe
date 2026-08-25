import { CountryCode, isValidCountryCode } from '@app-types/country';

export function validateCountryCode(code: string): code is CountryCode {
  return isValidCountryCode(code);
}

export function validateCurrencyCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

export function validateTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function validateAmount(amount: number): boolean {
  return !isNaN(amount) && amount >= 0 && isFinite(amount);
}