import React from 'react';
import AnimateHeight from 'react-animate-height';
import Textarea from 'react-expanding-textarea';
import $ from 'jquery';

const shouldHighLight = (org, update) => {
    if ( org === update ) {
        return 'edit__bg';
    } else {
        return 'edit__changed__bg';
    }
};

export default class EventsText extends React.Component {
    
    state = {
        height: this.props.showLines * 18,
        minHeight: this.props.showLines * 18,
        categoryText: '',
        showLines: 1
    };

    toggle = () => {
        const { height, minHeight } = this.state;
        this.setState({
            height: height === minHeight ? 'auto' : minHeight,
        });
    };

    onHeightChange = (e) => {
        this.setHeight(e.target.value);
        this.props.onCategoryShowLinesChange(e);
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

            ratio = 2.5;
            if (windowWidth >= 500 && windowWidth < 768) {
                ratio = ratio * 0.24;
            } else if (windowWidth >= 450 && windowWidth < 500) {
                ratio = ratio * 0.85;
            } else if (windowWidth >= 400 && windowWidth < 450) {
                ratio = 4.8;
                lineHeight = 14.7;
            } else if (windowWidth >= 375 && windowWidth < 400) {
                ratio = 4.8;
                lineHeight = 14;
            } else if (windowWidth >= 350 && windowWidth < 475) {
                ratio = 4.8;
                lineHeight = 13.4;
            } else if (windowWidth < 350) {
                ratio = 4.8;
                lineHeight = 13.8;
            }

            this.setState({
                height: Math.round(showLines * ratio) * lineHeight,
                minHeight: Math.round(showLines* ratio) * lineHeight
            });
        } else {
            //console.log('componentDidMount');
            ratio = 2.2;
            if (windowWidth >= 768 && windowWidth < 800) {
                ratio = ratio * 0.68;
            } else if (windowWidth >= 800 && windowWidth < 850) {
                ratio = ratio * 0.75;
            } else if (windowWidth >= 850 && windowWidth < 900) {
                ratio = ratio * 0.73;
            } else if (windowWidth >= 900 && windowWidth < 950) {
                ratio = ratio * 0.67;
            } else if (windowWidth >= 950 && windowWidth < 1000) {
                ratio = ratio * 0.65;
            } else if (windowWidth >= 1000 && windowWidth < 1050) {
                ratio = ratio * 0.62;
            } else if (windowWidth >= 1050 && windowWidth < 1100) {
                ratio = ratio * 0.60;
            } else if (windowWidth >= 1100 && windowWidth < 1150) {
                ratio = ratio * 0.6;
            } else if (windowWidth >= 1150 && windowWidth < 1200) {
                ratio = ratio * 0.58;
            } else if (windowWidth >= 1200 && windowWidth < 1250) {
                ratio = ratio * 0.56;
            } else if (windowWidth >= 1250 && windowWidth < 1300) {
                ratio = ratio * 0.54;
            } else if (windowWidth >= 1300 && windowWidth < 1350) {
                ratio = ratio * 0.52;
            } else if (windowWidth >= 1350 && windowWidth < 1400) {
                ratio = ratio * 0.50;
            } else if (windowWidth >= 1400 && windowWidth < 1440) {
                ratio = ratio * 0.48;
            } else if (windowWidth >= 1440 && windowWidth < 1500) {
                ratio = ratio * 0.55;
            } else if (windowWidth >= 1500 && windowWidth < 1550) {
                ratio = ratio * 0.52;
            } else if (windowWidth >= 1550 && windowWidth < 1600) {
                ratio = ratio * 0.50;
            } else if (windowWidth >= 1600 && windowWidth < 1650) {
                ratio = ratio * 0.48;
            } else if (windowWidth >= 1650 && windowWidth < 1700) {
                ratio = ratio * 0.49;
            } else if (windowWidth >= 1700 && windowWidth < 1750) {
                ratio = ratio * 0.48;
            } else if (windowWidth >= 1750 && windowWidth < 1800) {
                ratio = ratio * 0.47;
            } else if (windowWidth >= 1800 && windowWidth < 1850) {
                ratio = ratio * 0.46;
            } else if (windowWidth >= 1850 && windowWidth < 1900) {
                ratio = ratio * 0.49;
            } else if (windowWidth >= 1900 && windowWidth < 1950) {
                ratio = ratio * 0.48;
            } else if (windowWidth >= 1950 && windowWidth < 2000) {
                ratio = ratio * 0.48;
            } else if (windowWidth >= 2000 && windowWidth < 2050) {
                ratio = ratio * 0.47;
            } else if (windowWidth >= 2050 && windowWidth < 2100) {
                ratio = ratio * 0.47;
            } else if (windowWidth >= 2100 && windowWidth < 2150) {
                ratio = ratio * 0.47;
            } else if (windowWidth >= 2150 && windowWidth < 2200) {
                ratio = ratio * 0.46;
            } else if (windowWidth >= 2200 && windowWidth < 2250) {
                ratio = ratio * 0.47;
            } else if (windowWidth >= 2250 && windowWidth < 2300) {
                ratio = ratio * 0.46;
            } else if (windowWidth >= 2300 && windowWidth < 2350) {
                ratio = ratio * 0.47;
            } else if (windowWidth >= 2350 && windowWidth < 2400) {
                ratio = ratio * 0.46;
            } else if (windowWidth >= 2400 && windowWidth < 2450) {
                ratio = ratio * 0.49;
            } else if (windowWidth >= 2450 && windowWidth < 2500) {
                ratio = ratio * 0.48;
            } else if (windowWidth >= 2500 && windowWidth < 2550) {
                ratio = ratio * 0.47;
            } else if (windowWidth >= 2550 && windowWidth < 2600) {
                ratio = ratio * 0.46;
            } else if (windowWidth >= 2600 && windowWidth < 2650) {
                ratio = ratio * 0.45;
            } else if (windowWidth >= 2650 && windowWidth < 2700) {
                ratio = ratio * 0.44;
            } else if (windowWidth >= 2700 && windowWidth < 2800) {
                ratio = ratio * 0.43;
            } else if (windowWidth >= 2800 && windowWidth < 2900) {
                ratio = ratio * 0.42;
            } else if (windowWidth >= 2900 && windowWidth < 3000) {
                ratio = ratio * 0.41;
            } else if (windowWidth >= 3000 && windowWidth < 3050) {
                ratio = ratio * 0.40;
            } else if (windowWidth >= 3050 && windowWidth < 3100) {
                ratio = ratio * 0.39;
            } else if (windowWidth >= 3100 && windowWidth < 3150) {
                ratio = ratio * 0.38;
            } else if (windowWidth >= 3150 && windowWidth < 3200) {
                ratio = ratio * 0.37;
            } else if (windowWidth >= 3200 && windowWidth < 3250) {
                ratio = ratio * 0.36;
            } else if (windowWidth >= 3250 && windowWidth < 3300) {
                ratio = ratio * 0.35;
            } else if (windowWidth >= 3300 && windowWidth < 3350) {
                ratio = ratio * 0.35;
            } else if (windowWidth >= 3350 && windowWidth < 3400) {
                ratio = ratio * 0.35;
            } else if (windowWidth >= 3400 && windowWidth < 3450) {
                ratio = ratio * 0.35;
            } else if (windowWidth >= 3450 && windowWidth < 3500) {
                ratio = ratio * 0.34;
            } else if (windowWidth >= 3500 && windowWidth < 3550) {
                ratio = ratio * 0.34;
            } else if (windowWidth >= 3550 && windowWidth < 3600) {
                ratio = ratio * 0.33;
            } else if (windowWidth >= 3600 && windowWidth < 3650) {
                ratio = ratio * 0.32;
            } else if (windowWidth >= 3650 && windowWidth < 3700) {
                ratio = ratio * 0.32;
            } else if (windowWidth >= 3700 && windowWidth < 3750) {
                ratio = ratio * 0.31;
            } else if (windowWidth >= 3750 && windowWidth < 3800) {
                ratio = ratio * 0.31;
            } else if (windowWidth >= 3800 && windowWidth < 3850) {
                ratio = ratio * 0.31;
            } else if (windowWidth >= 3850 && windowWidth < 3900) {
                ratio = ratio * 0.31;
            } else if (windowWidth >= 3900 && windowWidth < 3950) {
                ratio = ratio * 0.31;
            } else if (windowWidth >= 3950 && windowWidth < 4000) {
                ratio = ratio * 0.30;
            } else if (windowWidth >= 4000) {
                ratio = ratio * 0.29;
            }
            this.setState({
                height: showLines * ratio * (windowWidth/100),
                minHeight: showLines * ratio * (windowWidth/100),
                showLines: showLines
            });
        }
    }

    componentDidMount = () => {
        this.setHeight(this.props.showLines);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props.showLines !== prevProps.showLines && this.props.showLines) {
            this.setHeight(this.props.showLines);
        }
    }


    render() {
        const { height } = this.state;
        const dirLang = this.props.i18n.language === 'he' ? 'rtl' : 'ltr';
        //console.log(this.props.showLines);
        return (
            <div className={this.props.i18n.language === 'he' ? 'events__text__box' : 'events__text__box events__text__box__eng'}>
                
                <div className="events__text__flexbox" dir={dirLang}>
                    <AnimateHeight
                    duration={ 500 }
                    height={ height }>
                        { 
                            this.props.isAuthenticated === true ? 
                                <div className={shouldHighLight(this.props.categoryTextOrigin, this.props.categoryText)}>
                                    <Textarea
                                        className="events__text Heebo-Regular"
                                        value={this.props.categoryText ? this.props.i18n.language === 'he' ? this.props.categoryText : this.props.categoryTextEng : this.props.i18n.language === 'he' ? this.state.categoryText : this.state.categoryTextEng}
                                        data-field="text"
                                        data-action='setString'
                                        data-name={`item${this.props.index}`}
                                        data-index={this.props.index}
                                        placeholder="תוכן"
                                        onChange={ this.props.onChange }
                                    />
                                </div>

                            :
                                <Textarea
                                    className="events__text Heebo-Regular"
                                    value={this.props.i18n.language === 'he' ? this.props.categoryText : this.props.categoryTextEng}
                                    readOnly
                                />
                        }
                    </AnimateHeight>
                </div>
                <div hidden className="events__text__more__box">
                    <button 
                        type='button'
                        className="events__text__button"
                        data-name="greenArrow"
                        onMouseEnter={this.props.setIconRatioOn}
                        onMouseLeave={this.props.setIconRatioOut}
                        onClick={this.toggle}
                    >
                        <p className="events__text__more__button__text Heebo-Regular">{`${this.props.i18n.language === 'he' ? '< קראו עוד' : 'Read more >'}`}</p>
                    </button>
                </div>
                { 
                    this.props.isAuthenticated === true ? 
                        <input
                            className={shouldHighLight(this.props.showLinesOrigin, this.props.showLines)}
                            id="number"
                            type="number"
                            value={this.props.showLines ? this.props.showLines : this.state.showLines}
                            data-field="linesShow"
                            data-action='setNumber'
                            data-name={`item${this.props.index}`}
                            data-index={this.props.index}
                            onChange={this.onHeightChange}
                        />
                    :
                        null
                }
        </div>
        );
    }
}