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
import type { RootState, AppDispatch } from '../types/store';
import BackofficeTheme from '../components/backoffice/BackofficeTheme';

type HomePageProps = HomePageControllerProps;

const HomePage: React.FC<HomePageProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { i18n, isAuthenticated, points, tableTemplate, startLogout: dispatchStartLogout } = props;

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
    setOpenCategories
  } = useHomePageController(props);

  const isEnglish = i18n.language === 'en';
  const isHebrew = i18n.language === 'he';
  const isMobileViewport = viewportWidth < 768;

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
        />

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

        <Footer position="absolute" />
      </div>
    </BackofficeTheme>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: Boolean(state.auth.uid),
  categories: state.categories,
  points: state.points,
  tableTemplate: state.tableTemplate
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
    dispatch(startAddCategory({ ...category, order }))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HomePage));
