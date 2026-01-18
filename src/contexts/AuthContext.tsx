import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearTokens, getTokens, setTokens } from '../utils/api/storage';
import { getMe, login as apiLogin, register as apiRegister, type ApiUser } from '../utils/api/endpoints';

type AuthState = {
  user: ApiUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const tokens = getTokens();
    if (!tokens) {
      setUser(null);
      return;
    }

    try {
      const me = await getMe();
      setUser(me);
    } catch {
      clearTokens();
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiLogin(email, password, 'web');
    setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    setUser(result.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const result = await apiRegister(email, password, name);
    setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    setUser(result.user);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const value = useMemo<AuthState>(
    () => ({ user, isLoading, login, register, logout, refreshUser }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
