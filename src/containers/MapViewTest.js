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



//let categoryColors = ['#409191', '#5eae88', '#a6c98d', '#e8e2a4', '#e5b682', '#db8976', '#c1617e']

let categoryColors = [[64,145,145], [94,174,136], [166,201,141], [232,226,164], [229,182,130], [219,137,118], [193,97,126]]




let markerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40],
    outline: {
        color: [255, 255, 255],
        width: 2
    }
};

class MapViewTest extends Component {
    state ={
        coordinates: [],
        points: this.props.points,
        selectedPoint: null
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.points.length !== prevProps.points.length) {
            //console.log('length changed !');
        }
        if (this.props.sidebarClickedItemId !== prevProps.sidebarClickedItemId) {
            //console.log('side bar clicked');
            let selectedPoint = null;
            this.props.points.map(point => {
                if (point.id === this.props.sidebarClickedItemId) {
                    selectedPoint = point;
                }
            });
            
            view.popup.close();
            
            // view.center = [selectedPoint.x, selectedPoint.y];
            // view.zoom = 13;
            view.goTo({
                center: [selectedPoint.x, selectedPoint.y],
                zoom: 10
              })
              .catch(function(error) {
                if (error.name != "AbortError") {
                   console.error(error);
                }
              });
        }
    }
    
    //  "esri/WebScene" -- makes trouble with MapView
    

    componentDidMount() {
        loadModules(["esri/Map", "esri/views/MapView", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/Search", "esri/Camera", "esri/widgets/Editor", "esri/popup/content/TextContent", "esri/widgets/Expand"]) // "esri/widgets/BasemapGallery", "esri/widgets/Locate",
            .then(([Map, MapView, SceneView, GraphicsLayer, Graphic, Search, Expand]) => { // BasemapGallery,
                var map = new Map({
                    basemap: "streets"
                });
                
                view = new MapView({
                    popup: {
                        dockEnabled: true,
                        dockOptions: {
                        // Disables the dock button from the popup
                        buttonEnabled: false,
                        // Ignore the default sizes that trigger responsive docking
                        breakpoint: false,
                        position: 'top-left'
                        }
                    },
                    container: "pointTestViewDiv", // Reference to the scene div created in step 5
                    map: map, // Reference to the map object created before the scene
                    zoom: 3, // Sets zoom level based on level of detail (LOD)
                    center: [-20, 35] // Sets center point of view using longitude,latitude
                });
                
                var graphicsLayer = new GraphicsLayer();
                map.add(graphicsLayer);
                
                
                // BaseMap Widget
                
                // var basemapGallery = new BasemapGallery({
                //     view: view
                // });
                
                // var bgExpand = new Expand({
                //     view: view,
                //     content: basemapGallery
                //   });

                // view.ui.add(bgExpand, {
                //     position: "bottom-right"
                // });
                
                
                // Search Widget
                
                const searchWidget = new Search({
                    view: view
                });

                view.ui.add(searchWidget, {
                    position: "bottom-right",
                    index: 2
                });
        
                
                
                var expandThisAction = {
                    title: 'Expand',
                    id: 'expand-this',
                    className: 'esri-icon-zoom-out-fixed'
                };
                
                let points = this.state.points;
                
                
                
                view.popup.autoOpenEnabled = false;
                view.popup.on("trigger-action", function(event) {
                    if (event.action.id === "expand-this") {
                        expandThis(event);
                    }
                });
                
                let expandThis = (event) => { 
                    //console.log('expand', event.target.project);
                    view.popup.close();
                    this.props.handleExpandProject(event.target.project);
                }
                
                view.on('click', (event) => {
                    //console.log('in click');
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
                            //console.log(respoint);
                            
                            points.push(respoint);
                            this.setState({points});
                            // var polyline = {
                            //     type: "polyline",
                            //     paths: [
                            //     [event.mapPoint.longitude, event.mapPoint.latitude, 0],
                            //     [event.mapPoint.longitude, event.mapPoint.latitude, 490]
                            //     ]
                            // };
                        
                            // var lineSymbol = {
                            //     type: "simple-line",
                            //     color: [226, 119, 40],
                            //     width: 4
                            // };
                    
                            // var polylineGraphic = new Graphic({
                            //     geometry: polyline,
                            //     symbol: lineSymbol
                            // });
                    
                            // graphicsLayer.add(polylineGraphic);
                            
                            
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
                            //console.log('in click graphic', response.results[0]);
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
                    let pointCategories = point.categories.split(',');
                    let markerSymbolColor = [226, 119, 40];
                    if (pointCategories.length > 0) {
                        let colorIndex = 0;
                        this.props.categories.map((category, index) => {
                            if (category.id === pointCategories[0]) {
                                colorIndex = index;
                            }
                        });
                        markerSymbolColor = categoryColors[colorIndex];
                    }
                    let markerSymbol = {
                        type: "simple-marker",
                        color: markerSymbolColor,
                        outline: {
                            color: [255, 255, 255],
                            width: 2
                        }
                    };
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
            <div style={ styles.container } >
                <div id='pointTestViewDiv' style={ styles.mapDiv } >
                    
                </div>
            </div>
        );
    }
}

export default MapViewTest;