import React from 'react';
import TypedSideBar from './TypedSideBar';

interface HomeSidebarPanelProps {
    language: string;
    sidebarClickedItemId: string | null;
    categories: any[];
    points: any[];
    isAuthenticated: boolean;
    categoryColors: any[];
    setOpenCategories: (openCategories: any[]) => void;
    handleSideBarClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const HomeSidebarPanel: React.FC<HomeSidebarPanelProps> = ({
    language,
    sidebarClickedItemId,
    categories,
    points,
    isAuthenticated,
    categoryColors,
    setOpenCategories,
    handleSideBarClick
}) => {
    return (
        <TypedSideBar
            sidebarClickedItemId={sidebarClickedItemId}
            handleSideBarClick={handleSideBarClick}
            categories={categories}
            points={points}
            isAuthenticated={isAuthenticated}
            lang={language}
            categoryColors={categoryColors}
            setOpenCategories={setOpenCategories}
        />
    );
};

export default HomeSidebarPanel;
