import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dirLang = this.props.i18n.language === 'he' ? 'rtl' : 'ltr';
        const { t } = this.props;

        const positionClassMap = {
            absolute: 'footer__box--absolute',
            relative: 'footer__box--relative',
            fixed: 'footer__box--fixed'
        };

        const positionModifier = this.props.position && positionClassMap[this.props.position]
            ? ` ${positionClassMap[this.props.position]}`
            : '';

        return (
            <div
                className={`footer__box${this.props.i18n.language === 'en' ? ' footer__box--en' : ' footer__box--he'}${positionModifier}`}
            >
                <p className="footer__text Heebo-Regular desktop" dir={dirLang}>
                    {t('allRightsReserved')} | {t('programmingBy')}
                </p>
                <p className="footer__text Heebo-Regular mobile" dir={dirLang}>
                    {t('allRightsReserved')} | {t('programmingBy')}
                </p>
            </div>
        )
    }
};



const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(withTranslation()(Footer));
