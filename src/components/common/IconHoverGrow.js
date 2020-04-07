import React from 'react';
import PropTypes from 'prop-types';

const icons = {
  facebook: {
    paths: [
      'M10.52,11.78H7.22V23.55H2.33V11.78H0V7.63H2.33V4.94C2.33,3,3.24,0,7.26,0h3.62v4H8.25a1,1,0,0,0-1,1.13V7.63h3.73Z'
    ],
    width: 1.2,
    height: 1.7,
    vbwidth: 10.94,
    vbheight: 23.55
  },
  instagram: {
    paths: [
      'M20.06,0H3A2.92,2.92,0,0,0,0,2.87V19.48a2.92,2.92,0,0,0,3,2.87H20.06a2.92,2.92,0,0,0,3-2.87V2.87A2.92,2.92,0,0,0,20.06,0ZM15.73,3.49a1,1,0,0,1,1-1h2.6a1,1,0,0,1,1,1V5.9a1,1,0,0,1-1,1h-2.6a1,1,0,0,1-1-1Zm-4.2,3.29a4.49,4.49,0,0,1,4.62,4.35,4.49,4.49,0,0,1-4.62,4.35,4.49,4.49,0,0,1-4.62-4.35A4.49,4.49,0,0,1,11.53,6.78Zm8.88,12.12a.9.9,0,0,1-.91.89h-16a.9.9,0,0,1-.91-.89V9.45H4.67a6.39,6.39,0,0,0-.3,1.92,7,7,0,0,0,7.15,6.73,7,7,0,0,0,7.15-6.73,6.36,6.36,0,0,0-.3-1.92h2Z'
    ],
    width: 1.9,
    height: 1.7,
    vbwidth: 23.01,
    vbheight: 23.55
  },
  mail: {
    paths: [
      'M22.63,19.35H2.22A2.12,2.12,0,0,1,.76,18.8l7-7.08.49.35q.79.59,1.28.91a7.85,7.85,0,0,0,1.31.67,4,4,0,0,0,1.53.34h0A4,4,0,0,0,14,13.65,7.87,7.87,0,0,0,15.28,13q.49-.33,1.28-.91l.49-.35,7,7.08A2.12,2.12,0,0,1,22.63,19.35Z',
      'M.29,16.82V6a7.36,7.36,0,0,0,1.4,1.21q2.95,2,4.81,3.32Z',
      'M24.57,16.82l-6.2-6.24q2-1.39,4.82-3.32A7.66,7.66,0,0,0,24.57,6Z',
      'M24.18,4.34a6.61,6.61,0,0,1-1.69,1.72L17.4,9.6l-1.4,1-.21.15L15.4,11l-.75.53-.72.45a4.19,4.19,0,0,1-.8.38,2.2,2.2,0,0,1-.69.13h0a2.2,2.2,0,0,1-.69-.13,4.21,4.21,0,0,1-.8-.38q-.42-.25-.72-.45L9.45,11l-.38-.28-.21-.15-1.4-1L5.23,8l-2.84-2A6.9,6.9,0,0,1,.76,4.44,3.27,3.27,0,0,1,0,2.54,2.82,2.82,0,0,1,.58.72,2,2,0,0,1,2.22,0H22.63A2.14,2.14,0,0,1,24.2.66a2.15,2.15,0,0,1,.66,1.58A3.7,3.7,0,0,1,24.18,4.34Z'
    ],
    width: 1.9,
    height: 1.4,
    vbwidth: 24.85,
    vbheight: 19.35
  },
  phone: {
    paths: [
      'M22.46,20.79l-1,1,0,0a5.78,5.78,0,0,1-1.45.82,6,6,0,0,1-1.48.37c-.23,0-5.61.53-12.28-6.14C1.38,12-.4,8.43.07,4.53A6,6,0,0,1,.44,3.06,5.79,5.79,0,0,1,1.27,1.6l0,0,1-1a1.85,1.85,0,0,1,2.61,0L8.41,4.07a1.85,1.85,0,0,1,0,2.61l-.59.59-1.2,1.2.19.35a17.93,17.93,0,0,0,3.12,4.32,17.83,17.83,0,0,0,4.31,3.12l.35.2,1.79-1.79a1.85,1.85,0,0,1,2.61,0l3.56,3.56A1.86,1.86,0,0,1,22.46,20.79Z'
    ],
    width: 1.9,
    height: 1.6,
    vbwidth: 23.03,
    vbheight: 22.97
  }
};

const ratioFixer = 0.73;

class IconHoverGrow extends React.Component {
  
  render() {
    let measure = 'vw';
    if (typeof(window) !== "undefined") {
      if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){
          measure = 'em';
      }
    }
    const width = (icons[this.props.icon].width * this.props.ratio * ratioFixer) + measure;
    const height = (icons[this.props.icon].height * this.props.ratio * ratioFixer) + measure;
    const vbwidth = icons[this.props.icon].vbwidth;
    const vbheight = icons[this.props.icon].vbheight;
    return(
      <svg
        className="svg-icon"
        width={width}
        height={height}
        viewBox={`0 0 ${vbwidth} ${vbheight}`}
      >
      {
        icons[this.props.icon].paths.map((spath, i) => <path d={spath} key={i}></path>)
      }
      </svg>
    )
  };
};

IconHoverGrow.propTypes = {
  icon: PropTypes.string.isRequired,
  ratio: PropTypes.number.isRequired
};

export default IconHoverGrow;