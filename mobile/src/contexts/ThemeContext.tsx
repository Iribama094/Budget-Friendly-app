import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getTheme, type Theme } from '../theme/theme';

type ThemeState = {
  theme: Theme;
  mode: Theme['mode'];
  preference: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setMode: (mode: Theme['mode'] | 'system') => void;
  isLoading: boolean;
};

const THEME_KEY = 'bf_theme_mode_v1'; // 'light' | 'dark' | 'system'

const ThemeContext = createContext<ThemeState | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [storedMode, setStoredMode] = useState<'light' | 'dark' | 'system'>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await SecureStore.getItemAsync(THEME_KEY);
        if (v === 'light' || v === 'dark' || v === 'system') setStoredMode(v);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const effectiveMode: Theme['mode'] = storedMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : storedMode;
  const theme = useMemo(() => getTheme(effectiveMode), [effectiveMode]);

  const setMode = (mode: Theme['mode'] | 'system') => {
    const next = mode;
    setStoredMode(next);
    void SecureStore.setItemAsync(THEME_KEY, next);
  };

  const toggleDarkMode = () => {
    const next: 'light' | 'dark' = effectiveMode === 'dark' ? 'light' : 'dark';
    setMode(next);
  };

  const value = useMemo<ThemeState>(
    () => ({
      theme,
      mode: effectiveMode,
      preference: storedMode,
      isDarkMode: effectiveMode === 'dark',
      toggleDarkMode,
      setMode,
      isLoading
    }),
    [theme, effectiveMode, storedMode, isLoading]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
