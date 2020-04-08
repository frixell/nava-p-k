import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { createMemoryHistory } from 'history';
import ReactLoading from "react-loading";

let loadImage = "";
if (typeof(window) !== "undefined") {
    if (navigator.userAgent.toLowerCase().indexOf('msie') > -1 || navigator.userAgent.toLowerCase().indexOf('trident') > -1 || navigator.userAgent.toLowerCase().indexOf('edge') > -1 ){
        console.log("found");
        loadImage = <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><img src="/images/ie-preloader.gif" alt="נאוה פרסוב קיינר nava persov kainer" /></div>;
    } else {
        loadImage = <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><ReactLoading type="spinningBubbles" color="#666665" /></div>;
    }
}

import AboutPage from '../containers/AboutPage';
import ContactPage from '../containers/ContactPage';
import DifferentPage from '../containers/DifferentPage';
import EventsPage from '../containers/EventsPage';
import EventPage from '../containers/EventPage';
import HomePage from '../containers/HomePage';
import WorkshopPage from '../containers/WorkshopPage';
import NotFoundPage from '../containers/NotFoundPage';
import LoginPage from '../components/LoginPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import SigninPage from '../components/SigninPage';
import { connect } from 'react-redux';
import { stringReplace } from '../reusableFunctions/stringReplace';

export const history = typeof(window) !== "undefined" ? createHistory() : createMemoryHistory();

class AppRouter extends React.Component {
    render() {
        return (
            <Router history={history}>
                <div>
                    {
                        this.props.events.categories ?
                        <Switch>
                            <Route path="/" render={(props) => ( <HomePage {...props} />)} exact={true} />
                            <Route path="/עב" render={(props) => ( <HomePage {...props} urlLang='he' />)} exact={true} />
                            <Route path="/en" render={(props) => ( <HomePage {...props} urlLang='en' />)} exact={true} />
                            <Route path="/אודות" render={(props) => ( <AboutPage {...props} urlLang='he' />)} exact={true} />
                            <Route path="/about" render={(props) => ( <AboutPage {...props} urlLang='en' />)} exact={true} />
                            <Route path="/צרו_קשר" component={ContactPage} exact={true} />
                            <Route path="/contact" component={ContactPage} exact={true} />
                            {
                                this.props.events.categories.map((category, index) => {
                                    return <Route path={`/${stringReplace(category.name, '_', ' ')}`} key={category.id} render={(props) => ( <EventsPage {...props} urlLang='he' category={category} categoryIndex={index} />)} exact={true} />;
                                })
                            }
                            {
                                this.props.events.categories.map((category, index) => {
                                    return <Route path={`/${stringReplace(category.nameEng, '_', ' ')}`} key={category.id} render={(props) => ( <EventsPage {...props} urlLang='en' category={category} categoryIndex={index} />)} exact={true} />;
                                })
                            }
                            {
                                this.props.events.categories.map((category, index) => {
                                    
                                    return <Route
                                                path={`/:subcategory/${stringReplace(category.name, '_', ' ')}`}
                                                key={category.id}
                                                render={(props) => ( <EventsPage {...props} urlLang='he' category={category} categoryIndex={index} />)}
                                                exact={true}
                                            />;
                                    
                                })
                            }
                            {
                                this.props.events.categories.map((category, index) => {
                                    
                                    return <Route
                                                path={`/${stringReplace(category.nameEng, '_', ' ')}/:subcategory`}
                                                key={category.id}
                                                render={(props) => ( <EventsPage {...props} urlLang='en' category={category} categoryIndex={index} />)}
                                                exact={true}
                                            />;
                                    
                                })
                            }
                            {
                                this.props.events.categories.map((category, index) => {
                                    //this.props.events.allSubCategories.map((subcategory, index) => {
                                        return <Route
                                                    path={`/:event/:subcategory/${stringReplace(category.name, '_', ' ')}`}
                                                    key={category.id}
                                                    render={(props) => ( <EventsPage {...props} urlLang='he' category={category} categoryIndex={index} categoryName={category.name} categoryId={category.id} />)}
                                                    exact={true}
                                                />;
                                    //})
                                })
                            }
                            {
                                this.props.events.categories.map((category, index) => {
                                    //this.props.events.allSubCategories.map((subcategory, index) => {
                                        return <Route
                                                    path={`/${stringReplace(category.nameEng, '_', ' ')}/:subcategory/:event`}
                                                    key={category.id}
                                                    render={(props) => ( <EventsPage {...props} urlLang='en' category={category} categoryIndex={index} categoryName={category.name} categoryId={category.id} />)}
                                                    exact={true}
                                                />;
                                    //})
                                })
                            }
                            <Route path="/signin" component={SigninPage} exact={true} />
                            <PublicRoute path="/login" component={LoginPage} exact={true} />
                            <Route path="/סדנאות" render={(props) => ( <WorkshopPage {...props} urlLang='he' />)} exact={true} />
                            <Route path="/workshops" render={(props) => ( <WorkshopPage {...props} urlLang='en' />)} exact={true} />
                            <Route component={NotFoundPage} />
                        </Switch>
                        :
                            null
                        }   
                </div>
            </Router>
        )
    }
};

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    events: state.eventspage
});

export default connect(mapStateToProps)(AppRouter);