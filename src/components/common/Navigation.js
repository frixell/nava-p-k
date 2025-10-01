import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import $ from 'jquery';

const Navigation = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(document.getElementById('enable-toolbar-trigger')) {
      document.getElementById('enable-toolbar-buttons').style.textAlign = "right";
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const updateToolbarHeight = () => {
      const desktopToolbar = document.querySelector('.navbar-light .MuiToolbar-root');
      const mobileToolbar = document.querySelector('.mobile .MuiToolbar-root');

      const isVisible = (element) => {
        if (!element || !element.parentElement) {
          return false;
        }
        const style = window.getComputedStyle(element.parentElement);
        return style.display !== 'none' && style.visibility !== 'hidden';
      };

      const activeToolbar = isVisible(desktopToolbar) ? desktopToolbar : (isVisible(mobileToolbar) ? mobileToolbar : (desktopToolbar || mobileToolbar));
      const fallback = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height')) || 0;
      const height = activeToolbar ? activeToolbar.offsetHeight : fallback;

      // document.documentElement.style.setProperty('--toolbar-height', `${height}px`);
    };

    updateToolbarHeight();
    window.addEventListener('resize', updateToolbarHeight);

    return () => {
      window.removeEventListener('resize', updateToolbarHeight);
    };
  }, []);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const setLang = () => {
    const newLang = props.i18n.language === 'he' ? 'en' : 'he';
    props.i18n.changeLanguage(newLang);
    if (newLang === 'he') {
      navigate(props.langLink);
    } else {
      navigate(props.langLinkEng);
    }
  };

  const { i18n } = props;
  const { pathname } = window.location;

  return (
    <div className="container-fluid">
      <div id="fakeNav" className="fakeNav" />
      <AppBar position="fixed" color="transparent" className="navbar-light">
        <Toolbar style={{ justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '20px'}}>
          {i18n.language === 'he' ? (
            <>
              <Button 
                color="inherit" 
                onClick={setLang}
                className="nav__link"
              >
                EN
              </Button>
              <div style={{ flexGrow: 1 }} />
              <div>
                <Button color="inherit" component={NavLink} to="/" className={pathname === '/' ? 'is-active nav__link--active' : 'nav__link'}>ראשי</Button>
                <Button color="inherit" component={NavLink} to="/מחקר" className={pathname === '/מחקר' ? 'is-active nav__link--active' : 'nav__link'}>מחקר</Button>
                <Button color="inherit" component={NavLink} to="/הוראה" className={pathname === '/הוראה' ? 'is-active nav__link--active' : 'nav__link'}>הוראה</Button>
                <Button color="inherit" component={NavLink} to="/הרצאות" className={pathname === '/הרצאות' ? 'is-active nav__link--active' : 'nav__link'}>הרצאות</Button>
                <Button color="inherit" component={NavLink} to="/פרסומים" className={pathname === '/פרסומים' ? 'is-active nav__link--active' : 'nav__link'}>פרסומים</Button>
                <Button color="inherit" component={NavLink} to="/קורות_חיים" className={pathname === '/קורות_חיים' ? 'is-active nav__link--active' : 'nav__link'}>קו״ח</Button>
                <Button color="inherit" component={NavLink} to="/אודות" className={pathname === '/אודות' ? 'is-active nav__link--active' : 'nav__link'}>אודות</Button>
                <Button color="inherit" component={NavLink} to="/צרו_קשר" className={pathname === '/צרו_קשר' ? 'is-active nav__link--active' : 'nav__link'}>צרו קשר</Button>
              </div>
              <Button color="inherit" href="/" style={{textTransform: 'none'}} className="navbar__brand">
                <div style={{marginTop: '-0.9vw', textAlign: 'right', lineHeight: '1.2'}}>נאוה קיינר-פרסוב<br />אדריכלית ומתכננת ערים</div>
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" href="/" style={{textTransform: 'none'}} className="navbar__brand navbar__brand__eng">
                <div style={{marginTop: '-0.8vw', lineHeight: '140%'}}>Nava Kainer-Persov, PhD<br />Architect & Urban Planner</div>
              </Button>
              <div>
                <Button color="inherit" component={NavLink} to="/en" className={pathname === '/en' ? 'is-active nav__link--active' : 'nav__link'}>Home</Button>
                <Button color="inherit" component={NavLink} to="/research" className={pathname === '/research' ? 'is-active nav__link--active' : 'nav__link'}>Research</Button>
                <Button color="inherit" component={NavLink} to="/Teaching" className={pathname === '/Teaching' ? 'is-active nav__link--active' : 'nav__link'}>Teaching</Button>
                <Button color="inherit" component={NavLink} to="/Lectures" className={pathname === '/Lectures' ? 'is-active nav__link--active' : 'nav__link'}>Lectures</Button>
                <Button color="inherit" component={NavLink} to="/Publication" className={pathname === '/Publication' ? 'is-active nav__link--active' : 'nav__link'}>Publication</Button>
                <Button color="inherit" component={NavLink} to="/CV" className={pathname === '/CV' ? 'is-active nav__link--active' : 'nav__link'}>CV</Button>
                <Button color="inherit" component={NavLink} to="/About" className={pathname === '/About' ? 'is-active nav__link--active' : 'nav__link'}>About</Button>
                <Button color="inherit" component={NavLink} to="/Contact" className={pathname === '/Contact' ? 'is-active nav__link--active' : 'nav__link'}>Contact</Button>
              </div>
              <div style={{ flexGrow: 1 }} />
              <Button 
                color="inherit" 
                onClick={setLang}
                className="nav__link"
              >
                עב
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <AppBar position="fixed" color="default" className="mobile">
        <Toolbar>
          <Button color="inherit" href="/">{i18n.language === 'he' ? <div style={{marginTop: '-0.9vw', textAlign: 'right'}}>נאוה קיינר-פרסוב<br />אדריכלית ומתכננת ערים</div> : <div style={{marginTop: '-0.8vw', lineHeight: '140%'}}>Nava Kainer-Persov, PhD<br />Architect & Urban Planner</div>}</Button>
          <div style={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={setLang}>{i18n.language === 'he' ? 'EN' : 'עב'}</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Navigation));
