import styled from '@emotion/styled';

export const PageContainer = styled.div({
  margin: 0,
  padding: 0
});

export const PageUpSpacer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isHidden'
})<{ isHidden: boolean }>(({ isHidden }) => ({
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  maxWidth: '100vw',
  background: 'var(--color-pageup-placeholder, #f7f7f7)',
  height: '3.6rem',
  display: isHidden ? 'none' : 'block',
  '@media (max-width: 768px)': {
    display: 'none'
  }
}));

export const FakePageUpStripAnchor = styled.div({
  display: 'block'
});
