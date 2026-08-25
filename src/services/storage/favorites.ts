import type { CountryCode } from '@app-types/country';

const FAVORITES_KEY = 'countryFavorites';
const STORAGE_VERSION = 1;

async function getFromIndexedDB(): Promise<CountryCode[] | null> {
  try {
    const { openDB } = await import('idb');
    const db = await openDB('globe-connect', STORAGE_VERSION, {
      upgrade(db) {
        db.createObjectStore('favorites');
      },
    });
    const data = await db.get('favorites', FAVORITES_KEY);
    if (data && data.version === STORAGE_VERSION) {
      return data.favorites;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveToIndexedDB(favorites: CountryCode[]): Promise<void> {
  try {
    const { openDB } = await import('idb');
    const db = await openDB('globe-connect', STORAGE_VERSION, {
      upgrade(db) {
        db.createObjectStore('favorites');
      },
    });
    await db.put('favorites', { version: STORAGE_VERSION, favorites, updatedAt: Date.now() }, FAVORITES_KEY);
  } catch {
    // Silently fail
  }
}

function getFromLocalStorage(): CountryCode[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.version === STORAGE_VERSION && Array.isArray(data.favorites)) {
        return data.favorites;
      }
    }
    return [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(favorites: CountryCode[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      favorites,
      updatedAt: Date.now(),
    }));
  } catch {
    // Silently fail
  }
}

export async function getFavorites(): Promise<CountryCode[]> {
  const indexed = await getFromIndexedDB();
  if (indexed) return indexed;
  return getFromLocalStorage();
}

export async function addFavorite(code: CountryCode): Promise<void> {
  const favorites = await getFavorites();
  if (!favorites.includes(code)) {
    favorites.push(code);
    await saveToIndexedDB(favorites);
    saveToLocalStorage(favorites);
  }
}

export async function removeFavorite(code: CountryCode): Promise<void> {
  const favorites = await getFavorites();
  const index = favorites.indexOf(code);
  if (index > -1) {
    favorites.splice(index, 1);
    await saveToIndexedDB(favorites);
    saveToLocalStorage(favorites);
  }
}

export async function toggleFavorite(code: CountryCode): Promise<boolean> {
  const favorites = await getFavorites();
  const isFavorite = favorites.includes(code);
  if (isFavorite) {
    await removeFavorite(code);
    return false;
  } else {
    await addFavorite(code);
    return true;
  }
}

export async function isFavorite(code: CountryCode): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(code);
}