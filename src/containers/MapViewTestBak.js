import React, { Component } from 'react';
import {loadModules} from 'esri-loader';
import isEqual from 'lodash.isequal';

let map = null;
let graphicsLayer = null;
let view = null;
let polygon = null;
let camera = null;
let searchWidget = null;
let expandThisAction = {};
let editGraphic = null;
let pointGraphic = null;
let polygonGraphic = null;
let markerSymbolWidth = 3;
let markerSymbolOutlineWidth = 1;
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

let markerSymbol = null;

let imageSymbol = null;

class MapViewTest extends Component {
    state ={
        coordinates: [],
        points: null,
        selectedPoint: null,
        lang: 'en',
        openCategories: []
    }
    
    componentDidUpdate(prevProps) {
        //console.log('map', map);
        //if (map) console.log('map.layers.items[0].graphics.items[0].symbol.color.a', map.layers.items[0].graphics.items[0].symbol.color);
        //if (map) map.layers.items[0].graphics.items[0].symbol.color = {r:0,g:0,b:0,a:1};
        //if (map) console.log('map.layers.items[0].graphics.items[0].symbol.color.a 2', map.layers.items[0].graphics.items[0].symbol.color);
        if (this.props.lang !== prevProps.lang) {
            this.setState({lang: this.props.lang});
            
            if (this.props.lang === 'en') {
                if (view) {
                    view.ui.move("zoom", this.props.lang === 'en' ? 'top-right' : 'top-left');
                    view.ui.move(searchWidget, this.props.lang === 'en' ? 'bottom-left' : 'bottom-right');
                    view.popup.lang = this.props.lang;
                    view.popup.title = this.state.selectedPoint && this.state.selectedPoint.title;
                    view.popup.content = this.state.selectedPoint && this.state.selectedPoint.content;
                    expandThisAction = {
                        title: 'Expand',
                        id: 'expand-this',
                        className: 'esri-icon-zoom-out-fixed'
                    };
                    view.popup.actions = [expandThisAction];
                }
            } else {
                if (view) {
                    view.ui.move("zoom", this.props.lang === 'en' ? 'top-right' : 'top-left');
                    view.ui.move(searchWidget, this.props.lang === 'en' ? 'bottom-left' : 'bottom-right');
                    view.popup.lang = this.props.lang;
                    view.popup.title = this.state.selectedPoint && this.state.selectedPoint.titleHebrew;
                    view.popup.content = this.state.selectedPoint && this.state.selectedPoint.contentHebrew;
                    expandThisAction = {
                        title: 'הרחבה',
                        id: 'expand-this',
                        className: 'esri-icon-zoom-out-fixed'
                    };
                    view.popup.actions = [expandThisAction];
                }
            }
        }
        
        console.log('this.state.openCategories', this.state.openCategories);
        console.log('this.props.openCategories', this.props.openCategories);
        if (this.props.openCategories.length !== this.state.openCategories.length || (this.props.openCategories.length === 0 && graphicsLayer)) {
            
            graphicsLayer.removeAll();
            this.drawPoints();
            
            
            
            // console.log('1 - in map view test');
            // if (this.props.openCategories.length === 0 && graphicsLayer) {
            //     graphicsLayer.removeAll();
            //     this.state.points.forEach(point => {
            //         let pointCategories = (point.categories && point.categories.split(',')) || [];
            //         let markerSymbolColor = [226, 119, 40];
            //         if (pointCategories.length > 0) {
            //             let colorIndex = 0;
            //             this.props.categories.map((category, index) => {
            //                 if (category.id === pointCategories[0]) {
            //                     colorIndex = index;
            //                 }
            //             });
            //             markerSymbolColor = this.props.categoryColors[colorIndex].color;
            //         }
            //         markerSymbol = {
            //             type: "simple-marker",
            //             color: markerSymbolColor,
            //             outline: {
            //                 color: [255, 255, 255],
            //                 width: markerSymbolOutlineWidth
            //             }
            //         };
            //         imageSymbol = {
            //             type: "picture-fill",  // autocasts as new PictureFillSymbol()
            //             url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
            //             width: "24px",
            //             height: "24px",
            //             outline: {
            //             style: "solid"
            //             },
            //         };
            //         pointGraphic = {
            //             point: point,
            //             geometry: point,
            //             symbol: markerSymbol
            //         };
            //         graphicsLayer.add(pointGraphic);
            //         graphicsLayer
            //             .when(function() {
            //                 return graphicsLayer.queryExtent();
            //             })
            //             .then(function(response) {
            //                 view.goTo(response.extent);
            //             });
            //     });
            // } else {
            //     console.log('2');
            //     //graphicsLayer.remove(editGraphic);
            //     graphicsLayer.removeAll();
            //     this.state.points.forEach(point => {
            //         let pointCategories = (point.categories && point.categories.split(',')) || [];
            //         let markerSymbolColor = [226, 119, 40];
            //         let showPoint = false;
            //         pointCategories.map(pointCategoryId => {
            //             this.props.openCategories.map(openCategory => {
            //                 console.log('openCategory.id', openCategory);
            //                 console.log('pointCategoryId', pointCategoryId);
            //                 if (openCategory === pointCategoryId) {
            //                     showPoint = true;
            //                 }
            //             })
            //         })
                    
            //         console.log('showPoint', showPoint);
                    
            //         if (showPoint) {
            //             if (pointCategories.length > 0) {
            //                 let colorIndex = 0;
            //                 this.props.categories.map((category, index) => {
            //                     if (category.id === pointCategories[0]) {
            //                         colorIndex = index;
            //                     }
            //                 });
            //                 markerSymbolColor = this.props.categoryColors[colorIndex].color;
            //             }
            //             markerSymbol = {
            //                 type: "simple-marker",
            //                 color: markerSymbolColor,
            //                 outline: {
            //                     color: [255, 255, 255],
            //                     width: markerSymbolOutlineWidth
            //                 }
            //             };
            //             pointGraphic = {
            //                 point: point,
            //                 geometry: point,
            //                 symbol: markerSymbol
            //             };
            //             graphicsLayer.add(pointGraphic);
            //             graphicsLayer
            //                 .when(function() {
            //                     return graphicsLayer.queryExtent();
            //                 })
            //                 .then(function(response) {
            //                     view.goTo(response.extent);
            //                 });
            //         }
            //         //this.setState({openCategories: this.props.openCategories});
            //     });
            // }
            
        }
        
        
        if (!isEqual(this.props.points, prevProps.points)) {
            this.setState({points: this.props.points});
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
    
    drawPoints = () => {
        this.state.points.forEach(point => {
            let pointCategories = (point.categories && point.categories.split(',')) || [];
            let markerSymbolColor = [226, 119, 40];
            let showPoint = false;
            pointCategories.map(pointCategoryId => {
                this.props.openCategories.map(openCategory => {
                    console.log('openCategory.id', openCategory);
                    console.log('pointCategoryId', pointCategoryId);
                    if (openCategory === pointCategoryId) {
                        showPoint = true;
                    }
                })
            })
            if (showPoint || this.props.openCategories.length === 0) {
                if (pointCategories.length > 0) {
                    let colorIndex = 0;
                    this.props.categories.map((category, index) => {
                        if (category.id === pointCategories[0]) {
                            colorIndex = index;
                        }
                    });
                    markerSymbolColor = this.props.categoryColors[colorIndex].color;
                }
                
                
                
                
                
                
                markerSymbol = {
                    type: "simple-marker",
                    color: markerSymbolColor,
                    outline: {
                        color: [255, 255, 255],
                        width: markerSymbolOutlineWidth
                    }
                };

                
                
                
                imageSymbol = {
                    type: "picture-fill",  // autocasts as new PictureFillSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
                    width: "24px",
                    height: "24px",
                    outline: {
                    style: "solid"
                    },
                };
                
                
                
        
                
                
                
                
                
                
                
                
                
                
                
                
                
                //console.log(point);
                
                
                //   var polyline = {
                //     type: "polyline", // autocasts as new Polyline()
                //     paths: [[point.x, point.y - 0.5], [point.x, point.y + 0.5]]
                //   };
                
                //   var lineSymbol = {
                //     type: "simple-line", // autocasts as new SimpleLineSymbol()
                //     color: markerSymbolColor, // RGB color values as an array
                //     width: 10
                //   };
                
                //   var lineAtt = {
                //     Name: "Keystone Pipeline", // The name of the pipeline
                //     Owner: "TransCanada", // The owner of the pipeline
                //     Length: "3,456 km" // The length of the pipeline
                //   };
                
                //   var polylineGraphic = new Graphic({
                //     geometry: polyline, // Add the geometry created in step 4
                //     symbol: lineSymbol, // Add the symbol created in step 5
                //     attributes: lineAtt // Add the attributes created in step 6
                //   });
                
                //   // Add the graphic to the view's default graphics view
                //   // If adding multiple graphics, use addMany and pass in the array of graphics.
                //   graphicsLayer.add(polylineGraphic);
                
                //console.log('view', view);
                
                
                
                
                var polygon = {
                    type: "polygon",
                    rings: [
                    [point.x - (2 * 3 / view.zoom), point.y - (2 * 3 / view.zoom)],
                    [point.x - (2 * 3 / view.zoom), point.y + (2 * 3 / view.zoom)],
                    [point.x + (2 * 3 / view.zoom), point.y + (2 * 3 / view.zoom)],
                    [point.x + (2 * 3 / view.zoom), point.y - (2 * 3 / view.zoom)]
                    ],
                    center: [point.x, point.y]
                };
                
                
                console.log('point', 5 * 3 / view.zoom);
        
                var simpleFillSymbol = {
                    type: "simple-fill",
                    color: markerSymbolColor,  // orange, opacity 80%
                    outline: {
                    color: [255, 255, 255],
                    width: 1
                    }
                };
        
                polygonGraphic = {
                    geometry: polygon,
                    symbol: simpleFillSymbol
                };
        
                graphicsLayer.add(polygonGraphic);
                
                
                
                
                
                
                //   var polygon = {
                //     type: "polygon", // autocasts as new Polygon()
                //     rings: [
                //       [30.184, 51.48391, 400],
                //       [30.184, 51.49091, 500],
                //       [30.172, 51.49091, 500],
                //       [30.172, 51.48391, 400],
                //       [30.184, 51.48391, 400]
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
                
                
                
                markerSymbol = {
                    type: "simple-marker",
                    color: markerSymbolColor,
                    outline: {
                        color: [255, 255, 255],
                        width: markerSymbolOutlineWidth
                    }
                };

                
                
                
                imageSymbol = {
                    type: "picture-fill",  // autocasts as new PictureFillSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
                    width: "24px",
                    height: "24px",
                    outline: {
                    style: "solid"
                    },
                };
                
                
                
                
                // let simpleSymbol = {
                //     type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                //     color: [ 51, 51, 204, 0.9 ],
                //     style: "solid",
                //     outline: {  // autocasts as new SimpleLineSymbol()
                //         color: "white",
                //         width: 1
                //     }
                // };
                
                // polygonGraphic = new Graphic({
                //     point: point,
                //     geometry: point,
                //     symbol: simpleSymbol
                // });
                
                
                
                
                pointGraphic = {
                    point: point,
                    geometry: point,
                    symbol: markerSymbol
                };
                
                
                //graphicsLayer.add(pointGraphic);
                
                
                
                
                
                
                
                
                graphicsLayer
                    .when(function() {
                        return graphicsLayer.queryExtent();
                    })
                    .then(function(response) {
                        view.goTo(response.extent);
                    });
            }
        });
    }
    

    componentDidMount() {
        this.setState({points: this.props.points});
        loadModules(["esri/Map", "esri/views/MapView", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/geometry/Polygon", "esri/symbols/SimpleFillSymbol", "esri/widgets/Search", "esri/Camera", "esri/widgets/Editor", "esri/popup/content/TextContent", "esri/widgets/Expand", "esri/widgets/Zoom"]) // "esri/widgets/BasemapGallery", "esri/widgets/Locate",
            .then(([Map, MapView, SceneView, GraphicsLayer, Graphic, Polygon, SimpleFillSymbol, Search, Expand, Zoom]) => { // BasemapGallery,
                map = new Map({
                    basemap: "streets"
                });
                
                view = new MapView({
                    popup: {
                        lang: this.state.lang,
                        dockEnabled: true,
                        dockOptions: {
                            buttonEnabled: false,
                            breakpoint: false,
                            position: 'top-left'
                        }
                    },
                    container: "pointTestViewDiv",
                    map: map,
                    zoom: 3,
                    center: [-20, 35]
                });
                
                
                //view.ui.components = [];
                graphicsLayer = new GraphicsLayer({
                    id: "mosh"
                });
                map.add(graphicsLayer);
                
                view.ui.move("zoom", this.props.lang === 'en' ? 'top-right' : 'top-left');
                
                
                // Search Widget
                
                searchWidget = new Search({
                    view: view
                });

                view.ui.add(searchWidget, {
                    position: "bottom-left",
                    index: 2
                });
                
                view.ui.move(searchWidget, this.props.lang === 'en' ? 'bottom-left' : 'bottom-right');
                
                expandThisAction = {
                    title: this.props.lang === 'en' ? 'Expand' : 'הרחבה',
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
                    view.popup.close();
                    this.props.handleExpandProject(event.target.project);
                }
                
                
                
                const detectZoom = (newValue, oldValue, property, object) => {
                    console.log("New Value: ",newValue," Old Value: ",oldValue, " Changed Property: ",property," Watched Object: ",object);
                    graphicsLayer.removeAll();
                    setTimeout(this.drawPoints(), 250);
                }
                
                view.watch('zoom', detectZoom);
                // view.on('zoom-start', function(event){
                        
                //     console.log(view.zoom);
                //   });
                
                //   map.on("zoom-end", function(){

                //     alert("this is my Map");
                
                // });
                
                view.on('click', (event) => {
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
                            points.push(respoint);
                            this.setState({points});
                            pointGraphic = new Graphic({
                                point: respoint,
                                geometry: respoint,
                                symbol: markerSymbol
                            });
                            graphicsLayer.add(pointGraphic);
                        });
                    }
                    const setAction = (point) => {
                        this.setState({selectedPoint: point});
                    }
                    view.hitTest(event).then(function(response) {
                        //editGraphic = response.results[0].graphic;
console.log('editGraphic', editGraphic);
                        // Remove the graphic from the GraphicsLayer
                        // Sketch will handle displaying the graphic while being updated
                        //view.graphics.removeAll();
                        //graphicsLayer.remove(editGraphic);
                        
                        
                        let results = response.results[0].graphic
                        if (results) {
                            let titleHebrew = results.point.titleHebrew;
                            let contentHebrew = results.point.contentHebrew;
                            let title = results.point.title;
                            let content = results.point.content;
                            setAction(results.point);
                            view.popup.open({
                                project: results.point || {},
                                title: view.popup.lang === 'en' ? title : titleHebrew,
                                location: event.mapPoint,
                                content: view.popup.lang === 'en' ? content : contentHebrew,
                                actions: [expandThisAction]
                            });
                        }
                    });
                });
            
                this.drawPoints();
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