import styled from '@emotion/styled';

export const ContactLayout = styled.section({
  display: 'flex',
  flexDirection: 'column',
  gap: '3rem',
  padding: '6rem clamp(1.5rem, 4vw, 4rem) 6rem'
});

export const CardGrid = styled.div({
  display: 'grid',
  gap: '2.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
});

export const Card = styled.article({
  background: '#fff',
  borderRadius: '1rem',
  boxShadow: '0 1.5rem 3rem rgba(15, 23, 42, 0.08)',
  padding: '2.4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem'
});

export const CardHeading = styled('h2', {
    shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>(({ direction }) => ({
    margin: 0,
    fontSize: '2rem',
    fontWeight: 600,
    color: 'var(--color-text-primary, #2f3a3f)',
    textAlign: direction === 'rtl' ? 'right' : 'left',
    direction
}));

export const CardSubheading = styled('p', {
    shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>(({ direction }) => ({
    margin: 0,
    fontSize: '1.4rem',
    color: 'var(--color-text-muted, #6d767a)',
    textAlign: direction === 'rtl' ? 'right' : 'left',
    direction
}));

export const FieldStack = styled.div({
  display: 'grid',
  gap: '1.2rem'
});

export const InputField = styled('input', {
  shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>(({ direction }) => ({
  width: '100%',
  padding: '1.1rem 1.4rem',
  borderRadius: '0.8rem',
  border: '1px solid rgba(15, 23, 42, 0.12)',
  fontSize: '1.4rem',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box',
  direction,
  textAlign: direction === 'rtl' ? 'right' : 'left',
  '&::placeholder': {
    textAlign: direction === 'rtl' ? 'right' : 'left'
  },
  '&:focus': {
    outline: 'none',
    borderColor: 'var(--color-accent-secondary, #4f7a6a)',
    boxShadow: '0 0 0 3px rgba(79, 122, 106, 0.16)'
  }
}));

export const TextAreaField = styled('textarea', {
  shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>(({ direction }) => ({
  width: '100%',
  minHeight: '12rem',
  padding: '1.1rem 1.4rem',
  borderRadius: '0.8rem',
  border: '1px solid rgba(15, 23, 42, 0.12)',
  fontSize: '1.4rem',
  resize: 'vertical',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box',
  direction,
  textAlign: direction === 'rtl' ? 'right' : 'left',
  '&::placeholder': {
    textAlign: direction === 'rtl' ? 'right' : 'left'
  },
  '&:focus': {
    outline: 'none',
    borderColor: 'var(--color-accent-secondary, #4f7a6a)',
    boxShadow: '0 0 0 3px rgba(79, 122, 106, 0.16)'
  }
}));

export const PrimaryButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction?: 'ltr' | 'rtl' }>(({ direction = 'ltr' }) => ({
  alignSelf: direction === 'rtl' ? 'flex-end' : 'flex-start',
  padding: '0.9rem 1.8rem',
  borderRadius: '999px',
  background: 'var(--color-accent-secondary, #4f7a6a)',
  color: '#fff',
  fontSize: '1.4rem',
  fontWeight: 500,
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

export const ErrorMessage = styled.p({
  margin: 0,
  fontSize: '1.3rem',
  color: '#d14343'
});

export const SuccessContent = styled.div({
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.2rem',
  textAlign: 'center'
});

export const SuccessTitle = styled.h3({
  margin: 0,
  fontSize: '1.8rem',
  fontWeight: 600
});

export const SuccessBody = styled.p({
  margin: 0,
  fontSize: '1.4rem',
  color: 'var(--color-text-muted, #6d767a)'
});

export const LinkList = styled.ul({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: '0.8rem'
});

export const LinkItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  fontSize: '1.5rem'
});

export const LinkAnchor = styled.a({
  color: 'inherit',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.6rem',
  '&:hover': {
    color: 'var(--color-accent-secondary, #4f7a6a)'
  }
});
