import React from 'react';
import { Route } from 'react-router-dom';
import { Parallax, Background } from 'react-parallax';

import PropTypes from 'prop-types';

export class HomePagePleasedMobile extends React.Component {

    render () {
        const { homepage, homepageOrigin, action, onChange, field } = this.props;
        const changedBorder = homepage.pleasedText !== homepageOrigin.pleasedText ? "edit__changed__bg" : "edit__bg";
        return (
            <div className="homepage__pleased-box mobile_inline">
                
                <Parallax
                    blur={0}
                    bgImage='https://res.cloudinary.com/dz7woxmn2/image/upload/v1550833008/ziva_hp_mobile.jpg'
                    bgImageAlt="Ziva Kainer Ein Hod"
                    strength={200}
                >
                    
                    <div style={{ height: '125vw' }} />
                </Parallax>
            </div>
    )}
};

export default HomePagePleasedMobile;