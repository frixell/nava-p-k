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
  gap: '0.25rem'
}));

export const ToolbarLabel = styled.span<{ isDirty?: boolean }>(({ isDirty }) => ({
  display: 'block',
  minHeight: '1.8rem',
  minWidth: '5.6rem',
  fontSize: '0.9rem',
  color: isDirty
    ? 'var(--color-accent-danger, #cc7f6b)'
    : 'var(--color-accent-secondary, #749260)'
}));

export const ToolbarActionButton = styled.button({
  padding: 0,
  border: 'none',
  background: 'transparent',
  width: '3rem',
  height: '3rem',
  cursor: 'pointer'
});

export const ToolbarActionIcon = styled.img({
  width: '100%',
  height: '100%'
});
