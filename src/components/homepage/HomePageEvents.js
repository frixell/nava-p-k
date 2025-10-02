import React from 'react';
import HomePageEventsItem from './HomePageEventsItem';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class HomePageEvents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ratio: 1
        }
    }
    render () {
        const { homepage, homepageOrigin } = this.props;
        const changedBorder = homepage.pleasedText !== homepageOrigin.pleasedText ? "edit__changed__bg" : "edit__bg";
        return (
            <div className="homepage__events__box align-text-center">
            
                <div className="homepage__events-header">
                    <h1 className="homepage__events-header__text Heebo-Medium" dir="rtl">{this.context.t("homepageEventsTitle")}</h1>
                </div>
                

                <div className="homepage__pleased__content-box mobile">
                    <div className="homepage__pleased__body">
                        {
                            this.props.isAuthenticated === true ?
                            <div className="homepage__pleased__content" dir={this.props.lang === 'he' ? 'rtl' : 'ltr'}>
                                <div className={changedBorder}>
                                    <textarea
                                        data-name='eventLink'
                                        data-action='setString'
                                        placeholder="טקסט ׳אודות׳"
                                        value={this.props.lang === 'he' ? homepage.pleasedText : homepage.pleasedTextEng}
                                        onChange={this.props.onChange}
                                    />
                                </div>
                            </div>
                            :
                            <div className="homepage__pleased__content" dir={this.props.lang === 'he' ? 'rtl' : 'ltr'}>
                                <textarea
                                    readOnly
                                    value={this.props.lang === 'he' ? homepage.pleasedText : homepage.pleasedTextEng}
                                />
                            </div>
                        }
                    </div>
                </div>



                <div className="homepage__events-structure" dir="rtl">
                    {
                        this.props.homepage.events ?
                        this.props.homepage.events.map((event,index) => {
                            return  <HomePageEventsItem
                                        key={`homepage-events-item-${index}`}
                                        event={event}
                                        name={this.props.name}
                                        {...this.props}
                                        index={index}
                                        action='setString'
                                        homepage={this.props.homepage}
                                        homepageOrigin={this.props.homepageOrigin}
                                        onChange={this.props.onChange}
                                        uploadWidget={this.props.uploadWidget}
                                        ratioGreenArrow={this.props.ratioGreenArrow}
                                        setIconRatioOn={this.props.setIconRatioOn}
                                        setIconRatioOut={this.props.setIconRatioOut} 
                                    />
                        })
                        :
                        null
                    }
                </div>
            </div>
        )
    }
}

HomePageEvents.contextTypes = {
  t: PropTypes.func.isRequired
}


const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

export default connect(mapStateToProps)(HomePageEvents);