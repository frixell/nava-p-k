import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HomePageIntouchForm from './HomePageIntouchForm';
import { withTranslation } from 'react-i18next';
import { subscribeToNewsletter } from '../../actions/newsletter';


export class HomePageIntouch extends React.Component {
    onSubmit = (subscriber) => {
        this.props.subscribeToNewsletter(subscriber);
    };
    render() {
        const { t, i18n } = this.props;
        const dirLang = i18n.language === 'he' ? 'rtl' : 'ltr';
        return (
            <div className="homepage__intouch__box" dir={dirLang}>
                <p className="homepage__intouch__text Heebo-Medium" dir={dirLang}>{t("joinNewsletter")}</p>
                <HomePageIntouchForm
                    onSubmit={this.onSubmit}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    subscribeToNewsletter: (subscriber) => dispatch(subscribeToNewsletter(subscriber)),
});

export default connect(undefined, mapDispatchToProps)(withTranslation()(HomePageIntouch));