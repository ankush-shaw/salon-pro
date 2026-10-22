export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('YOUR_') &&
  !import.meta.env.VITE_FIREBASE_PROJECT_ID.includes('YOUR_')
);

// Cached promise for dynamic lazy loading
let firebasePromise: Promise<{ app: any; db: any; firestore: any }> | null = null;

export const getLazyFirebase = async () => {
  if (!isFirebaseConfigured) {
    return { app: null, db: null, firestore: null };
  }

  if (!firebasePromise) {
    firebasePromise = (async () => {
      try {
        const [{ initializeApp, getApps }, firestore] = await Promise.all([
          import('firebase/app'),
          import('firebase/firestore'),
        ]);

        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
        };

        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const db = firestore.getFirestore(app);
        console.log('🔥 Lazy Firebase Cloud Firestore connected!');
        return { app, db, firestore };
      } catch (err) {
        console.error('🔥 Error initializing lazy Firebase:', err);
        return { app: null, db: null, firestore: null };
      }
    })();
  }

  return firebasePromise;
};
