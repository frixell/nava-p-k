import React from 'react';
import { Route } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import ContactStrip from '../components/contactpage/ContactStrip';
import { connect } from 'react-redux';

class NotFoundPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            langLink: '/לא_נמצא',
            langLinkEng: '/not_found'
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <Navigation 
                    {...this.props}
                    langLink={this.state.langLink}
                    langLinkEng={this.state.langLinkEng}
                />
                <div className="pagenotfound__structure">
                    <div className="pagenotfound__box">
                        <div className="pagenotfound__gray__bg"></div>
                        <h1 className="pagenotfound__goback__button__superheader Heebo-Medium">404</h1>
                        <h2 className="pagenotfound__goback__button__header Heebo-Medium">העמוד לא נמצא</h2>
                        <div className="pagenotfound__goback" dir="rtl">
                            <Route render={({ history}) => (
                                <button 
                                    type='button'
                                    className="pagenotfound__goback__button"
                                    onClick={() => { history.push("/") }}
                                >
                                    <p className="pagenotfound__goback__button__text Heebo-Medium">בחזרה לאתר</p>
                                </button> 
                            )} />
                        </div>
                    </div>
                </div>
                <ContactStrip lang={this.props.lang} />
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

export default connect(mapStateToProps)(NotFoundPage); 


                                    // data-name="greenArrow"
                                    // onMouseEnter={props.setIconRatioOn}
                                    // onMouseLeave={props.setIconRatioOut}