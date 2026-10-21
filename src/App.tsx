import { useState, useEffect, useCallback } from 'react';
import { Home } from './pages/Home';
import { AdminPortal } from './components/admin/AdminPortal';
import { BookingProvider } from './context/BookingContext';
import { Lock } from 'lucide-react';

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
        <>
          <Home onOpenAdmin={navigateToAdmin} />

          {/* Discreet Floating Staff Portal Trigger for Quick Manager Access */}
          <div className="fixed bottom-4 left-4 z-30">
            <button
              type="button"
              onClick={navigateToAdmin}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/90 text-primary-fixed hover:bg-primary text-[11px] font-sans border border-outline-variant/30 shadow-md backdrop-blur-sm"
              title="Open Staff Manager Portal (PIN: 1234)"
            >
              <Lock className="w-3 h-3 text-secondary-fixed" />
              <span className="tracking-wider uppercase text-[10px] font-semibold">Staff Portal</span>
            </button>
          </div>
        </>
      )}
    </BookingProvider>
  );
}

export default App;
