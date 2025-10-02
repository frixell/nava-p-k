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

class DomPopup extends Component {
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
        loadModules([
            "esri/layers/FeatureLayer",
            "esri/Map",
            "esri/WebScene",
            "esri/views/MapView",
            "esri/views/SceneView"
        ])
            .then(([FeatureLayer, Map, WebScene, MapView, SceneView]) => {
                var map = new WebScene({
                    portalItem: {
                    id: "5a392557cffb485f8fe004e668e9edc0"
                    }
                });
        
                // Create the SceneView
                var sceneView = new SceneView({
                    map: map,
                    container: "pointTestViewDiv",
                    popup: {
                    actions: [],
                    dockEnabled: true,
                    dockOptions: {
                        buttonEnabled: true,
                        breakpoint: false
                    }
                    }
                });
        
                // Listen for when the scene view is ready
                sceneView.when(function() {
                    // It's necessary to overwrite the default click for the popup
                    // behavior in order to display your own popup
                    sceneView.popup.autoOpenEnabled = false;
                    sceneView.on("click", function(event) {
                    // Make sure that there is a valid latitude/longitude
                    if (event && event.mapPoint) {
                        // Create lat/lon vars to display in popup title
                        var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                        var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
        
                        sceneView.popup.open({
                        // Set the popup's title to the coordinates of the location
                        title: "Map view coordinates: [" + lon + ", " + lat + "]",
                        location: event.mapPoint, // Set the location of the popup to the clicked location
                        content: setContentInfo(sceneView.center, sceneView.scale)
                        });
                    } else {
                        sceneView.popup.open({
                        // Set the popup's title to the coordinates of the location
                        title: "Invalid point location",
                        location: event.mapPoint, // Set the location of the popup to the clicked location
                        content: "Please click on a valid location."
                        });
                    }
                    });
        
                    function setContentInfo(center, scale) {
                    var popupDiv = document.createElement("div");
                    popupDiv.classList.add("mapView");
                    
                    console.log('before popup view');
                    
                    var popupView = new MapView({
                        container: popupDiv,
                        map: new Map({ basemap: "topo" }),
                        center: sceneView.center,
                        scale: sceneView.scale * 2 * Math.max(sceneView.width / 250, sceneView.height / 250), constraints: { rotationEnabled: false },
                        ui: { components: [] }
                    });
                    console.log('after popup view');
                    // Return a dom node
                    return popupView.container;
                    }
                });
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

export default DomPopup;