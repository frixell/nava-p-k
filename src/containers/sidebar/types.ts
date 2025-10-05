import React from 'react';
import { CategoryColor, SidebarCategory, SidebarPoint } from './CategoryList';

export interface SidebarProps {
  categories: SidebarCategory[];
  points: SidebarPoint[];
  language?: string;
  isAuthenticated: boolean;
  setOpenCategories: (openCategories: string[]) => void;
  handleSideBarClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  categoryColors?: CategoryColor[];
  sidebarClickedItemId: string | null;
  openCategories?: string[];
}

export interface SidebarState {
  localCategories: SidebarCategory[];
  localPoints: SidebarPoint[];
  openCategoryIds: string[];
  isEnglish: boolean;
  isMobile: boolean;
  hasUnconnectedProjects: boolean;
}
