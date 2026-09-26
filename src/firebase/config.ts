import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  enableIndexedDbPersistence,
  Unsubscribe,
} from 'firebase/firestore';
import { FirebaseConnectionConfig, FirestoreDriver } from '../types';

export const DEFAULT_FIREBASE_CONFIG: FirebaseConnectionConfig = {
  apiKey: '',
  projectId: '',
  appId: '',
  storageBucket: '',
  authDomain: '',
  isLiveConnected: false,
};

export function getStoredFirebaseConfig(): FirebaseConnectionConfig {
  const envProjectId = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID?.trim() || '';
  const envApiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY?.trim() || '';
  const envAuthDomain = (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN?.trim() || (envProjectId ? `${envProjectId}.firebaseapp.com` : '');
  const envAppId = (import.meta as any).env?.VITE_FIREBASE_APP_ID?.trim() || '';
  const envStorageBucket = (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET?.trim() || (envProjectId ? `${envProjectId}.firebasestorage.app` : '');

  return {
    projectId: envProjectId,
    apiKey: envApiKey,
    authDomain: envAuthDomain,
    appId: envAppId,
    storageBucket: envStorageBucket,
    isLiveConnected: Boolean(envApiKey && envProjectId),
  };
}

let activeApp: FirebaseApp | null = null;
let activeDb: Firestore | null = null;

export function getOrCreateFirebaseInstance(config: FirebaseConnectionConfig): {
  app: FirebaseApp | null;
  db: Firestore | null;
} {
  try {
    if (!config.apiKey || !config.projectId) {
      return { app: null, db: null };
    }

    const appName = `cmt_admin_${config.projectId}`;
    const existingApps = getApps();
    const found = existingApps.find((a) => a.name === appName || a.name === '[DEFAULT]');

    if (found) {
      activeApp = found;
      activeDb = getFirestore(found);
      return { app: activeApp, db: activeDb };
    }

    activeApp = initializeApp(
      {
        apiKey: config.apiKey,
        projectId: config.projectId,
        appId: config.appId,
        storageBucket: config.storageBucket,
        authDomain: config.authDomain || `${config.projectId}.firebaseapp.com`,
      },
      appName
    );

    activeDb = getFirestore(activeApp);
    try {
      enableIndexedDbPersistence(activeDb).catch(() => {});
    } catch {}

    return { app: activeApp, db: activeDb };
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
    return { app: null, db: null };
  }
}

/**
 * Real-time subscription to the Firestore 'drivers' collection
 */
export function subscribeToFirestoreDrivers(
  config: FirebaseConnectionConfig,
  onData: (drivers: FirestoreDriver[]) => void,
  onError: (err: any) => void
): Unsubscribe | null {
  try {
    const { db } = getOrCreateFirebaseInstance(config);
    if (!db) return null;

    const driversQuery = collection(db, 'drivers');
    const driverCache = new Map<string, FirestoreDriver>();
    let dispatchTimer: ReturnType<typeof setTimeout> | null = null;

    const parseDriverDoc = (docSnap: any): FirestoreDriver | null => {
      if (docSnap.id.startsWith('_')) return null;
      const data = docSnap.data();

      // Clean 8 fields
      const driverId = String(data.driver_id || docSnap.id || '').trim();
      const driverName = String(data.driver_name || data.name || '').trim();
      const mobileNumber = String(data.mobile_number || data.driver_mobile || data.phone || '').trim();
      const vehicleNumber = String(data.vehicle_number || data.vehicle_no || '').trim();
      const vehicleCategory = String(data.vehicle_category || data.category || 'Sedan').trim();
      const driverImageUrl = String(data.driver_image_url || data.photo_url || '').trim();
      const deviceId = String(data.device_id || '').trim();
      const pin = String(data.pin || data.login_pin || '').trim();

      return {
        doc_id: docSnap.id,
        driver_id: driverId,
        driver_name: driverName,
        mobile_number: mobileNumber,
        vehicle_number: vehicleNumber,
        vehicle_category: vehicleCategory,
        driver_image_url: driverImageUrl,
        photo_url: driverImageUrl,
        device_id: deviceId,
        pin,
        login_pin: pin,
      };
    };

    const flushDrivers = () => {
      dispatchTimer = null;
      const uniqueDriversMap = new Map<string, FirestoreDriver>();

      for (const d of driverCache.values()) {
        const key = (d.driver_id || d.doc_id || '').trim().toUpperCase();
        if (key) {
          uniqueDriversMap.set(key, d);
        }
      }

      onData(Array.from(uniqueDriversMap.values()));
    };

    const unsubscribe = onSnapshot(
      driversQuery,
      (snapshot) => {
        driverCache.clear();
        snapshot.forEach((docSnap) => {
          const parsed = parseDriverDoc(docSnap);
          if (parsed) {
            driverCache.set(docSnap.id, parsed);
          }
        });

        if (dispatchTimer) clearTimeout(dispatchTimer);
        dispatchTimer = setTimeout(flushDrivers, 100);
      },
      (err) => {
        console.warn('Firestore drivers listener notice:', err);
        onError(err);
      }
    );

    return () => {
      if (dispatchTimer) clearTimeout(dispatchTimer);
      unsubscribe();
    };
  } catch (err) {
    onError(err);
    return null;
  }
}

/**
 * Upserts a driver document in Firestore using the clean 8-field schema.
 * All 8 fields stored as clean strings:
 * - device_id
 * - driver_id
 * - driver_image_url
 * - driver_name
 * - mobile_number
 * - pin
 * - vehicle_category
 * - vehicle_number
 */
export async function upsertDriverInFirestore(
  config: FirebaseConnectionConfig,
  driver: {
    device_id: string;
    driver_id: string;
    driver_image_url: string;
    driver_name: string;
    mobile_number: string;
    pin: string;
    vehicle_category: string;
    vehicle_number: string;
  }
): Promise<boolean> {
  try {
    const { db } = getOrCreateFirebaseInstance(config);
    if (!db) return false;

    const targetDocId = String(driver.driver_id || '').trim();
    if (!targetDocId) return false;

    const docRef = doc(db, 'drivers', targetDocId);

    const cleanDoc = {
      device_id: String(driver.device_id || '').trim(),
      driver_id: targetDocId,
      driver_image_url: String(driver.driver_image_url || '').trim(),
      driver_name: String(driver.driver_name || '').trim(),
      mobile_number: String(driver.mobile_number || '').trim(),
      pin: String(driver.pin || '').trim(),
      vehicle_category: String(driver.vehicle_category || 'Sedan').trim(),
      vehicle_number: String(driver.vehicle_number || '').trim(),
    };

    await setDoc(docRef, cleanDoc);
    return true;
  } catch (err) {
    console.error('Error writing clean driver to Firestore:', err);
    return false;
  }
}
