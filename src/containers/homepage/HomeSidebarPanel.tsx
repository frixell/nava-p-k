import React from 'react';
import SideBar from '../SideBar';
import { CategoryColor, SidebarCategory, SidebarPoint } from '../sidebar/CategoryList';

interface HomeSidebarPanelProps {
  language: string;
  sidebarClickedItemId: string | null;
  categories: SidebarCategory[];
  points: SidebarPoint[];
  isAuthenticated: boolean;
  categoryColors: CategoryColor[];
  setOpenCategories: (openCategories: string[]) => void;
  openCategories: string[];
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
  openCategories,
  handleSideBarClick
}) => (
  <SideBar
    sidebarClickedItemId={sidebarClickedItemId}
    handleSideBarClick={handleSideBarClick}
    categories={categories}
    points={points}
    isAuthenticated={isAuthenticated}
    language={language}
    categoryColors={categoryColors}
    setOpenCategories={setOpenCategories}
    openCategories={openCategories}
  />
);

export default HomeSidebarPanel;
