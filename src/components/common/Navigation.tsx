import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  langLink: string;
  langLinkEng: string;
}

const Navigation: React.FC<NavigationProps> = ({ langLink, langLinkEng }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const trigger = document.getElementById('enable-toolbar-trigger');
    const buttons = document.getElementById('enable-toolbar-buttons');
    if (trigger && buttons) {
      buttons.style.textAlign = 'right';
    }
  }, []);

  useEffect(() => {
    const updateToolbarHeight = () => {
      const desktopToolbar = document.querySelector<HTMLElement>('.navbar-light .MuiToolbar-root');
      const mobileToolbar = document.querySelector<HTMLElement>('.mobile .MuiToolbar-root');

      const isVisible = (element?: HTMLElement | null) => {
        if (!element || !element.parentElement) {
          return false;
        }
        const style = window.getComputedStyle(element.parentElement);
        return style.display !== 'none' && style.visibility !== 'hidden';
      };

      const activeToolbar = isVisible(desktopToolbar)
        ? desktopToolbar
        : isVisible(mobileToolbar)
          ? mobileToolbar
          : desktopToolbar || mobileToolbar;

      if (!activeToolbar) {
        return;
      }

      void activeToolbar.offsetHeight;
    };

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return () => undefined;
    }

    updateToolbarHeight();
    window.addEventListener('resize', updateToolbarHeight);
    return () => window.removeEventListener('resize', updateToolbarHeight);
  }, []);

  const isHebrew = i18n.language === 'he';

  const setLang = () => {
    const nextLang = isHebrew ? 'en' : 'he';
    i18n.changeLanguage(nextLang).then(() => {
      navigate(nextLang === 'he' ? langLink : langLinkEng);
    });
  };

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

  const pathname = typeof window !== 'undefined' ? decodePathname(window.location.pathname) : '';

  const navLinks = isHebrew
    ? [
        { to: '/', label: 'ראשי' },
        { to: '/מחקר', label: 'מחקר' },
        { to: '/הוראה', label: 'הוראה' },
        { to: '/הרצאות', label: 'הרצאות' },
        { to: '/פרסומים', label: 'פרסומים' },
        { to: '/קורות_חיים', label: 'קו״ח' },
        { to: '/אודות', label: 'אודות' },
        { to: '/צרו_קשר', label: 'צרו קשר' }
      ]
    : [
        { to: '/en', label: 'Home' },
        { to: '/research', label: 'Research' },
        { to: '/Teaching', label: 'Teaching' },
        { to: '/Lectures', label: 'Lectures' },
        { to: '/Publication', label: 'Publication' },
        { to: '/CV', label: 'CV' },
        { to: '/About', label: 'About' },
        { to: '/Contact', label: 'Contact' }
      ];

  const brandButton = isHebrew ? (
    <Button
      color="inherit"
      href="/עב"
      style={{ textTransform: 'none' }}
      className="navbar__brand"
    >
      <div style={{ marginBottom: '2px', textAlign: 'right', lineHeight: '1.2' }}>
        נאוה קיינר-פרסוב
        <br />
        אדריכלית ומתכננת ערים
      </div>
    </Button>
  ) : (
    <Button
      color="inherit"
      href="/"
      style={{ textTransform: 'none' }}
      className="navbar__brand navbar__brand__eng"
    >
      <div style={{ marginBottom: '1px', lineHeight: '140%' }}>
        Nava Kainer-Persov, PhD
        <br />
        Architect & Urban Planner
      </div>
    </Button>
  );

  return (
    <div className="container-fluid">
      <div id="fakeNav" className="fakeNav" />
      <AppBar position="fixed" color="transparent" className="navbar-light">
        <Toolbar
          sx={{ justifyContent: 'space-between', alignItems: 'flex-end', pb: '20px' }}
          dir={isHebrew ? 'rtl' : 'ltr'}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
            {brandButton}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: isHebrew ? 'flex-end' : 'flex-start' }}>
              {navLinks.map(({ to, label }) => (
                <Button
                  key={to}
                  color="inherit"
                  component={NavLink}
                  to={to}
                  className={pathname === to ? 'is-active nav__link--active' : 'nav__link'}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Box>
          <Button color="inherit" onClick={setLang} className="nav__link">
            {isHebrew ? 'EN' : 'עב'}
          </Button>
        </Toolbar>
      </AppBar>

      <AppBar position="fixed" color="default" className="mobile">
        <Toolbar dir={isHebrew ? 'rtl' : 'ltr'}>
          {brandButton}
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={setLang}>
            {isHebrew ? 'EN' : 'עב'}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;
