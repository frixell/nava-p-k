import React from 'react';
import HomePageIntouch from '../homepage/HomePageIntouch';
import { connect } from 'react-redux';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    getTranslation(key) {
        // Simple translation function based on language
        const translations = {
            he: {
                allRightsReserved: "כל הזכויות שמורות",
                programmingBy: "תכנות על ידי"
            },
            en: {
                allRightsReserved: "All rights reserved",
                programmingBy: "Programming by"
            }
        };

        const lang = this.props.lang || 'he';
        return translations[lang][key] || key;
    }

    render() {
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (

            <div
                className={`footer__box${this.props.lang === 'en' ? ' footer__box--en' : ' footer__box--he'}`}
                style={{position: this.props.position}}
            >
                {/*<HomePageIntouch />*/}
                <p className="footer__text Heebo-Regular desktop" dir={dirLang}>
                    {this.getTranslation("allRightsReserved")} | {this.getTranslation("programmingBy")}
                </p>
                <p className="footer__text Heebo-Regular mobile" dir={dirLang}>
                    {this.getTranslation("allRightsReserved")} | {this.getTranslation("programmingBy")}
                </p>
            </div>
        )
    }
};

export default Footer;