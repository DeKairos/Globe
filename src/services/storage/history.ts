import type { CountryCode } from '@app-types/country';

const HISTORY_KEY = 'comparisonHistory';
const MAX_HISTORY = 10;
const STORAGE_VERSION = 1;

interface HistoryEntry {
  from: CountryCode;
  to: CountryCode;
  timestamp: string;
}

async function getFromIndexedDB(): Promise<HistoryEntry[] | null> {
  try {
    const { openDB } = await import('idb');
    const db = await openDB('globe-connect', STORAGE_VERSION, {
      upgrade(db) {
        db.createObjectStore('history');
      },
    });
    const data = await db.get('history', HISTORY_KEY);
    if (data && data.version === STORAGE_VERSION) {
      return data.history;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveToIndexedDB(history: HistoryEntry[]): Promise<void> {
  try {
    const { openDB } = await import('idb');
    const db = await openDB('globe-connect', STORAGE_VERSION, {
      upgrade(db) {
        db.createObjectStore('history');
      },
    });
    await db.put('history', { version: STORAGE_VERSION, history }, HISTORY_KEY);
  } catch {
    // Silently fail
  }
}

function getFromLocalStorage(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.version === STORAGE_VERSION && Array.isArray(data.history)) {
        return data.history;
      }
    }
    return [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(history: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      history,
    }));
  } catch {
    // Silently fail
  }
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const indexed = await getFromIndexedDB();
  if (indexed) return indexed;
  return getFromLocalStorage();
}

export async function addToHistory(from: CountryCode, to: CountryCode): Promise<void> {
  const history = await getHistory();
  const entry: HistoryEntry = {
    from,
    to,
    timestamp: new Date().toISOString(),
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }
  await saveToIndexedDB(history);
  saveToLocalStorage(history);
}

export async function clearHistory(): Promise<void> {
  await saveToIndexedDB([]);
  saveToLocalStorage([]);
}