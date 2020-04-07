import React from 'react';
import AnimateHeight from 'react-animate-height';
import Textarea from 'react-expanding-textarea';
import $ from 'jquery';

const shouldHighLight = (org, update, eng) => {
    if ( org === update ) {
        return `workshop__content__text${eng} Heebo-Regular edit__bg`;
    } else {
        return `workshop__content__text${eng} Heebo-Regular edit__changed__bg`;
    }
};

export default class WorkshopContentStrip extends React.Component {
    
    state = {
        height: 'auto'
    };

    render() {
        const { height } = this.state;
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        const textAlignEng = this.props.lang === 'he' ? '' : ' workshop__content__text__eng';
        //console.log(this.props.index);

        return (
        <div className="workshop__content__box" dir="rtl">
            <div className="workshop__content__header__box">
                { 
                    this.props.workshoppage && this.props.workshoppage[this.props.index] && this.props.index !== 'workshop' ?
                        this.props.isAuthenticated === true ? 
                            <div className="workshop__content__header__in__box">
                                <Textarea
                                    className={`workshop__content__header${this.props.lang === 'he' ? '' : ' workshop__content__header__eng'} Heebo-Medium`}
                                    dir={dirLang}
                                    data-field={this.props.lang === 'he' ? 'header' : 'headerEng'}
                                    data-action='setString'
                                    data-index={this.props.index}
                                    placeholder="תוכן"
                                    defaultValue={this.props.lang === 'he' ? this.props.workshoppage[this.props.index].header : this.props.workshoppage[this.props.index].headerEng}
                                    onChange={ this.props.setData }
                                />
                                
                            </div>
                        :
                            <div className="workshop__content__header__in__box">
                                <h2 className={`workshop__content__header${this.props.lang === 'he' ? '' : ' workshop__content__header__eng'} Heebo-Medium`} dir={dirLang}>{this.props.lang === 'he' ? this.props.workshoppage[this.props.index].header : this.props.workshoppage[this.props.index].headerEng}</h2>
                            </div>
                    :
                        null
                }
                
                
            </div>
            <div className="workshop__content__text__box">
                
                <AnimateHeight
                duration={ 500 }
                height='auto'>
                    { 
                        this.props.workshoppage && this.props.workshoppage[this.props.index] ?
                            this.props.isAuthenticated === true ? 
                                <Textarea
                                    className={shouldHighLight(this.props.workshoppageOrigin[this.props.index].text, this.props.workshoppage[this.props.index].text, textAlignEng)}
                                    value={this.props.lang === 'he' ? this.props.workshoppage[this.props.index].text : this.props.workshoppage[this.props.index].textEng}
                                    dir={dirLang}
                                    data-field={this.props.lang === 'he' ? 'text' : 'textEng'}
                                    data-action='setString'
                                    data-index={this.props.index}
                                    placeholder="תוכן"
                                    onChange={ this.props.setData }
                                />
                            :
                                <Textarea
                                    className={`workshop__content__text${this.props.lang === 'he' ? '' : ' workshop__content__text__eng'} Heebo-Regular`}
                                    dir={dirLang}
                                    value={this.props.lang === 'he' ? this.props.workshoppage[this.props.index].text : this.props.workshoppage[this.props.index].textEng}
                                    readOnly
                                />
                        :
                            <div> </div>
                    }
                    
                </AnimateHeight>
                    



                
            </div>
            
        </div>
        );
    }
}