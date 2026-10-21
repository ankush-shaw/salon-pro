import { useState, useEffect, useCallback } from 'react';
import { Home } from './pages/Home';
import { AdminPortal } from './components/admin/AdminPortal';
import { BookingProvider } from './context/BookingContext';

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
      {isAdminView ? (
        <AdminPortal onExit={navigateToHome} />
      ) : (
        <Home onOpenAdmin={navigateToAdmin} />
      )}
    </BookingProvider>
  );
}

export default App;
