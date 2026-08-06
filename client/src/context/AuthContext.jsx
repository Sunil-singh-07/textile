import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { authApi } from '../api/authApi';
import { onUnauthorized } from '../utils/authEvents';

const AuthContext = createContext(undefined);

// There is no client-readable token anywhere (it's an httpOnly cookie), so
// the only way to know "am I logged in" on a fresh page load is to ask the
// server via GET /auth/me and see whether it succeeds.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrate = useCallback(async () => {
    try {
      const { user } = await authApi.getMe();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // If any request anywhere in the app comes back 401 (session expired/
  // cookie invalidated), clear the user here so route guards redirect
  // naturally — no manual navigation needed from inside axios.
  useEffect(() => onUnauthorized(() => setUser(null)), []);

  const login = useCallback(async (payload) => {
    const { user } = await authApi.login(payload);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (payload) => {
    const { user } = await authApi.register(payload);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refetchUser: hydrate,
    }),
    [user, isLoading, login, register, logout, hydrate]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
};
