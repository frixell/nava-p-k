import styled from '@emotion/styled';
import type { AppTheme } from '../../styles/theme';

export const ContactLayout = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing['2xl'],
  padding: `${theme.app.spacing['2xl']} clamp(${theme.app.spacing.md}, 4vw, ${theme.app.spacing.xl}) ${theme.app.spacing['2xl']}`
}));

export const CardGrid = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.app.spacing.xl,
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
}));

export const Card = styled.article(({ theme }) => ({
  background: theme.app.colors.surface,
  borderRadius: '1rem',
  boxShadow: theme.app.shadows.card,
  padding: theme.app.spacing['2xl'],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.lg
}));

export const CardHeading = styled('h2', {
    shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>(({ theme, direction }) => ({
    margin: 0,
    fontSize: '2rem',
    fontWeight: theme.app.typography.weights.bold,
    color: `var(--color-text-main, ${theme.app.colors.text.primary})`,
    textAlign: direction === 'rtl' ? 'right' : 'left',
    direction
}));

export const CardSubheading = styled('p', {
    shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>(({ theme, direction }) => ({
    margin: 0,
    fontSize: '1.4rem',
    color: `var(--color-text-muted, ${theme.app.colors.text.muted})`,
    textAlign: direction === 'rtl' ? 'right' : 'left',
    direction
}));

export const FieldStack = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.app.spacing.sm
}));

const focusOutline = (theme: AppTheme) => ({
  outline: 'none',
  borderColor: `var(--color-accent-secondary, ${theme.app.colors.accent.secondary})`,
  boxShadow: `0 0 0 3px rgba(79, 122, 106, 0.16)`
});

export const InputField = styled('input', {
  shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>(({ theme, direction }) => ({
  width: '100%',
  padding: '1.1rem 1.4rem',
  borderRadius: '0.8rem',
  border: `1px solid rgba(15, 23, 42, 0.12)`,
  fontSize: '1.4rem',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box',
  direction,
  textAlign: direction === 'rtl' ? 'right' : 'left',
  '&::placeholder': {
    textAlign: direction === 'rtl' ? 'right' : 'left'
  },
  '&:focus': focusOutline(theme)
}));

export const TextAreaField = styled('textarea', {
  shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>(({ theme, direction }) => ({
  width: '100%',
  minHeight: '12rem',
  padding: '1.1rem 1.4rem',
  borderRadius: '0.8rem',
  border: `1px solid rgba(15, 23, 42, 0.12)`,
  fontSize: '1.4rem',
  resize: 'vertical',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box',
  direction,
  textAlign: direction === 'rtl' ? 'right' : 'left',
  '&::placeholder': {
    textAlign: direction === 'rtl' ? 'right' : 'left'
  },
  '&:focus': focusOutline(theme)
}));

export const PrimaryButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction?: 'ltr' | 'rtl' }>(({ theme, direction = 'ltr' }) => ({
  alignSelf: direction === 'rtl' ? 'flex-end' : 'flex-start',
  padding: '0.9rem 1.8rem',
  borderRadius: '999px',
  background: `var(--color-accent, ${theme.app.colors.accent.primary})`,
  color: `var(--color-surface, ${theme.app.colors.text.inverse})`,
  fontSize: '1.4rem',
  fontWeight: theme.app.typography.weights.medium,
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 0.8rem 1.6rem rgba(79, 122, 106, 0.25)'
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'default',
    boxShadow: 'none'
  }
}));

export const ErrorMessage = styled.p(({ theme }) => ({
  margin: 0,
  fontSize: '1.3rem',
  color: `var(--color-error, ${theme.app.colors.error.main})`
}));

export const SuccessContent = styled.div(({ theme }) => ({
  padding: theme.app.spacing.md,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.app.spacing.md,
  textAlign: 'center'
}));

export const SuccessTitle = styled.h3(({ theme }) => ({
  margin: 0,
  fontSize: '1.8rem',
  fontWeight: theme.app.typography.weights.bold
}));

export const SuccessBody = styled.p(({ theme }) => ({
  margin: 0,
  fontSize: '1.4rem',
  color: `var(--color-text-muted, ${theme.app.colors.text.muted})`
}));

export const LinkList = styled.ul(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: theme.app.spacing.sm
}));

export const LinkItem = styled.li(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.app.spacing.sm,
  fontSize: '1.5rem'
}));

export const LinkAnchor = styled.a(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.app.spacing.xs,
  '&:hover': {
    color: `var(--color-accent-secondary, ${theme.app.colors.accent.secondary})`
  }
}));
