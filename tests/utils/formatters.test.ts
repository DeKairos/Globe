import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatRate, formatPercentage, parsePopulation } from '@utils/formatters';
import { validateCountryCode, validateCurrencyCode, validateTimezone, validateCoordinates, validateAmount } from '@utils/validators';

describe('formatters', () => {
  describe('formatNumber', () => {
    it('should format large numbers with abbreviations', () => {
      expect(formatNumber(1234567)).toBe('1.2M');
    });

    it('should format small numbers', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with symbol', () => {
      const result = formatCurrency(1234.56, '$');
      expect(result).toContain('1');
      expect(result).toContain('$');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0, '€');
      expect(result).toContain('0');
    });
  });

  describe('formatRate', () => {
    it('should format exchange rate', () => {
      const result = formatRate(0.85);
      expect(result).toContain('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage', () => {
      const result = formatPercentage(0.85);
      expect(result).toContain('85');
    });
  });

  describe('parsePopulation', () => {
    it('should parse population string', () => {
      expect(parsePopulation('331M')).toBe(331000000);
      expect(parsePopulation('67.9M')).toBe(67900000);
    });

    it('should handle billions', () => {
      expect(parsePopulation('1.4B')).toBe(1400000000);
    });

    it('should return NaN for invalid input', () => {
      expect(isNaN(parsePopulation('invalid'))).toBe(true);
    });
  });
});

describe('validators', () => {
  describe('validateCountryCode', () => {
    it('should accept valid country codes', () => {
      expect(validateCountryCode('US')).toBe(true);
      expect(validateCountryCode('GB')).toBe(true);
      expect(validateCountryCode('JP')).toBe(true);
    });

    it('should reject invalid country codes', () => {
      expect(validateCountryCode('XX')).toBe(false);
      expect(validateCountryCode('us')).toBe(false);
    });
  });

  describe('validateCurrencyCode', () => {
    it('should accept valid currency codes', () => {
      expect(validateCurrencyCode('USD')).toBe(true);
      expect(validateCurrencyCode('EUR')).toBe(true);
    });

    it('should reject invalid currency codes', () => {
      expect(validateCurrencyCode('US')).toBe(false);
      expect(validateCurrencyCode('usd')).toBe(false);
    });
  });

  describe('validateTimezone', () => {
    it('should accept valid timezones', () => {
      expect(validateTimezone('America/New_York')).toBe(true);
      expect(validateTimezone('Europe/London')).toBe(true);
    });

    it('should reject invalid timezones', () => {
      expect(validateTimezone('Invalid/Timezone')).toBe(false);
    });
  });

  describe('validateCoordinates', () => {
    it('should accept valid coordinates', () => {
      expect(validateCoordinates(40.7128, -74.0060)).toBe(true);
      expect(validateCoordinates(-33.8688, 151.2093)).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      expect(validateCoordinates(100, -74.0060)).toBe(false);
      expect(validateCoordinates(40.7128, 200)).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should accept valid amounts', () => {
      expect(validateAmount(100)).toBe(true);
      expect(validateAmount(0.5)).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAmount(-100)).toBe(false);
    });
  });
});