import React from 'react';
import EventsEvent from './EventsEvent';
import isEqual from 'lodash.isequal';

const shouldHighLight = (org, update) => {
    if (isEqual(org, update)) {
        
        return 'edit__bg';
    } else {
        return 'edit__changed__bg';
    }
};

const EventsEvents = (props) => (
    <div className={`${props.lang === 'he' ? 'events__events__box' : 'events__events__box events__events__box__noflex'} ${shouldHighLight(props.itemsCurrentOrigin, props.itemsCurrentCheck)}`}>
        { 
            props.isAuthenticated === true && props.oneLine !== true ? 
                <div className={props.backofficeSaveButtonClassName}>
                    {
                        props.subcategoryId !== '' ?
                            <button className="backoffice__events__events__add__button" onClick={props.startAddNewItem}>
                                <img className="backoffice__events__events__add__icon" src="/images/eventspage/add-eventSubcategory-icon.svg" alt="הוספת אירוע" />
                            </button>
                        :
                            null
                    }
                    <button className="backoffice__events__events__save__button" onClick={props.updateItems}>
                        <img className="backoffice__events__events__save__icon" src="/images/backoffice/save.svg" alt="שמירה" />
                    </button>
                </div>
            :
                null
        }
        
        { props.oneLine === true ? 
                <div className="events__events__oneline__header__box">
                    <img className="events__seperator mobile" src="/images/eventspage/events-seperator-mobile.png" alt="קו הפרדה" />
                    <p className="events__events__oneline__more Heebo-Medium">לאירועים נוספים</p>
                    <div className="common__intouch__seperator__box__desktop desktop">
                        <div className="common__intouch__seperator__desktop desktop"></div>
                    </div>
                    <img className="events__seperator mobile" src="/images/eventspage/events-seperator-mobile.png" alt="קו הפרדה" />
                    <h3 className="events__events__oneline__header Heebo-Regular">{props.subcategoryName}</h3>
                </div>
            :
                null
        }
        {
            props.itemsCurrent.map((item, index) => {
                return <EventsEvent
                            isAuthenticated={props.isAuthenticated}
                            itemsCurrent={props.itemsCurrent}
                            key={item.id}
                            id={item.id}
                            index={index}
                            item={item}
                            visible={item.visible}
                            categoryIndex={item.categories[props.categoryId+'order']}
                            order={item.subcategories[props.subcategoryId+'order']}
                            categoryId={props.categoryId}
                            subcategoryId={props.subcategoryId}
                            categoryName={props.categoryName}
                            categoryNameEng={props.categoryNameEng}
                            subcategoryName={props.subcategoryName}
                            subcategoryNameEng={props.subcategoryNameEng}
                            categoryName={props.categoryName}
                            eventName={props.eventName}
                            image={item.image}
                            title={item.name}
                            titleEng={item.nameEng}
                            text={item.text}
                            textEng={item.textEng}
                            categories={item.categories}
                            subcategories={item.subcategories}
                            uploadWidget={props.uploadWidget}
                            onRollOver={props.onRollOver}
                            oneLine={props.oneLine}
                            onItemOrderChange={props.onItemOrderChange}
                            onItemOrderKeyPress={props.onItemOrderKeyPress}
                            onItemOrderBlur={props.onItemOrderBlur}
                            toggleShowItem={props.toggleShowItem}
                            toggleHookEvent={props.toggleHookEvent}
                            onInfoToggleOpen={props.onInfoToggleOpen}
                            lang={props.lang}
                        />
            })
        }
        { props.oneLine === true ? 
                <div className="events__events__oneline__header__box">
                    <button 
                        type='button'
                        className="events__eventshare__button"
                        data-name="greenArrow"
                        onMouseEnter={props.setIconRatioOn}
                        onMouseLeave={props.setIconRatioOut}
                        onClick={props.navtoCategoryPage}
                    >
                        <img className="events__eventshare__more__button__image" src="/images/aboutpage/arrowBlack.svg" alt="גלו עוד" />
                        <p className="events__eventshare__more__button__text Heebo-Regular">גלו עוד</p>
                        
                    </button> 
                    <div className="common__intouch__seperator__box__desktop desktop">
                        <div className="common__intouch__seperator__desktop desktop"></div>
                    </div>
                    <img className="events__seperator mobile" src="/images/eventspage/events-seperator-mobile.png" alt="קו הפרדה" />
                </div>
            :
                null
        }
    </div>
);

export default EventsEvents;