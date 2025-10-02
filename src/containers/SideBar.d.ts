import * as React from 'react';

export interface SideBarProps {
    categories: any[];
    points: any[];
    i18n?: any;
    lang?: string;
    isAuthenticated: boolean;
    setOpenCategories: (openCategories: any[]) => void;
    handleSideBarClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    categoryColors?: any[];
    sidebarClickedItemId?: string | null;
}

declare const SideBar: React.ComponentType<SideBarProps>;

export default SideBar;
