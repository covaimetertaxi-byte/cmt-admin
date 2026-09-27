import React, { useState } from 'react';
import { Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onOpenLegal }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Expected Admin PIN from .env (defaults to '1234')
  const envPin = (import.meta.env.VITE_ADMIN_PIN || '1234').toString().trim();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setError('Please enter your password / PIN');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (pin.trim() === envPin) {
        try {
          sessionStorage.setItem('cmt_admin_authenticated', 'true');
        } catch {}
        onLoginSuccess();
      } else {
        setError('Incorrect PIN. Please try again.');
        setIsLoading(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-purple-100 selection:text-purple-900">
      {/* Responsive Card Container for Mobile, Tablet & Desktop */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl sm:rounded-[36px] shadow-xl sm:shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-9 transition-all">
        {/* Soft Purple Curve Shape (Top Right) */}
        <div className="absolute -top-12 -right-12 w-56 h-56 sm:w-72 sm:h-72 bg-gradient-to-br from-purple-200/70 via-purple-100/50 to-purple-50/20 rounded-full blur-xs pointer-events-none -z-0" />
        <div className="absolute top-0 right-0 w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-b from-purple-100/40 to-transparent rounded-bl-[120px] pointer-events-none -z-0" />

        {/* Header Section */}
        <div className="relative z-10 pt-4 sm:pt-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Admin console access
          </p>
        </div>

        {/* Center Form Section */}
        <form onSubmit={handleSubmit} className="relative z-10 my-8 sm:my-10 space-y-4">
          {/* Password / PIN Input */}
          <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200/50 rounded-2xl px-4 py-3 sm:py-3.5 transition shadow-2xs">
            <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="Password / PIN"
              autoFocus
              className="w-full bg-transparent text-slate-900 font-medium text-sm sm:text-base focus:outline-none placeholder:text-slate-400 tracking-wider"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer shrink-0"
              title={showPin ? 'Hide PIN' : 'View PIN'}
              aria-label={showPin ? 'Hide PIN' : 'View PIN'}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-200 rounded-xl py-2 px-3 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Right-Aligned Floating Login Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !pin}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base rounded-2xl shadow-md shadow-purple-500/25 flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <div className="w-6 h-6 rounded-lg border border-white/40 flex items-center justify-center">
                    <LogIn className="w-3.5 h-3.5" />
                  </div>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Subtle Bottom Accent & Legal Links */}
        <div className="relative z-10 pt-2 pb-1 text-center space-y-2">
          <span className="text-[11px] font-medium text-slate-400 block">
            Covai Meter Taxi · Admin Portal
          </span>
          {onOpenLegal && (
            <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-slate-500">
              <button
                type="button"
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-purple-600 transition cursor-pointer underline-offset-2 hover:underline"
              >
                Privacy Policy
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onOpenLegal('terms')}
                className="hover:text-purple-600 transition cursor-pointer underline-offset-2 hover:underline"
              >
                Terms & Conditions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
