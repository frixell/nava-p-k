import styled from '@emotion/styled';

export const TopStripRoot = styled.section({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
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
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  '&:hover': {
    background: 'rgba(0,0,0,0.8)'
  }
});

export const SloganWrapper = styled.div<{ dir: 'ltr' | 'rtl' }>(({ dir }) => ({
  width: '40vw',
  maxWidth: '520px',
  minWidth: '260px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  direction: dir
}));

export const SloganTextarea = styled.textarea({
  width: '100%',
  minHeight: '12rem',
  padding: '1.2rem',
  borderRadius: '0.75rem',
  border: '1px solid rgba(0,0,0,0.08)',
  fontSize: '1.6rem',
  lineHeight: 1.6,
  resize: 'vertical',
  background: '#fff',
  color: 'var(--color-text-primary, #3a3a3a)'
});

export const SloganText = styled.p<{ dir: 'ltr' | 'rtl' }>(({ dir }) => ({
  margin: 0,
  padding: '1.2rem',
  fontSize: '1.6rem',
  lineHeight: 1.6,
  direction: dir,
  color: 'var(--color-text-secondary, #4f5b5f)',
  background: '#fff',
  borderRadius: '0.75rem'
}));

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
