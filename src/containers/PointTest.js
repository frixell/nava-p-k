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
};

const markerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40],
    outline: {
    color: [255, 255, 255],
    width: 2
    }
};

class PointTest extends Component {
    state ={
        coordinates: [],
        points: this.props.points,
        selectedPoint: null
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.points.length !== prevProps.points.length) {
            console.log('length changed !');
        }
        if (this.props.sidebarClickedItemId !== prevProps.sidebarClickedItemId) {
            let selectedPoint = null;
            this.props.points.map(point => {
                if (point.id === this.props.sidebarClickedItemId) {
                    selectedPoint = point;
                }
            });
            camera = {
                position: {
                    x: selectedPoint.x,
                    y: selectedPoint.y - 0.1,
                    z: 2500
                },
                heading: 0.37445102566290225,
                tilt: 82.95536300536367
            };
            view.popup.close();
            view.goTo(camera);
        }
    }
    
    
    

    componentDidMount() {
        loadModules(["esri/Map", "esri/WebMap", "esri/WebScene", "esri/views/MapView", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/BasemapGallery", "esri/widgets/Locate", "esri/widgets/Search", "esri/Camera", "esri/widgets/Editor", "esri/popup/content/TextContent", "esri/widgets/Expand"])
            .then(([Map, WebMap, MapView, WebScene, SceneView, GraphicsLayer, Graphic, BasemapGallery, Locate, Search, Camera, Editor, TextContent, Expand]) => {
                var map = new Map({
                    basemap: "hybrid"
                });
                
                {
                // ein hod
                // camera = new Camera({
                //     position: {
                //         x: 34.97992814784823,
                //         y: 32.559655621247935,
                //         z: 2500
                //     },
                //     heading: 0.34445102566290225,
                //     tilt: 82.95536300536367
                // });
                }
                
                camera = new Camera({
                    position: {
                        x: -42,
                        y: 38,
                        z: 12000000
                    },
                    heading: 0,
                    tilt: 15
                });
                
                view = new SceneView({
                    container: "pointTestViewDiv",
                    map: map,
                    camera: camera
                }); 
                
                
                function switchView() {
                    var is3D = appConfig.activeView.type === "3d";
                  
                    // remove the reference to the container for the previous view
                    appConfig.activeView.container = null;
                  
                    if (is3D) {
                      // if the input view is a SceneView, set the viewpoint on the
                      // mapView instance. Set the container on the mapView and flag
                      // it as the active view
                      appConfig.mapView.viewpoint = appConfig.activeView.viewpoint.clone();
                      appConfig.mapView.container = appConfig.container;
                      appConfig.activeView = appConfig.mapView;
                      switchButton.value = "3D";
                    } else {
                      appConfig.sceneView.viewpoint = appConfig.activeView.viewpoint.clone();
                      appConfig.sceneView.container = appConfig.container;
                      appConfig.activeView = appConfig.sceneView;
                      switchButton.value = "2D";
                    }
                  }
                    
                
                // BaseMap Widget
                
                var basemapGallery = new BasemapGallery({
                    view: view
                });
                
                var bgExpand = new Expand({
                    view: view,
                    content: basemapGallery
                  });

                view.ui.add(bgExpand, {
                    position: "bottom-right"
                });
                
                
                // Search Widget
                
                const searchWidget = new Search({
                    view: view
                });

                view.ui.add(searchWidget, {
                    position: "bottom-right",
                    index: 2
                });
        
                var graphicsLayer = new GraphicsLayer();
                map.add(graphicsLayer);
            
                // var editThisAction = {
                //     title: 'Edit',
                //     id: 'edit-this',
                //     className: 'esri-icon-edit'
                // };
                
                var expandThisAction = {
                    title: 'Expand',
                    id: 'expand-this',
                    className: 'esri-icon-zoom-out-fixed'
                };
                
                let points = this.state.points;
                
                
                
                view.popup.autoOpenEnabled = false;
                view.popup.on("trigger-action", function(event) {
                    // Execute the measureThis() function if the measure-this action is clicked
                    // if (event.action.id === "edit-this") {
                    //     editThis(event);
                    // }
                    if (event.action.id === "expand-this") {
                        expandThis(event);
                    }
                });
                
                // let editThis = (event) => {
                //     console.log('edit', event);
                // }
                
                let expandThis = (event) => { 
                    console.log('expand', event.target.project);
                    view.popup.close();
                    this.props.handleExpandProject(event.target.project);
                }
                
                view.on('click', (event) => {
                    console.log('in click');
                    if (this.props.allowAddPoint) {
                        let point = {
                            project: {},
                            title: `point ${this.state.points.length + 1}`,
                            type: "point",
                            x: event.mapPoint.longitude,
                            y: event.mapPoint.latitude,
                            z: 500
                        };
                        this.props.addPoint(point).then(respoint => {
                            console.log(respoint);
                            
                            points.push(respoint);
                            this.setState({points});
                            var polyline = {
                                type: "polyline",
                                paths: [
                                [event.mapPoint.longitude, event.mapPoint.latitude, 0],
                                [event.mapPoint.longitude, event.mapPoint.latitude, 490]
                                ]
                            };
                        
                            var lineSymbol = {
                                type: "simple-line",
                                color: [226, 119, 40],
                                width: 4
                            };
                    
                            var polylineGraphic = new Graphic({
                                geometry: polyline,
                                symbol: lineSymbol
                            });
                    
                            graphicsLayer.add(polylineGraphic);
                            
                            
                            var pointGraphic = new Graphic({
                                point: respoint,
                                geometry: respoint,
                                symbol: markerSymbol
                            });
                            
                            graphicsLayer.add(pointGraphic);
                        });
                        
                    }

                    view.hitTest(event).then(function(response) {
                        // check if a graphic is returned from the hitTest
                        let results = response.results[0].graphic
                        if (results) {
                            console.log('in click graphic', response.results[0]);
                            let title = (results.point && results.point.title) || 'Edit this';
                            let content = (results.point && results.point.content) || 'Edit this';
                            
                            view.popup.open({
                                // Set the popup's title to the coordinates of the location
                                project: results.point || {},
                                title: title,
                                location: event.mapPoint, // Set the location of the popup to the clicked location
                                content: content,
                                actions: [expandThisAction] // editThisAction, 
                            });
                            
                            //this.props.addPoint(response.results[0].graphic.point);
                            //this.props.setSelectedProject(response.results[0].graphic.point);
                            //this.setState({selectedPoint: response.results[0].graphic.point});
                        }
                    });
                    
                });
                
                
            
                this.state.points.forEach(point => {
                    var polyline = {
                        type: "polyline",
                        paths: [
                            [point.x, point.y, 0],
                            [point.x, point.y, 490]
                        ]
                    };
                
                    var lineSymbol = {
                        type: "simple-line",
                        color: [226, 119, 40],
                        width: 4
                    };
            
                    var polylineGraphic = new Graphic({
                        geometry: polyline,
                        symbol: lineSymbol
                    });
            
                    graphicsLayer.add(polylineGraphic);
                    
                    var pointGraphic = new Graphic({
                        point: point,
                        geometry: point,
                        symbol: markerSymbol
                    });
                    graphicsLayer.add(pointGraphic);
                    graphicsLayer
                        .when(function() {
                            return graphicsLayer.queryExtent();
                        })
                        .then(function(response) {
                            view.goTo(response.extent);
                        });
                })
            })
    }
 
    render() {
        return ( 
            <div style = { styles.container } >
                <div id = 'pointTestViewDiv' style = { styles.mapDiv } >
                    
                </div>
            </div>
        );
    }
}

export default PointTest;