import React from 'react';
import { Route } from 'react-router-dom';
//import { Button } from "react-bootstrap";
import Button from 'react-bootstrap/lib/Button';
import UploadImageButton from '../common/UploadImageButton';
import { stringReplace } from '../../reusableFunctions/stringReplace';


class EventsEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false,
            infoOver: '',
            shopOver: '',
            order: 0
        }
    }
    onMouseEnter = () => {
        const hover = true;
        this.setState(() => ({ hover }));
    };

    onMouseLeave = () => {
        const hover = false;
        this.setState(() => ({ hover }));
    };

    onShopEnter = () => {
        const shopOver = '-over';
        this.setState(() => ({ shopOver }));
    };

    onShopLeave = () => {
        const shopOver = '';
        this.setState(() => ({ shopOver }));
    };

    onInfoEnter = () => {
        const infoOver = '-over';
        this.setState(() => ({ infoOver }));
    };

    onInfoLeave = () => {
        const infoOver = '';
        this.setState(() => ({ infoOver }));
    };

    componentDidMount = () => {
        const items = this.props.itemsCurrent;
        items.map((item,index) => {
            if (item.id === this.props.itemId) {

            }
        })
    }

    render() {
        
        let categoryLink = 'הכל';
        if (this.props.subcategoryName !== '' && this.props.subcategoryName !== undefined) {
            categoryLink = this.props.subcategoryName;
        }
        return (
            <div 
                hidden={(this.props.subcategories[this.props.subcategoryId] !== true && this.props.subcategoryId !== '') || (this.props.isAuthenticated !== true && this.props.visible !== true)} 
                className={`events__event__box${ this.props.oneLine === true ? ' events__event__box--event' : ''}`} 
                onMouseEnter={this.props.onRollOver}
                data-id={this.props.id} 
                data-title={this.props.title}
                data-text={this.props.text}
                data-image={this.props.image}
                data-subcategoryid={this.props.subcategoryId}
                data-categoryid={this.props.categoryId}
                data-currentitems={this.props.itemsCurrent}
                onClick={!this.props.isAuthenticated ? this.props.onInfoToggleOpen : null}
                dir="rtl"
            >
                {   
                    this.props.isAuthenticated && this.props.subcategoryId !== '' ?

                        <div className="backoffice__events__event__box">
                            <Button
                                id="btn-x"
                                data-id={this.props.id}
                                data-order={this.props.order}
                                data-showstatus={false}
                                className="backoffice__events__event__remove btn-danger"
                                onClick={this.props.toggleHookEvent}
                            >
                                X
                            </Button>
                            <Button
                                id="btn-show"
                                data-id={this.props.id}
                                data-visible={this.props.visible === true ? false : true}
                                className={`backoffice__events__event__remove${this.props.visible === true ? ' btn-success' : ' btn-danger'}`}
                                onClick={this.props.toggleShowItem}
                            >
                                <img
                                    data-id={this.props.id}
                                    data-visible={this.props.visible === true ? false : true}
                                    className="backoffice__show__icon"
                                    src={`/images/backoffice/${this.props.visible === true ? 'show' : 'hide'}.svg`}
                                    alt={this.props.visible === true ? 'הצג' : 'הסתר'} 
                                />
                            </Button>
                            <div className="backoffice__item__order__box">
                                <input
                                    id="number"
                                    data-id={this.props.id}
                                    data-categoryindex={this.props.categoryIndex}
                                    type="number"
                                    value={this.props.order ? this.props.order : this.state.order}
                                    onChange={this.props.onItemOrderChange}
                                    data-index={this.props.index}
                                    data-subcategoryid={this.props.subcategoryId}
                                    onKeyPress={this.props.onItemOrderKeyPress}
                                    onBlur={this.props.onItemOrderBlur}
                                />
                            </div>
                            <UploadImageButton
                                cssClass='backoffice__item__upload__image__button'
                                action='setString'
                                field='image'
                                id={this.props.id}
                                name='item'
                                uploadWidget={this.props.uploadWidget}
                            />
                        </div>
                    :
                        null
                }
                {   
                    this.props.isAuthenticated && this.props.subcategoryId === '' ?

                        <div className="backoffice__events__event__box backoffice__events__event__box__all">
                            
                            <div className="backoffice__item__order__box">
                                <input
                                    id="number"
                                    data-id={this.props.id}
                                    data-type="all"
                                    data-categoryindex={this.props.categoryIndex}
                                    type="number"
                                    value={this.props.categoryIndex}
                                    onChange={this.props.onItemOrderChange}
                                    data-index={this.props.index}
                                    data-subcategoryid={this.props.subcategoryId}
                                    onKeyPress={this.props.onItemOrderKeyPress}
                                    onBlur={this.props.onItemOrderBlur}
                                />
                            </div>
                            
                        </div>
                    :
                        null
                }
                <div className="events__event__image__box">
                    <img 
                        data-id={this.props.id} 
                        data-title={this.props.title}
                        data-titleeng={this.props.titleEng}
                        data-text={this.props.text}
                        data-texteng={this.props.textEng}
                        data-image={this.props.image}
                        data-subcategoryid={this.props.subcategoryId}
                        data-categoryid={this.props.categoryId}
                        data-currentitems={this.props.itemsCurrent}
                        className="events__event__image" 
                        src={this.props.image.replace('image/upload', 'image/upload/t_shopSmall')} alt={this.props.title} 
                    />
                </div>
                <h2 
                    data-id={this.props.id} 
                    data-title={this.props.title}
                    data-titleeng={this.props.titleEng}
                    data-text={this.props.text}
                    data-texteng={this.props.textEng}
                    data-image={this.props.image}
                    data-subcategoryid={this.props.subcategoryId}
                    data-categoryid={this.props.categoryId}
                    data-currentitems={this.props.itemsCurrent}
                    hidden={this.state.hover} 
                    className="events__event__item__title Heebo-Regular" 
                    dir={this.props.lang === 'he' ? "rtl" : "ltr"}
                    onClick={this.props.isAuthenticated ? this.props.onInfoToggleOpen : null}
                >
                    {this.props.lang === 'he' ? this.props.title : this.props.titleEng}
                </h2>
                
                
                
                        
               
            </div>
        )
    }
}

export default EventsEvent;


////<img data-id={this.props.id} className="events__event__image" src={this.props.image} alt={this.props.title} />


// <p 
//                     data-id={this.props.id} 
//                     data-title={this.props.title}
//                     data-titleeng={this.props.titleEng}
//                     data-text={this.props.text}
//                     data-texteng={this.props.textEng}
//                     data-image={this.props.image}
//                     data-subcategoryid={this.props.subcategoryId}
//                     data-categoryid={this.props.categoryId}
//                     data-currentitems={this.props.itemsCurrent}
//                     hidden={this.state.hover} 
//                     className="events__event__item__text Heebo-Regular" 
//                     dir="rtl"
//                 >
//                     {this.props.lang === 'he' ? this.props.text : this.props.textEng}
//                 </p>