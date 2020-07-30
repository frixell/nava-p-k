import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import { createMemoryHistory } from 'history';
const createHistory = require("history").createBrowserHistory;
import ReactLoading from "react-loading";

let loadImage = "";
if (typeof(window) !== "undefined") {
    if (navigator.userAgent.toLowerCase().indexOf('msie') > -1 || navigator.userAgent.toLowerCase().indexOf('trident') > -1 || navigator.userAgent.toLowerCase().indexOf('edge') > -1 ){
        console.log("found");
        loadImage = <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><img src="/images/ie-preloader.gif" alt="נאוה קיינר-פרסוב Nava Kainer-Persov" /></div>;
    } else {
        loadImage = <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><ReactLoading type="spinningBubbles" color="#666665" /></div>;
    }
}

import AboutPage from '../containers/AboutPage';
import TeachingPage from '../containers/TeachingPage';
import CvPage from '../containers/CvPage';

import ContactPage from '../containers/ContactPage';
import HomePage from '../containers/HomePage';
import NotFoundPage from '../containers/NotFoundPage';
import LoginPage from '../components/LoginPage';
import PublicRoute from './PublicRoute';
import SigninPage from '../components/SigninPage';
import { connect } from 'react-redux';

export const history = typeof(window) !== "undefined" ? createHistory() : createMemoryHistory();

class AppRouter extends React.Component {
    render() {
        return (
            <Router history={history}>
                <div>
                    <Switch>
                        <Route path="/" render={(props) => ( <HomePage {...props} urlLang='he' />)} exact={true} />
                        <Route path="/עב" render={(props) => ( <HomePage {...props} urlLang='he' />)} exact={true} />
                        <Route path="/en" render={(props) => ( <HomePage {...props} urlLang='en' />)} exact={true} />
                        <Route path="/אודות" render={(props) => ( <AboutPage {...props} urlLang='he' />)} exact={true} />
                        <Route path="/About" render={(props) => ( <AboutPage {...props} urlLang='en' />)} exact={true} />
                        <Route path="/הוראה" render={(props) => ( <TeachingPage {...props} urlLang='he' />)} exact={true} />
                        <Route path="/Teaching" render={(props) => ( <TeachingPage {...props} urlLang='en' />)} exact={true} />
                        <Route path="/קורות_חיים" render={(props) => ( <CvPage {...props} urlLang='he' />)} exact={true} />
                        <Route path="/CV" render={(props) => ( <CvPage {...props} urlLang='en' />)} exact={true} />
                        <Route path="/צרו_קשר" component={ContactPage} exact={true} />
                        <Route path="/Contact" component={ContactPage} exact={true} />
                        <Route path="/signin" component={SigninPage} exact={true} />
                        <PublicRoute path="/login" component={LoginPage} exact={true} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </div>
            </Router>
        )
    }
};

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid
});

export default connect(mapStateToProps)(AppRouter);