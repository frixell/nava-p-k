import React from 'react';
import $ from 'jquery';
import EventShareStrip from './EventShareStrip';
import EventNavigation from './EventNavigation';
import {getMobileRatio, getDesktopRatio} from '../../reusableFunctions/getRatio';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import AutosizeInput from 'react-input-autosize';
import Textarea from 'react-expanding-textarea';

import { withTranslation } from 'react-i18next';

const shouldHighLight = (org, update) => {
    if ( org === update ) {
        return 'width_100 edit__bg';
    } else {
        return 'width_100 edit__changed__bg';
    }
};

class EventHeader extends React.Component {
    
    state = {
        height: 'auto',
        minHeight: 'auto',
        eventName: '',
        eventNameEng: ''
    };

    toggle = () => {
        const { height, minHeight } = this.state;
        this.setState({
            height: 'auto',
        });
    };

    onHeightChange = (e) => {
        this.setHeight(e.target.value);
        this.props.onEventShowLinesChange(e);
    }

    setHeight = (showLines) => {
        let windowWidth = 1960;
        if (typeof(window) !== "undefined") {
            windowWidth = $(window).width();
        }
        let windowRatio = 100;
        let ratio = 2.2;
        let lineHeight = 22;
        if (windowWidth < 768) {
            ratio = getMobileRatio(windowWidth).ratio;
            lineHeight = getMobileRatio(windowWidth).lineHeight;
            this.setState({
                height: 'auto',
                minHeight: 'auto'
            });
        } else {
            ratio = getDesktopRatio(windowWidth);
            this.setState({
                height: 'auto',
                minHeight: 'auto',
                showLines: showLines
            });
        }
    }

    componentDidMount = () => {
        this.setHeight(this.props.showLines);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props.showLines !== prevProps.showLines) {
            this.setHeight(this.props.showLines);
        }
        if (this.props.eventName !== prevProps.eventName) {
            this.setState({
                eventName: this.props.eventName
            });
        }
    }

    render() {
        const { height } = this.state;
        const { i18n } = this.props;
        const dirLang = i18n.language === 'he' ? 'rtl' : 'ltr';
        console.log(this.props.eventText);
        console.log(i18n.language);
        return (
            <div className="event__header__box" dir={dirLang}>
                { 
                    this.props.isAuthenticated === true ? 
                        <div className="backoffice__events__header__buttons">
                            <button className="backoffice__events__header__save__button" onClick={this.props.onUpdateEvent}>
                                <img className="backoffice__events__header__save__icon" src="/images/backoffice/save.svg" alt="שמירה" />
                            </button>
                        </div>
                    :
                        null
                }

                <div className="event__header__content__box">

                    <EventNavigation 
                        currentURL={this.props.currentURL}
                        eventName={this.props.eventName}
                        navtoCategoryPage={this.props.navtoCategoryPage}
                        gotoNextEvent={this.props.gotoNextEvent}
                        gotoPrevEvent={this.props.gotoPrevEvent}
                        currentItems={this.props.currentItems}
                        closeEventModal={this.props.closeEventModal}
                    />

                    <div className="desktop">
                        <EventShareStrip 
                            style='desktop'
                            currentURL={this.props.currentURL}
                            eventName={this.props.eventName}
                            navtoCategoryPage={this.props.navtoCategoryPage}
                            gotoNextEvent={this.props.gotoNextEvent}
                            gotoPrevEvent={this.props.gotoPrevEvent}
                            currentItems={this.props.currentItems}
                        />
                    </div>

                    

                    <div className={i18n.language === 'he' ? `event__header__in__box` : `event__header__in__box event__header__in__box__eng`} dir={dirLang}>
                        
                        {
                            this.props.isAuthenticated === true ?
                                <div className={shouldHighLight(this.props.eventNameOrigin, this.props.eventName)}>
                                    <AutosizeInput
                                        className="event__header__input Heebo-Regular"
                                        name="name"
                                        data-name="name"
                                        data-index={this.props.categoryId}
                                        data-field='name'
                                        data-action={this.props.action}
                                        placeholder="שם הציור"
                                        value={i18n.language === 'he' ? this.props.eventName || this.state.eventNameEng : this.props.eventNameEng || this.state.eventNameEng}
                                        onChange={this.props.onEventNameChange}
                                        dir={dirLang}
                                    />
                                </div>
                            :
                                <h2 className="event__header Heebo-Regular">{i18n.language === 'he' ? this.props.eventName || this.state.eventNameEng : this.props.eventNameEng || this.state.eventNameEng}</h2>
                        }

                        <div className={i18n.language === 'he' ? `event__text__box` : `event__text__box event__text__box__eng`}>
                            <AnimateHeight
                            duration={ 500 }
                            height={ 'auto' }>
                                { 
                                    this.props.isAuthenticated === true ? 
                                        <div className={shouldHighLight(this.props.eventTextOrigin, this.props.eventText)}>
                                            <Textarea
                                                className="events__text Heebo-Regular"
                                                value={i18n.language === 'he' ? this.props.eventText : this.props.eventTextEng}
                                                data-field="text"
                                                data-action='setString'
                                                data-name={`item${this.props.index}`}
                                                data-index={this.props.index}
                                                placeholder="תוכן"
                                                onChange={ this.props.onEventTextChange }
                                                dir={i18n.language === 'he' ? "rtl" : "ltr"}
                                            />
                                        </div>
                                    :
                                        <Textarea
                                            className="events__text Heebo-Regular"
                                            value={this.props.eventText}
                                            dir={i18n.language === 'he' ? "rtl" : "ltr"}
                                            readOnly
                                        />
                                }           
                            </AnimateHeight>
                        </div>

                    </div>

                    
                    
                </div>
                    

                <div className="event__header__image__box">
                    <img className="event__header__image" src={this.props.eventImage} />
                </div>

                <div className="mobile">
                    <EventShareStrip 
                        style='mobile'
                        currentURL={this.props.currentURL}
                        eventName={this.props.eventName}
                        navtoCategoryPage={this.props.navtoCategoryPage}
                        gotoNextEvent={this.props.gotoNextEvent}
                        gotoPrevEvent={this.props.gotoPrevEvent}
                        currentItems={this.props.currentItems}
                    />
                </div>
            </div>
        );
    }
}

export default withTranslation()(EventHeader);