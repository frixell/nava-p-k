import React from 'react';
import styled from '@emotion/styled';

interface HomeProjectDetailsProps {
  isHebrew: boolean;
  title: string;
  category?: string;
  description?: string;
  image?: string;
  onClose: () => void;
  closeLabel: string;
}

const DetailsWrapper = styled('section')(({ theme }) => ({
  marginInline: theme.app.spacing.xxl,
  marginBottom: theme.app.spacing['3xl'],
  backgroundColor: theme.app.colors.surface,
  borderRadius: '24px',
  border: `1px solid ${theme.app.colors.border}`,
  boxShadow: theme.app.shadows.card,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 320px)',
  gap: theme.app.spacing.xl,
  padding: theme.app.spacing.xl,
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr',
    marginInline: theme.app.spacing.lg
  }
}));

const InfoColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.sm
}));

const Title = styled('h3')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.variants.displayMd.fontWeight,
  fontSize: '1.6rem',
  color: theme.app.colors.text.primary
}));

const CategoryLabel = styled('span')(({ theme }) => ({
  fontSize: '0.95rem',
  color: theme.app.colors.text.secondary
}));

const Description = styled('p')(({ theme }) => ({
  margin: `${theme.app.spacing.sm} 0`,
  color: theme.app.colors.text.secondary,
  fontSize: '1rem',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap'
}));

const Poster = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingBottom: '66%',
  borderRadius: '20px',
  overflow: 'hidden',
  backgroundColor: theme.app.colors.surfaceMuted,
  '@media (max-width: 900px)': {
    paddingBottom: '56%'
  }
}));

const PosterImage = styled('img')({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

const CloseButton = styled('button')(({ theme }) => ({
  alignSelf: 'flex-start',
  marginTop: theme.app.spacing.lg,
  padding: `${theme.app.spacing['2xs']} ${theme.app.spacing.md}`,
  borderRadius: '999px',
  border: `1px solid ${theme.app.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.app.colors.text.primary,
  cursor: 'pointer',
  fontFamily: theme.app.typography.fontFamilyBase,
  fontWeight: theme.app.typography.weights.medium,
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.app.colors.surfaceMuted
  }
}));

const HomeProjectDetails: React.FC<HomeProjectDetailsProps> = ({
  isHebrew,
  title,
  category,
  description,
  image,
  onClose,
  closeLabel
}) => (
  <DetailsWrapper dir={isHebrew ? 'rtl' : 'ltr'}>
    <InfoColumn>
      <Title>{title}</Title>
      {category ? <CategoryLabel>{category}</CategoryLabel> : null}
      {description ? <Description>{description}</Description> : null}
      <CloseButton type="button" onClick={onClose}>
        {closeLabel}
      </CloseButton>
    </InfoColumn>
    {image ? (
      <Poster>
        <PosterImage src={image} alt="" />
      </Poster>
    ) : null}
  </DetailsWrapper>
);

export default HomeProjectDetails;
