import React, { Component } from 'react';
import {loadModules} from 'esri-loader';
import isEqual from 'lodash.isequal';


let zoomFactorsX =    [6, 5, 4,  3  , 1.7, 0.8, 0.5, 0.4, 0.3, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005, 0.003, 0.001, 0.0005, 0.0002, 0.0001, 0.00005, 0.00002, 0.00001, 0.000005];
let zoomFactorsY =    [6, 5, 4,  3  , 1.7, 1.2, 0.5, 0.4, 0.3, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005, 0.003, 0.001, 0.0005, 0.0002, 0.0001, 0.00005, 0.00002, 0.00001, 0.000005];
let zoomFactorsYVal = [3, 3, 3,  3.2, 4.5, 4.5,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3, 3, 3, 3, 3, 3, 3, 3];
                
                
let map = null;
let graphicsLayer = null;
let view = null;
let camera = null;
let searchWidget = null;
let expandThisAction = {};
let editGraphic = null;
let pointGraphic = null;
let polygonGraphic = null;
let polygon = null;
let simpleFillSymbol = null;
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
                
                // TODO fix all zoom options
                
                if (pointCategories.length > 0) {
                    pointCategories.map((category, index) => {
                        let factorY = zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10);
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
                
                        //let currentColor = null;
                        
                        // pointCategories.map(pointCategoryId => {
                        //     this.props.openCategories.map(openCategory => {
                        //         if (openCategory === pointCategoryId) {
                        //             currentColor = category.color;
                        //         }
                        //     })
                        // })
                        
                        let colorIndex = 0;
                        this.props.categories.map((propsCategory, index) => {
                            if (propsCategory.id === category) {
                                colorIndex = index;
                            }
                        });
                        markerSymbolColor = this.props.categoryColors[colorIndex].color;
                        
                        // console.log('nu...', category);
                        // console.log('nu...', this.props.categories);
                        
                        
                        simpleFillSymbol = {
                            type: "simple-fill",
                            color: markerSymbolColor, //currentColor,  // orange, opacity 80%
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
                    });
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
                    //console.log("New Value: ",newValue," Old Value: ",oldValue, " Changed Property: ",property," Watched Object: ",object);
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
                            console.log('respoint', respoint);
                            points.push(respoint);
                            this.setState({points});
                            
                            let factorY = zoomFactorsY[view.zoom] - point.y / (zoomFactorsYVal[view.zoom] * 10);
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
                            
                            
                            pointGraphic = new Graphic({
                                point: respoint,
                                geometry: polygon,
                                symbol: simpleFillSymbol
                            });
                            console.log('pointGraphic', pointGraphic);
                            graphicsLayer.add(pointGraphic);
                        });
                    }
                    
                    const setAction = (point) => {
                        this.setState({selectedPoint: point});
                    }
                    
                    view.hitTest(event).then(function(response) {
                        console.log('hitTest response', response);
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

export default MapViewTest;