import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { toasts, type Toast } from '@store/ui';

export function useToast() {
  const toastsList = useStore(toasts);
  return { toasts: toastsList, addToast };
}

function addToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const toast: Toast = { id, message, type, duration };
  toasts.set([...toasts.get(), toast]);
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }
  return id;
}

function removeToast(id: string) {
  toasts.set(toasts.get().filter((t) => t.id !== id));
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export { useFavoriteStatus } from './useFavoriteStatus';