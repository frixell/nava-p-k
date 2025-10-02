import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import styled from '@emotion/styled';

const sidebarPropFilter = (prop) => ![
    'isMobile',
    'isEnglish',
    'colorHex',
    'isOpen',
    'isSelected',
    'isEmphasized',
    'isExpanded',
    'isSpaced'
].includes(prop);

const SidebarContainer = styled('div', {
    shouldForwardProp: sidebarPropFilter
})(({ isMobile }) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : 'column',
    width: isMobile ? '100%' : '162px',
    height: isMobile ? 'auto' : 'calc(100vh - var(--toolbar-height))',
    paddingTop: 0,
    paddingRight: isMobile ? 0 : '10px',
    background: 'var(--color-on-surface)',
    boxSizing: 'border-box'
}));

const HeaderSection = styled('div', {
    shouldForwardProp: sidebarPropFilter
})(({ isMobile, isEnglish }) => ({
    display: 'flex',
    flexDirection: isMobile ? (isEnglish ? 'row' : 'row-reverse') : 'column',
    alignItems: 'center',
    paddingTop: isMobile ? '20px' : 0,
    gap: isMobile ? '1.5rem' : '0.8rem'
}));

const SidebarImageWrapper = styled('div', {
    shouldForwardProp: sidebarPropFilter
})(({ isMobile }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: isMobile ? 0 : '20px'
}));

const SidebarImage = styled('img', {
    shouldForwardProp: sidebarPropFilter
})(({ isEnglish }) => ({
    maxWidth: '100%',
    transform: isEnglish ? 'scaleX(-1)' : 'scaleX(1)'
}));

const SidebarText = styled('div', {
    shouldForwardProp: sidebarPropFilter
})(({ isEnglish, isSpaced }) => ({
    width: '100%',
    color: 'var(--color-text-inverse)',
    fontFamily: 'var(--font-family-base)',
    fontWeight: 'var(--font-weight-regular)',
    fontSize: '1.4rem',
    textAlign: isEnglish ? 'left' : 'right',
    paddingLeft: isEnglish ? '6px' : 0,
    paddingRight: isEnglish ? 0 : '6px',
    marginTop: isSpaced ? '3rem' : 0
}));

const CategoriesContainer = styled('div', {
    shouldForwardProp: sidebarPropFilter
})(({ isMobile, isEnglish }) => ({
    display: 'flex',
    flexDirection: isMobile ? (isEnglish ? 'row' : 'row-reverse') : 'column',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    justifyContent: 'flex-start',
    alignItems: isMobile ? 'center' : 'stretch',
    marginTop: isMobile ? '7px' : 0,
    marginBottom: isMobile ? '7px' : 0,
    paddingRight: isMobile ? '1rem' : 0,
    paddingLeft: isMobile ? '1rem' : 0,
    gap: isMobile ? '6px' : 0
}));

const CategoryWrapper = styled('div', {
    shouldForwardProp: sidebarPropFilter
})(({ isMobile, isExpanded, colorHex }) => ({
    display: isMobile ? 'block' : 'flex',
    flexDirection: 'column',
    margin: isMobile ? 3 : 0,
    padding: isMobile ? 2 : 0,
    width: isMobile && isExpanded ? '100%' : 'auto',
    color: !isMobile ? colorHex : undefined
}));

const CategoryHeader = styled('div', {
    shouldForwardProp: sidebarPropFilter
})(({ isEnglish, isMobile, colorHex }) => ({
    display: 'flex',
    flexDirection: isEnglish ? 'row' : 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    color: colorHex,
    fontSize: '14px',
    padding: isMobile ? '2px' : '5px',
    paddingRight: isMobile ? (isEnglish ? '6px' : '2px') : undefined,
    paddingLeft: isMobile ? (isEnglish ? '2px' : '6px') : undefined,
    cursor: 'pointer',
    background: 'transparent',
    border: isMobile ? `1px dotted ${colorHex}` : 'none',
    transition: 'background 0.2s ease',
    '&:hover': {
        background: 'var(--color-on-surface)'
    }
}));

const ArrowIcon = styled('span', {
    shouldForwardProp: sidebarPropFilter
})(({ isEnglish, isOpen }) => {
    const baseRotation = isEnglish ? 0 : 180;
    const openRotation = isOpen ? 90 : 0;
    return {
        width: 8,
        height: 8,
        marginRight: isEnglish ? 3 : 0,
        marginLeft: isEnglish ? 0 : 3,
        backgroundImage: "url('/images/customersStrip/prevArrow.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: '8px 8px',
        transition: 'transform 0.3s ease',
        pointerEvents: 'none',
        transform: `rotate(${baseRotation + openRotation}deg)`
    };
});

const CategoryTitle = styled('span', {
    shouldForwardProp: sidebarPropFilter
})(({ isEnglish }) => ({
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0,
    textAlign: isEnglish ? 'left' : 'right'
}));

const ProjectItem = styled('div', {
    shouldForwardProp: sidebarPropFilter
})(({ isEnglish, isSelected, isEmphasized }) => ({
    width: '100%',
    padding: '5px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    textAlign: isEnglish ? 'left' : 'right',
    paddingLeft: isEnglish ? '12px' : undefined,
    marginLeft: isEnglish ? '6px' : undefined,
    paddingRight: isEnglish ? undefined : '12px',
    marginRight: isEnglish ? undefined : '6px',
    color: isSelected ? 'var(--color-on-surface)' : isEmphasized ? 'var(--color-accent-tertiary)' : 'var(--color-text-inverse)',
    background: isSelected ? 'var(--color-text-muted)' : 'transparent',
    transition: 'background 0.2s ease, color 0.2s ease',
    '&:hover': {
        background: 'var(--color-text-muted)',
        color: 'var(--color-on-surface)'
    }
}));


const getViewportWidth = () => {
    if (typeof window === 'undefined') {
        return 1024;
    }
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

const SideBar = ({
    categories,
    points,
    i18n,
    lang,
    isAuthenticated,
    setOpenCategories,
    handleSideBarClick,
    categoryColors = ([]),
    sidebarClickedItemId
}) => {
    const [localCategories, setLocalCategories] = useState(categories);
    const [localPoints, setLocalPoints] = useState(points);
    const [openCategories, setOpenCategoriesState] = useState([]);

    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    useEffect(() => {
        setLocalPoints(points);
    }, [points]);

    useEffect(() => {
        setOpenCategoriesState((prev) => {
            const validIds = new Set(localCategories.map((category) => category.id));
            const filtered = prev.filter((id) => id === 'notConnectedProjects' || validIds.has(id));
            if (filtered.length !== prev.length) {
                setOpenCategories(filtered);
                return filtered;
            }
            return prev;
        });
    }, [localCategories, setOpenCategories]);

    const viewportWidth = useMemo(() => getViewportWidth(), []);
    const isMobile = viewportWidth < 768;
    const currentLanguage = lang || i18n.language;
    const isEnglish = currentLanguage === 'en';

    const toggleCategory = useCallback((categoryId) => {
        setOpenCategoriesState((prev) => {
            const exists = prev.includes(categoryId);
            const next = exists ? prev.filter((id) => id !== categoryId) : [...prev, categoryId];
            setOpenCategories(next);
            return next;
        });
    }, [setOpenCategories]);

    const handleCategoryClick = useCallback((event) => {
        const { id } = event.currentTarget.dataset;
        if (id) {
            toggleCategory(id);
        }
    }, [toggleCategory]);

    const hasUnconnectedProjects = useMemo(
        () => localPoints.some((point) => !point.categories || point.categories.length === 0),
        [localPoints]
    );

    return (
        <SidebarContainer isMobile={isMobile}>
            <HeaderSection isMobile={isMobile} isEnglish={isEnglish}>
                <SidebarImageWrapper isMobile={isMobile}>
                    <SidebarImage
                        isEnglish={isEnglish}
                        src="https://res.cloudinary.com/dewafmxth/image/upload/v1587375229/nava_ky02kt.jpg"
                        alt={isEnglish ? 'Nava Kainer-Persov' : 'נאוה קיינר-פרסוב'}
                    />
                </SidebarImageWrapper>
                <div>
                    <SidebarText isEnglish={isEnglish}>
                        {isEnglish
                            ? 'Urban regeneration comparative global case studies'
                            : 'התחדשות ערונית מקרי מחקר השוואתי גלובלי'}
                    </SidebarText>
                    <SidebarText
                        isEnglish={isEnglish}
                        isSpaced
                        className="mobile"
                    >
                        {isEnglish
                            ? 'New tool for comparative research'
                            : 'כלי חדש למחקר השוואתי'}
                    </SidebarText>
                </div>
            </HeaderSection>
            <CategoriesContainer isMobile={isMobile} isEnglish={isEnglish}>
                {localCategories.map((category, index) => {
                    const colorHex = categoryColors[index]?.colorHex || 'var(--color-text-inverse)';
                    const isOpen = openCategories.includes(category.id);
                    const isVisible = category.isVisible || isAuthenticated;

                    if (!isVisible) {
                        return null;
                    }

                    const relevantPoints = localPoints.filter(
                        (point) => Array.isArray(point.categories) && point.categories.includes(category.id)
                    );

                    return (
                        <CategoryWrapper
                            key={category.id || index}
                            isMobile={isMobile}
                            isExpanded={isOpen}
                            colorHex={colorHex}
                        >
                            <CategoryHeader
                                onClick={handleCategoryClick}
                                data-id={category.id}
                                isEnglish={isEnglish}
                                isMobile={isMobile}
                                colorHex={colorHex}
                            >
                                <ArrowIcon isEnglish={isEnglish} isOpen={isOpen} />
                                <CategoryTitle isEnglish={isEnglish}>
                                    {isEnglish ? category.name : category.nameHebrew}
                                </CategoryTitle>
                            </CategoryHeader>
                            {isOpen && relevantPoints.map((point) => (
                                <ProjectItem
                                    onClick={handleSideBarClick}
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
                        isExpanded={openCategories.includes('notConnectedProjects')}
                        colorHex={'var(--color-text-inverse)'}
                        style={{ marginTop: '10px' }}
                    >
                        <CategoryHeader
                            onClick={handleCategoryClick}
                            data-id={'notConnectedProjects'}
                            title={isEnglish ? 'Not Connected' : 'לא מחובר'}
                            isEnglish={isEnglish}
                            isMobile={isMobile}
                            colorHex={'var(--color-text-inverse)'}
                        >
                            <ArrowIcon
                                isEnglish={isEnglish}
                                isOpen={openCategories.includes('notConnectedProjects')}
                            />
                            <CategoryTitle isEnglish={isEnglish}>
                                {isEnglish ? ' Not Connected' : 'לא מחובר'}
                            </CategoryTitle>
                        </CategoryHeader>
                        {openCategories.includes('notConnectedProjects') && localPoints.map((point) => {
                            if (!point.categories || point.categories.length === 0) {
                                return (
                                    <ProjectItem
                                        onClick={handleSideBarClick}
                                        data-id={point.id}
                                        key={point.id}
                                        isEnglish={isEnglish}
                                        isSelected={sidebarClickedItemId === point.id}
                                        isEmphasized
                                        dir={isEnglish ? 'ltr' : 'rtl'}
                                    >
                                        - {point.title}
                                    </ProjectItem>
                                );
                            }
                            return null;
                        }).filter(Boolean)}
                    </CategoryWrapper>
                ) : null}
            </CategoriesContainer>
            <SidebarText isEnglish={isEnglish} className="desktop">
                {isEnglish
                    ? 'New tool for comparative research'
                    : 'כלי חדש למחקר השוואתי'}
            </SidebarText>
        </SidebarContainer>
    );
};

export default withTranslation()(SideBar);
