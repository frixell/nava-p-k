import React from 'react';
import { connect } from 'react-redux';
import ContactMap from '../components/contactpage/ContactMap';
import ContactForm from '../components/contactpage/ContactForm';
import ContactFollow from '../components/contactpage/ContactFollow';
import ContactContact from '../components/contactpage/ContactContact';
import ContactStrip from '../components/contactpage/ContactStrip';
import CustomersStrip from '../components/common/CustomersStrip';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import { startSendMessage } from '../actions/messages';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

export class ContactPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const langDir = this.props.i18n.language === 'he' ? 'rtl' : 'ltr';
        return (
            <div className="container-fluid">
                <Navigation {...this.props} />
                <div className="contactpage__structure">
                    <div className="contactpage__container">
                       <ContactStrip lang={this.props.i18n.language} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    startSendMessage: (message) => dispatch(startSendMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ContactPage));