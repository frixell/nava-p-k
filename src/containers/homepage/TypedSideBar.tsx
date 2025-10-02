import React from 'react';
import SideBar from '../SideBar';

export interface TypedSideBarProps {
    categories: any[];
    points: any[];
    isAuthenticated: boolean;
    setOpenCategories: (openCategories: any[]) => void;
    handleSideBarClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    sidebarClickedItemId: string | null;
    categoryColors?: any[];
    lang?: string;
    i18n?: { language: string };
}

const TypedSideBar: React.FC<TypedSideBarProps> = (props) => {
    return <SideBar {...props} />;
};

export default TypedSideBar;
