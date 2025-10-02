import styled from '@emotion/styled';

export const SeoModalContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'dir'
})<{ dir?: 'ltr' | 'rtl' }>(({ dir }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.6rem',
  fontFamily: "var(--font-family-base, 'Rubik', sans-serif)",
  minWidth: '32rem',
  direction: dir ?? 'rtl'
}));

export const SeoColumn = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem'
});

export const SeoInput = styled.input({
  fontSize: '1.4rem',
  padding: '0.6rem 0.8rem'
});

export const SeoTextarea = styled.textarea({
  fontSize: '1.4rem',
  padding: '0.6rem 0.8rem',
  minHeight: '6rem'
});

export const SeoHeading = styled.h4({
  margin: 0,
  gridColumn: '1 / -1',
  fontWeight: 500,
  fontFamily: "var(--font-family-base, 'Rubik', sans-serif)",
  textAlign: 'left'
});
