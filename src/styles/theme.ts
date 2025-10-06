import { createTheme } from '@mui/material/styles';

export interface ColorSet {
  background: string;
  backgroundDark: string;
  surface: string;
  surfaceMuted: string;
  surfaceSubtle: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  accent: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  error: {
    main: string;
    background: string;
    border: string;
    strong: string;
  };
}

export interface SpacingScale {
  '2xs': string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  xxl: string;
  '3xl': string;
}

export interface TypographyVariant {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
}

export interface TypographyScale {
  fontFamilyBase: string;
  fontFamilyHeading: string;
  fontFamilySystem: string;
  fontSizeBase: string;
  lineHeightBase: number;
  weights: {
    regular: number;
    medium: number;
    bold: number;
  };
  variants: {
    displayLg: TypographyVariant;
    displayMd: TypographyVariant;
    statNumber: TypographyVariant;
    body: TypographyVariant;
  };
}

export interface GradientSet {
  primary: string;
  accent: string;
}

export interface ShadowSet {
  card: string;
  floating: string;
}

export interface AppTokens {
  colors: ColorSet;
  spacing: SpacingScale;
  typography: TypographyScale;
  gradients: GradientSet;
  shadows: ShadowSet;
  categoryPalette: string[];
  colorPickerPalette: string[];
}

const tokens: AppTokens = {
  colors: {
    background: '#F5F7FA',
    backgroundDark: '#0B2744',
    surface: '#FFFFFF',
    surfaceMuted: '#E7EDF3',
    surfaceSubtle: '#F1F4F8',
    border: '#D8DEE6',
    text: {
      primary: '#0A1F33',
      secondary: '#2F3B4A',
      muted: '#4F5B66',
      inverse: '#FFFFFF'
    },
    accent: {
      primary: '#0B2744',
      secondary: '#145C9E',
      tertiary: '#1872C0'
    },
    error: {
      main: '#d14343',
      background: '#fef2f2',
      border: '#fecaca',
      strong: '#dc2626'
    }
  },
  spacing: {
    '2xs': '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    xxl: '4rem',
    '3xl': '6rem'
  },
  typography: {
    fontFamilyBase: "'Heebo', 'Helvetica Neue', Arial, sans-serif",
    fontFamilyHeading: "'Heebo', 'Helvetica Neue', Arial, sans-serif",
    fontFamilySystem:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    fontSizeBase: '1.6rem',
    lineHeightBase: 1.6,
    weights: {
      regular: 400,
      medium: 500,
      bold: 700
    },
    variants: {
      displayLg: {
        fontSize: '3.5rem',
        lineHeight: '1.1',
        fontWeight: 500,
        letterSpacing: '-0.02em'
      },
      displayMd: {
        fontSize: '2.5rem',
        lineHeight: '1.2',
        fontWeight: 500,
        letterSpacing: '-0.01em'
      },
      statNumber: {
        fontSize: '2.5rem',
        lineHeight: '1.1',
        fontWeight: 600,
        letterSpacing: '-0.015em'
      },
      body: {
        fontSize: '1rem',
        lineHeight: '1.5',
        fontWeight: 400
      }
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: 'linear-gradient(135deg, #53b0a1 0%, #5eae88 100%)'
  },
  shadows: {
    card: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    floating: '0 15px 30px -10px rgba(34, 34, 34, 0.35)'
  },
  categoryPalette: ['#409191', '#c1617e', '#5eae88', '#a6c98d', '#db8976', '#e8e2a4', '#e5b682'],
  colorPickerPalette: ['#000000', '#FFFFFF', '#fbc02d', '#53b0a1', '#666665']
};

export const appTokens: AppTheme['app'] & { categoryPalette: string[] } = tokens;

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: tokens.colors.background,
      paper: tokens.colors.surface
    },
    text: {
      primary: tokens.colors.text.primary,
      secondary: tokens.colors.text.secondary
    },
    primary: {
      main: tokens.colors.accent.primary
    },
    secondary: {
      main: tokens.colors.accent.secondary
    },
    error: {
      main: tokens.colors.error.main
    }
  },
  typography: {
    fontFamily: tokens.typography.fontFamilyBase,
    fontWeightRegular: tokens.typography.weights.regular,
    fontWeightMedium: tokens.typography.weights.medium,
    fontWeightBold: tokens.typography.weights.bold
  }
});

const theme = muiTheme as typeof muiTheme & { app: AppTokens };
theme.app = tokens;

theme.typography.h1 = {
  fontFamily: tokens.typography.fontFamilyHeading,
  fontWeight: tokens.typography.variants.displayLg.fontWeight,
  fontSize: tokens.typography.variants.displayLg.fontSize,
  lineHeight: tokens.typography.variants.displayLg.lineHeight,
  letterSpacing: tokens.typography.variants.displayLg.letterSpacing
};

theme.typography.h2 = {
  fontFamily: tokens.typography.fontFamilyHeading,
  fontWeight: tokens.typography.variants.displayMd.fontWeight,
  fontSize: tokens.typography.variants.displayMd.fontSize,
  lineHeight: tokens.typography.variants.displayMd.lineHeight,
  letterSpacing: tokens.typography.variants.displayMd.letterSpacing
};

theme.typography.subtitle1 = {
  fontFamily: tokens.typography.fontFamilyBase,
  fontWeight: tokens.typography.weights.medium,
  fontSize: tokens.typography.variants.body.fontSize,
  lineHeight: tokens.typography.variants.body.lineHeight
};

theme.typography.body1 = {
  fontFamily: tokens.typography.fontFamilyBase,
  fontWeight: tokens.typography.variants.body.fontWeight,
  fontSize: tokens.typography.variants.body.fontSize,
  lineHeight: tokens.typography.variants.body.lineHeight
};

export type AppTheme = typeof theme;

export default theme;
