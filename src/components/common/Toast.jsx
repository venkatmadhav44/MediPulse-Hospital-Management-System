import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

/**
 * HCI-Enhanced Toast Notification System
 *
 * Improvements applied:
 * 1. 'warning' type added — Shneiderman Rule 2 (Differentiated Informative Feedback)
 *    Four distinct types: success ✓ / info ℹ / warning ⚠ / danger ✗
 *    Each uses colour + icon to communicate severity without relying on text alone.
 * 2. ARIA role="alert" on container — WCAG 2.1 AA (Screen reader announces notifications)
 * 3. ARIA aria-live="polite" for non-critical messages — Nielsen H1 (Visibility of status)
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} color="var(--emerald-600)" aria-hidden="true" />;
      case 'danger':  return <AlertCircle  size={18} color="var(--rose-600)"    aria-hidden="true" />;
      // HCI: Warning icon — amber colour signals caution without alarm (Shneiderman Rule 2)
      case 'warning': return <AlertTriangle size={18} color="var(--amber-600)"  aria-hidden="true" />;
      case 'info':
      default:        return <Info          size={18} color="var(--primary-600)" aria-hidden="true" />;
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'success': return 'toast-success';
      case 'danger':  return 'toast-danger';
      case 'warning': return 'toast-warning';
      default:        return 'toast-info';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/*
        HCI: aria-live="assertive" for toast container — WCAG 2.1 AA
        Screen readers announce the toast message when it appears, even without focus.
        role="status" is polite; for danger/warning, individual toasts could use role="alert"
      */}
      <div
        className="toast-container"
        role="status"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Notifications"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast-item ${getTypeClass(toast.type)}`}
            role={toast.type === 'danger' || toast.type === 'warning' ? 'alert' : 'status'}
          >
            {getToastIcon(toast.type)}
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
              {toast.message}
            </span>
            {/* HCI: Explicit dismiss — Shneiderman Rule 3 (Easy reversal of actions) */}
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-icon"
              style={{ padding: 4 }}
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
