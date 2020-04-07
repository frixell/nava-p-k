import React from 'react';
import { connect } from 'react-redux';
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
            <div className={this.props.lang === 'he' ? 'container-fluid contactstrip__box' : 'container-fluid contactstrip__box contactstrip__box__eng'} dir={this.props.lang === 'he' ? 'ltr' : 'rtl'}>
                <ContactMap
                    style='strip'
                    lang={this.props.lang}
                />
                <ContactForm
                    style='strip'
                    lang={this.props.lang}
                    onSubmit={this.onSubmit}
                />
                <ContactContact
                    style='strip'
                    lang={this.props.lang}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    startSendMessage: (message) => dispatch(startSendMessage(message))
});

export default connect(undefined, mapDispatchToProps)(ContactStrip);