import { Global, css, useTheme } from '@emotion/react';
import type { ReactElement } from 'react';
import type { AppTheme } from './theme';

const ThemeOverrides = (): ReactElement => {
  const theme = useTheme() as AppTheme;
  const { colors, spacing, typography } = theme.app;

  return (
    <Global
      styles={css({
        ':root': {
          '--color-background': colors.background,
          '--color-background-dark': colors.backgroundDark,
          '--color-surface': colors.surface,
          '--color-surface-muted': colors.surfaceMuted,
          '--color-surface-subtle': colors.surfaceSubtle,
          '--color-text-main': colors.text.primary,
          '--color-text-muted': colors.text.muted,
          '--color-text-secondary': colors.text.secondary,
          '--color-text-inverse': colors.text.inverse,
          '--color-accent': colors.accent.primary,
          '--color-accent-alt': colors.accent.secondary,
          '--color-accent-secondary': colors.accent.secondary,
          '--color-accent-tertiary': colors.accent.tertiary,
          '--color-border': colors.border,
          '--color-error': colors.error.main,
          '--color-error-bg': colors.error.background,
          '--color-error-border': colors.error.border,
          '--color-error-strong': colors.error.strong,
          '--space-2xs': spacing['2xs'],
          '--space-xs': spacing.xs,
          '--space-sm': spacing.sm,
          '--space-md': spacing.md,
          '--space-lg': spacing.lg,
          '--space-xl': spacing.xl,
          '--space-2xl': spacing['2xl'],
          '--space-xxl': spacing.xxl,
          '--space-3xl': spacing['3xl'],
          '--font-size-sm': '0.875rem',
          '--font-size-base': '1rem',
          '--font-size-lg': '1.25rem',
          '--font-size-xl': '1.5rem',
          '--font-family-base': typography.fontFamilyBase,
          '--font-family-heading': typography.fontFamilyHeading,
          '--font-weight-regular': typography.weights.regular,
          '--font-weight-medium': typography.weights.medium,
          '--font-weight-bold': typography.weights.bold,
          '--m-size': typography.fontSizeBase,
          '--font-display-lg-size': typography.variants.displayLg.fontSize,
          '--font-display-lg-line-height': typography.variants.displayLg.lineHeight,
          '--font-display-lg-weight': String(typography.variants.displayLg.fontWeight),
          '--font-display-md-size': typography.variants.displayMd.fontSize,
          '--font-display-md-line-height': typography.variants.displayMd.lineHeight,
          '--font-display-md-weight': String(typography.variants.displayMd.fontWeight),
          '--font-stat-number-size': typography.variants.statNumber.fontSize,
          '--font-stat-number-line-height': typography.variants.statNumber.lineHeight,
          '--font-stat-number-weight': String(typography.variants.statNumber.fontWeight),
          '--font-body-size': typography.variants.body.fontSize,
          '--font-body-line-height': typography.variants.body.lineHeight,
          '--font-body-weight': String(typography.variants.body.fontWeight)
        },
        "[data-theme='dark']": {
          '--color-background': '#121212',
          '--color-background-dark': '#090909',
          '--color-surface': '#1f1f1f',
          '--color-surface-muted': '#222222',
          '--color-text-main': '#f7f7f7',
          '--color-text-muted': '#d0d0d0',
          '--color-text-inverse': '#090909',
          '--color-border': 'rgba(255, 255, 255, 0.1)',
          '--color-error': '#f87171',
          '--color-accent-secondary': '#4f7a6a',
          '--color-accent-tertiary': '#6ba3ff',
          '--color-error-bg': '#2b0b0b',
          '--color-error-border': 'rgba(248, 113, 113, 0.45)',
          '--color-error-strong': '#fca5a5'
        },
        'button, input, textarea, select': {
          fontFamily: typography.fontFamilyBase
        },
        button: {
          fontWeight: typography.weights.medium
        }
      })}
    />
  );
};

export default ThemeOverrides;
