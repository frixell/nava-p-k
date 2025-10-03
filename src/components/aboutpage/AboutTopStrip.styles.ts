import styled from '@emotion/styled';

export const TopStripRoot = styled.section({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3rem',
  marginTop: '6rem',
  marginBottom: '2rem',
  width: '100%'
});

export const ImageWrapper = styled.div({
  position: 'relative',
  width: '60vw',
  maxWidth: '960px',
  height: '35vw',
  maxHeight: '560px',
  overflow: 'hidden',
  borderRadius: '0.75rem',
  background: 'var(--color-surface-subtle, #f0f0f0)'
});

export const HeroImage = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

export const UploadAction = styled.button({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  padding: '0.5rem',
  border: 'none',
  borderRadius: '50%',
  background: 'rgba(0,0,0,0.6)',
  color: 'var(--color-surface, #fff)',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  '&:hover': {
    background: 'rgba(0,0,0,0.8)'
  }
});
export const Placeholder = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  color: 'var(--color-text-muted, #8c9496)',
  background: 'var(--color-surface-subtle, #f0f0f0)'
});
