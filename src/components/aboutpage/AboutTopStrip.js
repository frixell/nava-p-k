import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
        const langDir = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (
            <div className="about__topstrip__box" dir={langDir}>
                { 
                    this.props.isAuthenticated === true ? 
                        <div
                            className="backoffice__toolbar__buttons backoffice__toolbar__buttons--save-project"
                            style={
                                this.props.lang === 'en' ? 
                                    {
                                        width: '5rem',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        top: '17.4rem',
                                        left: '88%',
                                        background: 'black'
                                    } 
                                : 
                                    {
                                        width: '5rem',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        top: '17.4rem',
                                        left: '12%',
                                        background: 'black'
                                    }
                                }
                        >
                            <div className="backoffice__toolbar__label" style={{width: '5rem', color: this.state.needSave ? 'red' : 'aqua'}}>
                                {this.props.lang === 'en' ? 'Image' : 'תמונה'}
                            </div>
                            <button
                                className="backoffice_button"
                                onClick={this.props.uploadWidget}
                            >
                                <img
                                    className="backoffice__events__events__add__icon"
                                    src="/images/eventspage/add-eventSubcategory-icon.svg"
                                    alt="תמונה"
                                />
                            </button>
                        </div>
                    :
                        null
                }
                <div className="about__topstrip__image__box">
                    <img
                        width={this.props.image.width}
                        className="about__topstrip__image"
                        src={this.props.image.src}
                        alt="נאוה קיינר - אודות"
                    />
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