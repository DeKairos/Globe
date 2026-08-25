import { atom, computed } from 'nanostores';
import type { Country, CountryCode } from '@app-types';
import countriesData from '@data/countries.json';

export const allCountries = atom<Country[]>(countriesData.countries);

export const selectedFrom = atom<CountryCode>('US');
export const selectedTo = atom<CountryCode>('GB');

export const fromCountry = computed([allCountries, selectedFrom], (countries, code) =>
  countries.find((c) => c.code === code)
);

export const toCountry = computed([allCountries, selectedTo], (countries, code) =>
  countries.find((c) => c.code === code)
);

export function swapCountries(): void {
  const from = selectedFrom.get();
  const to = selectedTo.get();
  selectedFrom.set(to);
  selectedTo.set(from);
}

export function setFromCountry(code: CountryCode): void {
  if (allCountries.get().some((c) => c.code === code)) {
    selectedFrom.set(code);
  }
}

export function setToCountry(code: CountryCode): void {
  if (allCountries.get().some((c) => c.code === code)) {
    selectedTo.set(code);
  }
}

export const areCountriesSelected = computed(
  [selectedFrom, selectedTo],
  (from, to) => from && to && from !== to
);

export const selectedCountries = computed(
  [fromCountry, toCountry],
  (from, to) => ({ from, to })
);