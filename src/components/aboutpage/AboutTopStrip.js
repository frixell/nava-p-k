import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import Textarea from 'react-expanding-textarea';

class AboutTopStrip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 'auto',
            minHeight: 'auto',
            lang: ''
        }
    }

    componentDidMount = () => {
        this.setState({
            lang: this.props.lang
        });
    }

    render () {
        console.log('this.props.lang');
        console.log(this.props.lang);
        console.log(this.props.slogen)
        const { height } = this.state;
        const langDir = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (
            <div className="about__topstrip__box" dir={langDir}>
                
                <div className="about__topstrip__image__box">
                    <img className="about__topstrip__image" src="https://res.cloudinary.com/dewafmxth/image/upload/v1595499796/nave-kainer-persov_mu4jos.jpg" alt="נאוה קיינר - אודות" />
                </div>
                
            </div>
        )
    }
};

AboutTopStrip.contextTypes = {
    t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

export default connect(mapStateToProps)(AboutTopStrip);