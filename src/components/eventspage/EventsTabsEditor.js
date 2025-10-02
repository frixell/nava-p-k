import React from 'react';
import isEqual from 'lodash.isequal';
import Button from 'react-bootstrap/lib/Button';
import AutosizeInput from 'react-input-autosize';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const shouldHighLight = (org, update) => {
    if (isEqual(org, update)) {
        return 'edit__bg';
    } else {
        return 'edit__changed__bg';
    }
};

class EventsTabsEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log(this.props);
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (
            <div className="backoffice__edit__events__tabs__box" hidden={this.props.hideSubcategoriesEditPanel}>
            {

                this.props.subcategories && this.props.subcategories.length > 0 ?
                    
                    this.props.subcategories.map((subCategory, index) => {
                        //console.log(subCategory);
                        return  <div className="backoffice__edit__events__tabs__in__box" key={subCategory.id + index} dir={this.props.lang === 'he' ? 'rtl' : 'ltr'}>
                                    <Button
                                        id="btn-x"
                                        data-id={subCategory.id}
                                        data-index={subCategory.categories[this.props.category.id+'order']}
                                        data-showstatus={false}
                                        className="backoffice__events__tabs__remove btn-danger"
                                        onClick={this.props.toggleHookSubcategory}
                                    >
                                        X
                                    </Button>
                                    <Button
                                        id="btn-show"
                                        data-id={subCategory.id}
                                        data-visible={subCategory.visible === true ? false : true}
                                        className={`backoffice__events__tabs__remove${subCategory.visible === true ? ' btn-success' : ' btn-danger'}`}
                                        onClick={this.props.toggleShowSubcategory}
                                    >
                                        <img
                                            data-id={subCategory.id}
                                            data-visible={subCategory.visible === true ? false : true}
                                            className="backoffice__show__icon"
                                            src={`/images/backoffice/${subCategory.visible === true ? 'show' : 'hide'}.svg`}
                                            alt={subCategory.visible === true ? 'הצג' : 'הסתר'}
                                        />
                                    </Button>
                                    <div className="backoffice__events__tabs__order__box">
                                        <input
                                            id="number"
                                            data-id={subCategory.id}
                                            type="number"
                                            value={subCategory.categories[this.props.category.id+'order']}
                                            data-index={index}
                                            onChange={this.props.onSubcategoryOrderChange}
                                            onKeyPress={this.props.onSubcategoryOrderKeyPress}
                                            onBlur={this.props.onSubcategoryOrderBlur}
                                        />
                                    </div>
                                    <AutosizeInput
                                        key={index}
                                        data-id={subCategory.id}
                                        data-index={index}
                                        className="events__tabs__button"
                                        type="text"
                                        placeholder={this.props.lang === 'he' ? 'שם תת קטגוריה' : 'Subcategory name'}
                                        value={this.props.lang === 'he' ? this.props.subcategories[index].name : this.props.subcategories[index].nameEng}
                                        onChange={this.props.onSubcategoryNameChange}
                                        onBlur={this.props.onSubcategoryNameBlur}
                                    />
                                </div>
                    })
                    
                :
                    null
            }
            <div className="backoffice__events__tabs__update__box">
                <Button className="backoffice__events__tabs__update btn-success" onClick={this.props.updateSubcategories}>{this.context.t("update")}</Button>
            </div>
        </div>
        );
    }
}

EventsTabsEditor.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

export default connect(mapStateToProps)(EventsTabsEditor);