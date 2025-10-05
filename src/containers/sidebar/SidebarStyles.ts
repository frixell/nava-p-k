import styled from '@emotion/styled';

const blockedProps = new Set([
  'isMobile',
  'isEnglish',
  'colorHex',
  'isOpen',
  'isSelected',
  'isEmphasized',
  'isExpanded',
  'isSpaced'
]);

const filterProps = { shouldForwardProp: (prop: string) => !blockedProps.has(prop) };

export const SidebarContainer = styled(
  'div',
  filterProps
)<{ isMobile: boolean }>(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'column-reverse' : 'column',
  width: isMobile ? '100%' : '162px',
  height: isMobile ? 'auto' : 'calc(100vh - var(--toolbar-height))',
  paddingTop: 0,
  paddingRight: isMobile ? 0 : '10px',
  background: 'var(--color-background-dark, #000000)',
  boxSizing: 'border-box',
  overflow: 'hidden'
}));

export const HeaderSection = styled(
  'div',
  filterProps
)<{ isMobile: boolean; isEnglish: boolean }>(({ isMobile, isEnglish }) => ({
  display: 'flex',
  flexDirection: isMobile ? (isEnglish ? 'row' : 'row-reverse') : 'column',
  alignItems: 'center',
  paddingTop: isMobile ? '20px' : 0,
  gap: isMobile ? '1.5rem' : '0.8rem'
}));

export const SidebarImageWrapper = styled(
  'div',
  filterProps
)<{ isMobile: boolean }>(({ isMobile }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: isMobile ? 0 : '20px'
}));

export const SidebarImage = styled(
  'img',
  filterProps
)<{ isEnglish: boolean }>(({ isEnglish }) => ({
  maxWidth: '100%',
  transform: isEnglish ? 'scaleX(-1)' : 'scaleX(1)'
}));

export const SidebarText = styled(
  'div',
  filterProps
)<{ isEnglish: boolean; isSpaced?: boolean }>(({ isEnglish, isSpaced }) => ({
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

export const CategoriesContainer = styled(
  'div',
  filterProps
)<{ isMobile: boolean; isEnglish: boolean }>(({ isMobile, isEnglish }) => ({
  display: 'flex',
  flexDirection: isMobile ? (isEnglish ? 'row' : 'row-reverse') : 'column',
  flexWrap: isMobile ? 'wrap' : 'nowrap',
  justifyContent: 'flex-start',
  alignItems: isMobile ? 'center' : 'stretch',
  marginTop: isMobile ? '7px' : 0,
  marginBottom: isMobile ? '7px' : 0,
  paddingRight: isMobile ? '1rem' : 0,
  paddingLeft: isMobile ? '1rem' : 0,
  gap: isMobile ? '6px' : 0,
  overflowY: 'auto',
  overflowX: 'hidden'
}));

export const CategoryWrapper = styled(
  'div',
  filterProps
)<{ isMobile: boolean; isExpanded: boolean; colorHex: string; isSpaced?: boolean }>(
  ({ isMobile, isExpanded, colorHex, isSpaced }) => ({
    display: isMobile ? 'block' : 'flex',
    flexDirection: 'column',
    margin: isMobile ? 3 : 0,
    padding: isMobile ? 2 : 0,
    width: isMobile && isExpanded ? '100%' : 'auto',
    color: !isMobile ? colorHex : undefined,
    marginTop: isSpaced ? '10px' : undefined
  })
);

export const CategoryHeader = styled(
  'div',
  filterProps
)<{ isEnglish: boolean; isMobile: boolean; colorHex: string }>(
  ({ isEnglish, isMobile, colorHex }) => ({
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
  })
);

export const ArrowIcon = styled(
  'span',
  filterProps
)<{ isEnglish: boolean; isOpen: boolean }>(({ isEnglish, isOpen }) => {
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

export const CategoryTitle = styled(
  'span',
  filterProps
)<{ isEnglish: boolean }>(({ isEnglish }) => ({
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
  textAlign: isEnglish ? 'left' : 'right'
}));

export const ProjectItem = styled(
  'div',
  filterProps
)<{ isEnglish: boolean; isSelected: boolean; isEmphasized?: boolean }>(
  ({ isEnglish, isSelected, isEmphasized }) => ({
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
    color: isSelected
      ? 'var(--color-on-surface)'
      : isEmphasized
        ? 'var(--color-accent-tertiary)'
        : 'var(--color-text-inverse)',
    background: isSelected ? 'var(--color-text-muted)' : 'transparent',
    transition: 'background 0.2s ease, color 0.2s ease',
    '&:hover': {
      background: 'var(--color-text-muted)',
      color: 'var(--color-on-surface)'
    }
  })
);
