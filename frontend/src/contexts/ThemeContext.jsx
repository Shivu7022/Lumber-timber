import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default to light theme
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Determine the data attribute value
    const root = window.document.documentElement;
    
    // Remove old classes/attributes
    root.removeAttribute('data-theme');
    root.classList.remove('dark', 'light', 'wood');
    
    // Set the new theme
    root.setAttribute('data-theme', theme);
    // Also add class for Tailwind's class-based dark mode if needed
    root.classList.add(theme);
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
