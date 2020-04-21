import React from 'react';
import HomePageIntouch from '../homepage/HomePageIntouch';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (

            <div className={`footer__box${this.props.lang === 'en' ? ' footer__box--en' : ' footer__box--he'}`}>
                {/*<HomePageIntouch />*/}
                <p className="footer__text Heebo-Regular desktop" dir={dirLang}>
                    {this.context.t("allRightsReserved")} | {this.context.t("programmingBy")}
                </p>
                <p className="footer__text Heebo-Regular mobile" dir={dirLang}>
                    {this.context.t("allRightsReserved")} | {this.context.t("programmingBy")}
                </p>
            </div>
        )
    }
};

Footer.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

export default connect(mapStateToProps)(Footer);