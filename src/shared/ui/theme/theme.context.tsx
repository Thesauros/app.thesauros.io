import React from 'react';

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

type TThemeState = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

export const initialThemeState: TThemeState = {
  theme: AppTheme.LIGHT,
  setTheme: () => null,
};

const ThemeContext = React.createContext(initialThemeState);
export default ThemeContext;
