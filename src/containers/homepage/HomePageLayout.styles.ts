import styled from '@emotion/styled';

const TOOLBAR_HEIGHT = 58;
const SIDEBAR_GUTTER = 170;
const MIN_PROJECT_WIDTH = 240;
const MIN_MAP_WIDTH = 320;

interface LayoutContainerProps {
    isMobile: boolean;
    isEnglish: boolean;
}

export const LayoutContainer = styled('div', {
    shouldForwardProp: (prop) => !['isMobile', 'isEnglish'].includes(prop as string)
})<LayoutContainerProps>(({ theme, isMobile, isEnglish }) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : isEnglish ? 'row' : 'row-reverse',
    alignItems: 'stretch',
    backgroundColor: theme.app.colors.background,
    ...(isMobile ? {} : { height: `calc(100vh - ${TOOLBAR_HEIGHT}px)` })
}));

interface ProjectContainerProps {
    isMobile: boolean;
    isEnglish: boolean;
    viewportWidth: number;
}

export const ProjectContainer = styled('div', {
    shouldForwardProp: (prop) => !['isMobile', 'isEnglish', 'viewportWidth'].includes(prop as string)
})<ProjectContainerProps>(({ theme, isMobile, isEnglish, viewportWidth }) => ({
    position: 'absolute',
    zIndex: 5000,
    background: theme.app.colors.surface,
    padding: theme.spacing(4, 3, 3),
    top: `${TOOLBAR_HEIGHT}px`,
    boxSizing: 'border-box',
    overflowY: 'auto',
    ...(isMobile
        ? {
              height: 'auto',
              width: '100%'
          }
        : {
              height: `calc(100vh - ${TOOLBAR_HEIGHT}px)`,
              width: `${Math.max(viewportWidth - SIDEBAR_GUTTER, MIN_PROJECT_WIDTH)}px`,
              [isEnglish ? 'right' : 'left']: 0
          })
}));

interface MapContainerProps {
    isMobile: boolean;
    isEnglish: boolean;
    viewportWidth: number;
}

export const MapContainer = styled('div', {
    shouldForwardProp: (prop) => !['isMobile', 'isEnglish', 'viewportWidth'].includes(prop as string)
})<MapContainerProps>(({ isMobile, isEnglish, viewportWidth }) => ({
    alignSelf: 'stretch',
    ...(isMobile
        ? {
              height: 'auto',
              width: '100%'
          }
        : {
              display: 'inline-block',
              height: `calc(100vh - ${TOOLBAR_HEIGHT}px)`,
              width: `${Math.max(viewportWidth - SIDEBAR_GUTTER, MIN_MAP_WIDTH)}px`,
              float: isEnglish ? 'right' : 'left'
          })
}));
