'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { getStoredUser, login as authLogin, register as authRegister, logout as authLogout, isFirstVisit, markVisitComplete, activateAdmin } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authLogin(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string, adminCode?: string) => {
    const result = await authRegister(email, password, fullName, adminCode);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const checkFirstVisit = useCallback(() => {
    return isFirstVisit();
  }, []);

  const completeWelcome = useCallback(() => {
    markVisitComplete();
  }, []);

  const makeAdmin = useCallback(async (code: string) => {
    if (!user) return false;
    const success = await activateAdmin(user.id, code);
    if (success) {
      setUser({ ...user, is_admin: true });
    }
    return success;
  }, [user]);

  return {
    user,
    loading,
    login,
    register,
    logout,
    checkFirstVisit,
    completeWelcome,
    makeAdmin,
    isAdmin: user?.is_admin || false,
  };
}
