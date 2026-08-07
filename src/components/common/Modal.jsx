import { X } from 'lucide-react';
import { useEffect, useId } from 'react';

const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function Modal({ open, onClose, title, children, size = 'md', footer, hideClose = false }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const previouslyFocused = document.activeElement;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`animate-zoom-in w-full ${sizes[size]} card max-h-[90vh] overflow-hidden shadow-2xl`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
          <h3 id={titleId} className="text-lg font-bold text-slate-900">
            {title}
          </h3>
          {!hideClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
