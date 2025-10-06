/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import styled from '@emotion/styled';
import { AvatarFrame } from '../../components/newDesign';

interface HomeHeroProps {
  isHebrew: boolean;
  portraitSrc?: string;
  portraitAlt: string;
  headline: string;
  subheading: string;
  onEditHero?: () => void;
}

const HeroSection = styled('section')(({ theme }) => ({
  position: 'absolute',
  top: 50,
  zIndex: 3,
  width: '100%',
  maxWidth: 'calc(100vw - 42px)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  paddingInline: '21px',
  paddingTop: theme.app.spacing.sm,
  paddingBottom: theme.app.spacing.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.xxl,
  '@media (max-width: 900px)': {
    paddingInline: theme.app.spacing.lg,
    paddingTop: theme.app.spacing.xl,
    paddingBottom: theme.app.spacing.xl
  }
}));

const EditHeroButton = styled('button')(({ theme }) => ({
  alignSelf: 'flex-end',
  marginBottom: theme.app.spacing.md,
  padding: `${theme.app.spacing['2xs']} ${theme.app.spacing.sm}`,
  borderRadius: '999px',
  border: `1px solid ${theme.app.colors.border}`,
  backgroundColor: theme.app.colors.surface,
  color: theme.app.colors.text.primary,
  fontFamily: theme.app.typography.fontFamilyBase,
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.app.colors.surfaceMuted,
    borderColor: theme.app.colors.accent.secondary
  },
  '@media (max-width: 900px)': {
    alignSelf: 'center'
  }
}));

const HeroContent = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(120px, 160px) 1fr',
  gap: theme.app.spacing['2xl'],
  alignItems: 'center',
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr',
    textAlign: 'center'
  }
}));

const TextBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.sm
}));

const Headline = styled('h1')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.variants.displayLg.fontWeight,
  fontSize: `calc(${theme.app.typography.variants.displayLg.fontSize} * 0.75)`,
  lineHeight: theme.app.typography.variants.displayLg.lineHeight,
  letterSpacing: theme.app.typography.variants.displayLg.letterSpacing,
  color: theme.app.colors.text.primary
}));

const Subheading = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.app.typography.fontFamilyBase,
  fontSize: `calc(${theme.app.typography.variants.displayMd.fontSize} * 0.75)`,
  lineHeight: theme.app.typography.variants.displayMd.lineHeight,
  color: theme.app.colors.text.secondary,
  maxWidth: '42ch',
  '@media (max-width: 900px)': {
    maxWidth: 'none'
  }
}));

const HomeHero: React.FC<HomeHeroProps> = ({
  isHebrew,
  portraitSrc,
  portraitAlt,
  headline,
  subheading,
  onEditHero
}) => {
  return (
    <HeroSection dir={isHebrew ? 'rtl' : 'ltr'}>
      {onEditHero ? (
        <EditHeroButton type="button" onClick={onEditHero}>
          {isHebrew ? 'עריכת תוכן ראשי' : 'Edit hero'}
        </EditHeroButton>
      ) : null}
      <HeroContent>
        <AvatarFrame src={portraitSrc} alt={portraitAlt} isHebrew={isHebrew} />
        <TextBlock>
          <Headline>{headline}</Headline>
          <Subheading>{subheading}</Subheading>
        </TextBlock>
      </HeroContent>
    </HeroSection>
  );
};

export default HomeHero;
