import styled from '@emotion/styled';

export const ToolbarRoot = styled.nav({
  position: 'fixed',
  top: '0.5vh',
  left: '8.125rem', // 130px
  zIndex: 15000,
  minWidth: '28rem',
  width: '100%'
});

export const ToolbarButton = styled('div', {
  shouldForwardProp: (prop) => prop !== 'left'
})<{ left: string }>(({ left }) => ({
  position: 'absolute',
  left,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.125rem'
}));

export const ToolbarLabel = styled.span<{ isDirty?: boolean }>(({ isDirty }) => ({
  display: 'block',
  minHeight: '1.8rem',
  minWidth: '5.6rem',
  fontSize: '12px',
  color: isDirty
    ? 'var(--color-accent-danger, #cc7f6b)'
    : 'var(--color-accent-primary, aqua)'
}));

export const ToolbarActionButton = styled.button({
  padding: 0,
  border: 'none',
  background: 'var(--color-accent-primary, aqua)',
  width: '4rem',
  height: '3rem',
  cursor: 'pointer',
  borderRadius: '0.25rem',
  transition: 'background 150ms ease-in-out, border 150ms ease-in-out',
  '&:hover': {
    border: '1px solid var(--color-text-muted, #666665)'
  },
  '&:active': {
    background: 'var(--color-accent-success, green)'
  }
});

export const ToolbarActionIcon = styled.img({
  width: '100%',
  height: '100%'
});
