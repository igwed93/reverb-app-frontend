'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-white hover:bg-white/10 dark:hover:bg-deep-slate/10 transition"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        // Sun icon (for switching to dark mode)
        <Moon className="w-6 h-6 text-white/50 dark:text-deep-slate/10" />
      ) : (
        // Moon icon (for switching to light mode)
        <Sun className="w-6 h-6 text-deep-slate/30 dark:text-deep-slate/10" />
      )}
    </button>
  );
};

export default ThemeToggle;
