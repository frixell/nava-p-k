import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Carousel,
  CarouselItem
} from 'reactstrap';

const propTypes = {
  items: PropTypes.array.isRequired,
  indicators: PropTypes.bool,
  controls: PropTypes.bool,
  autoPlay: PropTypes.bool,
  activeIndex: PropTypes.number,
  onNext: PropTypes.func,
  previous: PropTypes.func,
  goToIndex: PropTypes.func,
};

class UncontrolledCarousel extends Component {
  constructor(props) {
    super(props);
    this.animating = false;
    this.state = { activeIndex: this.props.activeIndex };
    this.onNext = this.onNext.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  onNext() {
    //console.log('next: '+this.state.activeIndex);
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === this.props.items.length - 1 ? 0 : this.state.activeIndex + 1;
    //this.props.onCurrentImageChange(nextIndex);
    //this.setState({ activeIndex: nextIndex });
    if (this.props.onCurrentImageChange) {
    this.props.onCurrentImageChange(nextIndex);
    }
  }

  previous() {
    //console.log('previous: '+this.state.activeIndex);
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? this.props.items.length - 1 : this.state.activeIndex - 1;
    this.props.onCurrentImageChange(nextIndex);
    //this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    //console.log('nextProps, nextState');
    //console.log(nextProps.activeIndex);
    //console.log(this.props.activeIndex);
    if(this.props !== nextProps) {
      this.setState({ activeIndex: nextProps.activeIndex });
      return true;
    } else {
      return false;
    }
  }



  getDerivedStateFromProps = (props, state) => {
    //console.log('getDerivedStateFromProps');
    //console.log(props);
    //console.log(state);
  }




  render() {
    const { autoPlay, indicators, controls, items, goToIndex, ...props } = this.props;
    const { activeIndex } = this.state;

    const slides = items.map((item) => {
      return (
        <CarouselItem
          onExiting={this.props.onExiting}
          onExited={this.props.onExited}
          key={item.src}
        >
          {
            item.width ?
              <img width={item.width} height={item.height} src={item.src} alt={item.altText} />
              :
              <img className="w-100" src={item.src} alt={item.altText} />

          }
        </CarouselItem>
      );
    });

    return (
      <Carousel
        activeIndex={activeIndex}
        next={this.onNext}
        previous={this.previous}
        ride='carousel'
        {...props}
        slide={this.props.slide}
      >
        
        {slides}
        
      </Carousel>
    )
  }
}

UncontrolledCarousel.propTypes = propTypes;
UncontrolledCarousel.defaultProps = {
  controls: true,
  indicators: true,
  autoPlay: true,
};

export default UncontrolledCarousel;