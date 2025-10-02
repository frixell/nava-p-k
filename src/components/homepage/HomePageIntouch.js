import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HomePageIntouchForm from './HomePageIntouchForm';
import { subscribeToNewsletter } from '../../actions/newsletter';


export class HomePageIntouch extends React.Component {
    onSubmit = (subscriber) => {
        this.props.subscribeToNewsletter(subscriber);
    };
    render() {
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (
            <div className="homepage__intouch__box" dir={dirLang}>
                <p className="homepage__intouch__text Heebo-Medium" dir={dirLang}>{this.context.t("joinNewsletter")}</p>
                <HomePageIntouchForm
                    onSubmit={this.onSubmit}
                />
            </div>
        );
    }
}

HomePageIntouch.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    subscribeToNewsletter: (subscriber) => dispatch(subscribeToNewsletter(subscriber)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageIntouch);