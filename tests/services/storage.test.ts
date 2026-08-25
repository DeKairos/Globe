import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getFavorites, addFavorite, removeFavorite, toggleFavorite, isFavorite } from '@services/storage/favorites';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage });

describe('favorites storage', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  it('should start with empty favorites', async () => {
    const favorites = await getFavorites();
    expect(Array.isArray(favorites)).toBe(true);
  });

  it('should add a favorite', async () => {
    await addFavorite('US');
    const favorites = await getFavorites();
    expect(favorites).toContain('US');
  });

  it('should not duplicate favorites', async () => {
    await addFavorite('US');
    await addFavorite('US');
    const favorites = await getFavorites();
    const usCount = favorites.filter((f) => f === 'US').length;
    expect(usCount).toBe(1);
  });

  it('should remove a favorite', async () => {
    await addFavorite('US');
    await removeFavorite('US');
    const favorites = await getFavorites();
    expect(favorites).not.toContain('US');
  });

  it('should toggle favorite on', async () => {
    const result = await toggleFavorite('GB');
    expect(result).toBe(true);
    expect(await isFavorite('GB')).toBe(true);
  });

  it('should toggle favorite off', async () => {
    await addFavorite('GB');
    const result = await toggleFavorite('GB');
    expect(result).toBe(false);
    expect(await isFavorite('GB')).toBe(false);
  });

  it('should check if favorite', async () => {
    expect(await isFavorite('DE')).toBe(false);
    await addFavorite('DE');
    expect(await isFavorite('DE')).toBe(true);
  });
});