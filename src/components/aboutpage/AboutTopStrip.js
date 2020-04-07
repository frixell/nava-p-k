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
        console.log(this.props.lang);
        console.log(this.props.slogen)
        const { height } = this.state;
        const langDir = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (
            <div>
                <div className="homepage__events-header">
                    <h1 className="homepage__events-header__text Heebo-Medium" dir={langDir}>{this.context.t("homepageEventsTitle")}</h1>
                </div>
                <div className="about__topstrip__box" dir={langDir}>
                    
                    { this.props.slogen && this.state.lang ?
                        <div className='desktop'>
                            <AnimateHeight
                                duration={ 500 }
                                height={ height }>
                                    { 
                                        <Textarea
                                            className={`about__topstrip__slogen${this.props.lang === 'he' ? '' : ' about__topstrip__slogen__eng'}`}
                                            dir={langDir}
                                            data-field={this.props.lang === 'he' ? 'text' : 'textEng'}
                                            data-action='setString'
                                            data-index={this.props.index}
                                            placeholder="תוכן"
                                            value={this.props.lang === 'he' ? this.props.slogen.text : this.props.slogen.textEng}
                                            onChange={ this.props.setData }
                                        />
                                    }
                    
                            </AnimateHeight>
                        </div>
                    :
                        null

                    }
                    
                    <img className="about__topstrip__image" src="https://res.cloudinary.com/dz7woxmn2/image/upload/v1538493472/about-top.jpg" alt="זיוה קיינר - אמנית - אודות - רקע" />
                    
                    { this.props.slogen && this.state.lang ?
                        <div className='mobile'>
                            <AnimateHeight
                                duration={ 500 }
                                height={ height }>
                                    { 
                                        <Textarea
                                            className={`about__topstrip__slogen${this.props.lang === 'he' ? '' : ' about__topstrip__slogen__eng'}`}
                                            dir={langDir}
                                            data-field={this.props.lang === 'he' ? 'text' : 'textEng'}
                                            data-action='setString'
                                            data-index={this.props.index}
                                            placeholder="תוכן"
                                            value={this.props.lang === 'he' ? this.props.slogen.text : this.props.slogen.textEng}
                                            onChange={ this.props.setData }
                                        />
                                    }
                    
                            </AnimateHeight>
                        </div>
                    :
                        null

                    }
                </div>
                
                
                
            </div>
        )
    }
};

AboutTopStrip.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    aang: state.i18nState.lang
});

export default connect(mapStateToProps)(AboutTopStrip);