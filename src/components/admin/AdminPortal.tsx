import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminPortalProps {
  onExit: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('atelier_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('atelier_admin_auth');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} onExit={onExit} />;
  }

  return <AdminDashboard onExit={onExit} onLogout={handleLogout} />;
};
