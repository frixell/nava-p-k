import React from 'react';
import IconHoverGrow from './IconHoverGrow';
import HomepageSocialmediaRightBorder from '../svg/HomepageSocialmediaRightBorder';





class SocialMedia extends React.Component {
    gotoFacebook = () => {
        console.log('in facebook');
        if (typeof(window) !== "undefined") {
            window.open('https://www.facebook.com/oren.pro/');
        }
    }
    gotoInstagram = () => {
        console.log('in facebook');
        if (typeof(window) !== "undefined") {
            window.open('https://www.instagram.com/oren_rinat_pro/');
        }
    }
    gotoMail = () => {
        console.log('in facebook');
        if (typeof(window) !== "undefined") {
            window.location = 'mailto:mosh.kainer@gmail.com';
        }
    }
    gotoPhone = () => {
        console.log('in facebook');
        if (typeof(window) !== "undefined") {
            window.location = 'tel:0525379515';
        }
    }
    
    render() {
        return (
            <div className="homepage__socialmedia-box desktop">
                <div className="homepage__socialmedia-icons-box">
                    <div className="homepage__socialmedia-icons">
                        <button
                            className="homepage__socialmedia-button"
                            data-name="facebook"
                            onMouseEnter={this.props.setIconRatioOn}
                            onMouseLeave={this.props.setIconRatioOut}
                            onClick={this.gotoFacebook}
                        >
                            <IconHoverGrow icon="facebook" ratio={this.props.ratioFacebook} />
                        </button>
                        <button
                            className="homepage__socialmedia-button"
                            data-name="instagram"
                            onMouseEnter={this.props.setIconRatioOn}
                            onMouseLeave={this.props.setIconRatioOut}
                            onClick={this.gotoInstagram}
                        >
                            <IconHoverGrow icon="instagram" ratio={this.props.ratioInstagram} />
                        </button>
                        <button
                            className="homepage__socialmedia-button"
                            data-name="mail"
                            onMouseEnter={this.props.setIconRatioOn}
                            onMouseLeave={this.props.setIconRatioOut}
                            onClick={this.gotoMail}
                        >
                            <IconHoverGrow icon="mail" ratio={this.props.ratioMail} />
                        </button>
                        <button
                            className="homepage__socialmedia-button"
                            data-name="phone"
                            onMouseEnter={this.props.setIconRatioOn}
                            onMouseLeave={this.props.setIconRatioOut}
                            onClick={this.gotoPhone}
                        >
                            <IconHoverGrow icon="phone" ratio={this.props.ratioPhone} />
                        </button>
                    </div>
                    <HomepageSocialmediaRightBorder />
                </div>

            </div>
        );
    }
}

export default SocialMedia;