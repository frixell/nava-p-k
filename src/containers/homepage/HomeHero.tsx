/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import {
  AvatarFrame,
  FilterPill,
  FilterDropdown,
  ImpactBand,
  type ImpactItem
} from '../../components/newDesign';
import type { FilterDropdownOption } from '../../components/newDesign/FilterDropdown';
import StaticMap from './StaticMap';
import HeroArcgisMap, { HeroArcgisMarker } from './HeroArcgisMap';
import type { Category } from '../../store/slices/categoriesSlice';

interface HeroCategory {
  id: string;
  label: string;
}

interface HomeHeroProps {
  isHebrew: boolean;
  portraitSrc?: string;
  portraitAlt: string;
  headline: string;
  subheading: string;
  allLabel: string;
  dropdownLabel: string;
  categories: HeroCategory[];
  dropdownOptions: FilterDropdownOption[];
  activeCategoryId?: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  metrics: ImpactItem[];
  markers: Array<{
    id: string;
    left: number;
    top: number;
    color: string;
    label?: string;
  }>;
  arcgisMarkers?: HeroArcgisMarker[];
  arcgisCategories?: Category[];
  arcgisCategoryColors?: Array<{ id: string; color?: number[]; colorHex?: string }>;
  selectedMarkerId?: string | null;
  onMarkerSelect?: (markerId: string) => void;
  onEditHero?: () => void;
}

const HeroSection = styled('section')(({ theme }) => ({
  backgroundColor: theme.app.colors.background,
  paddingInline: theme.app.spacing.xxl,
  paddingTop: theme.app.spacing.xl,
  paddingBottom: theme.app.spacing.xxl,
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

const FilterRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.app.spacing.sm,
  marginTop: theme.app.spacing.lg
}));

const PillOverflow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.app.spacing.sm,
  flexWrap: 'wrap',
  alignItems: 'center'
}));

const HomeHero: React.FC<HomeHeroProps> = ({
  isHebrew,
  portraitSrc,
  portraitAlt,
  headline,
  subheading,
  allLabel,
  dropdownLabel,
  categories,
  dropdownOptions,
  activeCategoryId,
  onSelectCategory,
  metrics,
  markers,
  arcgisMarkers = [],
  arcgisCategories = [],
  arcgisCategoryColors = [],
  selectedMarkerId,
  onMarkerSelect,
  onEditHero
}) => {
  const primaryCategories = useMemo(() => categories.slice(0, 5), [categories]);

  return (
    <>
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
            <FilterRow>
              <PillOverflow>
                <FilterPill
                  type="button"
                  active={!activeCategoryId}
                  onClick={() => onSelectCategory(null)}
                >
                  {allLabel}
                </FilterPill>
                {primaryCategories.map((category) => (
                  <FilterPill
                    key={category.id}
                    type="button"
                    active={activeCategoryId === category.id}
                    onClick={() => onSelectCategory(category.id)}
                  >
                    {category.label}
                  </FilterPill>
                ))}
              </PillOverflow>
              {dropdownOptions.length > primaryCategories.length ? (
                <FilterDropdown
                  label={dropdownLabel}
                  options={dropdownOptions}
                  selectedId={activeCategoryId ?? undefined}
                  onSelect={(optionId) => onSelectCategory(optionId)}
                />
              ) : null}
            </FilterRow>
          </TextBlock>
        </HeroContent>
        {arcgisMarkers.length > 0 ? (
          <HeroArcgisMap
            markers={arcgisMarkers}
            categories={arcgisCategories}
            categoryColors={arcgisCategoryColors}
            selectedId={selectedMarkerId ?? undefined}
            onSelect={onMarkerSelect}
            isHebrew={isHebrew}
          />
        ) : (
          <StaticMap
            markers={markers}
            selectedId={selectedMarkerId ?? undefined}
            onMarkerClick={onMarkerSelect}
            isHebrew={isHebrew}
          />
        )}
      </HeroSection>
      <ImpactBand items={metrics} />
    </>
  );
};

export default HomeHero;
