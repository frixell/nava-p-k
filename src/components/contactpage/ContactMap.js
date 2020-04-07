import React from 'react';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import $ from 'jquery';

class ContactMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      windowWidth: 0
    }
    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }
  componentDidMount = () => {
    if (!this.state.windowWidth) {
      let windowWidth = 0;
      if (typeof(window) !== "undefined") {
        windowWidth = $( window ).width();
      }
      this.setState({ 
          windowWidth
      });
    }
  }
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }
  render() {
    if (this.state.windowWidth !== 0) {

      let style = {
        width: '40vw',
        height: '40vh',
        'marginLeft': 'auto',
        'marginRight': 'auto'
      }
      if (this.state.windowWidth<767) {
        if (this.props.style === 'strip') {
          if (this.props.lang === 'he') {
            style = {
              width: '80vw',
              height: '80vw',
              left: '10vw',
              top: '-2rem'
            }
          } else {
            style = {
              width: '80vw',
              height: '80vw',
              right: '10vw',
              top: '-2rem'
            }
          }
        } else if (this.props.style === 'page') {
          if (this.props.lang === 'he') {
            style = {
              width: '80vw',
              height: '80vw',
              left: '10vw',
              top: '-2rem'
            }
          } else {
            style = {
              width: '80vw',
              height: '80vw',
              right: '10vw',
              top: '-2rem'
            }
          }
        }
      } else {
        if (this.props.style === 'strip') {
          if (this.props.lang === 'he') {
            style = {
              width: '20vw',
              height: '20vw',
              left: '-10rem',
              top: '0rem'
            }
          } else {
            style = {
              width: '20vw',
              height: '20vw',
              right: '-10rem',
              top: '0rem'
            }
          }
        } else if (this.props.style === 'page') {
          if (this.props.lang === 'he') {
            style = {
              width: '40vw',
              height: '40vw',
              left: '-10rem',
              top: '2rem'
            }
          } else {
            style = {
              width: '40vw',
              height: '40vw',
              right: '-10rem',
              top: '2rem'
            }
          }
        }
      }
        
      
      return (
        <Map
          className = 'map__helper'
          item
          xs = { 12 }
          style = { style }
          google = { this.props.google }
          onClick = { this.onMapClick }
          zoom = { 16 }
          initialCenter = {{ lat: 32.7018506, lng: 34.9814115 }}
        >
          <Marker
            onClick = { this.onMarkerClick }
            title = { 'Ziva Kainer Artist' }
            position = {{ lat: 32.7018506, lng: 34.9814115 }}
            name = { 'ziva kainer artist ein hod' }
          />
          <InfoWindow
            marker = { this.state.activeMarker }
            visible = { this.state.showingInfoWindow }
          >
            <h2>Ziva Kainer</h2>
          </InfoWindow>
        </Map>
      );
    } else {
      return (
        <h2>Loading..</h2>
      );
    }
  }
}
export default GoogleApiWrapper({
    apiKey: process.env.GOOGLE_MAPS_API_KEY
})(ContactMap)