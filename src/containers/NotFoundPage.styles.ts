import styled from '@emotion/styled';

export const PageWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.app.colors.background
}));

export const HeroSection = styled('main')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: `${theme.spacing(7)} 0 0`,
  background: theme.app.colors.surfaceSubtle
}));

export const Panel = styled('section')(({ theme }) => ({
  position: 'relative',
  width: '90rem',
  maxWidth: '90vw',
  textAlign: 'center',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    maxWidth: '100%'
  }
}));

export const Title = styled('h1')(({ theme }) => ({
  margin: `${theme.spacing(9)} 0 0`,
  fontSize: 'clamp(10rem, 16vw, 18rem)',
  color: theme.app.colors.accent.tertiary,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.weights.medium,
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(6)
  }
}));

export const Subtitle = styled('h2')(({ theme }) => ({
  margin: `${theme.spacing(1)} 0 ${theme.spacing(6)}`,
  fontSize: 'clamp(3rem, 6vw, 5rem)',
  color: theme.app.colors.accent.tertiary,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.weights.medium
}));

export const ActionBar = styled('div', {
  shouldForwardProp: (prop) => prop !== 'dir'
})<{ dir: 'ltr' | 'rtl' }>(({ theme, dir }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'min(29.6rem, 90vw)',
  height: theme.spacing(6),
  margin: `0 auto ${theme.spacing(6)}`,
  direction: dir,
  [theme.breakpoints.down('md')]: {
    width: 'auto'
  }
}));

export const ActionButton = styled('button')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  transition: 'transform 120ms ease-in',
  transform: 'scale(1)',
  cursor: 'pointer',
  color: theme.app.colors.accent.tertiary,
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

export const ActionText = styled('span')(({ theme }) => ({
  margin: `${theme.spacing(2)} 0 ${theme.spacing(6)} ${theme.spacing(1)}`,
  fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)',
  color: theme.app.colors.accent.tertiary,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.weights.medium,
  [theme.breakpoints.down('md')]: {
    fontSize: 'clamp(1.6rem, 4vw, 2.5rem)'
  }
}));
