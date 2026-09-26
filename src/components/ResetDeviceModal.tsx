import React from 'react';
import { Smartphone, AlertTriangle, X, Check, ShieldAlert } from 'lucide-react';
import { Driver } from '../types/driver';

interface ResetDeviceModalProps {
  isOpen: boolean;
  driver: Driver | null;
  onClose: () => void;
  onConfirm: (driverId: string) => void;
}

export const ResetDeviceModal: React.FC<ResetDeviceModalProps> = ({
  isOpen,
  driver,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-purple-50/60">
          <div className="w-10 h-1 bg-purple-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Reset Device Binding ID
              </h3>
              <p className="text-xs text-slate-500">
                Unlink driver smartphone lock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Driver:</span>
              <span className="font-bold text-slate-900">
                {driver.fullName} (#{driver.driverId})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Mobile:</span>
              <span className="font-mono font-semibold text-slate-800">
                +91 {driver.mobileNumber}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Current Device:</span>
              <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {driver.deviceBindingId || 'No device currently bound'}
              </span>
            </div>
            {driver.deviceModel && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Handset Model:</span>
                <span className="text-slate-700 font-medium">{driver.deviceModel}</span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-purple-50 border border-purple-200/80 rounded-xl text-xs text-purple-900 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">What happens when you reset?</p>
              <p className="mt-0.5 text-purple-800">
                The driver's current device token will be cleared immediately. The driver will be able to install or open the Covai Meter Taxi driver app on any new phone and log in using their 4-digit PIN.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(driver.id)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Reset Binding ID</span>
          </button>
        </div>
      </div>
    </div>
  );
};
