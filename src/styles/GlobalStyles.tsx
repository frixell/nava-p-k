import { Global, css, useTheme } from '@emotion/react';
import type { ReactElement } from 'react';
import type { AppTheme } from './theme';

const GlobalStyles = (): ReactElement => {
  const theme = useTheme() as AppTheme;
  const { colors, spacing, typography } = theme.app;

  return (
    <Global
      styles={css({
        '.app__loading-screen': {
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          color: colors.text.muted
        },
        '.app__loading-screen--dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.65)'
        },
        '.app__loading-screen img': {
          maxWidth: '18rem',
          width: '30vw'
        },
        '.app__loading-spinner': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.sm,
          color: colors.text.muted
        },
        '.app__loading-spinner p': {
          fontFamily: typography.fontFamilyBase,
          fontWeight: typography.weights.medium,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'currentColor'
        }
      })}
    />
  );
};

export default GlobalStyles;
