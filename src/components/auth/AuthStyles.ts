import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Button from '../../shared/components/Button';

const BREAKPOINT_MOBILE = 480;

export const AuthPage = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.app.gradients.primary,
  padding: theme.app.spacing.xl,
  fontFamily: theme.app.typography.fontFamilySystem,
  [`@media (max-width: ${BREAKPOINT_MOBILE}px)`]: {
    padding: theme.app.spacing.lg
  }
}));

export const AuthCard = styled('section')(({ theme }) => ({
  width: '100%',
  maxWidth: '420px',
  background: theme.app.colors.surface,
  borderRadius: '12px',
  boxShadow: theme.app.shadows.card,
  padding: theme.app.spacing['2xl'],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.lg,
  [`@media (max-width: ${BREAKPOINT_MOBILE}px)`]: {
    padding: theme.app.spacing.xl
  }
}));

export const AuthHeader = styled('header')(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.xs
}));

export const AuthTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontSize: '2rem',
  fontWeight: theme.app.typography.weights.bold,
  color: theme.app.colors.text.primary,
  [`@media (max-width: ${BREAKPOINT_MOBILE}px)`]: {
    fontSize: '1.75rem'
  }
}));

export const AuthSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: '1rem',
  color: theme.app.colors.text.muted
}));

export const AuthForm = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
});

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const SpinnerWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.app.spacing.md,
  padding: `${theme.app.spacing.lg} 0`,
  textAlign: 'center',
  color: theme.app.colors.text.muted
}));

export const Spinner = styled('div')(({ theme }) => ({
  width: '48px',
  height: '48px',
  border: `4px solid ${theme.app.colors.surfaceMuted}`,
  borderTop: `4px solid ${theme.app.colors.accent.tertiary}`,
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`
}));

export const ErrorBanner = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.app.spacing.xs,
  padding: `${theme.app.spacing.sm} ${theme.app.spacing.md}`,
  borderRadius: '8px',
  background: theme.app.colors.error.background,
  border: `1px solid ${theme.app.colors.error.border}`,
  color: theme.app.colors.error.strong,
  fontSize: '0.95rem'
}));

export const ErrorIcon = styled('span')({
  fontSize: '1.1rem'
});

export const SubmitButton = styled(Button)(({ theme }) => ({
  '&&': {
    width: '100%',
    marginTop: theme.app.spacing.sm,
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    fontWeight: theme.app.typography.weights.bold,
    background: theme.app.gradients.primary,
    color: theme.app.colors.text.inverse,
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)',
    '&:hover': {
      background: theme.app.gradients.primary,
      boxShadow: '0 12px 30px -5px rgba(102, 126, 234, 0.45)'
    },
    '&:disabled': {
      background: 'rgba(102, 126, 234, 0.4)',
      boxShadow: 'none'
    }
  }
}));

export const SecondaryAction = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: '0.95rem',
  textAlign: 'center',
  color: theme.app.colors.text.muted
}));

export const SecondaryLink = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  color: theme.app.colors.accent.tertiary,
  fontWeight: theme.app.typography.weights.medium,
  cursor: 'pointer',
  padding: 0,
  marginLeft: '0.35rem',
  textDecoration: 'underline',
  '&:hover': {
    textDecoration: 'none'
  }
}));
