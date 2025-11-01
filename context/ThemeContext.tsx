'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Type Definitions ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// --- Context and Hook Initialization ---
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- Theme Provider Component ---
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 1. Initialize state from localStorage or system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('reverb-theme')) {
      return localStorage.getItem('reverb-theme') as Theme;
    }
    // Fallback to light if no preference is saved
    return 'light'; 
  });

  // 2. useEffect to apply the class and save preference
  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('reverb-theme', theme);
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(theme === 'light' ? 'dark' : 'light');
  };
  
  const setTheme = (newTheme: Theme) => {
      setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};