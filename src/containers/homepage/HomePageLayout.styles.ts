import styled from '@emotion/styled';

interface LayoutContainerProps {
    isMobile: boolean;
    isEnglish: boolean;
}

export const LayoutContainer = styled('div', {
    shouldForwardProp: (prop) => !['isMobile', 'isEnglish'].includes(prop as string)
})<LayoutContainerProps>(({ isMobile, isEnglish }) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : isEnglish ? 'row' : 'row-reverse',
    alignItems: 'stretch',
    ...(isMobile ? {} : { height: 'calc(100vh - var(--toolbar-height))' })
}));

interface ProjectContainerProps {
    isMobile: boolean;
    isEnglish: boolean;
    viewportWidth: number;
}

export const ProjectContainer = styled('div', {
    shouldForwardProp: (prop) => !['isMobile', 'isEnglish', 'viewportWidth'].includes(prop as string)
})<ProjectContainerProps>(({ isMobile, isEnglish, viewportWidth }) => ({
    position: 'absolute',
    zIndex: 5000,
    background: '#fff',
    padding: '30px 20px 20px',
    top: 'var(--toolbar-height)',
    boxSizing: 'border-box',
    overflowY: 'auto',
    ...(isMobile
        ? {
              height: 'auto',
              width: '100%'
          }
        : {
              height: 'calc(100vh - var(--toolbar-height))',
              width: `${Math.max(viewportWidth - 170, 240)}px`,
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
              height: 'calc(100vh - var(--toolbar-height))',
              width: `${Math.max(viewportWidth - 170, 320)}px`,
              float: isEnglish ? 'right' : 'left'
          })
}));
