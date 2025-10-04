import styled from '@emotion/styled';

const mobileBreakpoint = '@media (max-width: 768px)';

type FooterPosition = 'absolute' | 'relative' | 'fixed';

interface FooterContainerProps {
  position?: FooterPosition;
}

export const FooterContainer = styled('footer', {
  shouldForwardProp: (prop) => prop !== 'position'
})<FooterContainerProps>(({ theme, position }) => {
  const basePositionStyles: Record<string, unknown> = {};

  if (position === 'absolute' || position === 'fixed') {
    basePositionStyles.position = position;
    basePositionStyles.bottom = 0;
    basePositionStyles.left = 0;
  } else if (position === 'relative') {
    basePositionStyles.position = 'relative';
  }

  const mobilePositionStyles: Record<string, unknown> = {};
  if (position === 'absolute' || position === 'relative' || position === 'fixed') {
    mobilePositionStyles.position = 'fixed';
  }

  return {
    width: '100%',
    background: 'none',
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingInline: theme.app.spacing.sm,
    ...basePositionStyles,
    [mobileBreakpoint]: {
      height: '2.4rem',
      background: `var(--color-background-dark, ${theme.app.colors.backgroundDark})`,
      bottom: 0,
      left: 0,
      zIndex: 5007,
      paddingInline: theme.app.spacing.xs,
      ...mobilePositionStyles
    }
  };
});

type FooterTextScreen = 'desktop' | 'mobile';

interface FooterTextProps {
  screen: FooterTextScreen;
}

export const FooterText = styled('p', {
  shouldForwardProp: (prop) => prop !== 'screen'
})<FooterTextProps>(({ theme, screen }) => ({
  margin: 0,
  padding: 0,
  color: `var(--color-text-muted, ${theme.app.colors.text.muted})`,
  fontSize: screen === 'mobile' ? '1.2rem' : '1.15rem',
  width: '100%',
  textAlign: 'center',
  paddingTop: screen === 'mobile' ? theme.app.spacing.xs : theme.app.spacing.md,
  lineHeight: screen === 'mobile' ? '1.2rem' : 1.4,
  fontFamily: theme.app.typography.fontFamilyBase,
  fontWeight: theme.app.typography.weights.regular,
  display: screen === 'mobile' ? 'none' : 'block',
  '& a': {
    color: `var(--color-surface, ${theme.app.colors.surface})`,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: `var(--color-surface, ${theme.app.colors.surface})`,
      textDecoration: 'none'
    }
  },
  [mobileBreakpoint]: {
    display: screen === 'mobile' ? 'block' : 'none'
  }
}));
