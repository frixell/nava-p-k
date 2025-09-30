import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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



class AppRouter extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<HomePage urlLang='he' />} />
                        <Route path="/עב" element={<HomePage urlLang='he' />} />
                        <Route path="/en" element={<HomePage urlLang='en' />} />
                        <Route path="/אודות" element={<AboutPage urlLang='he' />} />
                        <Route path="/About" element={<AboutPage urlLang='en' />} />
                        <Route path="/הוראה" element={<TeachingPage urlLang='he' />} />
                        <Route path="/Teaching" element={<TeachingPage urlLang='en' />} />
                        <Route path="/קורות_חיים" element={<CvPage urlLang='he' />} />
                        <Route path="/CV" element={<CvPage urlLang='en' />} />
                        <Route path="/צרו_קשר" element={<ContactPage />} />
                        <Route path="/Contact" element={<ContactPage />} />
                        <Route path="/signin" element={<SigninPage />} />
                        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </Router>
        )
    }
};

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid
});

export default connect(mapStateToProps)(AppRouter);