import React from 'react';
import ProjectDetailsPage from '../ProjectDetailsPage';
import { ProjectContainer } from './HomePageLayout.styles';

interface HomeProjectPanelProps {
    isEnglish: boolean;
    isMobileViewport: boolean;
    viewportWidth: number;
    categories: any[];
    table: any[];
    tableTemplate: any;
    selectedProject: any;
    isAuthenticated: boolean;
    onChange: (event: any) => void;
    uploadWidget: (event: any) => void;
    language: string;
    i18n: { language: string };
    categoryColors: any[];
    hideProject: () => void;
}

const HomeProjectPanel: React.FC<HomeProjectPanelProps> = ({
    isEnglish,
    isMobileViewport,
    viewportWidth,
    categories,
    table,
    tableTemplate,
    selectedProject,
    isAuthenticated,
    onChange,
    uploadWidget,
    language,
    i18n,
    categoryColors,
    hideProject
}) => {
    if (!selectedProject) {
        return null;
    }

    return (
        <ProjectContainer
            isMobile={isMobileViewport}
            isEnglish={isEnglish}
            viewportWidth={viewportWidth}
        >
            <ProjectDetailsPage
                hideProject={hideProject}
                categories={categories}
                table={table}
                tableTemplate={tableTemplate}
                selectedProject={selectedProject}
                isAuthenticated={isAuthenticated}
                onChange={onChange}
                uploadWidget={uploadWidget}
                lang={language}
                i18n={i18n}
                categoryColors={categoryColors}
            />
        </ProjectContainer>
    );
};

export default HomeProjectPanel;
