import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark';

export const ThemeContext = createContext<{
  theme: ThemeMode;
  toggle: () => void;
  setTheme: (t: ThemeMode) => void;
} | null>(null);
