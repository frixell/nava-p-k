import React from 'react';
import MapViewTest from '../MapViewTest';
import { MapContainer } from './HomePageLayout.styles';

interface HomeMapPanelProps {
    isEnglish: boolean;
    isMobileViewport: boolean;
    viewportWidth: number;
    language: string;
    categories: any[];
    sidebarClickedItemId: string | null;
    points: any[];
    addPoint: (point: any) => Promise<any>;
    allowAddPoint: boolean;
    selectedProject: any;
    setSelectedProject: (project: any) => void;
    handleExpandProject: (project: any) => void;
    categoryColors: any[];
    openCategories: any[];
}

const HomeMapPanel: React.FC<HomeMapPanelProps> = ({
    isEnglish,
    isMobileViewport,
    viewportWidth,
    language,
    categories,
    sidebarClickedItemId,
    points,
    addPoint,
    allowAddPoint,
    selectedProject,
    setSelectedProject,
    handleExpandProject,
    categoryColors,
    openCategories
}) => {
    return (
        <MapContainer
            dir={language === 'en' ? 'ltr' : 'rtl'}
            isMobile={isMobileViewport}
            isEnglish={isEnglish}
            viewportWidth={viewportWidth}
        >
            <MapViewTest
                categories={categories}
                sidebarClickedItemId={sidebarClickedItemId}
                points={points}
                addPoint={addPoint}
                allowAddPoint={allowAddPoint}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                handleExpandProject={handleExpandProject}
                lang={language}
                categoryColors={categoryColors}
                openCategories={openCategories}
            />
        </MapContainer>
    );
};

export default HomeMapPanel;
