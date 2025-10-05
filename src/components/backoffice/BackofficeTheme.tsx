import { Global, useTheme } from '@emotion/react';
import type { PropsWithChildren, ReactElement } from 'react';
import type { AppTheme } from '../../styles/theme';

interface BackofficeThemeProps extends PropsWithChildren {
  enabled?: boolean;
}

const BackofficeTheme = ({ enabled = true, children }: BackofficeThemeProps): ReactElement => {
  const theme = useTheme() as AppTheme;

  const { colors, typography } = theme.app;

  return (
    <div data-backoffice-theme={enabled ? 'true' : undefined}>
      {enabled ? (
        <Global
          styles={{
            '[data-backoffice-theme="true"]': {
              '--color-surface': colors.surface,
              '--color-surface-muted': colors.surfaceMuted,
              '--color-surface-subtle': colors.surfaceSubtle,
              '--color-background-dark': colors.backgroundDark,
              '--color-text-main': colors.text.primary,
              '--color-text-muted': colors.text.muted,
              '--color-text-inverse': colors.text.inverse,
              '--color-accent': colors.accent.primary,
              '--color-accent-secondary': colors.accent.secondary,
              '--color-border': colors.border,
              '--color-error': colors.error.main,
              '--font-family-base': typography.fontFamilyBase,
              '--font-weight-regular': typography.weights.regular,
              '--font-weight-medium': typography.weights.medium,
              '--font-weight-bold': typography.weights.bold
            }
          }}
        />
      ) : null}
      {children}
    </div>
  );
};

export default BackofficeTheme;
