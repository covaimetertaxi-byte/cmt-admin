import React from 'react';
import { Trash2, AlertTriangle, X, ShieldX, UserMinus } from 'lucide-react';
import { Driver } from '../types/driver';

interface DeleteDriverModalProps {
  isOpen: boolean;
  driver: Driver | null;
  onClose: () => void;
  onConfirmDelete: (driverId: string) => void;
  onDeactivateInstead: (driverId: string) => void;
}

export const DeleteDriverModal: React.FC<DeleteDriverModalProps> = ({
  isOpen,
  driver,
  onClose,
  onConfirmDelete,
  onDeactivateInstead,
}) => {
  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-rose-50/60">
          <div className="w-10 h-1 bg-rose-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Delete Driver #{driver.driverId}
              </h3>
              <p className="text-xs text-slate-500">
                Confirm driver removal or deactivation
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
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete driver{' '}
            <strong className="text-slate-900">{driver.fullName}</strong> (Driver ID:{' '}
            <span className="font-mono font-bold text-purple-700">{driver.driverId}</span>, Vehicle:{' '}
            <span className="font-mono font-bold">{driver.vehicleRegistrationNumber}</span>)?
          </p>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2.5 text-xs text-purple-900">
            <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Recommended:</span> If this driver is on leave or temporary hold, consider setting them to <strong>Inactive</strong> instead of permanently deleting them.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>

          {driver.status === 'Active' && (
            <button
              type="button"
              onClick={() => onDeactivateInstead(driver.id)}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserMinus className="w-3.5 h-3.5" />
              <span>Deactivate Instead</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onConfirmDelete(driver.id)}
            className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
