import React from 'react';
import { useNavigate } from 'react-router-dom';
import AutosizeInput from 'react-input-autosize';
import IconHoverGrow from '../common/IconHoverGrow';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

const shouldHighLight = (org, update) => {
    if ( org === update ) {
        return 'edit__bg';
    } else {
        return 'edit__changed__bg';
    }
};

const HomePageEventsItem = (props) => {
    const navigate = useNavigate();
    const { t, i18n, event, index, name, action, homepage, onChange, uploadWidget, setIconRatioOn, setIconRatioOut, isAuthenticated } = props;
    const dirLang = i18n.language === 'he' ? 'rtl' : 'ltr';

    return (
        <div className="homepage__event-item-box align-text-center inline-block">
            {
                isAuthenticated === true ?
                    <div className="homepage__event-item-box--in">
                        <div className="homepage__event-item__header">
                            
                            <AutosizeInput
                                type="text"
                                data-name={name}
                                data-index={index}
                                data-field={i18n.language === 'he' ? 'eventHeader' : 'eventHeaderEng'}
                                data-action={action}
                                placeholder={t("eventHeaderPlaceholder")}
                                value={event[i18n.language === 'he' ? 'eventHeader' : 'eventHeaderEng']}
                                onChange={onChange}
                            />
                        </div>
                        
                        <button
                            data-name={name}
                            data-index={index}
                            data-field='eventImage'
                            data-action={action}
                            className="homepage__event-item__upload-button"
                        >
                            <img
                                data-name={name}
                                data-index={index}
                                data-field='eventImage'
                                data-action={action}
                                data-publicid={event.publicId}
                                onClick={uploadWidget}
                                className="homepage__event-item__upload-button__image"
                                src="/images/common/upload-image.svg"
                                alt="הוספת תמונה"
                            />
                        </button>
                        <img className="homepage__event-item__image" src={event.eventImage} alt={event[i18n.language === 'he' ? 'eventHeader' : 'eventHeaderEng']} />
                        <div className="homepage__event-item__more">
                            <button 
                                type='button'
                                className="homepage__event-item__button"
                                data-name="greenArrow"
                                onMouseEnter={setIconRatioOn}
                                onMouseLeave={setIconRatioOut}
                                onClick={() => navigate(homepage.events[index].eventLink)}
                            >
                                <p className="homepage__event-item__button__text Heebo-Regular" dir={dirLang}>{i18n.language === 'he' ? `לכל ה${event.eventHeader} >` : `All ${event.eventHeaderEng} >`}</p>
                                
                            </button> 
                        </div>
                        <input
                            type="text"
                            data-name={name}
                            data-index={index}
                            data-field='eventLink'
                            data-action={action}
                            placeholder={t("linkToPage")}
                            value={homepage.events[index][i18n.language === 'he' ? 'eventLink' : 'eventLinkEng']}
                            onChange={onChange}
                        />
                    </div>
                :
                    <div className="homepage__event-item__box__in cursor__hand" onClick={() => navigate(homepage.events[index].eventLink)}>
                        <div className="homepage__event-item__header">
                            <h3 className="Heebo-Medium homepage__event-item__header-text">{event[i18n.language === 'he' ? 'eventHeader' : 'eventHeaderEng']}</h3>
                        </div>
                        
                        <img className="homepage__event-item__image" src={event.eventImage} alt={event[i18n.language === 'he' ? 'eventHeader' : 'eventHeaderEng']} />
                        <div className="homepage__event-item__more">
                            
                                <button 
                                    type='button'
                                    className="homepage__event-item__button"
                                    data-name="greenArrow"
                                    onMouseEnter={setIconRatioOn}
                                    onMouseLeave={setIconRatioOut}
                                    
                                >
                                    <p className="homepage__event-item__button__text Heebo-Regular" dir={dirLang}>{i18n.language === 'he' ? `לכל ה${event.eventHeader} >` : `All ${event.eventHeaderEng} >`}</p>
                                </button> 
                            
                        </div>
                    </div>
            }
        </div>
    )
};

export default withTranslation()(HomePageEventsItem);