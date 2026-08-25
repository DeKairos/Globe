import type { CountryCode } from '@app-types/country';

export function parseURLParams(
  setFrom: (code: CountryCode) => void,
  setTo: (code: CountryCode) => void
): void {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from');
  const to = params.get('to');

  if (from && isValidCountryCode(from)) {
    setFrom(from as CountryCode);
  }
  if (to && isValidCountryCode(to)) {
    setTo(to as CountryCode);
  }
}

const VALID_CODES = new Set([
  'US', 'GB', 'IN', 'AU', 'JP', 'RU', 'CN', 'DE', 'FR', 'BR',
  'CA', 'MX', 'ZA', 'EG', 'SG', 'IT', 'ES', 'NZ', 'IS', 'SE',
  'NO', 'FI', 'TR', 'KR', 'PK', 'AE', 'IE', 'AT', 'PH', 'BE',
  'IR', 'CH', 'NL', 'TH', 'VN', 'ID', 'MY', 'BN', 'BD', 'LK',
  'TN', 'MA', 'NG', 'KE', 'GH', 'AR', 'PE', 'CO', 'CL',
]);

function isValidCountryCode(code: string): code is CountryCode {
  return VALID_CODES.has(code);
}

export function generateShareUrl(from: CountryCode, to: CountryCode): string {
  const url = new URL(window.location.href);
  url.searchParams.set('from', from);
  url.searchParams.set('to', to);
  return url.toString();
}