import React from 'react';
import styled from '@emotion/styled';

interface ProjectCardData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
}

interface HomeProjectsSectionProps {
  projects: ProjectCardData[];
  selectedId?: string | null;
  isHebrew: boolean;
  onSelect: (projectId: string) => void;
  onOpenDetails: (projectId: string) => void;
  viewLabel: string;
  heading: string;
}

const Section = styled('section')(({ theme }) => ({
  paddingInline: theme.app.spacing.xxl,
  paddingBlock: theme.app.spacing['3xl'],
  backgroundColor: theme.app.colors.background,
  '@media (max-width: 900px)': {
    paddingInline: theme.app.spacing.lg,
    paddingBlock: theme.app.spacing.xl
  }
}));

const SectionHeading = styled('h2')(({ theme }) => ({
  margin: `0 0 ${theme.app.spacing.xl}`,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.variants.displayMd.fontWeight,
  fontSize: theme.app.typography.variants.displayMd.fontSize,
  lineHeight: theme.app.typography.variants.displayMd.lineHeight,
  color: theme.app.colors.text.primary
}));

const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: theme.app.spacing.xl
}));

const Card = styled('article', {
  shouldForwardProp: (prop) => prop !== 'selected'
})<{ selected: boolean }>(({ theme, selected }) => ({
  backgroundColor: theme.app.colors.surface,
  borderRadius: '20px',
  border: `1px solid ${selected ? theme.app.colors.accent.primary : theme.app.colors.border}`,
  boxShadow: selected ? theme.app.shadows.card : '0 8px 20px rgba(10, 31, 51, 0.08)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(10, 31, 51, 0.12)'
  }
}));

const ImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  paddingBottom: '56.25%',
  overflow: 'hidden'
});

const CardImage = styled('img')({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

const CardBody = styled('div')(({ theme }) => ({
  padding: theme.app.spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.sm
}));

const CardTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.weights.medium,
  fontSize: '1.25rem',
  color: theme.app.colors.text.primary
}));

const CardSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: '0.95rem',
  color: theme.app.colors.text.secondary
}));

const CardDescription = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.app.colors.text.muted,
  fontSize: '0.95rem',
  lineHeight: 1.5,
  minHeight: '3.8rem',
  overflow: 'hidden'
}));

const CardFooter = styled('div')({
  marginTop: 'auto',
  display: 'flex',
  justifyContent: 'flex-end'
});

const ViewButton = styled('button')(({ theme }) => ({
  padding: `${theme.app.spacing['2xs']} ${theme.app.spacing.md}`,
  borderRadius: '999px',
  border: 'none',
  backgroundColor: theme.app.colors.accent.primary,
  color: theme.app.colors.text.inverse,
  fontFamily: theme.app.typography.fontFamilyBase,
  fontWeight: theme.app.typography.weights.medium,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.app.colors.accent.secondary
  }
}));

const HomeProjectsSection: React.FC<HomeProjectsSectionProps> = ({
  projects,
  selectedId,
  isHebrew,
  onSelect,
  onOpenDetails,
  viewLabel,
  heading
}) => (
  <Section dir={isHebrew ? 'rtl' : 'ltr'}>
    <SectionHeading>{heading}</SectionHeading>
    <Grid>
      {projects.map((project) => (
        <Card
          key={project.id}
          selected={selectedId === project.id}
          onClick={() => onSelect(project.id)}
        >
          {project.image ? (
            <ImageContainer>
              <CardImage src={project.image} alt="" />
            </ImageContainer>
          ) : null}
          <CardBody>
            <CardTitle>{project.title}</CardTitle>
            {project.subtitle ? <CardSubtitle>{project.subtitle}</CardSubtitle> : null}
            {project.description ? <CardDescription>{project.description}</CardDescription> : null}
            <CardFooter>
              <ViewButton
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenDetails(project.id);
                }}
              >
                {viewLabel}
              </ViewButton>
            </CardFooter>
          </CardBody>
        </Card>
      ))}
    </Grid>
  </Section>
);

export default HomeProjectsSection;
