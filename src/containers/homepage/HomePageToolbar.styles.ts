import styled from '@emotion/styled';

interface ToolbarClusterProps {
  isEnglish: boolean;
  alignEnglish: number;
  alignHebrew: number;
  zIndexLevel?: number;
}

export const ToolbarCluster = styled('div', {
  shouldForwardProp: (prop) => {
    if (typeof prop !== 'string') {
      return true;
    }
    return !['isEnglish', 'alignEnglish', 'alignHebrew', 'zIndexLevel'].includes(prop);
  }
})<ToolbarClusterProps>(({ theme, isEnglish, alignEnglish, alignHebrew, zIndexLevel = 15000 }) => ({
  position: 'fixed',
  top: theme.app.spacing.xs,
  left: `${isEnglish ? alignEnglish : alignHebrew}%`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.app.spacing['2xs'],
  zIndex: zIndexLevel,
  pointerEvents: 'auto'
}));

interface ToolbarLabelProps {
  width?: string;
  align?: 'left' | 'center';
  tone?: 'default' | 'alert';
  paddingLeft?: string;
}

export const ToolbarLabel = styled('div', {
  shouldForwardProp: (prop) => {
    if (typeof prop !== 'string') {
      return true;
    }
    return !['width', 'align', 'tone', 'paddingLeft'].includes(prop);
  }
})<ToolbarLabelProps>(
  ({ theme, width = '9rem', align = 'center', tone = 'default', paddingLeft }) => ({
    display: 'block',
    width,
    height: '1.8rem',
    color: tone === 'alert' ? theme.app.colors.error.main : theme.app.colors.accent.secondary,
    fontSize: '1.2rem',
    textAlign: align,
    pointerEvents: 'none',
    paddingLeft: paddingLeft ?? 0
  })
);

export const IconButton = styled('button')(({ theme }) => ({
  width: '3.2rem',
  height: '3.2rem',
  borderRadius: '50%',
  background: 'transparent',
  border: '1px solid transparent',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: theme.app.colors.accent.secondary
  },
  '&:active': {
    transform: 'translateY(0)',
    borderColor: theme.app.colors.accent.primary
  }
}));

type IconVariant = 'default' | 'accent';

export const IconImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant?: IconVariant }>(({ theme, variant = 'default' }) => ({
  width: variant === 'accent' ? '2.4rem' : '3rem',
  height: variant === 'accent' ? '2.4rem' : '3rem',
  borderRadius: variant === 'accent' ? '50%' : '0',
  backgroundColor: variant === 'accent' ? theme.app.colors.accent.secondary : 'transparent',
  padding: variant === 'accent' ? theme.app.spacing['2xs'] : 0
}));

export const DualButtonContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '7rem',
  height: '3rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.app.spacing['2xs']
}));
