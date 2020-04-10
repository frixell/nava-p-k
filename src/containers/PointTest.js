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
    
    componentDidUpdate(prevProps) {
        if (this.props.sidebarClickedItemId !== prevProps.sidebarClickedItemId) {
            let selectedPoint = null;
            this.props.points.map(point => {
                console.log(point);
                if (point.id === this.props.sidebarClickedItemId) {
                    console.log('point');
                    selectedPoint = point;
                }
            });
            console.log(selectedPoint);
            camera = {
                position: {
                    x: selectedPoint.x,
                    y: selectedPoint.y - 0.15,
                    z: 2500
                },
                heading: 0.37445102566290225,
                tilt: 82.95536300536367
            };
            view.goTo(camera);
        }
    }

    componentDidMount() {
        loadModules(["esri/Map", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/BasemapGallery", "esri/widgets/Locate", "esri/widgets/Search", "esri/Camera", "esri/widgets/Editor", "esri/popup/content/TextContent"])
            .then(([Map, SceneView, GraphicsLayer, Graphic, BasemapGallery, Locate, Search, Camera, Editor, TextContent]) => {
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

                view.ui.add(searchWidget, {
                    position: "bottom-left",
                    index: 2
                });
                
                var basemapGallery = new BasemapGallery({
                    view: view
                });

                view.ui.add(basemapGallery, {
                    position: "bottom-right"
                });
                
        
                var graphicsLayer = new GraphicsLayer();
                map.add(graphicsLayer);
                
                // view.popup = {
                //     dockEnabled: true,
                //     dockOptions: {
                //     // Disables the dock button from the popup
                //     buttonEnabled: false,
                //     // Ignore the default sizes that trigger responsive docking
                //     breakpoint: true
                //     }
                // };
            
                var editThisAction = {
                    title: 'Edit',
                    id: 'edit-this',
                    className: 'esri-icon-edit'
                };
                
                var expandThisAction = {
                    title: 'Expand',
                    id: 'expand-this',
                    className: 'esri-icon-zoom-out-fixed'
                };
                
                let points = this.state.points;
                view.popup.autoOpenEnabled = false;
                view.popup.on("trigger-action", function(event) {
                    // Execute the measureThis() function if the measure-this action is clicked
                    if (event.action.id === "edit-this") {
                        editThis();
                    }
                    if (event.action.id === "expand-this") {
                        expandThis();
                    }
                });
                
                let editThis = () => {
                    console.log('edit');
                }
                
                let expandThis = () => {
                    console.log('expand');
                }
                
                view.on('click', (event) => {
                    if (this.props.allowAddPoint) {
                        let point = {
                            title: `point ${this.state.points.length}`,
                            type: "point",
                            x: event.mapPoint.longitude,
                            y: event.mapPoint.latitude,
                            z: 500
                        };
                        this.props.addPoint(point);
                        this.setState(points);
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
                            geometry: point,
                            symbol: markerSymbol
                        });
                        
                        graphicsLayer.add(pointGraphic);
                    }
                    
                    view.hitTest(event).then(function(response) {
                        console.log('response', response);
                        // check if a graphic is returned from the hitTest
                        if (response.results[0].graphic) {
                            let title = response.results[0].graphic.point.title;
                            let content = response.results[0].graphic.point.content;
                            view.popup.open({
                                // Set the popup's title to the coordinates of the location
                                title: title,
                                location: event.mapPoint, // Set the location of the popup to the clicked location
                                content: content,
                                actions: [editThisAction, expandThisAction]
                            });
                        }
                        });
                    
                });
                
                var markerSymbol = {
                    type: "simple-marker",
                    color: [226, 119, 40],
                    outline: {
                    color: [255, 255, 255],
                    width: 2
                    }
                };
            
                this.state.points.forEach(point => {
                    console.log('point', point);
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