import React from 'react';
import styled from '@emotion/styled';
import type { CSSObject } from '@emotion/react';

import type { AppTheme } from '../../styles/theme';

interface PageUpStripProps {
  pageupImageClassName: string;
  pageupImageStyle?: React.CSSProperties;
}

type PageUpVariant = 'inline' | 'absolute' | 'absoluteHome' | 'fixed';

const classToVariant: Record<string, PageUpVariant> = {
  pageup__image: 'inline',
  pageup__image__absolute: 'absolute',
  pageup__image__absolute__homepage: 'absoluteHome',
  pageup__image__fixed: 'fixed'
};

const variantStyles: Record<PageUpVariant, CSSObject> = {
  inline: {
    position: 'relative',
    left: '57%'
  },
  absolute: {
    position: 'absolute',
    left: '57%',
    top: '105vh',
    zIndex: 58
  },
  absoluteHome: {
    position: 'absolute',
    left: '57%',
    top: '205vh',
    zIndex: 58
  },
  fixed: {
    position: 'fixed',
    left: '57%',
    top: '90vh',
    zIndex: 58
  }
};

const PageUpWrapper = styled('div')(({ theme }) => {
  const appTheme = (theme as AppTheme).app;
  return {
    background: `var(--color-background, ${appTheme.colors.background})`,
    display: 'block',
    position: 'relative',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  };
});

const PageUpButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant: PageUpVariant }>(({ theme, variant }) => {
  const appTheme = (theme as AppTheme).app;
  const baseStyles: CSSObject = {
    width: '3.5rem',
    height: '3.6rem',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '3.5rem 3.6rem',
    backgroundImage: "url('/images/common/pageup.png')",
    border: 'none',
    backgroundColor: 'transparent',
    cursor: variant === 'absoluteHome' ? 'default' : 'pointer',
    marginLeft: '45.5rem',
    transition: 'background-image 0.15s ease',
    padding: 0
  };

  const buttonStyles: CSSObject = {
    ...baseStyles,
    ...variantStyles[variant],
    '@media (max-width: 1024px)': {
      marginLeft: '43vw'
    },
    '&:hover': {
      backgroundImage: "url('/images/common/pageup-over.png')"
    },
    '&:focus-visible': {
      outline: `0.2rem solid var(--color-accent-secondary, ${appTheme.colors.accent.secondary})`
    }
  };

  return buttonStyles;
});

const pageToTop = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

const PageUpStrip: React.FC<PageUpStripProps> = ({ pageupImageClassName, pageupImageStyle }) => {
  const variant = classToVariant[pageupImageClassName] ?? 'inline';

  return (
    <PageUpWrapper>
      <PageUpButton
        id="pageup__image"
        type="button"
        aria-label="Scroll to top"
        variant={variant}
        className={pageupImageClassName}
        data-variant={variant}
        style={pageupImageStyle}
        onClick={pageToTop}
      />
    </PageUpWrapper>
  );
};

export default PageUpStrip;
