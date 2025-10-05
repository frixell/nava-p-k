import styled from '@emotion/styled';

export const Container = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: 100%;
  gap: clamp(1rem, 2vw, 2.5rem);
  flex-direction: ${({ isEnglish }) => (isEnglish ? 'row' : 'row-reverse')};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PrimaryColumn = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SecondaryColumn = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BackButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(31, 41, 55, 0.2);
  background: transparent;
  color: var(--color-text-primary, #1f2937);
  cursor: pointer;
  align-self: ${({ isEnglish }) => (isEnglish ? 'flex-start' : 'flex-end')};
  transition: background 0.2s ease;
  font-size: 0.95rem;
  direction: ${({ isEnglish }) => (isEnglish ? 'ltr' : 'rtl')};

  &:hover {
    background: rgba(31, 41, 55, 0.06);
  }
`;

export const TitleBar = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: var(--color-panel-accent, #6c7680);
  color: var(--color-surface, #ffffff);
  border-radius: 10px;
  font-weight: 600;
`;

export const Heading = styled('h2', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
  font-family: 'Heebo', 'Rubik', 'Segoe UI', sans-serif;
  font-weight: 500;
  font-size: clamp(1.35rem, 2vw, 1.75rem);
  margin: 0;
  text-align: ${({ isEnglish }) => (isEnglish ? 'left' : 'right')};
`;

export const CategoryPanel = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
  display: flex;
  flex-direction: column;
  background: var(--color-surface, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.9);
  color: var(--color-text-secondary, #6c7680);
  font-size: 11px;
  border-radius: 10px;
  overflow: hidden;
  direction: ${({ isEnglish }) => (isEnglish ? 'ltr' : 'rtl')};
`;

export const CategoryRow = styled('div')`
  display: flex;
  flex-direction: row;
`;

export const CategoryName = styled('div', {
  shouldForwardProp: (prop) => prop !== 'backgroundColor' && prop !== 'isEnglish'
})<{ backgroundColor?: string; isEnglish: boolean }>`
  flex: 0 0 20%;
  min-height: 50px;
  padding: 5px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ backgroundColor }) => backgroundColor || 'transparent'};
  border-bottom: 1px solid rgba(0, 0, 0, 0.9);
  border-right: ${({ isEnglish }) => (isEnglish ? '1px solid rgba(0, 0, 0, 0.9)' : 'none')};
  border-left: ${({ isEnglish }) => (!isEnglish ? '1px solid rgba(0, 0, 0, 0.9)' : 'none')};
`;

export const SubcategoryColumn = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const SubcategoryRow = styled('div')`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid rgba(0, 0, 0, 0.9);
`;

export const SubcategoryName = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
  flex: 0 0 40%;
  padding: 5px;
  font-weight: 600;
  line-height: 1.1;
  border-right: ${({ isEnglish }) => (isEnglish ? '1px solid rgba(0, 0, 0, 0.9)' : 'none')};
  border-left: ${({ isEnglish }) => (!isEnglish ? '1px solid rgba(0, 0, 0, 0.9)' : 'none')};
  text-align: ${({ isEnglish }) => (isEnglish ? 'left' : 'right')};
`;

export const OptionList = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isInteractive'
})<{ isInteractive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 5px;
  cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
`;

export const OptionName = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
  padding: 5px 0;
  line-height: 1.1;
  text-align: ${({ isEnglish }) => (isEnglish ? 'left' : 'right')};
`;

export const ImageWrapper = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.75rem;
  position: relative;
`;

export const EditorWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: var(--color-text-secondary, #6c7680);
  font-size: 14px;
  line-height: 17px;
`;

export const ReadOnlyContent = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
  direction: ${({ isEnglish }) => (isEnglish ? 'ltr' : 'rtl')};
  font-size: 1rem;

  & p {
    margin-bottom: 0.75rem;
  }
`;

export const ImagePreview = styled('img')`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 18px 30px -12px rgba(31, 41, 55, 0.35);
  object-fit: cover;
`;

export const ImageControls = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  direction: ${({ isEnglish }) => (isEnglish ? 'ltr' : 'rtl')};
`;

export const ImageActionPanel = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>(({ theme, isEnglish }) => ({
  position: 'absolute',
  top: theme.app.spacing['2xs'],
  zIndex: 717,
  minWidth: '8rem',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing['2xs'],
  padding: `${theme.app.spacing.xs} ${theme.app.spacing.sm}`,
  borderRadius: '0.75rem',
  background: `var(--color-background-dark, ${theme.app.colors.backgroundDark})`,
  color: `var(--color-accent-secondary, ${theme.app.colors.accent.secondary})`,
  boxShadow: '0 12px 24px -12px rgba(15, 23, 42, 0.4)',
  ...(isEnglish ? { left: '-1.5rem' } : { right: '-1.5rem' })
}));

export const ImageActionLabel = styled('span')(({ theme }) => ({
  display: 'block',
  fontSize: '1.35rem',
  lineHeight: 1.2,
  color: `var(--color-accent-secondary, ${theme.app.colors.accent.secondary})`
}));

export const ImageActionButton = styled('button')(({ theme }) => ({
  width: '3.2rem',
  height: '3.2rem',
  borderRadius: '50%',
  border: '1px solid transparent',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  cursor: 'pointer',
  transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: theme.app.colors.accent.secondary,
    background: 'rgba(94, 174, 136, 0.12)'
  },
  '&:active': {
    transform: 'translateY(0)',
    borderColor: theme.app.colors.accent.primary
  }
}));

export const ImageActionIcon = styled('img')(({ theme }) => ({
  width: '2.4rem',
  height: '2.4rem',
  borderRadius: '50%',
  background: `var(--color-accent, ${theme.app.colors.accent.primary})`,
  padding: theme.app.spacing['2xs']
}));
