import '@emotion/react';
import type { Theme as MuiTheme } from '@mui/material/styles';
import type { AppTokens } from './theme';

declare module '@mui/material/styles' {
  interface Theme {
    app: AppTokens;
  }

  // allow configuration using `createTheme({ app: {...} })` if ever needed
  interface ThemeOptions {
    app?: AppTokens;
  }
}

declare module '@emotion/react' {
  interface Theme extends MuiTheme {}
}
