import { useStore } from '@nanostores/react';
import { toasts, removeToast } from '@store/ui';
import { useEffect } from 'react';

export function ToastContainer() {
  const toastList = useStore(toasts);

  useEffect(() => {
    toastList.forEach((toast) => {
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => removeToast(toast.id), toast.duration);
        return () => clearTimeout(timer);
      }
    });
  }, [toastList]);

  if (toastList.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`toast pointer-events-auto animate-slide-in ${
            toast.type === 'success' && 'toast-success'
          } ${toast.type === 'error' && 'toast-error'}
            ${toast.type === 'info' && 'toast-info'}
            ${toast.type === 'warning' && 'toast-warning'}`}
          role="alert"
          aria-live="polite"
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded hover:bg-white/20 transition-colors"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}