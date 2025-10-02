import React from 'react';
import ShareLink from 'react-facebook-share-link';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  ViberShareButton,
  EmailShareButton,
} from 'react-share';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
 


import { withTranslation } from 'react-i18next';
 


class EventShareStrip extends React.Component {
    render() {
        const { t, i18n } = this.props;
        const dirLang = i18n.language === 'he' ? 'rtl' : 'ltr';
        return (
    
            <div className="event__sharestrip__box" dir={dirLang}>
                
                <div className={`events__eventshare__share ${this.props.style === 'desktop' ? 'desktop_flex' : 'mobile_flex'}`} dir={dirLang}>
                    
                    <p className={i18n.language === 'he' ? `events__eventshare__text Heebo-Regular` : `events__eventshare__text events__eventshare__text__eng Heebo-Regular`} dir={dirLang}>{t("shareWithFriends")}</p>

                    <ShareLink link={this.props.currentURL}>
                    {link => (
                        <a href={link} target='_blank' className="events__eventshare__facebook"> </a>
                    )}
                    </ShareLink>

                    <a href={`mailto:?subject="זיוה קיינר - ציירת - עין הוד"&body=${this.props.currentURL}`} target='_blank' className="events__eventshare__mail"> </a>

                    <WhatsappShareButton className="events__eventshare__phone" title='זיוה קיינר' url={this.props.currentURL} />
                    
                </div>
                
            </div>
        )
    }
};

export default withTranslation()(EventShareStrip);