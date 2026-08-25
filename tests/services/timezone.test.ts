import { describe, it, expect } from 'vitest';
import { formatTime, formatTime24, calculateTimeDifference, convertTime } from '@services/geo/timezone';

describe('formatTime', () => {
  it('should format time with timezone', () => {
    const time = formatTime(new Date('2024-01-15T14:30:00'), 'America/New_York');
    expect(time).toMatch(/\d{2}:\d{2}/);
  });

  it('should return fallback for missing timezone', () => {
    const time = formatTime(new Date(), '');
    expect(typeof time).toBe('string');
    expect(time.length).toBeGreaterThan(0);
  });
});

describe('formatTime24', () => {
  it('should format time in 24h format', () => {
    const time = formatTime24(new Date('2024-01-15T14:30:00'), 'Europe/London');
    expect(time).toMatch(/\d{2}:\d{2}/);
  });
});

describe('calculateTimeDifference', () => {
  it('should return Same time for same timezone', () => {
    const diff = calculateTimeDifference('America/New_York', 'America/New_York');
    expect(diff).toBe('Same time');
  });

  it('should return different time for different timezones', () => {
    const diff = calculateTimeDifference('America/New_York', 'Asia/Tokyo');
    expect(diff).not.toBe('Same time');
    expect(typeof diff).toBe('string');
  });
});

describe('convertTime', () => {
  it('should convert time between timezones', () => {
    const result = convertTime('14:00', 'America/New_York', 'Europe/London');
    expect(result).toHaveProperty('time');
    expect(result).toHaveProperty('dayDiff');
    expect(result.time).toMatch(/\d{2}:\d{2}/);
  });

  it('should return a time string for same timezone', () => {
    const result = convertTime('14:00', 'America/New_York', 'America/New_York');
    expect(typeof result.time).toBe('string');
    expect(typeof result.dayDiff).toBe('number');
  });
});