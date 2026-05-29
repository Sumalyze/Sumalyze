// src/components/Toast.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);
  const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
          maxWidth: 'calc(100vw - 48px)',
          width: 380,
        }}
      >
        {toasts.map((toast) => {
          let icon = <Info size={18} />;
          let color = '#38bdf8'; // Blue info
          let bgGlow = 'rgba(56, 189, 248, 0.05)';
          let border = 'rgba(56, 189, 248, 0.2)';

          if (toast.type === 'success') {
            icon = <CheckCircle2 size={18} />;
            color = '#34d399'; // Emerald
            bgGlow = 'rgba(52, 211, 153, 0.05)';
            border = 'rgba(52, 211, 153, 0.2)';
          } else if (toast.type === 'error') {
            icon = <AlertCircle size={18} />;
            color = '#f87171'; // Red
            bgGlow = 'rgba(248, 113, 113, 0.05)';
            border = 'rgba(248, 113, 113, 0.2)';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle size={18} />;
            color = '#fbbf24'; // Amber
            bgGlow = 'rgba(251, 191, 36, 0.05)';
            border = 'rgba(251, 191, 36, 0.2)';
          }

          return (
            <div
              key={toast.id}
              className="toast-item"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(14, 4, 22, 0.95)',
                border: `1px solid ${border}`,
                boxShadow: `0 12px 32px rgba(0, 0, 0, 0.5), inset 0 0 12px ${bgGlow}`,
                color: 'white',
                fontSize: 14,
                lineHeight: '20px',
                animation: 'toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left accent bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: color,
                }}
              />
              
              <div style={{ color, marginTop: 1, flexShrink: 0 }}>
                {icon}
              </div>

              <div style={{ flex: 1, paddingRight: 8 }}>
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  padding: 2,
                  marginTop: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  transition: 'color 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
