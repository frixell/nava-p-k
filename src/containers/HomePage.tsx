/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import { startLogout } from '../store/slices/authSlice';
import { startAddPoint, startEditProject } from '../store/slices/pointsSlice';
import {
  startAddCategory,
  startEditCategories,
  startToggleShowCategory
} from '../store/slices/categoriesSlice';
import type { Category } from '../store/slices/categoriesSlice';
import { useHomePageController, HomePageControllerProps } from './homepage/useHomePageController';
import CategoryManagerModal from './homepage/CategoryManagerModal';
import NewCategoryModal from './homepage/NewCategoryModal';
import HomePageToolbar from './homepage/HomePageToolbar';
import HomePageLayout from './homepage/HomePageLayout';
import HomeHero from './homepage/HomeHero';
import StaticMap from './homepage/StaticMap';
import ArcgisMap from './homepage/ArcgisMap';
import HomeHeroModal from './homepage/HomeHeroModal';
// import HomeProjectsSection from './homepage/HomeProjectsSection';
import HomeProjectDetails from './homepage/HomeProjectDetails';
import type { HeroArcgisMarker } from './homepage/ArcgisMap';
import type { RootState, AppDispatch } from '../types/store';
import BackofficeTheme from '../components/backoffice/BackofficeTheme';
import { ImpactBand, type ImpactItem, FilterPill } from '../components/newDesign';
import type { HomepageHeroMetric, HomepageState } from '../store/slices/homepageSlice';
import { HERO_METRIC_DEFINITIONS } from '../constants/homeHeroMetrics';
import { appTokens } from '../styles/theme';
import { startEditHomePage, startDeleteHomePageImage } from '../store/slices/homepageSlice';

const FilterRow = styled('div')<{ isHebrew: boolean }>(({ theme, isHebrew }) => ({
  position: 'absolute',
  zIndex: 4,
  top: '100px',
  left: isHebrew ? 50 : 'none',
  right: isHebrew ? 'none' : 50,
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

type HeroPoint = {
  id?: string | number;
  categories?: string[] | string | null;
  x?: unknown;
  y?: unknown;
  title?: string;
  titleHebrew?: string;
  content?: string;
  contentHebrew?: string;
  extendedContent?: {
    image?: string;
    content?: string;
    contentHebrew?: string;
  };
};

interface MapMarker {
  id: string;
  left: number;
  top: number;
  color: string;
  label: string;
  point: HeroPoint;
  longitude?: number;
  latitude?: number;
}

type HomePageProps = HomePageControllerProps;

const HomePage: React.FC<HomePageProps> = (props) => {
  const {
    i18n,
    isAuthenticated,
    points,
    tableTemplate,
    startLogout: dispatchStartLogout,
    homepage,
    t
  } = props as HomePageProps & { t: TFunction; homepage?: HomepageState };

  // useHomePageController is a legacy hook that has not been fully typed yet.
  const {
    state,
    viewportWidth,
    setData,
    onUpdateProject,
    uploadWidget,
    addPoint,
    allowAddPoint,
    handleSideBarClick,
    handleExpandProject,
    hideProject,
    setSelectedProject,
    startEditCategory,
    toggleShowCategory,
    onCategoryOrderChange,
    onCategoryOrderBlur,
    onCategoryOrderKeyPress,
    onCategoryNameChange,
    onCategoryNameBlur,
    updateCategories,
    addNewCategory,
    onNewCategoryNameChange,
    onToggleNewCategoryName,
    onToggleEditCategories,
    setOpenCategories,
    heroModalIsOpen,
    heroSaving,
    heroDraft,
    openHeroModal,
    closeHeroModal,
    uploadHeroPortrait,
    clearHeroPortrait,
    saveHeroSettings,
    onHeroMetricChange
  } = useHomePageController(props);

  const isEnglish = i18n.language === 'en';
  const isHebrew = i18n.language === 'he';
  const isMobileViewport = viewportWidth < 768;
  const visibleCategories = state.categories.filter(
    (category) => isAuthenticated || category.isVisible !== false
  );

  const categoryOptions = visibleCategories.map((category) => ({
    id: String(category.id ?? ''),
    label: isEnglish
      ? String(category.name ?? category.nameHebrew ?? '')
      : String(category.nameHebrew ?? category.name ?? '')
  }));

  const activeCategoryId = state.openCategories.length > 0 ? state.openCategories[0] : null;

  const handleCategorySelect = (categoryId: string | null) => {
    setOpenCategories(categoryId ? [categoryId] : []);
  };

  const parseCoordinate = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return null;
  };

  const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

  const resolveMarkerColor = (categoryId: string | undefined | null) => {
    if (!categoryId) {
      return appTokens.colors.accent.secondary;
    }
    const match = state.categoryColors.find((entry) => entry.id === categoryId);
    return match?.colorHex ?? appTokens.colors.accent.secondary;
  };

  const pointMatchesCategory = (point: HeroPoint, categoryId: string | null): boolean => {
    if (!categoryId) {
      return true;
    }
    if (Array.isArray(point.categories)) {
      return point.categories.includes(categoryId);
    }
    if (typeof point.categories === 'string') {
      return point.categories
        .split(',')
        .map((item: string) => item.trim())
        .includes(categoryId);
    }
    return false;
  };

  const filteredPoints = state.points.filter((point: HeroPoint) =>
    pointMatchesCategory(point, activeCategoryId)
  );

  const categoryLabel = (categoryId: string | null | undefined): string => {
    if (!categoryId) {
      return '';
    }
    const category = state.categories.find((item) => String(item.id) === String(categoryId));
    if (!category) {
      return '';
    }
    const englishLabel = String(category.name ?? category.nameHebrew ?? '');
    const hebrewLabel = String(category.nameHebrew ?? category.name ?? '');
    return isHebrew ? hebrewLabel : englishLabel;
  };

  const stripHtml = (value?: string): string => {
    if (!value) {
      return '';
    }
    return value
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getDescription = (point: HeroPoint): string => {
    const preferred = isHebrew
      ? (point.extendedContent?.contentHebrew ??
        point.contentHebrew ??
        point.extendedContent?.content ??
        point.content)
      : (point.extendedContent?.content ??
        point.content ??
        point.extendedContent?.contentHebrew ??
        point.contentHebrew);
    return stripHtml(typeof preferred === 'string' ? preferred : undefined);
  };

  const mapMarkers: MapMarker[] = filteredPoints
    .map((point) => {
      const lon = parseCoordinate(point.x);
      const lat = parseCoordinate(point.y);
      if (lon === null || lat === null) {
        return null;
      }

      const rawCategories = (() => {
        if (Array.isArray(point.categories)) {
          return point.categories;
        }
        if (typeof point.categories === 'string') {
          return point.categories
            .split(',')
            .map((item: string) => item.trim())
            .filter(Boolean);
        }
        return [] as string[];
      })();

      const primaryCategory = rawCategories[0] ?? null;
      const englishTitle =
        typeof point.title === 'string' && point.title.length > 0 ? point.title : undefined;
      const hebrewTitle =
        typeof point.titleHebrew === 'string' && point.titleHebrew.length > 0
          ? point.titleHebrew
          : englishTitle;
      const label = (() => {
        if (isHebrew) {
          return hebrewTitle ?? '';
        }
        if (englishTitle) {
          return englishTitle;
        }
        return hebrewTitle ?? '';
      })();

      const marker: MapMarker = {
        id: String(point.id ?? `${lon}-${lat}`),
        left: clampPercent(((lon + 180) / 360) * 100),
        top: clampPercent(((90 - lat) / 180) * 100),
        color: resolveMarkerColor(primaryCategory),
        label,
        point,
        longitude: lon,
        latitude: lat
      };

      return marker;
    })
    .filter((marker): marker is MapMarker => marker !== null);

  const heroMarkers = mapMarkers.map((marker) => ({
    id: marker.id,
    left: marker.left,
    top: marker.top,
    color: marker.color,
    label: marker.label
  }));

  const heroArcgisMarkers: HeroArcgisMarker[] = mapMarkers
    .map((marker) => {
      if (typeof marker.longitude !== 'number' || typeof marker.latitude !== 'number') {
        return null;
      }
      const { id, point, longitude, latitude } = marker;
      return { id, longitude, latitude, point } satisfies HeroArcgisMarker;
    })
    .filter((marker): marker is HeroArcgisMarker => marker !== null);

  const translateMetricText = (lng: 'en' | 'he', key: string, fallback: string) => {
    if (typeof i18n.getFixedT === 'function') {
      return i18n.getFixedT(lng)(key, fallback);
    }
    return t(key, { defaultValue: fallback, lng });
  };

  const metricsFromStore: HomepageHeroMetric[] = Array.isArray(homepage?.hero?.metrics)
    ? homepage?.hero?.metrics
    : [];

  const heroMetrics: ImpactItem[] = HERO_METRIC_DEFINITIONS.map((definition) => {
    const stored = metricsFromStore.find((metric) => metric.id === definition.id);
    const value = isHebrew
      ? (stored?.valueHe ??
        translateMetricText('he', definition.valueKey, definition.fallbackValueHe))
      : (stored?.value ??
        translateMetricText('en', definition.valueKey, definition.fallbackValueEn));
    const label = isHebrew
      ? (stored?.labelHe ??
        translateMetricText('he', definition.labelKey, definition.fallbackLabelHe))
      : (stored?.label ??
        translateMetricText('en', definition.labelKey, definition.fallbackLabelEn));

    return {
      id: definition.id,
      value,
      label
    };
  });

  const heroPortraitUrl = homepage?.hero?.portraitUrl;
  const selectedProjectId = state.selectedProject?.id ? String(state.selectedProject.id) : null;

  const selectProjectById = (projectId: string) => {
    const marker = mapMarkers.find((item) => item.id === projectId);
    if (!marker) {
      return;
    }
    setSelectedProject(marker.point);
    if (isAuthenticated) {
      handleExpandProject(marker.point);
    }
  };

  const closeSelectedProject = () => {
    setSelectedProject(null);
    if (isAuthenticated) {
      hideProject();
    }
  };

  // const projectCards = mapMarkers.map((marker) => {
  //   const { point } = marker;
  //   const primaryCategory = (() => {
  //     if (Array.isArray(point.categories)) {
  //       return point.categories[0] ?? null;
  //     }
  //     if (typeof point.categories === 'string') {
  //       const [firstCategory] = point.categories
  //         .split(',')
  //         .map((item: string) => item.trim())
  //         .filter(Boolean);
  //       return firstCategory ?? null;
  //     }
  //     return null;
  //   })();

  //   const description = getDescription(point);
  //   const truncatedDescription =
  //     description.length > 180 ? `${description.slice(0, 177)}…` : description;
  //   const image =
  //     typeof point.extendedContent?.image === 'string' ? point.extendedContent.image : undefined;
  //   let title = marker.label;
  //   if (!title.length) {
  //     title = isHebrew
  //       ? t('homepage.projects.untitled', 'ללא כותרת')
  //       : t('homepage.projects.untitled', 'Untitled project');
  //   }

  //   return {
  //     id: marker.id,
  //     title,
  //     subtitle: categoryLabel(primaryCategory),
  //     description: truncatedDescription,
  //     image
  //   };
  // });

  const selectedMarker = selectedProjectId
    ? mapMarkers.find((marker) => marker.id === selectedProjectId)
    : null;
  const selectedProjectSummary = selectedMarker
    ? {
        title: (() => {
          if (selectedMarker.label.length) {
            return selectedMarker.label;
          }
          return isHebrew
            ? t('homepage.projects.untitled', 'ללא כותרת')
            : t('homepage.projects.untitled', 'Untitled project');
        })(),
        category: (() => {
          const { categories: pointCategories } = selectedMarker.point;
          if (Array.isArray(pointCategories)) {
            return categoryLabel(pointCategories[0] ?? null);
          }
          if (typeof pointCategories === 'string') {
            const [firstCategory] = pointCategories
              .split(',')
              .map((item: string) => item.trim())
              .filter(Boolean);
            return categoryLabel(firstCategory ?? null);
          }
          return categoryLabel(null);
        })(),
        description: getDescription(selectedMarker.point),
        image:
          typeof selectedMarker.point.extendedContent?.image === 'string'
            ? selectedMarker.point.extendedContent.image
            : undefined
      }
    : null;

  return (
    <BackofficeTheme enabled={isAuthenticated}>
      <div
        className="container-fluid"
        style={{ cursor: state.cursor, textAlign: isEnglish ? 'left' : 'right' }}
      >
        <CategoryManagerModal
          isOpen={state.editCategoriesModalIsOpen}
          categories={state.categories}
          onClose={onToggleEditCategories}
          toggleShowCategory={toggleShowCategory}
          onOrderChange={onCategoryOrderChange}
          onOrderBlur={onCategoryOrderBlur}
          onOrderKeyPress={onCategoryOrderKeyPress}
          onNameChange={onCategoryNameChange}
          onNameBlur={onCategoryNameBlur}
          onUpdateCategories={updateCategories}
        />
        <NewCategoryModal
          isOpen={state.newCategoryNameModalIsOpen}
          value={state.newCategoryName}
          alertMessage={state.newCategoryNameModalAlert}
          onClose={onToggleNewCategoryName}
          onChange={onNewCategoryNameChange}
          onSubmit={addNewCategory}
        />
        <Helmet>
          {isHebrew ? <title>{state.seo.title}</title> : <title>{state.seo.titleEng}</title>}
        </Helmet>
        <Navigation langLink="/עב" langLinkEng="/en" />
        <HomeHeroModal
          isOpen={heroModalIsOpen}
          isSaving={heroSaving}
          heroDraft={heroDraft}
          onClose={closeHeroModal}
          onSave={saveHeroSettings}
          onUploadPortrait={uploadHeroPortrait}
          onClearPortrait={clearHeroPortrait}
          onMetricChange={onHeroMetricChange}
        />
        <HomeHero
          isHebrew={isHebrew}
          portraitSrc={heroPortraitUrl}
          portraitAlt={t('homepage.hero.portraitAlt', 'Dr. Nava Kainer-Persov')}
          headline={t(
            'homepage.hero.headline',
            'Urban Regeneration Through Comparative Global Case Studies'
          )}
          subheading={t('homepage.hero.subheading', 'A digital atlas of urban transformation.')}
          onEditHero={isAuthenticated ? openHeroModal : undefined}
        />
        <FilterRow isHebrew={isHebrew}>
          <PillOverflow>
            <FilterPill
              type="button"
              active={!activeCategoryId}
              onClick={() => handleCategorySelect(null)}
            >
              {t('homepage.hero.filter.all', 'All')}
            </FilterPill>
            {categoryOptions.map((category) => (
              <FilterPill
                key={category.id}
                type="button"
                active={activeCategoryId === category.id}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.label}
              </FilterPill>
            ))}
          </PillOverflow>
        </FilterRow>
        {heroArcgisMarkers.length > 0 ? (
          <ArcgisMap
            markers={heroArcgisMarkers}
            categories={state.categories}
            categoryColors={state.categoryColors}
            selectedId={selectedProjectId ?? undefined}
            onSelect={selectProjectById}
            isHebrew={isHebrew}
          />
        ) : (
          <StaticMap
            markers={heroMarkers}
            selectedId={selectedProjectId ?? undefined}
            onMarkerClick={selectProjectById}
            isHebrew={isHebrew}
          />
        )}
        <ImpactBand items={heroMetrics} />
        {/* <HomeProjectsSection
          projects={projectCards}
          selectedId={selectedProjectId ?? undefined}
          isHebrew={isHebrew}
          onSelect={selectProjectById}
          onOpenDetails={selectProjectById}
          viewLabel={t('homepage.projects.view', 'View details')}
          heading={t('homepage.projects.heading', 'Featured Projects')}
        /> */}
        {!isAuthenticated && selectedProjectSummary ? (
          <HomeProjectDetails
            isHebrew={isHebrew}
            title={selectedProjectSummary.title}
            category={selectedProjectSummary.category}
            description={selectedProjectSummary.description}
            image={selectedProjectSummary.image}
            onClose={closeSelectedProject}
            closeLabel={t('common.close', 'Close')}
          />
        ) : null}
        <HomePageToolbar
          isAuthenticated={isAuthenticated}
          isEnglish={isEnglish}
          allowAddPoint={state.allowAddPoint}
          needSave={state.needSave}
          hasSelectedProject={!!state.selectedProject}
          onLogout={dispatchStartLogout}
          onSave={onUpdateProject}
          onToggleAddPoint={allowAddPoint}
          onToggleNewCategory={onToggleNewCategoryName}
          onStartEditCategory={startEditCategory}
          onOpenHeroSettings={openHeroModal}
        />

        {isAuthenticated ? (
          <HomePageLayout
            isEnglish={isEnglish}
            isMobileViewport={isMobileViewport}
            viewportWidth={viewportWidth}
            language={i18n.language}
            i18n={i18n}
            sidebarClickedItemId={state.sidebarClickedItemId}
            categories={state.categories}
            sidebarPoints={points}
            mapPoints={state.points}
            isAuthenticated={isAuthenticated}
            categoryColors={state.categoryColors}
            setOpenCategories={setOpenCategories}
            handleSideBarClick={handleSideBarClick}
            selectedProject={state.selectedProject}
            tableTemplate={tableTemplate}
            hideProject={hideProject}
            onProjectChange={setData}
            uploadWidget={uploadWidget}
            addPoint={addPoint}
            allowAddPoint={state.allowAddPoint}
            setSelectedProject={setSelectedProject}
            handleExpandProject={handleExpandProject}
            openCategories={state.openCategories}
          />
        ) : null}

        <Footer position="absolute" />
      </div>
    </BackofficeTheme>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: Boolean(state.auth.uid),
  categories: state.categories,
  points: state.points,
  tableTemplate: state.tableTemplate,
  homepage: state.homepage
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  startLogout: () => dispatch(startLogout()),
  startAddPoint: (point: Parameters<typeof startAddPoint>[0]) => dispatch(startAddPoint(point)),
  startEditProject: (project: Parameters<typeof startEditProject>[0]) =>
    dispatch(startEditProject(project)),
  startToggleShowCategory: (categoryId: string, visible: boolean) =>
    dispatch(startToggleShowCategory(categoryId, visible)),
  startEditCategories: (fbCategories: Record<string, unknown>, categories: Category[]) =>
    dispatch(startEditCategories(fbCategories, categories)),
  startAddCategory: (category: Parameters<typeof startAddCategory>[0], order: number) =>
    dispatch(startAddCategory({ ...category, order })),
  startEditHomePage: (payload: Parameters<typeof startEditHomePage>[0]) =>
    dispatch(startEditHomePage(payload)),
  startDeleteHomePageImage: (
    payload: Parameters<typeof startDeleteHomePageImage>[0],
    publicId: Parameters<typeof startDeleteHomePageImage>[1]
  ) => dispatch(startDeleteHomePageImage(payload, publicId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HomePage));
