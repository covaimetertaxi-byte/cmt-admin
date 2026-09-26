/**
 * Core Type Definitions for Covai Meter Taxi (CMT) Admin Portal
 */

export interface FirebaseConnectionConfig {
  apiKey: string;
  projectId: string;
  appId: string;
  storageBucket: string;
  authDomain?: string;
  databaseURL?: string;
  adminSecret?: string;
  isLiveConnected: boolean;
}

export interface FirestoreDriver {
  doc_id?: string;
  driver_id: string;
  driver_name: string;
  mobile_number: string;
  vehicle_number: string;
  vehicle_category: string;
  pin: string;
  device_id: string;
  driver_image_url?: string;
  photo_url?: string;
  login_pin?: string;
}
