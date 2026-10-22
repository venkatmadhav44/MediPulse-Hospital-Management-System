import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * HCI-Enhanced Modal Component
 *
 * Improvements applied:
 * 1. ARIA: aria-labelledby + aria-describedby (WCAG 2.1 AA, Nielsen H4 - Consistency)
 * 2. Focus Trap: Tab/Shift+Tab cycles within the modal only (Nielsen H3 - User Control)
 * 3. Auto-focus: First focusable element receives focus on open (Norman - Feedback/Mapping)
 * 4. Escape key close: already present — user can always exit (Shneiderman Rule 3)
 */
export default function Modal({ isOpen, onClose, title, subtitle, children, footer, size = 'md' }) {
  const dialogRef = useRef(null);
  const titleId = `modal-title-${Math.random().toString(36).slice(2, 7)}`;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // HCI: Focus Trap — Nielsen H3 (User Control & Freedom)
      // Keyboard users must not escape the modal accidentally into background content.
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // HCI: Auto-focus — Norman (Mapping), reduces user effort to start interacting
      // Focus moves to first focusable element inside the modal after it opens
      requestAnimationFrame(() => {
        if (dialogRef.current) {
          const focusable = dialogRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          focusable?.focus();
        }
      });
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'lg' ? 'modal-lg' : size === 'xl' ? 'modal-xl' : '';

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        className={`modal-dialog ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? `${titleId}-desc` : undefined}
      >
        <div className="modal-header">
          <div>
            {/* HCI: Explicit modal title ID for aria-labelledby (WCAG 2.1 AA) */}
            <h3 id={titleId} style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {title}
            </h3>
            {subtitle && (
              <p id={`${titleId}-desc`} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {subtitle}
              </p>
            )}
          </div>
          {/* HCI: Descriptive aria-label on close button (WCAG 2.1, Nielsen H4) */}
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label={`Close ${title} dialog`}
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
