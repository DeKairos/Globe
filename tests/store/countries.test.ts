import { describe, it, expect, beforeEach } from 'vitest';
import { allCountries, selectedFrom, selectedTo, fromCountry, toCountry, setFromCountry, setToCountry, swapCountries } from '@store/countries';
import type { CountryCode } from '@app-types/country';

describe('countries store', () => {
  beforeEach(() => {
    selectedFrom.set('US');
    selectedTo.set('GB');
  });

  it('should have all countries loaded', () => {
    const countries = allCountries.get();
    expect(countries.length).toBeGreaterThan(0);
  });

  it('should have US as first selected country', () => {
    expect(selectedFrom.get()).toBe('US');
  });

  it('should have GB as second selected country', () => {
    expect(selectedTo.get()).toBe('GB');
  });

  it('should return country objects from computed stores', () => {
    const from = fromCountry.get();
    const to = toCountry.get();
    expect(from).toBeDefined();
    expect(to).toBeDefined();
    expect(from?.code).toBe('US');
    expect(to?.code).toBe('GB');
  });

  it('should set from country', () => {
    setFromCountry('JP');
    expect(selectedFrom.get()).toBe('JP');
  });

  it('should set to country', () => {
    setToCountry('FR');
    expect(selectedTo.get()).toBe('FR');
  });

  it('should swap countries', () => {
    setFromCountry('US');
    setToCountry('JP');
    swapCountries();
    expect(selectedFrom.get()).toBe('JP');
    expect(selectedTo.get()).toBe('US');
  });

  it('should find country by code', () => {
    const countries = allCountries.get();
    const us = countries.find((c) => c.code === 'US');
    expect(us).toBeDefined();
    expect(us?.name).toBe('United States');
  });

  it('should have required fields for each country', () => {
    const countries = allCountries.get();
    const requiredFields = ['code', 'name', 'flag', 'capital', 'population', 'continent', 'timezone', 'currency', 'lat', 'lng'];

    countries.forEach((country) => {
      requiredFields.forEach((field) => {
        expect(country).toHaveProperty(field);
      });
    });
  });
});