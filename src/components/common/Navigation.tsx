import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import type { AppTheme } from '../../styles/theme';

interface NavigationProps {
  langLink: string;
  langLinkEng: string;
}

type NavLinkDefinition = {
  to: string;
  label: string;
  aliases?: string[];
};

const Header = styled('header', {
  shouldForwardProp: (prop) => prop !== 'scrolled'
})<{ scrolled: boolean }>(({ theme, scrolled }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  width: '100%',
  backgroundColor: theme.app.colors.background,
  borderBottom: `1px solid ${theme.app.colors.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBlock: theme.app.spacing.md,
  transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
  boxShadow: scrolled ? '0 10px 24px rgba(10, 31, 51, 0.12)' : 'none',
  '@media (max-width: 900px)': {
    paddingInline: theme.app.spacing.lg
  }
}));

const HeaderInner = styled('div')(({ theme }) => ({
  width: '100%',
  marginInline: 'auto',
  paddingInline: '47px',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  alignItems: 'center',
  gap: theme.app.spacing.xl,
  boxSizing: 'border-box'
}));

const HeaderLeft = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isHebrew'
})<{ isHebrew: boolean }>(({ theme, isHebrew }) => ({
  display: 'flex',
  order: isHebrew ? 1 : -1,
  alignItems: 'center',
  gap: theme.app.spacing.lg,
  minWidth: 0,
  flexDirection: isHebrew ? 'row-reverse' : 'row',
  justifyContent: isHebrew ? 'flex-end' : 'flex-start',
  justifySelf: isHebrew ? 'end' : 'start'
}));

const HeaderRight = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isHebrew'
})<{ isHebrew: boolean }>(({ theme, isHebrew }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.app.spacing.md,
  flexDirection: isHebrew ? 'row-reverse' : 'row',
  justifyContent: isHebrew ? 'flex-start' : 'flex-end',
  justifySelf: isHebrew ? 'start' : 'end'
}));

const BrandWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isHebrew'
})<{ isHebrew: boolean }>(({ isHebrew }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: isHebrew ? 'flex-end' : 'flex-start',
  marginInlineStart: isHebrew ? 0 : '0px',
  marginInlineEnd: isHebrew ? '0px' : '0px'
}));

const Brand = styled(NavLink)(({ theme }) => ({
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.variants.displayMd.fontWeight,
  fontSize: '1.25rem',
  color: theme.app.colors.text.primary,
  textDecoration: 'none',
  letterSpacing: '-0.01em',
  '&:hover': {
    textDecoration: 'underline'
  }
}));

const DesktopNav = styled('nav', {
  shouldForwardProp: (prop) => prop !== 'isHebrew'
})<{ isHebrew: boolean }>(({ theme, isHebrew }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.app.spacing.lg,
  flexDirection: isHebrew ? 'row-reverse' : 'row',
  marginInlineStart: isHebrew ? 0 : '40px',
  marginInlineEnd: isHebrew ? '40px' : 0,
  '@media (max-width: 768px)': {
    display: 'none'
  }
}));

const MobileMenuButton = styled('button')(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: '50%',
  border: `1px solid ${theme.app.colors.border}`,
  background: theme.app.colors.surface,
  cursor: 'pointer',
  '@media (max-width: 768px)': {
    display: 'inline-flex'
  }
}));

const MenuIcon = styled('span')(({ theme }) => ({
  position: 'relative',
  width: '1.4rem',
  height: '0.1rem',
  backgroundColor: theme.app.colors.text.primary,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '0.1rem',
    backgroundColor: theme.app.colors.text.primary,
    transition: 'transform 0.2s ease, top 0.2s ease'
  },
  '&::before': {
    top: '-0.4rem'
  },
  '&::after': {
    top: '0.4rem'
  }
}));

const LinksList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.app.spacing.lg,
  margin: 0,
  padding: 0
}));

const LinkItem = styled('li')({
  display: 'flex'
});

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  paddingInline: (theme as AppTheme).app.spacing.sm,
  paddingBlock: (theme as AppTheme).app.spacing['2xs'],
  borderRadius: '999px',
  textDecoration: 'none',
  fontFamily: (theme as AppTheme).app.typography.fontFamilyBase,
  fontWeight: (theme as AppTheme).app.typography.weights.regular,
  fontSize: (theme as AppTheme).app.typography.variants.body.fontSize,
  lineHeight: (theme as AppTheme).app.typography.variants.body.lineHeight,
  color: (theme as AppTheme).app.colors.text.primary,
  border: '1px solid transparent',
  transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
  textTransform: 'none',
  letterSpacing: '0.01em',
  '&:hover': {
    color: (theme as AppTheme).app.colors.accent.secondary,
    backgroundColor: (theme as AppTheme).app.colors.surfaceMuted
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme as AppTheme).app.colors.accent.tertiary}`,
    outlineOffset: '2px'
  },
  "&[data-active='true']": {
    color: (theme as AppTheme).app.colors.accent.primary,
    borderColor: (theme as AppTheme).app.colors.accent.primary,
    fontWeight: (theme as AppTheme).app.typography.weights.medium
  },
  "&[data-hebrew='true']": {
    letterSpacing: 0
  }
}));

const LanguageButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: theme.app.spacing.sm,
  paddingBlock: theme.app.spacing['2xs'],
  paddingRight: 0,
  paddingLeft: 0,
  borderRadius: '999px',
  border: `1px solid ${theme.app.colors.border}`,
  background: theme.app.colors.surface,
  color: theme.app.colors.text.primary,
  minWidth: '6.5rem',
  cursor: 'pointer',
  fontFamily: theme.app.typography.fontFamilyBase,
  fontWeight: theme.app.typography.weights.medium,
  '&:hover': {
    backgroundColor: theme.app.colors.surfaceMuted
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.app.colors.accent.tertiary}`,
    outlineOffset: '2px'
  }
}));

const MobilePanel = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  right: 0,
  left: 0,
  backgroundColor: theme.app.colors.background,
  borderBottom: `1px solid ${theme.app.colors.border}`,
  padding: theme.app.spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.md,
  '@media (min-width: 769px)': {
    display: 'none'
  }
}));

const MobileLinks = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.sm
}));

const decodePathname = (value: string) => {
  try {
    return decodeURI(value);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Failed to decode pathname', value, error);
    }
    return value;
  }
};

const Navigation: React.FC<NavigationProps> = ({ langLink, langLinkEng }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = decodePathname(location.pathname);
  const isHebrew = i18n.language === 'he';

  const navLinks = useMemo<NavLinkDefinition[]>(
    () =>
      isHebrew
        ? [
            { to: '/עב', label: 'ראשי', aliases: ['/'] },
            { to: '/מחקר', label: 'מחקר' },
            { to: '/הוראה', label: 'הוראה' },
            { to: '/פרסומים', label: 'פרסומים' },
            { to: '/צור-קשר', label: 'צור קשר', aliases: ['/צור קשר'] }
          ]
        : [
            { to: '/en', label: 'Home', aliases: ['/'] },
            { to: '/research', label: 'Research' },
            { to: '/teaching', label: 'Teaching' },
            { to: '/publications', label: 'Publications' },
            { to: '/contact', label: 'Contact' }
          ],
    [isHebrew]
  );

  const isActive = useCallback(
    (link: NavLinkDefinition) =>
      link.to === pathname || (link.aliases ?? []).some((alias) => alias === pathname),
    [pathname]
  );

  const setToolbarHeight = useCallback(() => {
    if (!headerRef.current) {
      return;
    }
    const height = headerRef.current.offsetHeight;
    if (height > 0) {
      document.documentElement.style.setProperty('--toolbar-height', `${height}px`);
    }
  }, []);

  useEffect(() => {
    setToolbarHeight();
    window.addEventListener('resize', setToolbarHeight);
    return () => window.removeEventListener('resize', setToolbarHeight);
  }, [setToolbarHeight]);

  useEffect(() => {
    setToolbarHeight();
  }, [setToolbarHeight, isHebrew]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY || window.pageYOffset;
      setScrolled(offset > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const handleKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
    return undefined;
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleToggleMenu = () => setMenuOpen((prev) => !prev);

  const handleChangeLanguage = () => {
    const nextLang = isHebrew ? 'en' : 'he';
    i18n
      .changeLanguage(nextLang)
      .then(() => {
        navigate(nextLang === 'he' ? langLink : langLinkEng);
      })
      .catch((error: unknown) => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Language change failed', error);
        }
      });
  };

  const languageLabel = isHebrew ? 'English' : 'עברית';
  const brandLabel = isHebrew
    ? i18n.t('homepage.hero.brand', 'ד"ר נאוה קיינר-פרסוב')
    : i18n.t('homepage.hero.brand', 'Dr. Nava Kainer-Persov');

  const desktopLinks = useMemo(
    () => (
      <LinksList dir={isHebrew ? 'rtl' : 'ltr'}>
        {navLinks.map((link) => (
          <LinkItem key={link.to}>
            <StyledNavLink to={link.to} data-active={isActive(link)} data-hebrew={isHebrew}>
              {link.label}
            </StyledNavLink>
          </LinkItem>
        ))}
      </LinksList>
    ),
    [navLinks, isActive, isHebrew]
  );

  return (
    <>
      <Header ref={headerRef} role="banner" scrolled={scrolled}>
        <HeaderInner>
          <HeaderLeft isHebrew={isHebrew}>
            <BrandWrapper isHebrew={isHebrew}>
              <Brand to={isHebrew ? '/עב' : '/en'}>{brandLabel}</Brand>
            </BrandWrapper>
            <DesktopNav
              isHebrew={isHebrew}
              aria-label={isHebrew ? 'תפריט ראשי' : 'Main navigation'}
              style={{
                marginInlineStart: isHebrew ? 0 : '40px',
                marginInlineEnd: isHebrew ? '40px' : 0
              }}
            >
              {desktopLinks}
            </DesktopNav>
          </HeaderLeft>
          <HeaderRight isHebrew={isHebrew}>
            <LanguageButton
              type="button"
              onClick={handleChangeLanguage}
              aria-label={isHebrew ? 'Change language to English' : 'החלף שפה לעברית'}
            >
              {languageLabel}
            </LanguageButton>
            <MobileMenuButton
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={handleToggleMenu}
            >
              <MenuIcon />
            </MobileMenuButton>
          </HeaderRight>
        </HeaderInner>
      </Header>
      {menuOpen ? (
        <MobilePanel id="mobile-navigation">
          <LanguageButton type="button" onClick={handleChangeLanguage}>
            {languageLabel}
          </LanguageButton>
          <MobileLinks>
            {navLinks.map((link) => (
              <li key={link.to}>
                <StyledNavLink to={link.to} data-active={isActive(link)} data-hebrew={isHebrew}>
                  {link.label}
                </StyledNavLink>
              </li>
            ))}
          </MobileLinks>
        </MobilePanel>
      ) : null}
    </>
  );
};

export default Navigation;
