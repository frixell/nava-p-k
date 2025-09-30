import React, { Component } from 'react';
import {loadModules} from 'esri-loader';
import isEqual from 'lodash.isequal';
import { withTranslation } from 'react-i18next';

const circleToPolygon = require('circle-to-polygon');


// let factorY = point.y > 0 ? zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10) : - zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10);
// let startX = point.x + 1 / pointCategories.length * zoomFactorsX[view.zoom] * index;
// let stepX = 1 / pointCategories.length * zoomFactorsX[view.zoom];
                //             0         1         2         3        4        5        6        7        8        9       10       11     12     13    14    15    16   17   18   19   20   21   22    23
let zoomRadius =      [1258291.2, 629145.6, 314572.8, 157286.4, 78643.2, 39321.6, 19660.8,  9830.4,  4915.2,  2457.6,  1228.8,   614.4, 307.2, 153.6, 76.8, 38.4, 19.2, 9.6, 4.8, 2.4, 1.2, 0.6, 0.3, 0.15];
let indexY     =      [10000000,  10000000,       50,       50,      12,     4.1,     3.3,     2.1,     1.5,     1.2,     1.1,     1.05];

let zoomFactorsX =    [8,   6, 4,  3  , 1.5, 0.8, 0.5, 0.3, 0.2, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005, 0.003, 0.001, 0.0005, 0.0002, 0.0001, 0.00005, 0.00002, 0.00001, 0.000005];
let zoomFactorsY =    [8,   6, 4,  3  , 1.8,   1, 0.5, 0.3, 0.2, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005, 0.003, 0.001, 0.0005, 0.0002, 0.0001, 0.00005, 0.00002, 0.00001, 0.000005];
let zoomFactorsYVal = [1, 1.5, 2,  3.1,   5,   8,  16,  30,  40,  80,  160,  300,  450,  900,  1800,  3300,  9900,  20000,  50000, 100000,  200000,  500000, 1000000,  2000000];
// let startZoom = 3;
// let startX = 0;
// let startY = 0;
let gotoZoom = 10;
var windowWidth   = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;
let startZoom = windowWidth < 768 ? 1 : 3;
let startX = -20;
let startY = 35;
                
let map = null;
let graphicsLayer = null;
let view = null;
let camera = null;
let searchWidget = null;
let expandThisAction = {};
let editGraphic = null;
let pointGraphic = null;
let polygonGraphic = null;
//let circleGraphic = null;
let polygon = null;
let simpleFillSymbol = null;
let markerSymbolWidth = 3;
let markerSymbolOutlineWidth = 2;
const styles = {
    container: {
        height: '100%',
        color: '#000',
        fontSize: 2
    },
    mapDiv: {
        height: windowWidth < 768 ? windowWidth * 0.6 : '100%',
        width: windowWidth < 768 ? windowWidth : '100%',
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
        if (this.props.i18n.language !== prevProps.lang) {
            this.setState({lang: this.props.i18n.language});
            
            if (this.props.i18n.language === 'en') {
                if (view) {
                    view.ui.move("zoom", this.props.i18n.language === 'en' ? 'top-right' : 'top-left');
                    view.ui.move(searchWidget, this.props.i18n.language === 'en' ? 'bottom-left' : 'bottom-right');
                    view.popup.lang = this.props.i18n.language;
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
                    view.ui.move("zoom", this.props.i18n.language === 'en' ? 'top-right' : 'top-left');
                    view.ui.move(searchWidget, this.props.i18n.language === 'en' ? 'bottom-left' : 'bottom-right');
                    view.popup.lang = this.props.i18n.language;
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
        
        // console.log('this.state.openCategories', this.state.openCategories);
        // console.log('this.props.openCategories', this.props.openCategories);
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
            //                 color: [108, 118, 128],
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
            //                     color: [108, 118, 128],
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
                zoom: gotoZoom
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
                
                let yIndex = 0;
                if (point.y < 0 && point.y > -10) {
                    yIndex = 1;
                } else if (point.y < -9 && point.y > -20) {
                    yIndex = 2;
                } else if (point.y < -19 && point.y > -30) {
                    yIndex = 3;
                } else if (point.y < -29 && point.y > -40) {
                    yIndex = 4;
                } else if (point.y < -39 && point.y > -50) {
                    yIndex = 5;
                } else if (point.y < -49 && point.y > -60) {
                    yIndex = 6;
                } else if (point.y < -59 && point.y > -70) {
                    yIndex = 7;
                } else if (point.y < -69 && point.y > -80) {
                    yIndex = 8;
                } else if (point.y < -79 && point.y > -85) {
                    yIndex = 9;
                } else if (point.y < -84 && point.y > -100) {
                    yIndex = 10;
                }
                if (point.y > 0 && point.y < 10) {
                    yIndex = 1;
                } else if (point.y > 9 && point.y < 20) {
                    yIndex = 2;
                } else if (point.y > 19 && point.y < 30) {
                    yIndex = 3;
                } else if (point.y > 29 && point.y < 40) {
                    yIndex = 4;
                } else if (point.y > 39 && point.y < 50) {
                    yIndex = 5;
                } else if (point.y > 49 && point.y < 60) {
                    yIndex = 6;
                } else if (point.y > 59 && point.y < 70) {
                    yIndex = 7;
                } else if (point.y > 69 && point.y < 80) {
                    yIndex = 8;
                } else if (point.y > 79 && point.y < 85) {
                    yIndex = 9;
                } else if (point.y > 84 && point.y < 100) {
                    yIndex = 10;
                }
                // console.log('yIndex', yIndex);
                const coordinates = [point.x, point.y];
                // console.log('view.zoom', view.zoom);
                // console.log('zoomRadius[view.zoom]', zoomRadius[Math.round(view.zoom)]);
                const radius = zoomRadius[Math.round(view.zoom)] - zoomRadius[Math.round(view.zoom)] / indexY[Math.round(yIndex)]; //zoomFactorsY[view.zoom] * 2000000 / (zoomFactorsY[view.zoom] * 10) - point.y * (zoomFactorsY[view.zoom] * zoomFactorsYVal[view.zoom] * 200);
                const numberOfEdges = 240;
                
                let slices = numberOfEdges / pointCategories.length;
                
                let newPolygon = circleToPolygon(coordinates, radius, numberOfEdges);
                
                if (pointCategories.length > 0) {
                    pointCategories.map((category, index) => {
                        let factorY = point.y > 0 ? zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10) : - zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10);
                        let startX = point.x + 1 / pointCategories.length * zoomFactorsX[view.zoom] * index;
                        let stepX = 1 / pointCategories.length * zoomFactorsX[view.zoom];
                        polygon = {
                            type: "polygon",
                            rings: [
                            [startX, point.y],
                            [startX, point.y + factorY],
                            [startX + stepX, point.y + factorY],
                            [startX + stepX, point.y]
                            ],
                            center: [point.x, point.y]
                        };
                        
                        let colorIndex = 0;
                        this.props.categories.map((propsCategory, index) => {
                            if (propsCategory.id === category) {
                                colorIndex = index;
                            }
                        });
                        markerSymbolColor = this.props.categoryColors[colorIndex].color;
                        
                        
                        simpleFillSymbol = {
                            type: "simple-fill",
                            color: markerSymbolColor,
                            outline: {
                            color: [108, 118, 128],
                            width: 0
                            }
                        };
                        
                        
                        polygon.rings = newPolygon.coordinates[0].slice(index * slices, index * slices + slices +1);
                        polygon.rings.push([point.x, point.y]);
                        polygon.rings.unshift([point.x, point.y]);
                        
                        
                        polygonGraphic = {
                            point: point,
                            geometry: polygon,
                            symbol: simpleFillSymbol
                        };
                
                        graphicsLayer.add(polygonGraphic);
                    });
                    
                    markerSymbol = {
                        type: "simple-marker",
                        color: [255, 255, 255,0],
                        outline: {
                            color: [255, 255, 255],
                            width: markerSymbolOutlineWidth
                        }
                    };
                    
                    
                    simpleFillSymbol = {
                        type: "simple-fill",
                        color: [0,0,0,0],
                        outline: {
                        color: [255, 255, 255],
                        width: 2
                        }
                    };
                    polygon.rings = newPolygon.coordinates[0];
                    
                    polygonGraphic = {
                        point: point,
                        geometry: point,
                        symbol: markerSymbol
                    };
            
                    graphicsLayer.add(polygonGraphic);

                    
                } else {
                    let factorY = point.y > 0 ? zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10) : - zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10);
                    let startX = point.x;
                    let stepX = 1 * zoomFactorsX[view.zoom];
                    polygon = {
                        type: "polygon",
                        rings: [
                        [startX, point.y],
                        [startX, point.y + factorY],
                        [startX + stepX, point.y + factorY],
                        [startX + stepX, point.y]
                        ],
                        center: [point.x, point.y]
                    };
            
                    simpleFillSymbol = {
                        type: "simple-fill",
                        color: [255,255,255,0.85],  // orange, opacity 80%
                        outline: {
                        color: [108, 118, 128],
                        width: 0.5
                        }
                    };
            
                    polygonGraphic = {
                        point: point,
                        geometry: polygon,
                        symbol: simpleFillSymbol
                    };
            
                    graphicsLayer.add(polygonGraphic);
                }
                
                
                graphicsLayer
                    .when(function() {
                        // console.log(graphicsLayer.fullExtent);
                        return graphicsLayer.fullExtent;
                    })
                    .then(function(response) {
                        // console.log(response);
                        // view.goTo(response.extent);
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

                // "dark-gray"
                // "dark-gray-vector"
                // "gray"
                // "gray-vector"
                // "hybrid"
                // "national-geographic"
                // "oceans"
                // "osm"
                // "satellite"
                // "streets"
                // "streets-navigation-vector"
                // "streets-night-vector"
                // "streets-relief-vector"
                // "streets-vector"
                // "terrain"
                // "topo"
                // "topo-vector"


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
                    zoom: startZoom,
                    center: [startX, startY]
                });
                
                view.constraints = {
                    minZoom: windowWidth < 768 ? 1 : 3
                };
                
                
                //view.ui.components = [];
                graphicsLayer = new GraphicsLayer({
                    id: "mosh"
                });
                map.add(graphicsLayer);
                
                view.ui.move("zoom", this.props.i18n.language === 'en' ? 'top-right' : 'top-left');
                
                
                // Search Widget
                if (windowWidth >767) {
                    searchWidget = new Search({
                        view: view
                    });

                    view.ui.add(searchWidget, {
                        position: "bottom-left",
                        index: 2
                    });
                    
                    view.ui.move(searchWidget, this.props.i18n.language === 'en' ? 'bottom-left' : 'bottom-right');
                }
                
                expandThisAction = {
                    title: this.props.i18n.language === 'en' ? 'Expand' : 'הרחבה',
                    id: 'expand-this',
                    className: 'esri-icon-zoom-out-fixed'
                };
                
                let points = this.state.points;
                
                view.popup.autoOpenEnabled = false;
                view.popup.on("trigger-action", function(event) {
                    // console.log(event);
                    if (event.action.id === "expand-this") {
                        // console.log('here');
                        expandThis(event);
                        //selectedPoint
                    }
                });
                
                let expandThis = (event) => {
                    // console.log(event);
                    this.props.handleExpandProject(this.state.selectedPoint);
                    view.popup.close();
                }
                
                const detectZoom = (newValue, oldValue, property, object) => {
                    graphicsLayer.removeAll();
                    setTimeout(this.drawPoints(), 250);
                }
                
                view.watch('zoom', detectZoom);
                
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
                            // console.log('respoint', respoint);
                            points.push(respoint);
                            this.setState({points});
                            
                            let factorY = point.y > 0 ? zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10) : - zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10);
                            let startX = point.x;
                            let stepX = 1 * zoomFactorsX[view.zoom];
                            polygon = {
                                type: "polygon",
                                rings: [
                                [startX, point.y],
                                [startX, point.y + factorY],
                                [startX + stepX, point.y + factorY],
                                [startX + stepX, point.y]
                                ],
                                center: [point.x, point.y]
                            };
                            
                            simpleFillSymbol = {
                                type: "simple-fill",
                                color: [255,255,255,0.85],
                                outline: {
                                color: [108, 118, 128],
                                width: 0.5
                                }
                            };
                            
                            // circleGraphic = new Circle({
                            //     spatialReference: mapView.spatialReference,
                            //     center: event.vertices[0],
                            //  });
 
                            
                            pointGraphic = new Graphic({
                                point: respoint,
                                geometry: polygon,
                                symbol: simpleFillSymbol
                            });
                            // console.log('pointGraphic', pointGraphic);
                            graphicsLayer.add(pointGraphic);
                        });
                    }
                    
                    const setAction = (point) => {
                        this.setState({selectedPoint: point});
                    }
                    
                    view.hitTest(event).then(function(response) {
                        // console.log('hitTest response', response);
                        let results = response.results[0].graphic;
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

export default withTranslation()(MapViewTest);