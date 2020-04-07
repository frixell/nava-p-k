import React from 'react';
import AutosizeInput from 'react-input-autosize';

const shouldHighLight = (org, update) => {
    //console.log('in highlight')
    if ( org === update ) {
        return 'events__header__input Heebo-Medium edit__bg';
    } else {
        return 'events__header__input Heebo-Medium edit__changed__bg';
    }
};

class EventsHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        //console.log(this.props.lang);
        return (
            <div className="events__header__box">
                { 
                    this.props.isAuthenticated === true ? 
                        <div className="backoffice__events__header__main__buttons">
                            <button className="backoffice__events__header__save__button" onClick={this.props.onUpdateCategory}>
                                <img className="backoffice__events__header__save__icon" src="/images/backoffice/save.svg" alt="שמירה" />
                            </button>
                        </div>
                    :
                        null
                }
                {
                    this.props.isAuthenticated === true ?
                        <h1 className="events__header Heebo-Regular" dir="rtl">{this.props.lang === 'he' ? this.props.categoryName : this.props.categoryNameEng}</h1>
                    :
                        <h1 className="events__header Heebo-Regular" dir="rtl">{this.props.lang === 'he' ? this.props.categoryName : this.props.categoryNameEng}</h1>
                }
                
            </div>
        );
    }
}

export default EventsHeader;




// <AutosizeInput
//                             className={shouldHighLight(this.props.categoryOrigin.name, this.props.categoryName)}
//                             name="name"
//                             data-name="name"
//                             data-index={this.props.categoryId}
//                             data-field='name'
//                             data-action={this.props.action}
//                             placeholder="שם קטגוריה"
//                             value={this.props.categoryName}
//                             onChange={this.props.onChange}
//                             dir="rtl"
//                         />