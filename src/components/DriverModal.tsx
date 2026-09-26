import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Driver, VehicleCategory, DriverStatus } from '../types/driver';
import { normalizeImageUrl } from '../utils/imageUrl';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'deviceBindingId'> & { id?: string }) => void;
  initialDriver?: Driver | null;
  existingDriverIds?: string[];
}

const VEHICLE_CATEGORIES: VehicleCategory[] = [
  'Mini',
  'Sedan',
  'SUV',
  'SUV+',
  'INNOVA',
  'CUSTOM',
];

export const DriverModal: React.FC<DriverModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDriver,
  existingDriverIds = [],
}) => {
  const [driverId, setDriverId] = useState('');
  const [fullName, setFullName] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory | ''>('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const status: DriverStatus = 'Active';

  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(initialDriver);

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialDriver) {
        setDriverId(initialDriver.driverId);
        setFullName(initialDriver.fullName);
        setLoginPin(initialDriver.loginPin);
        setMobileNumber(initialDriver.mobileNumber);
        setVehicleRegistrationNumber(initialDriver.vehicleRegistrationNumber);
        setVehicleCategory(initialDriver.vehicleCategory);
        setCustomCategoryName(initialDriver.customCategoryName || '');
        setPhotoUrl(initialDriver.photoUrl || '');
      } else {
        // Suggest next available driver ID
        let nextNum = 1;
        while (existingDriverIds.includes(String(nextNum).padStart(3, '0'))) {
          nextNum++;
        }
        setDriverId(String(nextNum).padStart(3, '0'));
        setFullName('');
        setLoginPin('');
        setMobileNumber('');
        setVehicleRegistrationNumber('');
        setVehicleCategory('');
        setCustomCategoryName('');
        setPhotoUrl('');
      }
      setErrors({});
      setShowPin(false);
    }
  }, [isOpen, initialDriver, existingDriverIds]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Driver ID
    const cleanId = driverId.trim();
    if (!cleanId) {
      newErrors.driverId = 'Driver ID is required (e.g. 001)';
    } else if (
      !isEditing &&
      existingDriverIds.some((id) => id.toLowerCase() === cleanId.toLowerCase())
    ) {
      newErrors.driverId = `Driver ID "${cleanId}" is already taken`;
    }

    // Full Name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required (e.g. Ramesh Kumar)';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }

    // 4-Digit Login PIN
    const cleanPin = loginPin.trim();
    if (!cleanPin) {
      newErrors.loginPin = '4-Digit Login PIN is required';
    } else if (!/^\d{4}$/.test(cleanPin)) {
      newErrors.loginPin = 'PIN must be exactly 4 numeric digits (e.g. 1234)';
    }

    // Mobile Number
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (cleanMobile.length < 10) {
      newErrors.mobileNumber = 'Mobile Number must be at least 10 digits';
    }

    // Vehicle Registration
    if (!vehicleRegistrationNumber.trim()) {
      newErrors.vehicleRegistrationNumber = 'Vehicle Number is required';
    }

    // Vehicle Category
    if (!vehicleCategory) {
      newErrors.vehicleCategory = 'Please select a Vehicle Category';
    }

    // Custom Category Name
    if (vehicleCategory === 'CUSTOM' && !customCategoryName.trim()) {
      newErrors.customCategoryName = 'Specify custom category name (e.g. Tempo Traveller)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !vehicleCategory) return;

    onSave({
      id: initialDriver?.id,
      driverId: driverId.trim(),
      fullName: fullName.trim(),
      loginPin: loginPin.trim(),
      mobileNumber: mobileNumber.replace(/\D/g, '').slice(-10),
      vehicleRegistrationNumber: vehicleRegistrationNumber.trim().toUpperCase(),
      vehicleCategory,
      customCategoryName: vehicleCategory === 'CUSTOM' ? customCategoryName.trim() : undefined,
      photoUrl: normalizeImageUrl(photoUrl).trim(),
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-0 sm:my-auto max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-slate-50/80">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {isEditing ? `Edit Driver #${initialDriver?.driverId}` : 'Add New Driver'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Top row: Driver ID & Driver Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Driver ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Driver ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={driverId}
                  onChange={(e) => {
                    setDriverId(e.target.value);
                    if (errors.driverId) setErrors((prev) => ({ ...prev, driverId: '' }));
                  }}
                  placeholder=""
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                    errors.driverId
                      ? 'border-rose-400 ring-2 ring-rose-400/20'
                      : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                />
              </div>
              {errors.driverId && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.driverId}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Driver Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                placeholder=""
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                  errors.fullName
                    ? 'border-rose-400 ring-2 ring-rose-400/20'
                    : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.fullName}
                </p>
              )}
            </div>
          </div>

          {/* 4-Digit Login PIN & Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 4-Digit Login PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Login PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={4}
                  value={loginPin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setLoginPin(val);
                    if (errors.loginPin) setErrors((prev) => ({ ...prev, loginPin: '' }));
                  }}
                  placeholder=""
                  className={`w-full px-3.5 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono font-bold tracking-widest text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                    errors.loginPin
                      ? 'border-rose-400 ring-2 ring-rose-400/20'
                      : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.loginPin && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.loginPin}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(val);
                  if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: '' }));
                }}
                placeholder=""
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                  errors.mobileNumber
                    ? 'border-rose-400 ring-2 ring-rose-400/20'
                    : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                }`}
              />
              {errors.mobileNumber && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.mobileNumber}
                </p>
              )}
            </div>
          </div>

          {/* Vehicle Registration & Vehicle Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle Registration Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vehicle Registration
              </label>
              <input
                type="text"
                value={vehicleRegistrationNumber}
                onChange={(e) => {
                  setVehicleRegistrationNumber(e.target.value.toUpperCase());
                  if (errors.vehicleRegistrationNumber) {
                    setErrors((prev) => ({ ...prev, vehicleRegistrationNumber: '' }));
                  }
                }}
                placeholder=""
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition uppercase ${
                  errors.vehicleRegistrationNumber
                    ? 'border-rose-400 ring-2 ring-rose-400/20'
                    : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                }`}
              />
              {errors.vehicleRegistrationNumber && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.vehicleRegistrationNumber}
                </p>
              )}
            </div>

            {/* Vehicle Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vehicle Category
              </label>
              <select
                value={vehicleCategory}
                onChange={(e) => {
                  setVehicleCategory(e.target.value as VehicleCategory);
                  if (errors.vehicleCategory) {
                    setErrors((prev) => ({ ...prev, vehicleCategory: '' }));
                  }
                }}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none transition cursor-pointer ${
                  errors.vehicleCategory
                    ? 'border-rose-400 ring-2 ring-rose-400/20'
                    : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                }`}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {VEHICLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.vehicleCategory && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.vehicleCategory}
                </p>
              )}
            </div>
          </div>

          {/* Conditional Custom Category Name */}
          {vehicleCategory === 'CUSTOM' && (
            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">
                Custom Vehicle Specification
              </label>
              <input
                type="text"
                value={customCategoryName}
                onChange={(e) => {
                  setCustomCategoryName(e.target.value);
                  if (errors.customCategoryName) {
                    setErrors((prev) => ({ ...prev, customCategoryName: '' }));
                  }
                }}
                placeholder=""
                className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
              {errors.customCategoryName && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">
                  {errors.customCategoryName}
                </p>
              )}
            </div>
          )}

          {/* Driver Photo URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Driver Photo URL
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => {
                setPhotoUrl(e.target.value);
                if (errors.photoUrl) setErrors((prev) => ({ ...prev, photoUrl: '' }));
              }}
              placeholder="Paste image URL (e.g. https://... or leave blank)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition"
            />
            {errors.photoUrl && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.photoUrl}
              </p>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{isEditing ? 'Save Changes' : 'Create Driver'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
