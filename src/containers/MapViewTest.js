import React, { Component } from 'react';
import {loadModules} from 'esri-loader'
 
let view = null;
let camera = null;
let searchWidget = null;
let expandThisAction = {};
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



//let categoryColors = ['#409191', '#c1617e', '#5eae88', '#a6c98d', '#db8976', '#e8e2a4', '#e5b682']

let categoryColors = [[64,145,145], [193,97,126], [94,174,136], [166,201,141], [219,137,118], [232,226,164], [229,182,130] ]




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
        selectedPoint: null,
        lang: 'en'
    }
    
    componentDidUpdate(prevProps) {
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
        loadModules(["esri/Map", "esri/views/MapView", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/Search", "esri/Camera", "esri/widgets/Editor", "esri/popup/content/TextContent", "esri/widgets/Expand", "esri/widgets/Zoom"]) // "esri/widgets/BasemapGallery", "esri/widgets/Locate",
            .then(([Map, MapView, SceneView, GraphicsLayer, Graphic, Search, Expand, Zoom]) => { // BasemapGallery,
                var map = new Map({
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
                var graphicsLayer = new GraphicsLayer();
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
                            var pointGraphic = new Graphic({
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