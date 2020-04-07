import React from 'react';
import AnimateHeight from 'react-animate-height';
import Textarea from 'react-expanding-textarea';
import $ from 'jquery';

const shouldHighLight = (org, update, eng) => {
    if ( org === update ) {
        return `about__content__text${eng} Heebo-Regular edit__bg`;
    } else {
        return `about__content__text${eng} Heebo-Regular edit__changed__bg`;
    }
};

export default class AboutContentStrip extends React.Component {
    
    state = {
        height: 'auto'
    };

    render() {
        const { height } = this.state;
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        const textAlignEng = this.props.lang === 'he' ? '' : ' about__content__text__eng';
        //console.log(this.props.index);
console.log(this.props.lang);
        return (
        <div className="about__content__box" dir={dirLang}>
        
            <div className="about__content__header__box">
                { 
                    this.props.aboutpage && this.props.aboutpage[this.props.index] && this.props.index !== 'about' ?
                        this.props.isAuthenticated === true ? 
                            <div className="about__content__header__in__box">
                                <Textarea
                                    className={`about__content__header${this.props.lang === 'he' ? '' : ' about__content__header__eng'} Heebo-Medium`}
                                    dir={dirLang}
                                    data-field={this.props.lang === 'he' ? 'header' : 'headerEng'}
                                    data-action='setString'
                                    data-index={this.props.index}
                                    placeholder="תוכן"
                                    value={this.props.lang === 'he' ? this.props.aboutpage[this.props.index].header : this.props.aboutpage[this.props.index].headerEng}
                                    onChange={ this.props.setData }
                                />
                                
                            </div>
                        :
                            <div className="about__content__header__in__box" dir={dirLang}>
                                <h2 className={`about__content__header${this.props.lang === 'he' ? '' : ' about__content__header__eng'} Heebo-Medium`} dir={dirLang}>{this.props.lang === 'he' ? this.props.aboutpage[this.props.index].header : this.props.aboutpage[this.props.index].headerEng}</h2>
                            </div>
                    :
                        null
                }
                
                
            </div>
            <div className="about__content__text__box">
                
                <AnimateHeight
                duration={ 500 }
                height='auto'>
                    { 
                        this.props.aboutpage && this.props.aboutpage[this.props.index] ?
                            this.props.isAuthenticated === true ? 
                                <Textarea
                                    className={shouldHighLight(this.props.aboutpageOrigin[this.props.index].text, this.props.aboutpage[this.props.index].text, textAlignEng)}
                                    value={this.props.lang === 'he' ? this.props.aboutpage[this.props.index].text : this.props.aboutpage[this.props.index].textEng}
                                    dir={dirLang}
                                    data-field={this.props.lang === 'he' ? 'text' : 'textEng'}
                                    data-action='setString'
                                    data-index={this.props.index}
                                    placeholder="תוכן"
                                    onChange={ this.props.setData }
                                />
                            :
                                <Textarea
                                    className={`about__content__text${this.props.lang === 'he' ? '' : ' about__content__text__eng'} Heebo-Regular`}
                                    dir={dirLang}
                                    value={this.props.lang === 'he' ? this.props.aboutpage[this.props.index].text : this.props.aboutpage[this.props.index].textEng}
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