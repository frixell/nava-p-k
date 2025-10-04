import React from 'react';
import ProjectDetailsPage from '../ProjectDetailsPage';
import { ProjectContainer } from './HomePageLayout.styles';

interface HomeProjectPanelProps {
  isEnglish: boolean;
  isMobileViewport: boolean;
  viewportWidth: number;
  categories: any[];
  tableTemplate: any;
  selectedProject: any;
  isAuthenticated: boolean;
  onChange: (event: any) => void;
  uploadWidget: (event: any) => void;
  i18n: { language: string };
  hideProject: () => void;
}

const HomeProjectPanel: React.FC<HomeProjectPanelProps> = ({
  isEnglish,
  isMobileViewport,
  viewportWidth,
  categories,
  tableTemplate,
  selectedProject,
  isAuthenticated,
  onChange,
  uploadWidget,
  i18n,
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
        tableTemplate={tableTemplate}
        selectedProject={selectedProject}
        isAuthenticated={isAuthenticated}
        onChange={onChange}
        uploadWidget={uploadWidget}
        i18n={i18n}
      />
    </ProjectContainer>
  );
};

export default HomeProjectPanel;
