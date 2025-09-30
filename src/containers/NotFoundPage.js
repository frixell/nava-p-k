import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import ContactStrip from '../components/contactpage/ContactStrip';
import { withTranslation } from 'react-i18next';

const NotFoundPage = (props) => {
    const navigate = useNavigate();
    const { i18n } = props;
    const langLink = '/לא_נמצא';
    const langLinkEng = '/not_found';

    return (
        <div className="container-fluid">
            <Navigation 
                {...props}
                langLink={langLink}
                langLinkEng={langLinkEng}
            />
            <div className="pagenotfound__structure">
                <div className="pagenotfound__box">
                    <div className="pagenotfound__gray__bg"></div>
                    <h1 className="pagenotfound__goback__button__superheader Heebo-Medium">404</h1>
                    <h2 className="pagenotfound__goback__button__header Heebo-Medium">העמוד לא נמצא</h2>
                    <div className="pagenotfound__goback" dir="rtl">
                        <button 
                            type='button'
                            className="pagenotfound__goback__button"
                            onClick={() => navigate("/")}
                        >
                            <p className="pagenotfound__goback__button__text Heebo-Medium">בחזרה לאתר</p>
                        </button> 
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default withTranslation()(NotFoundPage);