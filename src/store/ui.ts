import { atom } from 'nanostores';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const toasts = atom<Toast[]>([]);

export function addToast(message: string, type: ToastType = 'info', duration = 3000): string {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  toasts.set([...toasts.get(), { id, message, type, duration }]);
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }
  return id;
}

export function removeToast(id: string): void {
  toasts.set(toasts.get().filter((t) => t.id !== id));
}

export function clearToasts(): void {
  toasts.set([]);
}

export const isLoading = atom<Record<string, boolean>>({});

export function setLoading(key: string, loading: boolean): void {
  isLoading.set({ ...isLoading.get(), [key]: loading });
}

export const modals = atom<Record<string, boolean>>({});

export function openModal(key: string): void {
  modals.set({ ...modals.get(), [key]: true });
}

export function closeModal(key: string): void {
  modals.set({ ...modals.get(), [key]: false });
}

export function closeAllModals(): void {
  modals.set({});
}

export const globeView = atom<'day' | 'night'>('night');

export function toggleGlobeView(): void {
  globeView.set(globeView.get() === 'day' ? 'night' : 'day');
}