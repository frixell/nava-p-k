import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';

import { withTranslation } from 'react-i18next';

export class DifferentPage extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <Navigation {...this.props} />
                <div className="pagenotfound__structure">
                    <div className="pagenotfound__box">
                        <h3 className="events__header Heebo-Medium">קצת אחרת</h3>
                        <img className="events__seperator desktop" src="/images/eventspage/events-seperator.png" alt="קו הפרדה" />
                        <img className="events__seperator mobile" src="/images/eventspage/events-seperator-mobile.png" alt="קו הפרדה" />
                        <h3 className="events__header Heebo-Medium" style={{marginTop: '12rem', marginBottom: '12rem'}}>העמוד בבניה</h3>
                        <img className="events__seperator desktop" src="/images/eventspage/events-seperator.png" alt="קו הפרדה" />
                        <img className="events__seperator mobile" src="/images/eventspage/events-seperator-mobile.png" alt="קו הפרדה" />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default withTranslation()(DifferentPage);