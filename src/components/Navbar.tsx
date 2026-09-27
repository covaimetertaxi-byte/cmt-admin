import React from 'react';
import { LogOut, Shield } from 'lucide-react';

interface NavbarProps {
  onLogout?: () => void;
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout, onOpenLegal }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight leading-tight">
              Covai Meter Taxi
            </h1>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {onOpenLegal && (
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition cursor-pointer"
              title="Privacy Policy & Terms for Google Play Console"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Legal & Privacy</span>
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition cursor-pointer"
              title="Lock Admin Portal"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
