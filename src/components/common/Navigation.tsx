import React, { useCallback, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

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

const NavigationContainer = styled('div')({
  margin: 0,
  padding: 0,
  width: '100%'
});

const ToolbarSpacer = styled('div')({
  height: 'var(--toolbar-height)',
  width: '100%'
});

const DesktopAppBar = styled(AppBar)({
  backgroundColor: 'var(--color-background-dark, #1f1f1f)',
  boxShadow: 'none',
  display: 'none',
  '@media (min-width: 769px)': {
    display: 'block'
  }
});

const MobileAppBar = styled(AppBar)({
  backgroundColor: 'var(--color-background-dark, #1f1f1f)',
  boxShadow: 'none',
  display: 'block',
  '@media (min-width: 769px)': {
    display: 'none'
  }
});

const DesktopToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  minHeight: 'auto'
});

const MobileToolbar = styled(Toolbar)({
  minHeight: 'auto',
  paddingTop: '12px',
  paddingBottom: '12px',
  paddingLeft: '12px',
  paddingRight: '12px'
});

const navButtonStyles = (theme: AppTheme, isActive: boolean) => ({
  border: isActive
    ? `0.2rem dotted var(--color-surface, ${theme.app.colors.text.inverse})`
    : '0.2rem solid rgba(0, 0, 0, 0)',
  marginLeft: '0.4rem',
  marginRight: '0.4rem',
  marginBottom: '0.625rem',
  color: `var(--color-surface, ${theme.app.colors.text.inverse})`,
  fontFamily: theme.app.typography.fontFamilyBase,
  fontWeight: theme.app.typography.weights.regular,
  fontSize: '1.5rem',
  letterSpacing: '0.1px',
  minHeight: '2.2rem',
  lineHeight: '2.2rem',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: '1rem',
  paddingRight: '1rem',
  textTransform: 'capitalize',
  transition: 'border-color 0.2s ease',
  '&:hover': {
    border: `0.2rem dotted var(--color-surface, ${theme.app.colors.text.inverse})`,
    textDecoration: 'none'
  }
});

const languageButtonStyles = (theme: AppTheme) => ({
  ...navButtonStyles(theme, false),
  marginBottom: '0.625rem',
  textTransform: 'none'
});

const brandButtonStyles = (theme: AppTheme, isHebrew: boolean) => ({
  color: `var(--color-surface, ${theme.app.colors.text.inverse})`,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.weights.regular,
  fontSize: '1.6rem',
  letterSpacing: '0.1px',
  textTransform: 'none',
  border: '0.2rem solid rgba(0, 0, 0, 0)',
  marginBottom: '0.7rem',
  paddingTop: '1vw',
  paddingBottom: 0,
  paddingLeft: isHebrew ? 0 : '1rem',
  paddingRight: isHebrew ? 0 : '1rem',
  alignSelf: 'flex-end',
  '&:hover': {
    color: `var(--color-surface, ${theme.app.colors.text.inverse})`
  }
});

const decodePathname = (value: string) => {
  try {
    return decodeURI(value);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Failed to decode pathname', value, error);
    }
    return value;
  }
};

const Navigation: React.FC<NavigationProps> = ({ langLink, langLinkEng }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const desktopToolbarRef = useRef<HTMLDivElement | null>(null);
  const mobileToolbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trigger = document.getElementById('enable-toolbar-trigger');
    const buttons = document.getElementById('enable-toolbar-buttons');
    if (trigger && buttons) {
      buttons.style.textAlign = 'right';
    }
  }, []);

  const updateToolbarHeight = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const toolbars = [desktopToolbarRef.current, mobileToolbarRef.current].filter(
      (toolbar): toolbar is HTMLDivElement => Boolean(toolbar)
    );

    if (!toolbars.length) {
      return;
    }

    const visibleToolbar =
      toolbars.find((toolbar) => {
        const parent = toolbar.parentElement;
        if (!parent) {
          return false;
        }
        const style = window.getComputedStyle(parent);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }) ?? toolbars[0];

    const height = visibleToolbar.offsetHeight;
    if (height > 0) {
      document.documentElement.style.setProperty('--toolbar-height', `${height}px`);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }

    updateToolbarHeight();
    window.addEventListener('resize', updateToolbarHeight);
    return () => window.removeEventListener('resize', updateToolbarHeight);
  }, [updateToolbarHeight]);

  const isHebrew = i18n.language === 'he';

  useEffect(() => {
    updateToolbarHeight();
  }, [updateToolbarHeight, isHebrew, i18n.language]);

  const setLang = () => {
    const nextLang = isHebrew ? 'en' : 'he';
    i18n.changeLanguage(nextLang).then(() => {
      navigate(nextLang === 'he' ? langLink : langLinkEng);
    });
  };

  const pathname = typeof window !== 'undefined' ? decodePathname(window.location.pathname) : '';

  const navLinks: NavLinkDefinition[] = isHebrew
    ? [
        { to: '/עב', label: 'ראשי', aliases: ['/'] },
        { to: '/מחקר', label: 'מחקר' },
        { to: '/הוראה', label: 'הוראה' },
        { to: '/הרצאות', label: 'הרצאות' },
        { to: '/פרסומים', label: 'פרסומים' },
        { to: '/קורות_חיים', label: 'קו״ח' },
        { to: '/אודות', label: 'אודות' },
        { to: '/צרו_קשר', label: 'צרו קשר' }
      ]
    : [
        { to: '/en', label: 'Home', aliases: ['/'] },
        { to: '/research', label: 'Research' },
        { to: '/Teaching', label: 'Teaching' },
        { to: '/Lectures', label: 'Lectures' },
        { to: '/Publication', label: 'Publication' },
        { to: '/CV', label: 'CV' },
        { to: '/About', label: 'About' },
        { to: '/Contact', label: 'Contact' }
      ];

  const renderBrandButton = () => (
    <Button
      component="a"
      href={isHebrew ? '/עב' : '/'}
      color="inherit"
      sx={(theme) => brandButtonStyles(theme as AppTheme, isHebrew)}
    >
      <div
        style={{
          marginBottom: isHebrew ? '2px' : '1px',
          textAlign: isHebrew ? 'right' : 'left',
          lineHeight: isHebrew ? '1.2' : '140%'
        }}
      >
        {isHebrew ? 'נאוה קיינר-פרסוב' : 'Nava Kainer-Persov, PhD'}
        <br />
        {isHebrew ? 'אדריכלית ומתכננת ערים' : 'Architect & Urban Planner'}
      </div>
    </Button>
  );

  return (
    <NavigationContainer>
      <ToolbarSpacer id="fakeNav" />

      <DesktopAppBar position="fixed" color="transparent">
        <DesktopToolbar ref={desktopToolbarRef} dir={isHebrew ? 'rtl' : 'ltr'}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
            {renderBrandButton()}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                justifyContent: isHebrew ? 'flex-end' : 'flex-start'
              }}
            >
              {navLinks.map(({ to, label, aliases }) => {
                const matchTargets = [to, ...(aliases ?? [])];
                const isActive = matchTargets.includes(pathname);
                return (
                  <Button
                    key={to}
                    color="inherit"
                    component={NavLink}
                    to={to}
                    sx={(theme) => navButtonStyles(theme as AppTheme, isActive)}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          </Box>
          <Button color="inherit" onClick={setLang} sx={(theme) => languageButtonStyles(theme as AppTheme)}>
            {isHebrew ? 'EN' : 'עב'}
          </Button>
        </DesktopToolbar>
      </DesktopAppBar>

      <MobileAppBar position="fixed" color="transparent">
        <MobileToolbar ref={mobileToolbarRef} dir={isHebrew ? 'rtl' : 'ltr'}>
          {renderBrandButton()}
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={setLang} sx={(theme) => languageButtonStyles(theme as AppTheme)}>
            {isHebrew ? 'EN' : 'עב'}
          </Button>
        </MobileToolbar>
      </MobileAppBar>
    </NavigationContainer>
  );
};

export default Navigation;
