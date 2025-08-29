import React, { useState, useEffect, ReactNode } from 'react';
import ThemeContext, { initialThemeState } from './theme.context';
import { AppTheme } from '.';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(initialThemeState.theme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');

    if (theme) document.documentElement.setAttribute('data-theme', theme);

    if (!theme) {
      setTheme(AppTheme.LIGHT);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme--${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
