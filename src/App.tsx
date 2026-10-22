import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BookingProvider } from './context/BookingContext';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const AdminPortal = lazy(() =>
  import('./components/admin/AdminPortal').then((m) => ({ default: m.AdminPortal }))
);

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-secondary/30 border-t-secondary animate-spin"></div>
  </div>
);

function App() {
  const getIsAdminPath = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.endsWith('/admin') ||
      path.includes('/admin/') ||
      hash === '#admin' ||
      search.includes('view=admin') ||
      search.includes('admin=true')
    );
  }, []);

  const [isAdminView, setIsAdminView] = useState<boolean>(getIsAdminPath());

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(getIsAdminPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [getIsAdminPath]);

  const navigateToAdmin = () => {
    setIsAdminView(true);
    try {
      window.history.pushState(null, '', '/admin');
    } catch {
      window.location.hash = '#admin';
    }
  };

  const navigateToHome = () => {
    setIsAdminView(false);
    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
  };

  return (
    <BookingProvider>
      <Suspense fallback={<LoadingFallback />}>
        {isAdminView ? (
          <AdminPortal onExit={navigateToHome} />
        ) : (
          <Home onOpenAdmin={navigateToAdmin} />
        )}
      </Suspense>
    </BookingProvider>
  );
}

export default App;
