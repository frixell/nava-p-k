import React, { Component } from 'react';
import {loadModules} from 'esri-loader';
import isEqual from 'lodash.isequal';

let map = null;
let graphicsLayer = null;
let view = null;
let camera = null;
let searchWidget = null;
let expandThisAction = {};
let editGraphic = null;
let pointGraphic = null;
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
            console.log('1 - in map view test');
            if (this.props.openCategories.length === 0 && graphicsLayer) {
                graphicsLayer.removeAll();
                this.state.points.forEach(point => {
                    let pointCategories = (point.categories && point.categories.split(',')) || [];
                    let markerSymbolColor = [226, 119, 40];
                    if (pointCategories.length > 0) {
                        let colorIndex = 0;
                        this.props.categories.map((category, index) => {
                            if (category.id === pointCategories[0]) {
                                colorIndex = index;
                            }
                        });
                        markerSymbolColor = this.props.categoryColors[colorIndex].color;
                    }
                    let markerSymbol = {
                        type: "simple-marker",
                        color: markerSymbolColor,
                        outline: {
                            color: [255, 255, 255],
                            width: 2
                        }
                    };
                    pointGraphic = {
                        point: point,
                        geometry: point,
                        symbol: markerSymbol
                    };
                    graphicsLayer.add(pointGraphic);
                    graphicsLayer
                        .when(function() {
                            return graphicsLayer.queryExtent();
                        })
                        .then(function(response) {
                            view.goTo(response.extent);
                        });
                });
            } else {
                console.log('2');
                //graphicsLayer.remove(editGraphic);
                graphicsLayer.removeAll();
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
                    
                    console.log('showPoint', showPoint);
                    
                    if (showPoint) {
                        if (pointCategories.length > 0) {
                            let colorIndex = 0;
                            this.props.categories.map((category, index) => {
                                if (category.id === pointCategories[0]) {
                                    colorIndex = index;
                                }
                            });
                            markerSymbolColor = this.props.categoryColors[colorIndex].color;
                        }
                        let markerSymbol = {
                            type: "simple-marker",
                            color: markerSymbolColor,
                            outline: {
                                color: [255, 255, 255],
                                width: 2
                            }
                        };
                        pointGraphic = {
                            point: point,
                            geometry: point,
                            symbol: markerSymbol
                        };
                        graphicsLayer.add(pointGraphic);
                        graphicsLayer
                            .when(function() {
                                return graphicsLayer.queryExtent();
                            })
                            .then(function(response) {
                                view.goTo(response.extent);
                            });
                    }
                    //this.setState({openCategories: this.props.openCategories});
                });
            }
            
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
    

    componentDidMount() {
        this.setState({points: this.props.points});
        loadModules(["esri/Map", "esri/views/MapView", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/Search", "esri/Camera", "esri/widgets/Editor", "esri/popup/content/TextContent", "esri/widgets/Expand", "esri/widgets/Zoom"]) // "esri/widgets/BasemapGallery", "esri/widgets/Locate",
            .then(([Map, MapView, SceneView, GraphicsLayer, Graphic, Search, Expand, Zoom]) => { // BasemapGallery,
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
            
                this.state.points.forEach(point => {
                    let pointCategories = (point.categories && point.categories.split(',')) || [];
                    let markerSymbolColor = [226, 119, 40];
                    if (pointCategories.length > 0) {
                        let colorIndex = 0;
                        this.props.categories.map((category, index) => {
                            if (category.id === pointCategories[0]) {
                                colorIndex = index;
                            }
                        });
                        markerSymbolColor = this.props.categoryColors[colorIndex].color;
                    }
                    let markerSymbol = {
                        type: "simple-marker",
                        color: markerSymbolColor,
                        outline: {
                            color: [255, 255, 255],
                            width: 2
                        }
                    };
                    pointGraphic = new Graphic({
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
                });
                // const rings = [
                //     [  // first ring
                //     [-97.06138,32.837,35.1,4.8],
                //     [-97.06133,32.836,35.2,4.1],
                //     [-97.06124,32.834,35.3,4.2],
                //     [-97.06138,32.837,35.1,4.8]  // same as first vertex
                //     ], [  // second ring
                //     [-97.06326,32.759,35.4],
                //     [-97.06298,32.755,35.5],
                //     [-97.06153,32.749,35.6],
                //     [-97.06326,32.759,35.4]  // same as first vertex
                //     ]
                // ];
                
                // const polygon = new Polygon({
                //     hasZ: true,
                //     hasM: true,
                //     rings: rings,
                //     spatialReference: { wkid: 4326 }
                // });
                
                // var graphicC = new Graphic({  // graphic with polygon geometry
                //     geometry: polygon, // set geometry here
                //     symbol: new SimpleFillSymbol({}) // set symbol here
                //   });
                
                // var pointGraphic = new Graphic({
                //     point: point,
                //     geometry: polygon,
                //     symbol: markerSymbol
                // });
                //graphicsLayer.add(graphicC);
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