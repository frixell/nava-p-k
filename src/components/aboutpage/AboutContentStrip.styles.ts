import styled from '@emotion/styled';

export const ContentSection = styled.section<{ dir: 'ltr' | 'rtl' }>(({ dir }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem 0',
  direction: dir
}));

export const ContentContainer = styled.div({
  width: '100%',
  maxWidth: '960px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
});

export const Viewer = styled.div<{ dir: 'ltr' | 'rtl' }>(({ dir }) => ({
  fontSize: '1.6rem',
  lineHeight: 1.8,
  color: 'var(--color-text-secondary, #4f5b5f)',
  direction: dir,
  '& p': {
    margin: '0 0 1rem'
  }
}));

export const Note = styled.p({
  margin: 0,
  fontSize: '1.2rem',
  color: 'var(--color-text-muted, #8c9496)'
});
