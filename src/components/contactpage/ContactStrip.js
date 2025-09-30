import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ContactMap from './ContactMap';
import ContactForm from './ContactForm';
import ContactFollow from './ContactFollow';
import ContactContact from './ContactContact';
import { startSendMessage } from '../../actions/messages';

export class ContactStrip extends React.Component {
    onSubmit = (userMessage) => {
        this.props.startSendMessage(userMessage);
    };
    render() {
        return (
            <div className={this.props.i18n.language === 'he' ? 'container-fluid contactstrip__box' : 'container-fluid contactstrip__box contactstrip__box__eng'} dir={this.props.i18n.language === 'he' ? 'ltr' : 'rtl'}>
                
                <ContactForm
                    style='strip'
                    lang={this.props.i18n.language}
                    onSubmit={this.onSubmit}
                />
                <ContactContact
                    style='strip'
                    lang={this.props.i18n.language}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    startSendMessage: (message) => dispatch(startSendMessage(message))
});

export default connect(undefined, mapDispatchToProps)(withTranslation()(ContactStrip));

// <ContactMap
//                     style='strip'
//                     lang={this.props.i18n.language}
//                 />