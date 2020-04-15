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

class MapSaveTest extends Component {
    state ={
        coordinates: [],
        points: this.props.points,
        selectedPoint: null
    }
    
    componentDidUpdate(prevProps) {
        // if (this.props.points.length !== prevProps.points.length) {
        //     console.log('length changed !');
        // }
        // if (this.props.sidebarClickedItemId !== prevProps.sidebarClickedItemId) {
        //     let selectedPoint = null;
        //     this.props.points.map(point => {
        //         if (point.id === this.props.sidebarClickedItemId) {
        //             selectedPoint = point;
        //         }
        //     });
        //     camera = {
        //         position: {
        //             x: selectedPoint.x,
        //             y: selectedPoint.y - 0.1,
        //             z: 2500
        //         },
        //         heading: 0.37445102566290225,
        //         tilt: 82.95536300536367
        //     };
        //     view.popup.close();
        //     view.goTo(camera);
        // }
    }
    
    //  "esri/WebScene" -- makes trouble with MapView


    componentDidMount() {
        loadModules(["esri/Map",
            "esri/views/MapView",
            "esri/WebMap",
            "esri/widgets/LayerList",
            "esri/widgets/BasemapGallery",
            "esri/widgets/Legend",
            "esri/views/SceneView",
            "esri/layers/GraphicsLayer",
            "esri/Graphic",
            "esri/Camera",
            "esri/widgets/Editor",
            "esri/popup/content/TextContent",
            "esri/widgets/Expand",
            "esri/layers/FeatureLayer"
        ]) // "esri/widgets/BasemapGallery", "esri/widgets/Locate", "esri/widgets/Search",
            .then(([Map, MapView, WebMap, LayerList, BasemapGallery, Legend, SceneView, GraphicsLayer, Graphic, Expand, FeatureLayer]) => { // BasemapGallery, Search, 
                var map = new Map({
                    basemap: "streets"
                });
                
                
                const featureLayer = new FeatureLayer({
                    url:
                    "https://services1.arcgis.com/SZRnJrFMenczQuyb/arcgis/rest/services/moshtest1/FeatureServer",
                    outFields: ["*"],
                    popupEnabled: false,
                    id: "projectsLayer"
                });
                
                
                //let webmapId = "8ef14a1ee2544a1c9c9c26f3079267ab";
                
                let webmapId = "b9a2230cb57b4d4fa0ed91944859962f";
                if (window.location.href.indexOf("?id=") > 0) {
                    webmapId = window.location.href.split("?id=")[1];
                }
        
                var webmap = new WebMap({
                    portalItem: {
                    id: webmapId //"b9a2230cb57b4d4fa0ed91944859962f"
                    }
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
                    map: webmap//, // Reference to the map object created before the scene
                    //zoom: 3, // Sets zoom level based on level of detail (LOD)
                    //center: [-20, 35] // Sets center point of view using longitude,latitude
                });
                
                // view.ui.add(
                //     [
                //     new Expand({
                //         content: new Legend({
                //         view: view
                //         }),
                //         view: view,
                //         group: "top-left"
                //     }),
                //     new Expand({
                //         content: new LayerList({ view: view }),
                //         view: view,
                //         group: "top-left"
                //     }),
                //     new Expand({
                //         content: new BasemapGallery({
                //         view: view
                //         }),
                //         view: view,
                //         expandIconClass: "esri-icon-basemap",
                //         group: "top-left"
                //     })
                //     ],
                //     "top-left"
                // );
                
                
                //featured layer - moshtest1
                //6b2a806aa0a34c52bdcf49731ece19aa
                // const layer = new FeatureLayer({
                //     // URL to the service
                //     url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0"
                // });
                // webmap.add(layer);
                
                var testgraphicsLayer = new GraphicsLayer();
                //webmap.add(testgraphicsLayer);
                
                var graphicsLayer = new GraphicsLayer();
                //webmap.add(graphicsLayer);
                
                
                
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
                
                // const searchWidget = new Search({
                //     view: view
                // });

                // view.ui.add(searchWidget, {
                //     position: "bottom-right",
                //     index: 2
                // });
        
                
                
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
                    console.log('expand', event.target.project);
                    view.popup.close();
                    this.props.handleExpandProject(event.target.project);
                }
                
                view.on('click', (event) => {
                    console.log('in click');
                    if (this.props.allowAddPoint) {
                        let point = {
                            //project: {},
                            title: `point ${this.state.points.length + 1}`,
                            type: "point",
                            x: event.mapPoint.longitude,
                            y: event.mapPoint.latitude,
                            z: 500
                        };
                        this.props.addPoint(point).then(respoint => {
                            console.log(respoint);
                            
                            //points.push(respoint);
                            //this.setState({points});
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
                                //point: respoint,
                                geometry: point,
                                symbol: markerSymbol
                            });
                            
                            
                            var graphic = new Graphic({
                                geometry: {
                                    type: "point",
                                    latitude: event.mapPoint.latitude,
                                    longitude: event.mapPoint.longitude,
                                },
                                attributes: null//{title: `point ${this.state.points.length + 1}`}
                            });
                            
                            
                            
                            
                            
                            testgraphicsLayer.add(graphic);
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
                    // var polyline = {
                    //     type: "polyline",
                    //     paths: [
                    //         [point.x, point.y, 0],
                    //         [point.x, point.y, 490]
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
                
                
                
                view.when(function() {
                    // When the webmap and view resolve, display the webmap's
                    // new title in the Div
                    var title = document.getElementById("webMapTitle");
                    var save = document.getElementById("saveWebMap");
                    save.disabled = false;
                    save.addEventListener("click", function() {
                    // item automatically casts to a PortalItem instance by saveAs
                    var item = {
                        title: title.value
                    };
        
                    // Update properties of the WebMap related to the view.
                    // This should be called just before saving a webmap.
                    webmap.updateFrom(view);
        
                    webmap
                        .saveAs(item)
                        // Saved successfully
                        .then(function(item) {
                        // link to the newly-created web scene item
                        var itemPageUrl =
                            item.portal.url + "/home/item.html?id=" + item.id;
                        var link =
                            '<a target="_blank" href="' +
                            itemPageUrl +
                            '">' +
                            title.value +
                            "</a>";
        
                        statusMessage(
                            "Save WebMap",
                            "<br> Successfully saved as <i>" + link + "</i>"
                        );
                        })
                        // Save didn't work correctly
                        .catch(function(error) {
                        statusMessage("Save WebMap", "<br> Error " + error);
                        });
                    });
        
                    var overlay = document.getElementById("overlayDiv");
                    var ok = overlay.getElementsByTagName("input")[0];
        
                    function statusMessage(head, info) {
                    document.getElementById("head").innerHTML = head;
                    document.getElementById("info").innerHTML = info;
                    overlay.style.visibility = "visible";
                    }
        
                    ok.addEventListener("click", function() {
                    overlay.style.visibility = "hidden";
                    });
        
                    view.ui.add("sidebarDiv", "top-right");
                });
            })
    }
 
    render() {
        return ( 
            <div style={ styles.container } >
                <div id='pointTestViewDiv' style={ styles.mapDiv } >
                    
                </div>
                <div id="sidebarDiv" className="esri-widget">
                <h4 className="esri-heading">Save WebMap</h4>
                <label className="esri-feature-form__label">Title</label>
                <input
                    id="webMapTitle"
                    type="text"
                    className="esri-input"
                    defaultValue="WebMap Title1"
                /><br /><br />
                <input
                    id="saveWebMap"
                    type="button"
                    value="Save"
                    disabled
                    className="esri-button"
                />
                </div>
                <div id="overlayDiv" className="esri-widget">
                    <h4 className="esri-heading" id="head"></h4>
                    <label id="info"></label><br /><br />
                    <input type="button" value="OK" className="esri-button" />
                </div>
            </div>
        );
    }
}

export default MapSaveTest;