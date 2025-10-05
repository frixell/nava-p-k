import { useCallback, useEffect, useMemo, useState } from 'react';
import { SidebarProps, SidebarState } from './types';

const MOBILE_BREAKPOINT = 768;

const getViewportWidth = () => {
  if (typeof window === 'undefined') {
    return 1024;
  }
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

type SidebarStateParams = Pick<
  SidebarProps,
  'categories' | 'points' | 'language' | 'setOpenCategories' | 'openCategories'
>;

interface SidebarStateResult extends SidebarState {
  toggleCategory: (categoryId: string) => void;
}

const useSidebarState = ({
  categories,
  points,
  language,
  setOpenCategories,
  openCategories: openCategoriesProp
}: SidebarStateParams): SidebarStateResult => {
  const [localCategories, setLocalCategories] = useState(categories);
  const [localPoints, setLocalPoints] = useState(points);
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>(openCategoriesProp ?? []);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    setLocalPoints(points);
  }, [points]);

  const toggleCategory = useCallback(
    (categoryId: string) => {
      setOpenCategoryIds((prev: string[]) => {
        const exists = prev.includes(categoryId);
        if (exists) {
          const next = prev.filter((id) => id !== categoryId);
          setOpenCategories(next);
          return next;
        }
        const next = [...prev, categoryId];
        setOpenCategories(next);
        return next;
      });
    },
    [setOpenCategories]
  );

  const viewportWidth = useMemo(() => getViewportWidth(), []);
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;
  const languageKey = language || 'en';
  const isEnglish = languageKey === 'en';

  useEffect(() => {
    if (!openCategoriesProp) {
      return;
    }
    setOpenCategoryIds((prev: string[]) => {
      const incoming = Array.isArray(openCategoriesProp) ? openCategoriesProp : [];
      const hasDifference =
        incoming.length !== prev.length ||
        incoming.some((id: string, index: number) => id !== prev[index]);
      return hasDifference ? incoming : prev;
    });
  }, [openCategoriesProp]);

  const hasUnconnectedProjects = useMemo(
    () => localPoints.some((point) => !point.categories || point.categories.length === 0),
    [localPoints]
  );

  return {
    localCategories,
    localPoints,
    openCategoryIds,
    isEnglish,
    isMobile,
    hasUnconnectedProjects,
    toggleCategory
  };
};

export default useSidebarState;
