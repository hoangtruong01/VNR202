// ============================================================
// Toast Component — Beautiful notifications
// ============================================================
'use client';

import { useEffect, useState, useCallback } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
let addToastFn: ((msg: string, type: ToastMessage['type']) => void) | null = null;

/** Show a toast notification from anywhere */
export function showToast(message: string, type: ToastMessage['type'] = 'info') {
  addToastFn?.(message, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  return (
    <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-visible toast-${toast.type}`}
          style={{ position: 'relative', transform: 'none', pointerEvents: 'auto' }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
