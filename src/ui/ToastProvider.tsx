import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: ReactNode;
  autoClose?: number; // ms
}

interface ToastContextType {
  success: (msg: string | ReactNode, options?: { autoClose?: number }) => void;
  error: (msg: string | ReactNode, options?: { autoClose?: number }) => void;
  info: (msg: string | ReactNode, options?: { autoClose?: number }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const show = useCallback((type: Toast['type'], message: ReactNode, options?: { autoClose?: number }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message, autoClose: options?.autoClose }]);
    if (options?.autoClose) {
      setTimeout(() => removeToast(id), options.autoClose);
    }
  }, []);

  const contextValue: ToastContextType = {
    success: (msg, options) => show('success', msg, options),
    error: (msg, options) => show('error', msg, options),
    info: (msg, options) => show('info', msg, options),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed z-50 bottom-6 right-6 flex flex-col gap-3 items-end pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[260px] max-w-sm px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in-up pointer-events-auto
              ${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
              ${toast.type === 'info' ? 'bg-blue-700 text-white' : ''}
            `}
            style={{ animation: 'fade-in-up 0.3s' }}
          >
            {toast.type === 'success' && (
              <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
            )}
            <span className="flex-1 text-base font-medium leading-snug">{toast.message}</span>
            <button
              className="ml-2 text-white hover:text-gray-300 focus:outline-none transition-colors duration-150"
              onClick={() => removeToast(toast.id)}
              tabIndex={-1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}; 