import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

import Photo, { photoPropType } from './Photo';
import { computeSizes } from './utils';
import UploadImageButton from '../common/UploadImageButton';

class TileGallery extends React.Component {
  constructor() {
    super();
    this.state = {
      containerWidth: 0,
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);

    let that = this;
    // this is to fix non-ios browsers where a scrollbar isnt present before
    // images load, then becomes present, and doesn't trigger an update.
    // avoids calling setState in componentDidUpdate causing maximum depth exceeded error
    if (typeof(window) !== "undefined") {
      window.requestAnimationFrame(function() {
        if (that._gallery.clientWidth !== that.state.containerWidth) {
          that.setState({ containerWidth: Math.floor(that._gallery.clientWidth) });
        }
      });
    }
  }
  componentDidMount() {
    this.setState({ containerWidth: Math.floor(this._gallery.clientWidth) });
    if (typeof(window) !== "undefined") {
      window.addEventListener('resize', this.handleResize);
    }
  }
  componentWillUnmount() {
    if (typeof(window) !== "undefined") {
      window.removeEventListener('resize', this.handleResize, false);
    }
  }
  handleResize(e) {
    if (this._gallery.clientWidth !== this.state.containerWidth) {
      this.setState({ containerWidth: Math.floor(this._gallery.clientWidth) });
    }
  }
  handleClick(event, { index }) {
    const { photos, onClick } = this.props;
    onClick(event, {
      index,
      photo: photos[index],
      previous: photos[index - 1] || null,
      next: photos[index + 1] || null,
    });
  }

  render() {
    const { ImageComponentTop = Photo } = this.props;
    // subtract 1 pixel because the browser may round up a pixel
    const width = this.state.containerWidth - 1;
    const { photos, columns, margin, onClick } = this.props;
    const thumbs = computeSizes({ width, columns, margin, photos });
    
    return (
      <div className={this.props.style}>
        <div ref={c => (this._gallery = c)}>
          {thumbs.map((photo, index) => {
            const { src, width, height } = photo;
            //console.log(photo);
            const imgStyle = {  width: '100%', height: '100%' };
            const buttonStyle = { width: width, height: height }
            const divStyle = { position: 'relative', display: 'block', float: 'right', width: width, height: height, margin: margin };
            return (
                <div
                  style={divStyle}
                  key={index}
                >
                    {   
                        this.props.isAuthenticated ?

                            <div className="backoffice__events__event__image__box">
                                <Button
                                    id="btn-x"
                                    data-publicid={photo.publicId}
                                    data-order={photo.order}
                                    data-id={photo.id}
                                    data-showstatus={false}
                                    className="backoffice__events__event__remove btn-danger"
                                    onClick={this.props.onDeleteImage}
                                >
                                    X
                                </Button>
                                <div className="backoffice__item__order__box">
                                    <input
                                        data-id={photo.id}
                                        data-order={photo.order}
                                        data-index={index}
                                        value={photo.order}
                                        onChange={this.props.onImageOrderChange}
                                        onKeyPress={this.props.onImageOrderKeyPress}
                                        onBlur={this.props.onImageOrderBlur}
                                    />
                                </div>
                            </div>
                        :
                            null
                    }
                    <div
                        className="events__event__select__image__button__div desktop_flex"
                        style={buttonStyle}
                    >   
                        <button
                            className="events__event__select__image__button"
                            style={buttonStyle}
                            data-id={photo.id}
                            data-order={photo.order}
                            onClick={this.props.onOpenSlideGallery}
                        />
                        <img className="events__event__select__image__icon" src="/images/eventspage/pixel.png" alt="בחר" />
                    </div>
                    
                    <img
                        src={src}
                        style={imgStyle}
                        alt={photo.altText}
                    />
                    
                </div>
            );
          })}
        </div>
        <div style={{ content: '', display: 'table', clear: 'both' }} />
      </div>
    );
  }
}

TileGallery.propTypes = {
  photos: PropTypes.arrayOf(photoPropType).isRequired,
  onClick: PropTypes.func,
  columns: PropTypes.number,
  margin: PropTypes.number,
  ImageComponent: PropTypes.func,
};

TileGallery.defaultProps = {
  columns: 3,
  margin: 2,
};

export default TileGallery;
