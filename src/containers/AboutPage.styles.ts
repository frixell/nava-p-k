import styled from '@emotion/styled';

export const AboutStructure = styled('section')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(0),
  width: '100%',
  backgroundColor: theme.app.colors.background
}));

export const AboutLeftColumn = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: `${theme.breakpoints.values.lg}px`
}));

export const HeaderContainer = styled('header')(({ theme }) => ({
  marginTop: theme.spacing(6),
  width: '100%'
}));

export const PageHeading = styled('h1')(({ theme }) => ({
  fontSize: 'clamp(2.4rem, 3vw, 3rem)',
  margin: 0,
  textAlign: 'center',
  color: theme.app.colors.text.primary,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.weights.medium
}));
