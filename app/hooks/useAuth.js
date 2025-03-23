"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, getUserRole } from '../services/auth';

export function useAuth(requiredRole = null) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = getCurrentUser();
    
    if (!userData) {
      router.push('/login');
      return;
    }
    
    // If a specific role is required, check it
    if (requiredRole && userData.user.role !== requiredRole) {
      logout();
      router.push('/login');
      return;
    }
    
    setUser(userData);
    setLoading(false);
  }, [router, requiredRole]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return { user, loading, logout: handleLogout };
}
