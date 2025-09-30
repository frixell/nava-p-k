import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

class ContactContact extends React.Component {
    constructor(props) {
        super(props);
    }

    gotoFacebook = () => {
        console.log('in facebook');
        if (typeof(window) !== "undefined") {
            window.open('https://www.facebook.com/profile.php?id=100010955083493');
        }
    }
    gotoInstagram = () => {
        if (typeof(window) !== "undefined") {
            window.open('https://www.instagram.com/nava_persov_kainer/');
        }
    }

    gotoMail = () => {
        if (typeof(window) !== "undefined") {
            window.location = 'mailto:nava-p-k@gmail.com';
        }
    }
    gotoPhone = () => {
        if (typeof(window) !== "undefined") {
            window.location = 'tel:+972505966599';
        }
    }

    render() {
        //console.log(this.props.event);
        const { i18n } = this.props;
        const dirLang = i18n.language === 'he' ? 'rtl' : 'ltr';
        return (

            <div className={i18n.language === 'he' ? `contact__contact__box--${this.props.style}` : `contact__contact__box--${this.props.style} contact__contact__box__eng--${this.props.style}`}>
                
                <div className={`contact__contact__text__line--${this.props.style}`} dir={dirLang} onClick={this.gotoPhone}>
                    <p className={`contact__contact__text--${this.props.style} Heebo-Regular`} dir='ltr'>+972505966599</p>
                </div>

                <div className={`contact__contact__text__line--${this.props.style}`} dir={dirLang} onClick={this.gotoMail}>
                    <p className={`contact__contact__text--${this.props.style} Heebo-Regular`} dir={dirLang}>nava-p-k@gmail.com</p>
                </div>

                

                <div className={`contact__follow__icon__box--${this.props.style}`} onClick={this.gotoFacebook}>
                    <div className={`contact__follow__facebook__icon--${this.props.style}`} />
                </div>

            </div>
        )
    }
};

export default withTranslation()(ContactContact);



// <div className={`contact__follow__icon__box--${this.props.style}`} onClick={this.gotoInstagram}>
//                     <div className={`contact__follow__instagram__icon--${this.props.style}`} />
//                 </div>