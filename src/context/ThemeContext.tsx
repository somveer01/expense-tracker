import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type FontFamily = 'lexend' | 'jakarta' | 'inter' | 'poppins' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('surviva_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'light';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('surviva_font_size');
    return (saved === 'normal' || saved === 'large' || saved === 'xlarge') ? saved : 'normal';
  });

  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    const saved = localStorage.getItem('surviva_font_family');
    return (saved === 'lexend' || saved === 'jakarta' || saved === 'inter' || saved === 'poppins' || saved === 'system') 
      ? saved 
      : 'lexend'; // Lexend default for maximum clarity!
  });

  // Apply Theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('surviva_theme', theme);
  }, [theme]);

  // Apply Font Size scaling to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
    root.classList.add(`font-size-${fontSize}`);

    if (fontSize === 'large') {
      root.style.fontSize = '17px';
    } else if (fontSize === 'xlarge') {
      root.style.fontSize = '18.5px';
    } else {
      root.style.fontSize = '16px';
    }
    localStorage.setItem('surviva_font_size', fontSize);
  }, [fontSize]);

  // Apply Font Family to DOM
  useEffect(() => {
    const root = document.documentElement;
    let familyString = "'Lexend', sans-serif";
    if (fontFamily === 'jakarta') {
      familyString = "'Plus Jakarta Sans', sans-serif";
    } else if (fontFamily === 'inter') {
      familyString = "'Inter', sans-serif";
    } else if (fontFamily === 'poppins') {
      familyString = "'Poppins', sans-serif";
    } else if (fontFamily === 'system') {
      familyString = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    }

    root.style.fontFamily = familyString;
    localStorage.setItem('surviva_font_family', fontFamily);
  }, [fontFamily]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setFontFamily = (font: FontFamily) => {
    setFontFamilyState(font);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme,
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
