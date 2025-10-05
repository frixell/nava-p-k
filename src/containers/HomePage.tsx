import React from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
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
import HomeHeroModal from './homepage/HomeHeroModal';
import HomeProjectsSection from './homepage/HomeProjectsSection';
import HomeProjectDetails from './homepage/HomeProjectDetails';
import type { RootState, AppDispatch } from '../types/store';
import BackofficeTheme from '../components/backoffice/BackofficeTheme';
import type { ImpactItem } from '../components/newDesign';
import type { HomepageHeroMetric, HomepageState } from '../store/slices/homepageSlice';
import type { TFunction } from 'i18next';
import { HERO_METRIC_DEFINITIONS } from '../constants/homeHeroMetrics';
import { appTokens } from '../styles/theme';
import { startEditHomePage, startDeleteHomePageImage } from '../store/slices/homepageSlice';

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
}

type HomePageProps = HomePageControllerProps;

const HomePage: React.FC<HomePageProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    id: String(category.id),
    label: isEnglish ? category.name : category.nameHebrew || category.name
  }));

  const activeCategoryId = state.openCategories.length > 0 ? state.openCategories[0] : null;

  const handleCategorySelect = (categoryId: string | null) => {
    if (categoryId) {
      setOpenCategories([categoryId]);
    } else {
      setOpenCategories([]);
    }
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

  const categoryLabel = (categoryId: string | null): string => {
    if (!categoryId) {
      return '';
    }
    const category = state.categories.find(
      (item: { id: string; name: string; nameHebrew?: string }) => item.id === categoryId
    );
    if (!category) {
      return '';
    }
    return isHebrew
      ? (category.nameHebrew ?? category.name ?? '')
      : (category.name ?? category.nameHebrew ?? '');
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

      const rawCategories = Array.isArray(point.categories)
        ? point.categories
        : typeof point.categories === 'string'
          ? point.categories
              .split(',')
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [];

      const primaryCategory = rawCategories[0] ?? null;
      const label = isHebrew
        ? (typeof point.titleHebrew === 'string' && point.titleHebrew) || point.title || ''
        : (typeof point.title === 'string' && point.title) || point.titleHebrew || '';

      return {
        id: String(point.id ?? `${lon}-${lat}`),
        left: clampPercent(((lon + 180) / 360) * 100),
        top: clampPercent(((90 - lat) / 180) * 100),
        color: resolveMarkerColor(primaryCategory),
        label,
        point
      };
    })
    .filter((marker): marker is MapMarker => Boolean(marker));

  const heroMarkers = mapMarkers.map((marker) => ({
    id: marker.id,
    left: marker.left,
    top: marker.top,
    color: marker.color,
    label: marker.label
  }));

  const translateMetricText = (lng: 'en' | 'he', key: string, fallback: string) => {
    if (typeof i18n.getFixedT === 'function') {
      return i18n.getFixedT(lng)(key, fallback);
    }
    return t(key, { defaultValue: fallback, lng });
  };

  const metricsFromStore: HomepageHeroMetric[] = Array.isArray(homepage?.hero?.metrics)
    ? (homepage?.hero?.metrics as HomepageHeroMetric[])
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

  const projectCards = mapMarkers.map((marker) => {
    const point = marker.point;
    const primaryCategory = Array.isArray(point.categories)
      ? (point.categories[0] ?? null)
      : typeof point.categories === 'string'
        ? (point.categories.split(',').map((item: string) => item.trim())[0] ?? null)
        : null;

    const description = getDescription(point);
    const truncatedDescription =
      description.length > 180 ? `${description.slice(0, 177)}…` : description;
    const image =
      typeof point.extendedContent?.image === 'string' ? point.extendedContent.image : undefined;
    const title =
      marker.label ||
      (isHebrew
        ? t('homepage.projects.untitled', 'ללא כותרת')
        : t('homepage.projects.untitled', 'Untitled project'));

    return {
      id: marker.id,
      title,
      subtitle: categoryLabel(primaryCategory),
      description: truncatedDescription,
      image
    };
  });

  const selectedMarker = selectedProjectId
    ? mapMarkers.find((marker) => marker.id === selectedProjectId)
    : null;
  const selectedProjectSummary = selectedMarker
    ? {
        title:
          selectedMarker.label ||
          (isHebrew
            ? t('homepage.projects.untitled', 'ללא כותרת')
            : t('homepage.projects.untitled', 'Untitled project')),
        category: categoryLabel(
          Array.isArray(selectedMarker.point.categories)
            ? (selectedMarker.point.categories[0] ?? null)
            : typeof selectedMarker.point.categories === 'string'
              ? (selectedMarker.point.categories.split(',').map((item: string) => item.trim())[0] ??
                null)
              : null
        ),
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
          allLabel={t('homepage.hero.filter.all', 'All')}
          dropdownLabel={t('homepage.hero.filter.dropdown', 'Browse categories')}
          categories={categoryOptions}
          dropdownOptions={categoryOptions}
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleCategorySelect}
          metrics={heroMetrics}
          markers={heroMarkers}
          selectedMarkerId={selectedProjectId}
          onMarkerSelect={selectProjectById}
          onEditHero={isAuthenticated ? openHeroModal : undefined}
        />
        <HomeProjectsSection
          projects={projectCards}
          selectedId={selectedProjectId ?? undefined}
          isHebrew={isHebrew}
          onSelect={selectProjectById}
          onOpenDetails={selectProjectById}
          viewLabel={t('homepage.projects.view', 'View details')}
          heading={t('homepage.projects.heading', 'Featured Projects')}
        />
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          selectedProject={state.selectedProject}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
