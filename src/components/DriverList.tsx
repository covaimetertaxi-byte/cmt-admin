import React, { useState } from 'react';
import {
  Search,
  Car,
  Smartphone,
  Edit2,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  X,
  Plus,
  Phone,
  KeyRound,
  ShieldCheck,
  Ban,
} from 'lucide-react';
import {
  Driver,
  VehicleCategory,
  DriverStatus,
  DriverFilterCategory,
  DriverFilterDevice,
  DriverSortOption,
} from '../types/driver';
import { normalizeImageUrl } from '../utils/imageUrl';

interface DriverListProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  onResetDevice: (driver: Driver) => void;
  onToggleStatus?: (driverId: string, currentStatus: DriverStatus) => void;
  onAddNew: () => void;
}

const VEHICLE_CATEGORIES: VehicleCategory[] = [
  'Mini',
  'Sedan',
  'SUV',
  'SUV+',
  'INNOVA',
  'CUSTOM',
];

export const DriverList: React.FC<DriverListProps> = ({
  drivers,
  onEdit,
  onDelete,
  onResetDevice,
  onToggleStatus,
  onAddNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DriverFilterCategory>('All');
  const [deviceFilter, setDeviceFilter] = useState<DriverFilterDevice>('All');
  const [sortBy, setSortBy] = useState<DriverSortOption>('id-asc');

  // Track which driver PIN is unmasked
  const [unmaskedPins, setUnmaskedPins] = useState<Record<string, boolean>>({});
  // Track copied feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const togglePinVisibility = (id: string) => {
    setUnmaskedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter & Search Logic
  const filteredDrivers = drivers.filter((driver) => {
    // Search query: ID, name, mobile, vehicle number
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = driver.driverId.toLowerCase().includes(q);
      const matchName = driver.fullName.toLowerCase().includes(q);
      const matchMobile = driver.mobileNumber.includes(q);
      const matchVehicle = driver.vehicleRegistrationNumber.toLowerCase().includes(q);
      const matchBinding = driver.deviceBindingId?.toLowerCase().includes(q) || false;
      if (!matchId && !matchName && !matchMobile && !matchVehicle && !matchBinding) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== 'All' && driver.vehicleCategory !== categoryFilter) {
      return false;
    }

    // Device filter
    if (deviceFilter === 'Bound' && !driver.deviceBindingId) return false;
    if (deviceFilter === 'Unbound' && driver.deviceBindingId) return false;

    return true;
  });

  // Sorting
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    switch (sortBy) {
      case 'id-asc':
        return a.driverId.localeCompare(b.driverId, undefined, { numeric: true });
      case 'id-desc':
        return b.driverId.localeCompare(a.driverId, undefined, { numeric: true });
      case 'name-asc':
        return a.fullName.localeCompare(b.fullName);
      case 'name-desc':
        return b.fullName.localeCompare(a.fullName);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const getCategoryBadgeClass = (category: VehicleCategory) => {
    switch (category) {
      case 'Mini':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Sedan':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SUV':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SUV+':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'INNOVA':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
      case 'CUSTOM':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'All' ||
    deviceFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setDeviceFilter('All');
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Section Header Matching 'Recents Files' from Reference */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Recent Drivers
        </h3>
        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60 shadow-2xs">
          {filteredDrivers.length} {filteredDrivers.length === 1 ? 'Driver' : 'Drivers'}
        </span>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-3">
        {/* Top line: Search and Action */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver by ID, Name, Mobile, Vehicle..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown & Add Button */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as DriverSortOption)}
              className="flex-1 sm:flex-initial px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="id-asc">Driver ID (001 → 999)</option>
              <option value="id-desc">Driver ID (999 → 001)</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="newest">Recently Enrolled</option>
            </select>

            <button
              type="button"
              onClick={onAddNew}
              className="hidden sm:flex px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shadow-xs items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Driver</span>
            </button>
          </div>
        </div>

        {/* Filter Bar: Mobile-friendly horizontal scrollable chips + Selects */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {/* Quick Device Filter Chips */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setDeviceFilter('All')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  deviceFilter === 'All'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({drivers.length})
              </button>
              <button
                type="button"
                onClick={() => setDeviceFilter('Bound')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  deviceFilter === 'Bound'
                    ? 'bg-white text-blue-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bound
              </button>
              <button
                type="button"
                onClick={() => setDeviceFilter('Unbound')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  deviceFilter === 'Unbound'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unbound
              </button>
            </div>

            {/* Category Select Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as DriverFilterCategory)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer shrink-0"
            >
              <option value="All">All Categories</option>
              {VEHICLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-2.5 py-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Count badge */}
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900">{sortedDrivers.length}</strong> of{' '}
            {drivers.length} drivers
          </div>
        </div>
      </div>

      {/* Main Drivers View: Desktop Table + Mobile Cards */}
      {sortedDrivers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Car className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No drivers found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {hasActiveFilters
              ? 'No driver matched your search or active filters. Try clearing or adjusting your criteria.'
              : 'You have not added any drivers to the Covai Meter Taxi portal yet.'}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Clear all filters
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddNew}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
            >
              + Add First Driver
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile / small screens) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">driver_id</th>
                    <th className="py-3 px-4">driver_name</th>
                    <th className="py-3 px-4">mobile_number</th>
                    <th className="py-3 px-4">pin</th>
                    <th className="py-3 px-4">vehicle_number</th>
                    <th className="py-3 px-4">vehicle_category</th>
                    <th className="py-3 px-4">device_id</th>
                    <th className="py-3 px-4 text-right">actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {sortedDrivers.map((driver) => {
                    const isPinVisible = Boolean(unmaskedPins[driver.id]);
                    const isBound = Boolean(driver.deviceBindingId && driver.deviceBindingId.trim());

                    return (
                      <tr
                        key={driver.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* driver_id */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-950 font-mono font-bold text-xs border border-amber-300">
                            {driver.driverId}
                          </span>
                        </td>

                        {/* driver_name */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 text-sm">
                            {driver.fullName}
                          </span>
                        </td>

                        {/* mobile_number */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span>{driver.mobileNumber}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(driver.mobileNumber, `mob-${driver.id}`)}
                              className="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
                              title="Copy mobile number"
                            >
                              {copiedId === `mob-${driver.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* pin */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-xs tracking-wider">
                              {isPinVisible ? driver.loginPin : '••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePinVisibility(driver.id)}
                              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                              title={isPinVisible ? 'Hide PIN' : 'View PIN'}
                            >
                              {isPinVisible ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(driver.loginPin, `pin-${driver.id}`)}
                              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                              title="Copy PIN"
                            >
                              {copiedId === `pin-${driver.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* vehicle_number */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs tracking-wide">
                          {driver.vehicleRegistrationNumber}
                        </td>

                        {/* vehicle_category */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border tracking-wide uppercase ${getCategoryBadgeClass(
                              driver.vehicleCategory
                            )}`}
                          >
                            {driver.vehicleCategory === 'CUSTOM' && driver.customCategoryName
                              ? driver.customCategoryName
                              : driver.vehicleCategory}
                          </span>
                        </td>

                        {/* device_id */}
                        <td className="py-3.5 px-4">
                          {isBound ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                {driver.deviceBindingId}
                              </span>
                              <button
                                type="button"
                                onClick={() => onResetDevice(driver)}
                                className="px-2 py-0.5 rounded text-[11px] font-bold text-purple-700 hover:bg-purple-100 bg-purple-50 border border-purple-200 transition cursor-pointer"
                                title="Reset device_id to blank string"
                              >
                                Reset
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-semibold">
                              "" (empty)
                            </span>
                          )}
                        </td>

                        {/* actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => onEdit(driver)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
                              title="Edit Driver Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => onDelete(driver)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer border border-rose-200"
                              title="Delete Driver"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout (Native App Style matching user reference) */}
          <div className="flex flex-col lg:hidden gap-3.5">
            {sortedDrivers.map((driver) => {
              const isPinVisible = Boolean(unmaskedPins[driver.id]);
              const isBound = Boolean(driver.deviceBindingId);
              const isActive = driver.status === 'Active';

              return (
                <div
                  key={driver.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4 transition-all"
                >
                  {/* Header: Driver Name, ID, Badges */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight uppercase leading-snug">
                      {driver.fullName}
                    </h3>
                    <div className="text-sm font-bold font-mono text-purple-600 mt-0.5">
                      {driver.driverId}
                    </div>

                    {/* Category and Status Badges */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wide">
                        {driver.vehicleCategory === 'CUSTOM' && driver.customCategoryName
                          ? driver.customCategoryName
                          : driver.vehicleCategory}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : 'bg-rose-50 text-rose-700 border-rose-200/80'
                        }`}
                      >
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>

                  {/* Evenly Aligned Details Rows */}
                  <div className="space-y-2.5 pt-1 border-t border-slate-100">
                    {/* Vehicle Plate */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Car className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Vehicle Plate:</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 tracking-wide text-xs sm:text-sm text-right">
                        {driver.vehicleRegistrationNumber || '—'}
                      </span>
                    </div>

                    {/* Mobile Phone */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Mobile Phone:</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${driver.mobileNumber}`}
                          className="font-mono font-bold text-purple-700 hover:text-purple-800 tracking-wide text-xs sm:text-sm active:underline"
                        >
                          {driver.mobileNumber}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(driver.mobileNumber, `mob-${driver.id}`)}
                          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer active:scale-90"
                          title="Copy phone"
                        >
                          {copiedId === `mob-${driver.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Login PIN */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Login PIN:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs tracking-widest">
                          {isPinVisible ? driver.loginPin : '••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePinVisibility(driver.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label={isPinVisible ? 'Hide PIN' : 'View PIN'}
                        >
                          {isPinVisible ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(driver.loginPin, `pin-${driver.id}`)}
                          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                          title="Copy PIN"
                        >
                          {copiedId === `pin-${driver.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Device Lock Inset Box (exactly like reference) */}
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Device Lock:</span>
                      </div>
                      {isBound ? (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                          Phone Bound
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-200/70 text-slate-700">
                          Unbound (Ready)
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-slate-500 truncate pt-0.5">
                      {isBound ? driver.deviceBindingId : 'No phone linked — ready for driver login'}
                    </div>
                  </div>

                  {/* Bottom Action Buttons Row (aligned evenly as in reference) */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    {/* Reset Device button */}
                    <button
                      type="button"
                      onClick={() => onResetDevice(driver)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer border border-slate-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Reset Device</span>
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => onEdit(driver)}
                      className="p-2 rounded-xl text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
                      title="Edit Driver"
                      aria-label="Edit Driver"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => onDelete(driver)}
                      className="p-2 rounded-xl text-rose-600 hover:text-rose-700 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition active:scale-95 cursor-pointer"
                      title="Delete Driver"
                      aria-label="Delete Driver"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
