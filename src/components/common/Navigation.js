import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from "../../routers/withRouter";
import { setLanguage } from "redux-i18n";
import $ from 'jquery';

import ReactGA from 'react-ga';

function initializeReactGA(url) {
    ReactGA.initialize('UA-128960221-1');
    ReactGA.pageview(url);
}
//initializeReactGA();


class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      fixed: 'none',
      isOpen: false,
      accessibilityIcon: 'accessibility',
      eventsCategoriesReverse: [],
      lang: '',
      category: '',
      subcategory: '',
      event: ''
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  fixedTop = () => {
    document.getElementsByClassName("navbar-light")[1].style.position = "fixed";
    document.getElementsByClassName("navbar-light")[1].style.top = 0;
    document.getElementById('fakeNav').style.display = "block";
    const homepageCarouselDone = true;
    
    this.setState({
        fixed: 'top'
    });
    if (typeof(window) !== "undefined") {
      window.scrollTo(0, -20);
    }
  }

  setIconChangeOn = (e) => {
        switch(e.target.dataset.name) {
            case 'accessibility':
                return this.setState({ 
                    accessibilityIcon: 'accessibilityHover'
                });
            default:
                return null;
        }
        
    }

    setIconChangeOut = (e) => {
        switch(e.target.dataset.name) {
            case 'accessibility':
                return this.setState({ 
                    accessibilityIcon: 'accessibility'
                });
            default:
                return null;
        }
    }

  componentDidMount = () => {
    let windowWidth = 0;
    if (typeof(window) !== "undefined") {
      windowWidth = $( window ).width();
    }
    this.setState({ 
        windowWidth
    });
    if(document.getElementById('enable-toolbar-trigger')) {
      document.getElementById('enable-toolbar-buttons').style.textAlign = "right";
    }
    
    let location = '/';
    if (typeof(window) !== "undefined") {
      location = window.location.href;
    }
    this.fixedTop();
  }

  componentDidUpdate = () => {
    if (!this.state.windowWidth) {
      let windowWidth = 0;
      if (typeof(window) !== "undefined") {
        windowWidth = $( window ).width();
      }
      this.setState({ 
          windowWidth
      });
    }
  }

  componentWillUnmount = () => {
    let location = '/';
    if (typeof(window) !== "undefined") {
      const location = window.location.href;
    }
    const page = location.substring(location.lastIndexOf("/"), location.length);
    if (page === '/') {
      if (typeof(window) !== "undefined") {
        window.removeEventListener('scroll', this.handleScroll);
      }
    }
  }

  handleScroll = () => {
    if ($('#navbarD').css('display') === 'block') {
      var navbarTop = document.getElementById('navbarD').getBoundingClientRect().top;
    } else {
      var navbarTop = document.getElementById('navbarM').getBoundingClientRect().top;
    }
    if (navbarTop < -1 && this.state.fixed === 'none') {
      this.fixedTop();
    }
  }

  pageToTopD = () => {
    if (typeof(window) !== "undefined") {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
  }

  pageToTopM = () => {
    if (typeof(window) !== "undefined") {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
  }

  setLang = () => {
      const lang = this.props.lang === 'he' ? 'en' : 'he';
      this.props.setLanguage(lang);
      if (lang === 'he') {
        this.props.history.push(this.props.langLink);
        // initializeReactGA(`/${this.props.langLink}`);
      } else {
        this.props.history.push(this.props.langLinkEng);
        // initializeReactGA(`/${this.props.langLinkEng}`);
      }
      
  }


  render() {
    const langDir = this.props.lang === 'he' ? 'ltr' : 'rtl';
    return (
      <div className="container-fluid">
        
        <div id="fakeNav" className="fakeNav" />
        <Navbar id="navbarD" light className={`container-fluid navbar__shadow desktop`} expand="md" fixed={this.state.fixed} dir={this.langDir}>
          <div className={this.props.lang === 'he' ? 'container-fluid navbar__header__container' : 'container-fluid navbar__header__container__eng'} dir={this.props.lang === 'he' ? 'ltr' : 'rtl'}>
            <div className="container-fluid navbar__header">
              <NavbarBrand className={this.props.lang === 'he' ? 'navbar__brand' : 'navbar__brand__eng'} href="/">{this.props.lang === 'he' ? <div style={{marginTop: '-0.9vw', textAlign: 'right'}}>נאוה קיינר-פרסוב<br />אדריכלית ומתכננת ערים</div> : <div style={{marginTop: '-0.8vw', lineHeight: '140%'}}>Nava Kainer-Persov, PhD<br />Architect & Urban Planner</div>}</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
            </div>
          </div>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="navbar__nav" className={this.props.lang === 'he' ? 'ml-auto' : 'mr-auto'} navbar dir={this.props.lang === 'he' ? 'rtl' : 'ltr'}>
              
              
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/' : '/en'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'ראשי' : 'Home'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/מחקר' : '/research'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'מחקר' : 'Research'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/הוראה' : '/Teaching'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'הוראה' : 'Teaching'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/הרצאות' : '/Lectures'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'הרצאות' : 'Lectures'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/פרסומים' : '/Publication'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'פרסומים' : 'Publication'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/קורות_חיים' : '/CV'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'קו״ח' : 'CV'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/אודות' : '/About'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'אודות' : 'About'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/צרו_קשר' : '/Contact'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'צרו קשר' : 'Contact'}</NavLink>
              </NavItem>
              
              <NavItem>
                <div onClick={this.setLang} className="nav__link nav__link--padding-top" style={this.props.lang === 'he' ? {position: 'fixed', top: '2vw', left: '0'} : {position: 'fixed', top: '2vw', right: '0'}}>{this.props.lang === 'he' ? 'EN' : 'עב'}</div>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>








        <Navbar id="navbarM" light className={`container-fluid mobile`} expand="md" fixed={this.state.fixed}>
          <div className={this.props.lang === 'he' ? 'container-fluid navbar__header__container navbar__shadow' : 'container-fluid navbar__header__container__eng navbar__shadow'} dir={this.langDir}>
          
            <div
              className="container-fluid navbar__header__mobile"
              dir={this.langDir}
              style={
                this.props.lang === 'he' ?
                {
                  flexDirection: 'row'
                }
                :
                {
                  flexDirection: 'row-reverse'
                }
              }
            >
              <NavbarToggler className="navbar__toggler ml-auto" onClick={this.toggle} />
              <button className="nav__lang__mobile">
                <div onClick={this.setLang} className="navbar__lang">{this.props.lang === 'he' ? 'EN' : 'עב'}</div>
              </button>
              <button
                  className="nav__phone__mobile"
                  data-name="phone"
                  onClick={this.gotoPhone}
              >
                  <img className="nav__link__phone__mobile" src="/images/navigation/phone_mobile_white.png" alt="טלפון" />
              </button>
              <NavbarBrand className="navbar__brand" href="/">{this.props.lang === 'he' ? <div style={{marginTop: '-0.9vw', textAlign: 'right'}}>נאוה קיינר-פרסוב<br />אדריכלית ומתכננת ערים</div> : <div style={{marginTop: '-0.8vw', lineHeight: '140%'}}>Nava Kainer-Persov, PhD<br />Architect & Urban Planner</div>}</NavbarBrand>
              
            </div>
          </div>
          <Collapse className="navbar__collapse" isOpen={this.state.isOpen} navbar>
            <Nav className="navbar__nav" className="m-auto" navbar>
              <div className="nav__social__box">
                <img className="nav__social__seperator" src="/images/navigation/nav-social-seperator.png" alt="קו הפרדה" />
                <button
                    className="homepage__socialmedia-button mobile_inline"
                    onClick={this.gotoFacebook}
                >
                    <img className="nav__link__facebook__mobile" src="/images/navigation/facebook_mobile.svg" alt="פייסבוק" />
                </button>
                <button
                    className="homepage__socialmedia-button mobile_inline"
                    onClick={this.gotoInstagram}
                >
                    <img className="nav__link__instagram__mobile" src="/images/navigation/instagram_mobile.svg" alt="אינסטגרם" />
                </button>
                <button
                    className="homepage__socialmedia-button mobile_inline"
                    onClick={this.gotoMail}
                >
                    <img className="nav__link__mail__mobile" src="/images/navigation/mail_mobile.svg" alt="אימייל" />
                </button>
                <img className="nav__social__seperator" src="/images/navigation/nav-social-seperator.png" alt="קו הפרדה" />
              </div>
              
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/צרו_קשר' : '/Contact'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'צרו קשר' : 'Contact'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/אודות' : '/About'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'אודות' : 'About'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/קורות_חיים' : '/CV'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'קו״ח' : 'CV'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/פרסומים' : '/Publication'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'פרסומים' : 'Publication'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/הרצאות' : '/Lectures'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'הרצאות' : 'Lectures'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/הוראה' : '/Teaching'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'הוראה' : 'Teaching'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/מחקר' : '/Research'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'מחקר' : 'Research'}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={this.props.lang === 'he' ? '/' : '/en'} className={({ isActive }) => isActive ? "nav__link nav__link--padding-top is-active nav__link--active" : "nav__link nav__link--padding-top"}>{this.props.lang === 'he' ? 'ראשי' : 'Home'}</NavLink>
              </NavItem>
              
            </Nav>
          </Collapse>
        </Navbar>





      </div>



      
    );
  };
};

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid
});

const mapDispatchToProps = (dispatch) => ({
    setLanguage: (lang) => dispatch(setLanguage(lang))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));
