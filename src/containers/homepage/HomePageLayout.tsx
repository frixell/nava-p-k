import React from 'react';
import HomeSidebarPanel from './HomeSidebarPanel';
import HomeProjectPanel from './HomeProjectPanel';
import HomeMapPanel from './HomeMapPanel';
import { LayoutContainer } from './HomePageLayout.styles';
import type { HomePageLayoutProps } from './HomePageLayout.types';

const HomePageLayout: React.FC<HomePageLayoutProps> = ({
    isEnglish,
    isMobileViewport,
    viewportWidth,
    language,
    i18n,
    sidebarClickedItemId,
    categories,
    sidebarPoints,
    mapPoints,
    isAuthenticated,
    categoryColors,
    setOpenCategories,
    handleSideBarClick,
    selectedProject,
    table,
    tableTemplate,
    hideProject,
    onProjectChange,
    uploadWidget,
    addPoint,
    allowAddPoint,
    setSelectedProject,
    handleExpandProject,
    openCategories
}) => {
    return (
        <LayoutContainer isMobile={isMobileViewport} isEnglish={isEnglish}>
            <HomeSidebarPanel
                language={language}
                sidebarClickedItemId={sidebarClickedItemId}
                categories={categories}
                points={sidebarPoints}
                isAuthenticated={isAuthenticated}
                categoryColors={categoryColors}
                setOpenCategories={setOpenCategories}
                openCategories={openCategories}
                handleSideBarClick={handleSideBarClick}
            />

            <HomeProjectPanel
                isEnglish={isEnglish}
                isMobileViewport={isMobileViewport}
                viewportWidth={viewportWidth}
                categories={categories}
                table={table}
                tableTemplate={tableTemplate}
                selectedProject={selectedProject}
                isAuthenticated={isAuthenticated}
                onChange={onProjectChange}
                uploadWidget={uploadWidget}
                language={language}
                i18n={i18n}
                categoryColors={categoryColors}
                hideProject={hideProject}
            />

            <HomeMapPanel
                isEnglish={isEnglish}
                isMobileViewport={isMobileViewport}
                viewportWidth={viewportWidth}
                language={language}
                categories={categories}
                sidebarClickedItemId={sidebarClickedItemId}
                points={mapPoints}
                addPoint={addPoint}
                allowAddPoint={allowAddPoint}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                handleExpandProject={handleExpandProject}
                categoryColors={categoryColors}
                openCategories={openCategories}
            />
        </LayoutContainer>
    );
};

export default HomePageLayout;
