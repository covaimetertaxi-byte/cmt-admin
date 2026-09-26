import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types/driver';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
        let borderClass = 'border-emerald-200 bg-white';
        let titleColor = 'text-emerald-950';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-600" />;
          borderClass = 'border-rose-200 bg-white';
          titleColor = 'text-rose-950';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
          borderClass = 'border-amber-200 bg-white';
          titleColor = 'text-amber-950';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-600" />;
          borderClass = 'border-blue-200 bg-white';
          titleColor = 'text-blue-950';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border ${borderClass} flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h5 className={`text-xs font-bold ${titleColor}`}>{toast.title}</h5>
              {toast.message && (
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
