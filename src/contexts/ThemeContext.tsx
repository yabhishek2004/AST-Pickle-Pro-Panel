import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'emerald' | 'blue' | 'purple' | 'orange';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    primaryHover: string;
    secondaryHover: string;
    accentHover: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfig = {
  emerald: {
    primary: 'from-emerald-600 to-teal-600',
    secondary: 'from-emerald-500 to-teal-600',
    accent: 'emerald-600',
    primaryHover: 'hover:from-emerald-700 hover:to-teal-700',
    secondaryHover: 'hover:from-emerald-600 hover:to-teal-700',
    accentHover: 'hover:bg-emerald-700',
    ring: 'ring-emerald-600',
    focus: 'focus:ring-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  blue: {
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-blue-500 to-cyan-600',
    accent: 'blue-600',
    primaryHover: 'hover:from-blue-700 hover:to-cyan-700',
    secondaryHover: 'hover:from-blue-600 hover:to-cyan-700',
    accentHover: 'hover:bg-blue-700',
    ring: 'ring-blue-600',
    focus: 'focus:ring-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  purple: {
    primary: 'from-purple-600 to-pink-600',
    secondary: 'from-purple-500 to-pink-600',
    accent: 'purple-600',
    primaryHover: 'hover:from-purple-700 hover:to-pink-700',
    secondaryHover: 'hover:from-purple-600 hover:to-pink-700',
    accentHover: 'hover:bg-purple-700',
    ring: 'ring-purple-600',
    focus: 'focus:ring-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200'
  },
  orange: {
    primary: 'from-orange-600 to-red-600',
    secondary: 'from-orange-500 to-red-600',
    accent: 'orange-600',
    primaryHover: 'hover:from-orange-700 hover:to-red-700',
    secondaryHover: 'hover:from-orange-600 hover:to-red-700',
    accentHover: 'hover:bg-orange-700',
    ring: 'ring-orange-600',
    focus: 'focus:ring-orange-500',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200'
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('emerald');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('pickle_theme') as Theme;
    if (savedTheme && themeConfig[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pickle_theme', theme);
  }, [theme]);

  const themeColors = themeConfig[theme];

  const value: ThemeContextType = {
    theme,
    setTheme,
    themeColors: {
      primary: themeColors.primary,
      secondary: themeColors.secondary,
      accent: themeColors.accent,
      primaryHover: themeColors.primaryHover,
      secondaryHover: themeColors.secondaryHover,
      accentHover: themeColors.accentHover,
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
