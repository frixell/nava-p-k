import React, { Component } from 'react';
import {loadModules} from 'esri-loader'
 
let view = null;
let camera = null;
const styles = {
    container: {
        height: '100%',
        color: '#000',
        fontSize: 2

    },
        mapDiv: {
        height: '100%',
    },
}

class PointTest extends Component {
    state ={
        coordinates: [],
        points: this.props.points
    }

    onGoTo = () => {
        camera = {
            position: {
                x: -0.17746710975334712,
                y: 51.44543992422466,
                z: 1266.7049653716385
            },
            heading: 0.34445102566290225,
            tilt: 82.95536300536367
        };
        view.goTo(camera);
    }
    
    onGoToEinHod = () => {
        camera = {
            position: {
                x: 34.97992814784823,
                y: 32.559655621247935,
                z: 2500
            },
            heading: 0.37445102566290225,
            tilt: 82.95536300536367
        };
        view.goTo(camera);
    }

    componentDidMount() {
            loadModules(["esri/Map", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/BasemapGallery", "esri/widgets/Locate", "esri/widgets/Search", "esri/Camera"])
                .then(([Map, SceneView, GraphicsLayer, Graphic, BasemapGallery, Locate, Search, Camera]) => {
                    var map = new Map({
                        basemap: "hybrid"
                    });

                    camera = new Camera({
                        position: {
                            x: 34.97992814784823,
                            y: 32.559655621247935,
                            z: 2500
                        },
                        heading: 0.34445102566290225,
                        tilt: 82.95536300536367
                    });
                    view = new SceneView({
                        container: "pointTestViewDiv",
                        map: map,
                        camera: camera
                    });
                    
                    const searchWidget = new Search({
                        view: view
                    });
                    // Adds the search widget below other elements in
                    // the top left corner of the view
                    view.ui.add(searchWidget, {
                        position: "bottom-left",
                        index: 2
                    });
                    
                    
                      
                    // var locateWidget = new Locate({
                    //     view: view,   // Attaches the Locate button to the view
                    //     graphic: new Graphic({
                    //       symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
                    //       // graphic placed at the location of the user when found
                    //     })
                    // });
                      
                    // view.ui.add(locateWidget, "bottom-right");
                    
                    var basemapGallery = new BasemapGallery({
                        view: view
                      });
                      // Add widget to the top right corner of the view
                      view.ui.add(basemapGallery, {
                        position: "top-right"
                      });
                    
                    // // 1 - Create the widget
                    // var toggle = new BasemapToggle({
                    //     // 2 - Set properties
                    //     view: view, // view that provides access to the map's 'topo' basemap
                    //     nextBasemap: "hybrid" // allows for toggling to the 'hybrid' basemap
                    // });

                    // // Add widget to the top right corner of the view
                    // view.ui.add(toggle, "bottom-right");
            
                    /*********************
                     * Add graphics layer
                     *********************/
            
                    var graphicsLayer = new GraphicsLayer();
                    map.add(graphicsLayer);
            
                    /*************************
                     * Add a 3D point graphic
                     *************************/
              
                    let points = this.state.points;
              
                    view.on('click', (event) => {
                        console.log("click event: ", event.mapPoint);
                        if (this.props.allowAddPoint) {
                            let point = {
                                type: "point", // autocasts as new Point()
                                x: event.mapPoint.longitude,
                                y: event.mapPoint.latitude,
                                z: 1010
                            };
                            this.props.addPoint(point);
                            this.setState(points);
                            var polyline = {
                                type: "polyline", // autocasts as new Polyline()
                                paths: [
                                [event.mapPoint.longitude, event.mapPoint.latitude, 0],
                                [event.mapPoint.longitude, event.mapPoint.latitude, 1000]
                                ]
                            };
                    
                            /****************************
                             * Add a 3D polyline graphic
                             ****************************/
                        
                            var lineSymbol = {
                                type: "simple-line", // autocasts as SimpleLineSymbol()
                                color: [226, 119, 40],
                                width: 4
                            };
                    
                            var polylineGraphic = new Graphic({
                                geometry: polyline,
                                symbol: lineSymbol
                            });
                    
                            graphicsLayer.add(polylineGraphic);
                            
                            
                            var pointGraphic = new Graphic({
                                geometry: point,
                                symbol: markerSymbol
                            });
                            
                            graphicsLayer.add(pointGraphic);
                        }
                        
                    });
                    
                    var markerSymbol = {
                        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                        color: [226, 119, 40],
                        outline: {
                        // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 255],
                        width: 2
                        }
                    };
              
                    console.log('this.state.points', this.state.points);
                    this.state.points.forEach(point => {
                        var polyline = {
                            type: "polyline", // autocasts as new Polyline()
                            paths: [
                            [point.x, point.y, 0],
                            [point.x, point.y, 1000]
                            ]
                        };
                
                        /****************************
                     * Add a 3D polyline graphic
                     ****************************/
                    
                        var lineSymbol = {
                            type: "simple-line", // autocasts as SimpleLineSymbol()
                            color: [226, 119, 40],
                            width: 4
                        };
                
                        var polylineGraphic = new Graphic({
                            geometry: polyline,
                            symbol: lineSymbol
                        });
                
                        graphicsLayer.add(polylineGraphic);
                        
                        
                        var pointGraphic = new Graphic({
                            geometry: point,
                            symbol: markerSymbol
                        });
                        
                        graphicsLayer.add(pointGraphic);
                        
                    })
              
              
                      /***************************
                       * Add a 3D polygon graphic
                       ***************************/
              
                    //   var polygon = {
                    //     type: "polygon", // autocasts as new Polygon()
                    //     rings: [
                    //       [-0.184, 51.48391, 400],
                    //       [-0.184, 51.49091, 500],
                    //       [-0.172, 51.49091, 500],
                    //       [-0.172, 51.48391, 400],
                    //       [-0.184, 51.48391, 400]
                    //     ]
                    //   };
              
                    //   var fillSymbol = {
                    //     type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    //     color: [227, 139, 79, 0.8],
                    //     outline: {
                    //       // autocasts as new SimpleLineSymbol()
                    //       color: [255, 255, 255],
                    //       width: 1
                    //     }
                    //   };
              
                    //   var polygonGraphic = new Graphic({
                    //     geometry: polygon,
                    //     symbol: fillSymbol
                    //   });
              
                    //   graphicsLayer.add(polygonGraphic);
                })
    }
 
    render() {
        return ( 
            <div style = { styles.container } >
                <div style={{position: 'absolute', fontSize: 14, zIndex: 15019, top: '2rem', left: '75vw', color: '#fff'}} onClick={this.onGoTo}>
                    לונדון
                </div>
                <div style={{position: 'absolute', fontSize: 14, zIndex: 15019, top: '2rem', left: '72vw', color: '#fff'}} onClick={this.onGoToEinHod}>
                    עין הוד
                </div>
                <div id = 'pointTestViewDiv' style = { styles.mapDiv } >
                    
                </div>
            </div>
        );
    }
}

export default PointTest;