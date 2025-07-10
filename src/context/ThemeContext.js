import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => setDark(!dark);

  const theme = {
  dark,
  toggleTheme,
  colors: dark
    ? {
        background: '#121212',
        text: '#F5F5F5',
        card: '#1E1E1E',
        input: '#2C2C2C',
        button: '#60A5FA',
      }
    : {
        background: '#F2F4F7',
        text: '#1F2937',
        card: '#FFFFFF',
        input: '#E5E7EB',
        button: '#3B82F6',
      },
};


  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
