import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { startAddPoint, startEditProject } from '../actions/points';
import { withTranslation } from 'react-i18next';
import {
    startAddCategory,
    startEditCategories,
    startToggleShowCategory,
} from '../actions/categories';
import { useHomePageController } from './homepage/useHomePageController';
import CategoryManagerModal from './homepage/CategoryManagerModal';
import NewCategoryModal from './homepage/NewCategoryModal';
import HomePageToolbar from './homepage/HomePageToolbar';
import HomePageLayout from './homepage/HomePageLayout';

const HomePage: React.FC<any> = (props) => {
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

    console.log('boo');
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


const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    categories: state.categories,
    points: state.points,
    tableTemplate: state.tableTemplate,
    homepage: state.homepage,
    navigation: state.navigation
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startAddPoint: (point) => dispatch(startAddPoint(point)),
    startEditProject: (project) => dispatch(startEditProject(project)),
    startToggleShowCategory: (categoryId, visible) => dispatch(startToggleShowCategory(categoryId, visible)),
    startEditCategories: (fbCategories, categories) => dispatch(startEditCategories(fbCategories, categories)),
    startAddCategory: (category) => dispatch(startAddCategory(category))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HomePage));
