import styled from '@emotion/styled';

export const PageContainer = styled('div')(({ theme }) => ({
  margin: 0,
  padding: 0,
  backgroundColor: theme.app.colors.background,
  color: theme.app.colors.text.primary
}));

export const PageUpSpacer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isHidden'
})<{ isHidden: boolean }>(({ theme, isHidden }) => ({
  position: 'relative',
  marginInline: 'auto',
  width: '100%',
  maxWidth: '100vw',
  background: theme.app.colors.surfaceSubtle,
  height: theme.spacing(7),
  display: isHidden ? 'none' : 'block',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

export const FakePageUpStripAnchor = styled('div')({
  display: 'block'
});
