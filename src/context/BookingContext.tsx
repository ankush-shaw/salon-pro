import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Booking, BookingStatus, BookingStats } from '../types/booking';
import { getRelativeDate } from '../utils/date';
import { getLazyFirebase, isFirebaseConfigured } from '../lib/firebase';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, declineReason?: string) => Promise<void> | void;
  deleteBooking: (id: string) => Promise<void> | void;
  resetToMockData: () => Promise<void> | void;
  stats: BookingStats;
  getBookingById: (id: string) => Booking | undefined;
  isLiveSync: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'atelier_salon_bookings_v1';

export const getInitialMockBookings = (): Booking[] => {
  const today = getRelativeDate(0);
  const tomorrow = getRelativeDate(1);
  const inTwoDays = getRelativeDate(2);
  const yesterday = getRelativeDate(-1);

  return [
    {
      id: '#ATL-8492',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98201 14820',
      customerEmail: 'priya.sharma@gmail.com',
      serviceId: 'couture-cut',
      serviceName: 'Couture Cut & Finish',
      categoryName: 'Hair Architecture',
      duration: '75 mins',
      price: '₹3,200',
      priceNumeric: 3200,
      stylist: 'Elena Rostova (Master Hair Artisan)',
      date: today,
      timeSlot: 'Morning (11:15 AM)',
      timePeriod: 'morning',
      notes: 'First-time atelier guest. Prefers soft face framing around cheekbones.',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: '#ATL-7104',
      customerName: 'Rohit Mehrotra',
      customerPhone: '+91 98112 43219',
      customerEmail: 'rohit.m@enterprise.in',
      serviceId: 'executive-beard',
      serviceName: 'Executive Beard & Hair Sculpt',
      categoryName: 'Grooming & Styling',
      duration: '60 mins',
      price: '₹2,900',
      priceNumeric: 2900,
      stylist: 'Marcus Vance (Senior Precision Stylist)',
      date: today,
      timeSlot: 'Evening (5:00 PM)',
      timePeriod: 'evening',
      notes: 'Requires eucalyptus hot towel compress before evening board dinner.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: '#ATL-6385',
      customerName: 'Nandita Sen',
      customerPhone: '+91 97170 55823',
      customerEmail: 'nandita.sen@designstudio.org',
      serviceId: 'gua-sha',
      serviceName: 'Gua Sha Lymphatic Lift',
      categoryName: 'Skin & Cellular Facials',
      duration: '75 mins',
      price: '₹5,000',
      priceNumeric: 5000,
      stylist: 'Amara Chen (Skin Aesthetician)',
      date: tomorrow,
      timeSlot: 'Afternoon (2:30 PM)',
      timePeriod: 'afternoon',
      notes: 'Prefers cold-pressed camellia botanical oil. Sensitive skin profile.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: '#ATL-5291',
      customerName: 'Zara Merchant',
      customerPhone: '+91 99300 81290',
      customerEmail: 'zara.merchant@vogue.co',
      serviceId: 'balayage',
      serviceName: 'Balayage & Dimensional Colour',
      categoryName: 'Hair Architecture',
      duration: '180 mins',
      price: '₹8,500',
      priceNumeric: 8500,
      stylist: 'Julian Mercier (Balayage Specialist)',
      date: inTwoDays,
      timeSlot: 'Afternoon (1:15 PM)',
      timePeriod: 'afternoon',
      notes: 'Dimensional honey balayage refresh for upcoming gallery gala.',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: '#ATL-4018',
      customerName: 'Kabir Singhania',
      customerPhone: '+91 98450 67123',
      customerEmail: 'kabir.s@singhania.com',
      serviceId: 'curators-choice',
      serviceName: 'Grand Scalp & Botanical Glow Synthesis',
      categoryName: "Curator's Choice",
      duration: '105 mins',
      price: '₹6,800',
      priceNumeric: 6800,
      stylist: 'Elena Rostova (Master Hair Artisan)',
      date: yesterday,
      timeSlot: 'Morning (10:00 AM)',
      timePeriod: 'morning',
      notes: 'Private wash suite requested. Herbal cedarwood blend.',
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    },
  ];
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored bookings from localStorage', e);
    }
    const initial = getInitialMockBookings();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {
      console.warn('Failed to save initial bookings to localStorage', e);
    }
    return initial;
  });

  const [isLoading, setIsLoading] = useState<boolean>(isFirebaseConfigured);

  // Real-time Firestore sync — Only activate persistent stream on Admin dashboard!
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const isAdminRoute =
      typeof window !== 'undefined' &&
      (window.location.pathname.includes('/admin') ||
        window.location.hash.includes('#admin') ||
        window.location.search.includes('admin'));

    if (!isFirebaseConfigured || !isAdminRoute) {
      setIsLoading(false);
      return;
    }

    getLazyFirebase().then(({ db, firestore }) => {
      if (!db || !firestore) {
        setIsLoading(false);
        return;
      }

      const q = firestore.query(
        firestore.collection(db, 'bookings'),
        firestore.orderBy('createdAt', 'desc')
      );

      unsubscribe = firestore.onSnapshot(
        q,
        (snapshot: any) => {
          if (!snapshot.empty) {
            const cloudBookings: Booking[] = snapshot.docs.map((docSnap: any) => ({
              ...docSnap.data(),
              id: docSnap.id,
            }));
            setBookings(cloudBookings);
          } else {
            const seedData = getInitialMockBookings();
            setBookings(seedData);
            const batch = firestore.writeBatch(db);
            seedData.forEach((b: Booking) => {
              const bRef = firestore.doc(db, 'bookings', b.id);
              batch.set(bRef, b);
            });
            batch.commit().catch((err: any) => console.warn('Failed to seed initial bookings', err));
          }
          setIsLoading(false);
        },
        (error: any) => {
          console.error('🔥 Firestore onSnapshot error:', error);
          setIsLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync to localStorage as non-blocking offline cache
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      } catch (e) {
        console.warn('Failed to save bookings to localStorage', e);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [bookings]);

  // Generate unique booking code
  const generateBookingId = useCallback((): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `#ATL-${randomNum}`;
  }, []);

  const addBooking = useCallback(
    (data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Booking => {
      const newBooking: Booking = {
        ...data,
        id: generateBookingId(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Optimistic local update
      setBookings((prev) => [newBooking, ...prev]);

      // Non-blocking lazy persistence to Firestore
      if (isFirebaseConfigured) {
        getLazyFirebase().then(({ db, firestore }) => {
          if (db && firestore) {
            firestore
              .setDoc(firestore.doc(db, 'bookings', newBooking.id), newBooking)
              .then(() => console.log(`🔥 Booking ${newBooking.id} saved to Cloud Firestore!`))
              .catch((err: any) => console.error('🔥 Error writing booking:', err));
          }
        });
      }

      return newBooking;
    },
    [generateBookingId]
  );

  const updateBookingStatus = useCallback(
    async (id: string, status: BookingStatus, declineReason?: string) => {
      const updatedAt = new Date().toISOString();

      // Local update
      setBookings((prev) =>
        prev.map((booking) => {
          if (booking.id === id) {
            return {
              ...booking,
              status,
              declineReason: status === 'declined' ? declineReason || booking.declineReason : undefined,
              updatedAt,
            };
          }
          return booking;
        })
      );

      // Cloud update
      if (isFirebaseConfigured) {
        getLazyFirebase().then(({ db, firestore }) => {
          if (db && firestore) {
            const updatePayload: Record<string, unknown> = {
              status,
              updatedAt,
            };
            if (status === 'declined') {
              updatePayload.declineReason = declineReason || 'Declined by atelier manager';
            }
            firestore
              .updateDoc(firestore.doc(db, 'bookings', id), updatePayload)
              .then(() => console.log(`🔥 Booking ${id} status updated in Cloud Firestore to ${status}`))
              .catch((err: any) => console.error('🔥 Error updating booking in Firestore:', err));
          }
        });
      }
    },
    []
  );

  const deleteBooking = useCallback(async (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));

    if (isFirebaseConfigured) {
      getLazyFirebase().then(({ db, firestore }) => {
        if (db && firestore) {
          firestore
            .deleteDoc(firestore.doc(db, 'bookings', id))
            .then(() => console.log(`🔥 Booking ${id} deleted from Cloud Firestore`))
            .catch((err: any) => console.error('🔥 Error deleting booking from Firestore:', err));
        }
      });
    }
  }, []);

  const resetToMockData = useCallback(async () => {
    const fresh = getInitialMockBookings();
    setBookings(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.warn('Failed to reset bookings in localStorage', e);
    }

    if (isFirebaseConfigured) {
      getLazyFirebase().then(({ db, firestore }) => {
        if (db && firestore) {
          const batch = firestore.writeBatch(db);
          fresh.forEach((b: Booking) => {
            const bRef = firestore.doc(db, 'bookings', b.id);
            batch.set(bRef, b);
          });
          batch
            .commit()
            .then(() => console.log('🔥 Reset Firestore to fresh mock bookings'))
            .catch((err: any) => console.error('🔥 Error resetting Firestore bookings:', err));
        }
      });
    }
  }, []);

  const getBookingById = useCallback(
    (id: string) => {
      return bookings.find((b) => b.id.trim().toUpperCase() === id.trim().toUpperCase());
    },
    [bookings]
  );

  // Calculate live statistics
  const stats = useMemo<BookingStats>(() => {
    const todayStr = getRelativeDate(0);
    let todayTotal = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let completedCount = 0;
    let declinedCount = 0;
    let todayEstimatedRevenue = 0;
    let totalEstimatedRevenue = 0;

    bookings.forEach((b) => {
      if (b.status === 'pending') pendingCount++;
      if (b.status === 'confirmed') confirmedCount++;
      if (b.status === 'completed') completedCount++;
      if (b.status === 'declined') declinedCount++;

      // Today's metrics
      if (b.date === todayStr) {
        todayTotal++;
        if (b.status !== 'declined') {
          todayEstimatedRevenue += b.priceNumeric || 0;
        }
      }

      if (b.status === 'confirmed' || b.status === 'completed') {
        totalEstimatedRevenue += b.priceNumeric || 0;
      }
    });

    return {
      todayTotal,
      pendingCount,
      confirmedCount,
      completedCount,
      declinedCount,
      todayEstimatedRevenue,
      totalEstimatedRevenue,
    };
  }, [bookings]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        resetToMockData,
        stats,
        getBookingById,
        isLiveSync: isFirebaseConfigured,
        isLoading,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
