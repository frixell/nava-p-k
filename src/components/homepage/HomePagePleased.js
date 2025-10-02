import React from 'react';
import { Route } from 'react-router-dom';
import { Parallax, Background } from 'react-parallax';

import PropTypes from 'prop-types';

export class HomePagePleased extends React.Component {

    render () {
        const { homepage, homepageOrigin, action, onChange, field, lang } = this.props;
        const changedBorder = homepage.pleasedText !== homepageOrigin.pleasedText ? "edit__changed__bg" : "edit__bg";
        return (
            <div className="homepage__pleased-box desktop_inline">



                <Parallax
                    blur={0}
                    bgImage='https://res.cloudinary.com/dz7woxmn2/image/upload/v1542087834/Ziva_Kainer_Ein_Hod_homepage_1.jpg'
                    bgImageAlt="Ziva Kainer Ein Hod"
                    strength={200}
                >
                    
                    <div style={{ height: '43vw' }} />
                </Parallax>
                <div className="homepage__pleased__content-box">
                    <div className="homepage__pleased__body">
                        
                        {
                            this.props.isAuthenticated === true ?
                            <div className='homepage__pleased__content' dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                <div className={changedBorder}>
                                    <textarea
                                        data-name={field}
                                        data-action={action}
                                        placeholder="טקסט ׳אודות׳"
                                        value={lang === 'he' ? homepage.pleasedText : homepage.pleasedTextEng}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            :
                            <div className={`homepage__pleased__content${lang === 'he' ? '' : ''}`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                <textarea
                                    readOnly
                                    value={lang === 'he' ? homepage.pleasedText : homepage.pleasedTextEng}
                                />
                            </div>
                        }
                        
                    </div>
                </div>
            </div>
    )}
};

HomePagePleased.contextTypes = {
  t: PropTypes.func.isRequired
}

export default HomePagePleased;