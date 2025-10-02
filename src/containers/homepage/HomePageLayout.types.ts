export interface HomePageLayoutProps {
    isEnglish: boolean;
    isMobileViewport: boolean;
    viewportWidth: number;
    language: string;
    sidebarClickedItemId: string | null;
    categories: any[];
    sidebarPoints: any[];
    mapPoints: any[];
    isAuthenticated: boolean;
    categoryColors: any[];
    setOpenCategories: (openCategories: any[]) => void;
    handleSideBarClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    selectedProject: any;
    table: any[];
    tableTemplate: any;
    hideProject: () => void;
    onProjectChange: (event: any) => void;
    uploadWidget: (event: any) => void;
    addPoint: (point: any) => Promise<any>;
    allowAddPoint: boolean;
    setSelectedProject: (project: any) => void;
    handleExpandProject: (project: any) => void;
    openCategories: any[];
}
