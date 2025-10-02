// @ts-nocheck
import React from 'react';
import isEqual from 'lodash.isequal';

const shouldHighLight = (org, update) => {
    if (isEqual(org, update)) {
        return 'edit__bg';
    } else {
        return 'edit__changed__bg';
    }
};

class EventsTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subcategoryId: '',
            subCategories: []
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(nextProps !== this.props) {
            this.setState({
                subcategoryId: nextProps.subcategoryId,
                subCategories: nextProps.subCategories
            });
            return true;
        } else {
            return true;
        }
        
    }

    componentDidMount = () => {
        this.setState({
            subcategoryId: this.props.subcategoryId,
            subCategories: this.props.subCategories
        });
    }

    render() {
        const dirLang = this.props.i18n.language === 'he' ? 'rtl' : 'ltr';
        return (
            <div className="events__tabs__box">
            
                <div className={this.props.i18n.language === 'he' ? 'events__tabs__box--right' : 'events__tabs__box--right events__tabs__box--right__eng'}>
                    
                    <div className={this.props.subCategoriesOrigin ? shouldHighLight(this.props.subCategoriesOrigin, this.state.subCategories) : ""}>
                    <div className="events__tabs__tabs__box" dir={dirLang}>
                        <button 
                            data-id=''
                            data-name=''
                            data-nameeng=''
                            className={this.state.subcategoryId === '' ? "events__tabs__button events__tabs__button--selected" : "events__tabs__button"} 
                            onClick={this.props.setSubcategoryId}
                        >
                            {this.props.i18n.language === 'he' ? 'הכל' : 'All'}
                        </button>
                        {
                            this.state.subCategories.length > 0 ?
                                this.state.subCategories.map((subCategory) => {
                                    if (this.props.isAuthenticated || subCategory.visible === true) {
                                        return  <button
                                                    key={subCategory.id}
                                                    data-id={subCategory.id}
                                                    data-name={subCategory.name}
                                                    data-nameeng={subCategory.nameEng}
                                                    className={this.props.subcategoryId === subCategory.id ? "events__tabs__button events__tabs__button--selected" : "events__tabs__button"}
                                                    onClick={this.props.setSubcategoryId}
                                                >
                                                    {this.props.i18n.language === 'he' ? subCategory.name : subCategory.nameEng}
                                                </button>
                                    }
                                         
                                })
                            :
                                null
                        }
                        {
                            this.props.isAuthenticated && this.props.isEditable ?
                                <div className="backoffice__events__tabs__buttons">
                                    <button className="backoffice__add__button" onClick={this.props.startAddNewSubcategory}>
                                        <img className="backoffice__add__icon" src="/images/eventspage/add-eventSubcategory-icon.svg" alt="הוספת תת קטגוריה" />
                                    </button>
                                    <button className="backoffice__edit__button" onClick={this.props.startEditSubcategory}>
                                        <img className="backoffice__edit__icon" src="/images/backoffice/edit.svg" alt="עריכה" />
                                    </button>
                                </div>
                            :
                                null
                        }
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EventsTabs;
