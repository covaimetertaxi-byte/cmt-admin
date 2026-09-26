/**
 * Covai Meter Taxi (CMT) - Driver Management Types
 */

export type VehicleCategory =
  | 'Mini'
  | 'Sedan'
  | 'SUV'
  | 'SUV+'
  | 'INNOVA'
  | 'CUSTOM';

export type DriverStatus = 'Active' | 'Inactive';

export interface Driver {
  id: string;
  driverId: string; // e.g., '001', '002'
  fullName: string; // e.g., 'Ramesh Kumar'
  loginPin: string; // 4-digit PIN e.g., '1234'
  mobileNumber: string; // e.g., '9876543210'
  vehicleRegistrationNumber: string; // e.g., 'TN 38 AB 1234'
  vehicleCategory: VehicleCategory;
  customCategoryName?: string; // used when vehicleCategory === 'CUSTOM'
  photoUrl: string; // Image URL or Base64 Data URL
  status: DriverStatus;
  deviceBindingId: string | null; // e.g., 'DEV-CMT-9481A' or null if unbound
  deviceModel?: string; // e.g., 'Redmi Note 12 5G', 'Samsung Galaxy M34'
  deviceBoundAt?: string; // ISO timestamp
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export type DriverFilterStatus = 'All' | 'Active' | 'Inactive';
export type DriverFilterCategory = 'All' | VehicleCategory;
export type DriverFilterDevice = 'All' | 'Bound' | 'Unbound';

export type DriverSortOption =
  | 'id-asc'
  | 'id-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
