import React from 'react';
import SidebarHeader from './sidebar/SidebarHeader';
import CategoryList from './sidebar/CategoryList';
import { SidebarContainer, SidebarText } from './sidebar/SidebarStyles';
import useSidebarState from './sidebar/useSidebarState';
import { SidebarProps } from './sidebar/types';

const SideBar: React.FC<SidebarProps> = (props) => {
    const {
        localCategories,
        localPoints,
        openCategoryIds,
        isEnglish,
        isMobile,
        hasUnconnectedProjects,
        toggleCategory
    } = useSidebarState({
        categories: props.categories,
        points: props.points,
        language: props.language,
        setOpenCategories: props.setOpenCategories,
        openCategories: props.openCategories
    });

    return (
        <SidebarContainer isMobile={isMobile}>
            <SidebarHeader isEnglish={isEnglish} isMobile={isMobile} />
            <CategoryList
                categories={localCategories}
                points={localPoints}
                categoryColors={props.categoryColors}
                openCategoryIds={openCategoryIds}
                isEnglish={isEnglish}
                isMobile={isMobile}
                isAuthenticated={props.isAuthenticated}
                sidebarClickedItemId={props.sidebarClickedItemId}
                onToggleCategory={toggleCategory}
                onProjectClick={props.handleSideBarClick}
                hasUnconnectedProjects={hasUnconnectedProjects}
            />
            <SidebarText isEnglish={isEnglish} className="desktop">
                {isEnglish ? 'New tool for comparative research' : 'כלי חדש למחקר השוואתי'}
            </SidebarText>
        </SidebarContainer>
    );
};

export default SideBar;
