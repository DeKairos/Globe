import { describe, it, expect } from 'vitest';
import { calculateDistance, estimateFlightTime, formatDistance } from '@services/geo/distance';

describe('calculateDistance', () => {
  it('should calculate distance between same point as 0', () => {
    expect(calculateDistance(0, 0, 0, 0)).toBe(0);
  });

  it('should calculate distance between London and New York', () => {
    const dist = calculateDistance(51.5074, -0.1278, 40.7128, -74.0060);
    expect(dist).toBeGreaterThan(5000);
    expect(dist).toBeLessThan(6000);
  });

  it('should calculate distance between Sydney and Tokyo', () => {
    const dist = calculateDistance(-33.8688, 151.2093, 35.6762, 139.6503);
    expect(dist).toBeGreaterThan(7000);
    expect(dist).toBeLessThan(9000);
  });

  it('should be commutative', () => {
    const d1 = calculateDistance(51.5074, -0.1278, 40.7128, -74.0060);
    const d2 = calculateDistance(40.7128, -74.0060, 51.5074, -0.1278);
    expect(d1).toBeCloseTo(d2, 0);
  });
});

describe('estimateFlightTime', () => {
  it('should estimate flight time for London to New York', () => {
    const time = estimateFlightTime(51.5074, -0.1278, 40.7128, -74.0060);
    expect(time).toMatch(/\d+h/);
  });

  it('should return shorter time for closer destinations', () => {
    const short = estimateFlightTime(51.5074, -0.1278, 48.8566, 2.3522);
    const long = estimateFlightTime(51.5074, -0.1278, 40.7128, -74.0060);
    expect(parseInt(short)).toBeLessThan(parseInt(long));
  });
});

describe('formatDistance', () => {
  it('should format distance in km', () => {
    expect(formatDistance(500)).toBe('500 km');
  });

  it('should format large distance with units', () => {
    const result = formatDistance(5500);
    expect(result).toContain('km');
  });
});