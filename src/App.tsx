/**
 * Covai Meter Taxi (CMT) - Web Admin Portal
 * Modern, responsive Driver ID Management Console
 * With Firebase Cloud Sync for Driver Mobile App
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DriverStats } from './components/DriverStats';
import { DriverList } from './components/DriverList';
import { DriverModal } from './components/DriverModal';
import { ResetDeviceModal } from './components/ResetDeviceModal';
import { DeleteDriverModal } from './components/DeleteDriverModal';
import { AdminLogin } from './components/AdminLogin';
import { LegalPage } from './components/LegalPage';
import { Toast } from './components/Toast';
import { Driver, DriverStatus, ToastMessage, VehicleCategory } from './types/driver';
import { Plus } from 'lucide-react';
import {
  getStoredFirebaseConfig,
  getOrCreateFirebaseInstance,
  subscribeToFirestoreDrivers,
  upsertDriverInFirestore,
} from './firebase/config';
import { FirebaseConnectionConfig, FirestoreDriver } from './types';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

const STORAGE_KEY = 'covai_meter_taxi_drivers_clean_v2';

function normalizeCategory(cat: any): VehicleCategory {
  if (!cat) return 'Sedan';
  const c = String(cat).trim();
  if (/^mini/i.test(c)) return 'Mini';
  if (/^sedan/i.test(c)) return 'Sedan';
  if (/^innova/i.test(c)) return 'INNOVA';
  if (/^suv\+/i.test(c)) return 'SUV+';
  if (/^suv/i.test(c)) return 'SUV';
  if (/^custom/i.test(c)) return 'CUSTOM';
  return 'Sedan';
}

function loadInitialDrivers(): Driver[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse drivers storage:', e);
  }

  return [];
}

export default function App() {
  const [drivers, setDrivers] = useState<Driver[]>(loadInitialDrivers);

  // Legal / Privacy Policy page state (publicly accessible for Google Play Console)
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page === 'terms' || window.location.hash === '#terms') return 'terms';
    if (page === 'privacy' || window.location.hash === '#privacy') return 'privacy';
    return null;
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page === 'terms' || window.location.hash === '#terms') setLegalTab('terms');
      else if (page === 'privacy' || window.location.hash === '#privacy') setLegalTab('privacy');
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleOpenLegal = (tab: 'privacy' | 'terms') => {
    setLegalTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('page', tab);
      url.hash = tab;
      window.history.pushState({}, '', url.toString());
    } catch {}
  };

  const handleCloseLegal = () => {
    setLegalTab(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      url.hash = '';
      window.history.pushState({}, '', url.pathname);
    } catch {}
  };

  // Authentication state (checked against VITE_ADMIN_PIN in AdminLogin)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('cmt_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('cmt_admin_authenticated');
    } catch {}
    setIsAuthenticated(false);
  };

  // Firebase configuration & connection state (loaded directly from .env)
  const [firebaseConfig] = useState<FirebaseConnectionConfig>(getStoredFirebaseConfig);
  const isFirebaseConnected = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [resetDeviceDriver, setResetDeviceDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persist drivers to clean localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
    } catch (e) {
      console.error('Failed to save drivers to localStorage:', e);
    }
  }, [drivers]);

  // Live real-time Firestore sync when Firebase is connected
  useEffect(() => {
    if (!isFirebaseConnected) return;

    let isMounted = true;
    const unsub = subscribeToFirestoreDrivers(
      firebaseConfig,
      (cloudDrivers: FirestoreDriver[]) => {
        if (!isMounted) return;

        // Convert FirestoreDriver to Driver interface using the 8 clean fields
        const converted: Driver[] = cloudDrivers.map((cd: any) => {
          const dId = String(cd.driver_id || cd.doc_id || '').trim();
          const devId = String(cd.device_id || '').trim();
          return {
            id: cd.doc_id || `cmt-drv-${dId}`,
            driverId: dId,
            fullName: String(cd.driver_name || 'Driver').trim(),
            loginPin: String(cd.pin || cd.login_pin || '1234').trim(),
            mobileNumber: String(cd.mobile_number || '').trim(),
            vehicleRegistrationNumber: String(cd.vehicle_number || '').trim(),
            vehicleCategory: normalizeCategory(cd.vehicle_category),
            customCategoryName: cd.custom_category_name,
            photoUrl: String(cd.driver_image_url || cd.photo_url || '').trim(),
            status: 'Active',
            deviceBindingId: devId.length > 0 ? devId : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

        // If cloud has drivers, sync them into state
        if (converted.length > 0) {
          setDrivers(converted);
        }
      },
      (err) => {
        console.warn('Firestore subscription notice:', err?.message || err);
      }
    );

    return () => {
      isMounted = false;
      if (unsub) unsub();
    };
  }, [firebaseConfig, isFirebaseConnected]);

  // Open "Add New Driver" modal
  const handleOpenAddModal = () => {
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  // Open "Edit Driver" modal
  const handleOpenEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  // Save Driver (Add or Edit)
  const handleSaveDriver = async (
    driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'deviceBindingId'> & { id?: string }
  ) => {
    const now = new Date().toISOString();

    if (driverData.id) {
      // Edit existing driver
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverData.id
            ? {
                ...d,
                ...driverData,
                updatedAt: now,
              }
            : d
        )
      );

      // Sync with Firestore if connected
      if (isFirebaseConnected) {
        const existing = drivers.find((d) => d.id === driverData.id);
        upsertDriverInFirestore(firebaseConfig, {
          device_id: existing?.deviceBindingId || '',
          driver_id: driverData.driverId,
          driver_image_url: driverData.photoUrl || '',
          driver_name: driverData.fullName,
          mobile_number: driverData.mobileNumber,
          pin: driverData.loginPin,
          vehicle_category: driverData.vehicleCategory,
          vehicle_number: driverData.vehicleRegistrationNumber,
        }).catch((err) => console.warn('Firestore driver upsert error:', err));
      }

      addToast(
        'success',
        `Driver #${driverData.driverId} Updated`,
        `${driverData.fullName} details have been updated.`
      );
    } else {
      // Add new driver
      const newDriver: Driver = {
        ...driverData,
        id: `cmt-drv-${Date.now()}`,
        deviceBindingId: null, // Driver can log in from their phone
        deviceModel: undefined,
        deviceBoundAt: undefined,
        createdAt: now,
        updatedAt: now,
      };

      setDrivers((prev) => [newDriver, ...prev]);

      // Sync with Firestore if connected
      if (isFirebaseConnected) {
        upsertDriverInFirestore(firebaseConfig, {
          device_id: '',
          driver_id: newDriver.driverId,
          driver_image_url: newDriver.photoUrl || '',
          driver_name: newDriver.fullName,
          mobile_number: newDriver.mobileNumber,
          pin: newDriver.loginPin,
          vehicle_category: newDriver.vehicleCategory,
          vehicle_number: newDriver.vehicleRegistrationNumber,
        }).catch((err) => console.warn('Firestore driver upsert error:', err));
      }

      addToast(
        'success',
        `Driver #${newDriver.driverId} Added`,
        `${newDriver.fullName} has been enrolled in Covai Meter Taxi.`
      );
    }

    setIsModalOpen(false);
    setEditingDriver(null);
  };

  // Quick toggle status (Active / Inactive)
  const handleToggleStatus = (driverId: string, currentStatus: DriverStatus) => {
    const newStatus: DriverStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    let targetDriverName = '';
    let targetDId = '';

    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          targetDriverName = d.fullName;
          targetDId = d.driverId;
          return {
            ...d,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      })
    );

    // Sync to Firestore
    if (isFirebaseConnected && targetDId) {
      const { db } = getOrCreateFirebaseInstance(firebaseConfig);
      if (db) {
        updateDoc(doc(db, 'drivers', targetDId), {
          status: newStatus === 'Active' ? 'ACTIVE' : 'BLOCKED',
          is_blocked: newStatus !== 'Active',
          updated_at: Date.now(),
        }).catch((err) => console.warn('Firestore status toggle error:', err));
      }
    }

    addToast(
      newStatus === 'Active' ? 'success' : 'warning',
      `Driver Status: ${newStatus}`,
      `${targetDriverName} is now ${newStatus.toLowerCase()}.`
    );
  };

  // Reset Device Binding ID confirmation
  const handleConfirmResetDevice = (driverId: string) => {
    let driverName = '';
    let dId = '';

    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          driverName = d.fullName;
          dId = d.driverId;
          return {
            ...d,
            deviceBindingId: null,
            deviceModel: undefined,
            deviceBoundAt: undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      })
    );

    // Sync to Firestore: clear device_id field so driver's new phone can bind
    if (isFirebaseConnected && dId) {
      const { db } = getOrCreateFirebaseInstance(firebaseConfig);
      if (db) {
        updateDoc(doc(db, 'drivers', dId), {
          device_id: '',
          device_model: '',
          device_bound_at: null,
          updated_at: Date.now(),
        }).catch((err) => console.warn('Firestore device reset error:', err));
      }
    }

    setResetDeviceDriver(null);
    addToast(
      'info',
      `Device Binding Reset (#${dId})`,
      `${driverName}'s phone binding cleared. They can now log in from any new phone.`
    );
  };

  // Delete Driver confirmation
  const handleConfirmDelete = (driverId: string) => {
    const target = drivers.find((d) => d.id === driverId);
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
    setDeletingDriver(null);

    // Delete from Firestore
    if (isFirebaseConnected && target?.driverId) {
      const { db } = getOrCreateFirebaseInstance(firebaseConfig);
      if (db) {
        deleteDoc(doc(db, 'drivers', target.driverId)).catch((err) =>
          console.warn('Firestore delete error:', err)
        );
      }
    }

    addToast(
      'error',
      'Driver Deleted',
      `${target?.fullName || 'Driver'} (#${target?.driverId || ''}) was removed.`
    );
  };

  // Deactivate instead of delete
  const handleDeactivateInstead = (driverId: string) => {
    handleToggleStatus(driverId, 'Active');
    setDeletingDriver(null);
  };

  // Clear all drivers
  const handleClearAllDrivers = () => {
    if (window.confirm('Are you sure you want to clear all drivers? This cannot be undone.')) {
      setDrivers([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      addToast('info', 'Roster Cleared', 'All drivers removed.');
    }
  };

  if (legalTab) {
    return (
      <LegalPage
        initialTab={legalTab}
        onBack={handleCloseLegal}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        onOpenLegal={handleOpenLegal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-purple-100 selection:text-purple-900">
      {/* Top Navbar */}
      <Navbar onLogout={handleLogout} onOpenLegal={handleOpenLegal} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-8">
        {/* Fleet KPI Statistics Cards */}
        <DriverStats drivers={drivers} onAddNewDriver={handleOpenAddModal} />

        {/* Drivers Search, Filter and Table/Cards view */}
        <DriverList
          drivers={drivers}
          onEdit={handleOpenEditModal}
          onDelete={(driver) => setDeletingDriver(driver)}
          onResetDevice={(driver) => setResetDeviceDriver(driver)}
          onToggleStatus={handleToggleStatus}
          onAddNew={handleOpenAddModal}
        />
      </main>

      {/* Footer with Legal Links */}
      <footer className="mt-auto py-5 border-t border-slate-200/80 bg-white/60 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Covai Meter Taxi · Admin Portal</p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-purple-700 transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => handleOpenLegal('terms')}
              className="hover:text-purple-700 transition cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Action Button (FAB) for seamless 1-hand thumb reach */}
      <div className="sm:hidden fixed bottom-5 right-4 z-40">
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 pl-4 pr-5 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-full shadow-lg shadow-purple-600/30 transition-all active:scale-95 cursor-pointer border border-purple-500"
          aria-label="Add New Driver"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>New Driver</span>
        </button>
      </div>

      {/* Add / Edit Driver Modal */}
      <DriverModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDriver(null);
        }}
        onSave={handleSaveDriver}
        initialDriver={editingDriver}
        existingDriverIds={drivers
          .filter((d) => (editingDriver ? d.id !== editingDriver.id : true))
          .map((d) => d.driverId)}
      />

      {/* Reset Device Binding Modal */}
      <ResetDeviceModal
        isOpen={Boolean(resetDeviceDriver)}
        driver={resetDeviceDriver}
        onClose={() => setResetDeviceDriver(null)}
        onConfirm={handleConfirmResetDevice}
      />

      {/* Delete Driver Modal */}
      <DeleteDriverModal
        isOpen={Boolean(deletingDriver)}
        driver={deletingDriver}
        onClose={() => setDeletingDriver(null)}
        onConfirmDelete={handleConfirmDelete}
        onDeactivateInstead={handleDeactivateInstead}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
