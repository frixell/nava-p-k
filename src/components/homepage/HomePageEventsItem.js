import React from 'react';
import AutosizeInput from 'react-input-autosize';
import IconHoverGrow from '../common/IconHoverGrow';
import { connect } from 'react-redux';
import { withRouter } from "../../routers/withRouter";
import PropTypes from 'prop-types';

const shouldHighLight = (org, update) => {
    if ( org === update ) {
        return 'edit__bg';
    } else {
        return 'edit__changed__bg';
    }
};


class HomePageEventsItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log(this.props.event);
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (

            <div className="homepage__event-item-box align-text-center inline-block">
                {
                    this.props.isAuthenticated === true ?
                        <div className="homepage__event-item-box--in">
                            <div className="homepage__event-item__header">
                                
                                <AutosizeInput
                                    type="text"
                                    data-name={this.props.name}
                                    data-index={this.props.index}
                                    data-field={this.props.lang === 'he' ? 'eventHeader' : 'eventHeaderEng'}
                                    data-action={this.props.action}
                                    placeholder={this.context.t("eventHeaderPlaceholder")}
                                    value={this.props.event[this.props.lang === 'he' ? 'eventHeader' : 'eventHeaderEng']}
                                    onChange={this.props.onChange}
                                />
                            </div>
                            
                            <button
                                data-name={this.props.name}
                                data-index={this.props.index}
                                data-field='eventImage'
                                data-action={this.props.action}
                                className="homepage__event-item__upload-button"
                            >
                                <img
                                    data-name={this.props.name}
                                    data-index={this.props.index}
                                    data-field='eventImage'
                                    data-action={this.props.action}
                                    data-publicid={this.props.event.publicId}
                                    onClick={this.props.uploadWidget}
                                    className="homepage__event-item__upload-button__image"
                                    src="/images/common/upload-image.svg"
                                    alt="הוספת תמונה"
                                />
                            </button>
                            <img className="homepage__event-item__image" src={this.props.event.eventImage} alt={this.props.event[this.props.lang === 'he' ? 'eventHeader' : 'eventHeaderEng']} />
                            <div className="homepage__event-item__more">
                                <button
                                    type='button'
                                    className="homepage__event-item__button"
                                    data-name="greenArrow"
                                    onMouseEnter={this.props.setIconRatioOn}
                                    onMouseLeave={this.props.setIconRatioOut}
                                    onClick={() => { this.props.history.push(this.props.homepage.events[this.props.index].eventLink) }}
                                >
                                    <p className="homepage__event-item__button__text Heebo-Regular" dir={dirLang}>{this.props.lang === 'he' ? `לכל ה${this.props.event.eventHeader} >` : `All ${this.props.event.eventHeaderEng} >`}</p>
                                </button>
                            </div>
                            <input
                                type="text"
                                data-name={this.props.name}
                                data-index={this.props.index}
                                data-field='eventLink'
                                data-action={this.props.action}
                                placeholder={this.context.t("linkToPage")}
                                value={this.props.homepage.events[this.props.index][this.props.lang === 'he' ? 'eventLink' : 'eventLinkEng']}
                                onChange={this.props.onChange}
                            />
                        </div>
                    :
                        <div className="homepage__event-item__box__in cursor__hand" onClick={() => { this.props.history.push(this.props.homepage.events[this.props.index].eventLink) }}>
                            <div className="homepage__event-item__header">
                                <h3 className="Heebo-Medium homepage__event-item__header-text">{this.props.event[this.props.lang === 'he' ? 'eventHeader' : 'eventHeaderEng']}</h3>
                            </div>
                            
                            <img className="homepage__event-item__image" src={this.props.event.eventImage} alt={this.props.event[this.props.lang === 'he' ? 'eventHeader' : 'eventHeaderEng']} />
                            <div className="homepage__event-item__more">
                                
                                    <button 
                                        type='button'
                                        className="homepage__event-item__button"
                                        data-name="greenArrow"
                                        onMouseEnter={this.props.setIconRatioOn}
                                        onMouseLeave={this.props.setIconRatioOut}
                                        
                                    >
                                        <p className="homepage__event-item__button__text Heebo-Regular" dir={dirLang}>{this.props.lang === 'he' ? `לכל ה${this.props.event.eventHeader} >` : `All ${this.props.event.eventHeaderEng} >`}</p>
                                    </button> 
                                
                            </div>
                        </div>
                }
            </div>
        )
    }
};


HomePageEventsItem.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

export default withRouter(connect(mapStateToProps)(HomePageEventsItem));