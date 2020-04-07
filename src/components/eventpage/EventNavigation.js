import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class EventNavigation extends React.Component {
    render() {
        return (
    
            <div className="event__navigation__box">

                <div className="events__eventshare__nav">

                    <div className="events__eventshare__button__box__x">
                        <button 
                            type='button'
                            className="events__eventshare__button"
                            data-name="greenArrow"
                            onMouseEnter={this.props.setIconRatioOn}
                            onMouseLeave={this.props.setIconRatioOut}
                            onClick={this.props.closeEventModal}
                        >
                            X
                        </button> 
                    </div>

                    <div hidden={this.props.currentItems.length<2} className="events__eventshare__button__box">
                        <button 
                            type='button'
                            className="events__eventshare__button events__eventshare__button__text Heebo-Regular"
                            data-name="greenArrow"
                            data-eventname={this.props.eventName}
                            onMouseEnter={this.props.setIconRatioOn}
                            onMouseLeave={this.props.setIconRatioOut}
                            onClick={this.props.gotoPrevEvent}
                        >
                            {this.context.t("prevPainting")}
                        </button> 
                    </div>

                    <div hidden={this.props.currentItems.length<2} className="events__eventshare__button__box">
                        <button 
                            type='button'
                            className="events__eventshare__button events__eventshare__button__text Heebo-Regular"
                            data-name="greenArrow"
                            data-eventname={this.props.eventName}
                            onMouseEnter={this.props.setIconRatioOn}
                            onMouseLeave={this.props.setIconRatioOut}
                            onClick={this.props.gotoNextEvent}
                        >
                            {this.context.t("nextPainting")}
                            
                        </button> 
                    </div>

                    

                </div>

            </div>
        )
    }
};

EventNavigation.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

export default connect(mapStateToProps)(EventNavigation);