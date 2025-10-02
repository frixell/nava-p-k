import React from 'react';
import {
    ArrowIcon,
    CategoriesContainer,
    CategoryHeader,
    CategoryTitle,
    CategoryWrapper,
    ProjectItem
} from './SidebarStyles';

export interface SidebarCategory {
    id: string;
    name: string;
    nameHebrew?: string;
    isVisible?: boolean;
}

export interface SidebarPoint {
    id: string;
    title: string;
    titleHebrew?: string;
    categories?: string[];
}

export interface CategoryColor {
    colorHex?: string;
    id?: string;
}

interface CategoryListProps {
    categories: SidebarCategory[];
    points: SidebarPoint[];
    categoryColors?: CategoryColor[];
    openCategoryIds: string[];
    isEnglish: boolean;
    isMobile: boolean;
    isAuthenticated: boolean;
    sidebarClickedItemId: string | null;
    onToggleCategory: (categoryId: string) => void;
    onProjectClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    hasUnconnectedProjects: boolean;
}

const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    points,
    categoryColors,
    openCategoryIds,
    isEnglish,
    isMobile,
    isAuthenticated,
    sidebarClickedItemId,
    onToggleCategory,
    onProjectClick,
    hasUnconnectedProjects
}) => {
    const notConnectedColor = 'var(--color-text-inverse)';

    console.log('in list', categories, points);
    console.log({ points });
    return (
        <CategoriesContainer isMobile={isMobile} isEnglish={isEnglish}>
            {categories.map((category, index) => {
                const colorHex = categoryColors?.[index]?.colorHex || notConnectedColor;
                const isOpen = openCategoryIds.includes(category.id);
                const isVisible = Boolean(category.isVisible) || isAuthenticated;

                if (!isVisible) {
                    return null;
                }

                const relevantPoints = points.filter(
                    (point) => {
                        console.log('category.id', category.id);
                        console.log('point.categories', point.categories);
                        console.log('point?.categories && point?.categories.length > 0', point?.categories && point?.categories.length > 0);
                        console.log('point?.categories && point?.categories.length > 0 && point.categories.includes(category.id)', point?.categories && point?.categories.length > 0 && point.categories.includes(category.id));
                        if (!point.categories) {
                            return false;
                        }
                        return point?.categories && point?.categories.length > 0 &&point.categories.includes(category.id);
                    }
                );
                
                console.log({ relevantPoints });

                return (
                    <CategoryWrapper
                        key={category.id}
                        isMobile={isMobile}
                        isExpanded={isOpen}
                        colorHex={colorHex}
                    >
                        <CategoryHeader
                            onClick={() => category.id && onToggleCategory(category.id)}
                            isEnglish={isEnglish}
                            isMobile={isMobile}
                            colorHex={colorHex}
                        >
                            <ArrowIcon isEnglish={isEnglish} isOpen={isOpen} />
                            <CategoryTitle isEnglish={isEnglish}>
                                {isEnglish ? category.name : category.nameHebrew || category.name}
                            </CategoryTitle>
                        </CategoryHeader>
                        {isOpen && relevantPoints.map((point) => (
                            <ProjectItem
                                onClick={onProjectClick}
                                data-id={point.id}
                                key={point.id}
                                isEnglish={isEnglish}
                                isSelected={sidebarClickedItemId === point.id}
                                dir={isEnglish ? 'ltr' : 'rtl'}
                            >
                                - {isEnglish ? point.title : point.titleHebrew || point.title}
                            </ProjectItem>
                        ))}
                    </CategoryWrapper>
                );
            })}

            {isAuthenticated && hasUnconnectedProjects ? (
                <CategoryWrapper
                    isMobile={isMobile}
                    isExpanded={openCategoryIds.includes('notConnectedProjects')}
                    colorHex={notConnectedColor}
                    isSpaced
                >
                    <CategoryHeader
                        onClick={() => onToggleCategory('notConnectedProjects')}
                        isEnglish={isEnglish}
                        isMobile={isMobile}
                        colorHex={notConnectedColor}
                    >
                        <ArrowIcon
                            isEnglish={isEnglish}
                            isOpen={openCategoryIds.includes('notConnectedProjects')}
                        />
                        <CategoryTitle isEnglish={isEnglish}>
                            {isEnglish ? 'Not Connected' : 'לא מחובר'}
                        </CategoryTitle>
                    </CategoryHeader>
                    {openCategoryIds.includes('notConnectedProjects') && points
                        .filter((point) => !point.categories || point.categories.length === 0)
                        .map((point) => (
                            <ProjectItem
                                onClick={onProjectClick}
                                data-id={point.id}
                                key={point.id}
                                isEnglish={isEnglish}
                                isSelected={sidebarClickedItemId === point.id}
                                isEmphasized
                                dir={isEnglish ? 'ltr' : 'rtl'}
                            >
                                - {point.title}
                            </ProjectItem>
                        ))}
                </CategoryWrapper>
            ) : null}
        </CategoriesContainer>
    );
};

export default CategoryList;
