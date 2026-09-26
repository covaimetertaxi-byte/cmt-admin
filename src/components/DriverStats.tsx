import React from 'react';
import { Users, Smartphone, ShieldCheck, Plus } from 'lucide-react';
import { Driver } from '../types/driver';

interface DriverStatsProps {
  drivers: Driver[];
  onAddNewDriver?: () => void;
}

export const DriverStats: React.FC<DriverStatsProps> = ({ drivers, onAddNewDriver }) => {
  const total = drivers.length;
  const bound = drivers.filter((d) => Boolean(d.deviceBindingId && d.deviceBindingId.trim())).length;
  const unbound = total - bound;
  const activeCount = drivers.filter((d) => d.status === 'Active').length;

  return (
    <div className="space-y-4 mb-5 sm:mb-6">
      {/* Greeting Header (Matching Reference App Header) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            Hi Admin
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage your fleet
          </h2>
        </div>
        {onAddNewDriver && (
          <button
            type="button"
            onClick={onAddNewDriver}
            className="sm:hidden w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center cursor-pointer active:scale-90 transition shadow-2xs"
            title="Add Driver"
            aria-label="Add Driver"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* 3 Squircle Quick Stats (Matching Picture / Video / File in Reference) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Total Fleet (Pink/Rose Squircle) */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-sm transition flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 mb-2">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-tight">
            Total Fleet
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {total} Drivers
          </p>
        </div>

        {/* Bound Phones (Amber/Orange Squircle) */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-sm transition flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-2">
            <Smartphone className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-tight">
            Phone Bound
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {bound} Devices
          </p>
        </div>

        {/* Ready Open (Cyan/Blue Squircle) */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-sm transition flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-2">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-tight">
            Ready Login
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {unbound} Open
          </p>
        </div>
      </div>
    </div>
  );
};
