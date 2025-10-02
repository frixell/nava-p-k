import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { startLogout } from '../actions/auth';
import { startAddPoint, startEditProject } from '../actions/points';
import { withTranslation } from 'react-i18next';
import {
    startAddCategory,
    startEditCategories,
    startToggleShowCategory,
} from '../actions/categories';
import { useHomePageController, HomePageControllerProps } from './homepage/useHomePageController';
import CategoryManagerModal from './homepage/CategoryManagerModal';
import NewCategoryModal from './homepage/NewCategoryModal';
import HomePageToolbar from './homepage/HomePageToolbar';
import HomePageLayout from './homepage/HomePageLayout';

interface RootState {
    auth: { uid?: string | null };
    categories: any[];
    points: any[];
    tableTemplate: any;
    homepage: any;
    navigation: any;
}

type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

type HomePageProps = HomePageControllerProps & {
    homepage: any;
    navigation: any;
};

const HomePage: React.FC<HomePageProps> = (props) => {
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

    const isEnglish = props.i18n.language === 'en';
    const isHebrew = props.i18n.language === 'he';
    const isMobileViewport = viewportWidth < 768;

    return (
            <div className="container-fluid" style={{cursor: state.cursor, textAlign: isEnglish ? 'left' : 'right'}}>
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
                {
                    isHebrew ?
                        <title>{state.seo.title}</title>
                    :
                        <title>{state.seo.titleEng}</title>
                }
                </Helmet>
                <Navigation 
                    {...props}
                    langLink='/עב'
                    langLinkEng='/en'
                    categories={null}
                />
                <HomePageToolbar
                    isAuthenticated={props.isAuthenticated}
                    isEnglish={isEnglish}
                    allowAddPoint={state.allowAddPoint}
                    needSave={state.needSave}
                    hasSelectedProject={!!state.selectedProject}
                    onLogout={props.startLogout}
                    onSave={onUpdateProject}
                    onToggleAddPoint={allowAddPoint}
                    onToggleNewCategory={onToggleNewCategoryName}
                    onStartEditCategory={startEditCategory}
                />

                <HomePageLayout
                    isEnglish={isEnglish}
                    isMobileViewport={isMobileViewport}
                    viewportWidth={viewportWidth}
                    language={props.i18n.language}
                    i18n={props.i18n}
                    sidebarClickedItemId={state.sidebarClickedItemId}
                    categories={state.categories}
                    sidebarPoints={props.points}
                    mapPoints={state.points}
                    isAuthenticated={props.isAuthenticated}
                    categoryColors={state.categoryColors}
                    setOpenCategories={setOpenCategories}
                    handleSideBarClick={handleSideBarClick}
                    selectedProject={state.selectedProject}
                    table={state.table}
                    tableTemplate={props.tableTemplate}
                    hideProject={hideProject}
                    onProjectChange={setData}
                    uploadWidget={uploadWidget}
                    addPoint={addPoint}
                    allowAddPoint={state.allowAddPoint}
                    setSelectedProject={setSelectedProject}
                    handleExpandProject={handleExpandProject}
                    openCategories={state.openCategories}
                />
                
                <Footer lang={props.i18n.language} position="absolute" />
            </div>
        );
}; 


const mapStateToProps = (state: RootState) => ({
    isAuthenticated: !!state.auth.uid,
    categories: state.categories,
    points: state.points,
    tableTemplate: state.tableTemplate,
    homepage: state.homepage,
    navigation: state.navigation
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startAddPoint: (point: Parameters<typeof startAddPoint>[0]) => dispatch(startAddPoint(point)),
    startEditProject: (project: Parameters<typeof startEditProject>[0]) => dispatch(startEditProject(project)),
    startToggleShowCategory: (categoryId: string, visible: boolean) => dispatch(startToggleShowCategory(categoryId, visible)),
    startEditCategories: (fbCategories: Record<string, unknown>, categories: any[]) => dispatch(startEditCategories(fbCategories, categories)),
    startAddCategory: (category: Parameters<typeof startAddCategory>[0]) => dispatch(startAddCategory(category))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HomePage));
