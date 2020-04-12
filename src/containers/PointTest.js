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
    
        

    componentDidMount() {
        loadModules(["esri/widgets/Bookmarks", "esri/Map", "esri/WebMap", "esri/WebScene", "esri/views/MapView", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/BasemapGallery", "esri/widgets/Locate", "esri/widgets/Search", "esri/Camera", "esri/widgets/Editor", "esri/popup/content/TextContent", "esri/widgets/Expand", "esri/layers/FeatureLayer"])
            .then(([Bookmarks, Map, WebMap, MapView, WebScene, SceneView, GraphicsLayer, Graphic, BasemapGallery, Locate, Search, Camera, Editor, TextContent, Expand, FeatureLayer]) => {
                // var map = new Map({
                //     basemap: "hybrid"
                // });
                
                // {
                // // ein hod
                // // camera = new Camera({
                // //     position: {
                // //         x: 34.97992814784823,
                // //         y: 32.559655621247935,
                // //         z: 2500
                // //     },
                // //     heading: 0.34445102566290225,
                // //     tilt: 82.95536300536367
                // // });
                // }
                
                camera = new Camera({
                    position: {
                        x: -42,
                        y: 38,
                        z: 10000000
                    },
                    heading: 0,
                    tilt: 15
                });
                
                
                
                // var webmap = new WebMap({
                //     portalItem: { // autocasts as new PortalItem()
                //       id: "e691172598f04ea8881cd2a4adaa45ba"
                //     }
                //   });
                
                
                // const webmap = new WebMap({
                //     portalItem: {
                //       // autocasts as new PortalItem()
                //       id: "b9a2230cb57b4d4fa0ed91944859962f"
                //     }
                //   });
                // view = new SceneView({
                //     container: "pointTestViewDiv",
                //     map: webmap,
                //     camera: camera
                // }); 
                  
                // view = new MapView({
                //     container: "pointTestViewDiv",
                //     map: webmap
                // }); 
          
                // view = new MapView({
                //     container: "pointTestViewDiv",
                //     map: webmap
                //   });
          
                //   const bookmarks = new Bookmarks({
                //     view: view,
                //     // allows bookmarks to be added, edited, or deleted
                //     editingEnabled: true
                //   });
          
                //   const bkExpand = new Expand({
                //     view: view,
                //     content: bookmarks,
                //     expanded: true
                //   });
          
                //   // Add the widget to the top-right corner of the view
                //   view.ui.add(bkExpand, "top-right");
          
                  // bonus - how many bookmarks in the webmap?
                //   webmap.when(function() {
                //     if (webmap.bookmarks && webmap.bookmarks.length) {
                //       console.log("Bookmarks: ", webmap.bookmarks.length);
                //     } else {
                //       console.log("No bookmarks in this webmap.");
                //     }
                //   });
                  
                  
                  
                  
                  
                
        //         //  https://services1.arcgis.com/SZRnJrFMenczQuyb/arcgis/rest/services/moshtest1/FeatureServer
                
                
        //         var switchButton = document.getElementById("switch-btn");

        //         var appConfig = {
        //             mapView: null,
        //             sceneView: null,
        //             activeView: null,
        //             container: "pointTestViewDiv" // use same container for views
        //         };
                
                
                
                
        //         var initialViewParams = {
        //             zoom: 3,
        //             center: [-42, 40],
        //             container: appConfig.container
        //           };
        //           var webmap = new WebMap({
        //             portalItem: {
        //               // autocasts as new PortalItem()
        //               id: "219037f46fa44eaca1c3317357c88f55"
        //             }
        //           });
        //           var scene = new WebScene({
        //             portalItem: {
        //               // autocasts as new PortalItem()
        //               id: "b9a2230cb57b4d4fa0ed91944859962f"
        //             }
        //           });
                  
                  
                  
                  
        //         // create 2D view and and set active
        //         appConfig.mapView = createView(initialViewParams, "2d");
        //         appConfig.mapView.map = webmap;
        //         appConfig.activeView = appConfig.mapView;

        //         // create 3D view, won't initialize until container is set
        //         initialViewParams.container = null;
        //         initialViewParams.map = scene;
        //         appConfig.sceneView = createView(initialViewParams, "3d");

        //         // switch the view between 2D and 3D each time the button is clicked
        //         switchButton.addEventListener("click", function() {
        //         switchView();
        //         });
                  
                  
                  
                  
                  
        //         // Switches the view from 2D to 3D and vice versa
        // function switchView() {
        //     var is3D = appConfig.activeView.type === "3d";
        //     var activeViewpoint = appConfig.activeView.viewpoint.clone();
  
        //     // remove the reference to the container for the previous view
        //     appConfig.activeView.container = null;
  
        //     if (is3D) {
        //       // if the input view is a SceneView, set the viewpoint on the
        //       // mapView instance. Set the container on the mapView and flag
        //       // it as the active view
        //       appConfig.mapView.viewpoint = activeViewpoint;
        //       appConfig.mapView.container = appConfig.container;
        //       appConfig.activeView = appConfig.mapView;
        //       switchButton.value = "3D";
        //     } else {
        //       appConfig.sceneView.viewpoint = activeViewpoint;
        //       appConfig.sceneView.container = appConfig.container;
        //       appConfig.activeView = appConfig.sceneView;
        //       switchButton.value = "2D";
        //     }
        //   }
  
        //   // convenience function for creating a 2D or 3D view
        //   function createView(params, type) {
        //     var view;
        //     var is2D = type === "2d";
        //     //var is2D = false;
        //     if (is2D) {
        //       view = new MapView(params);
        //       return view;
        //     } else {
        //       view = new SceneView(params);
        //     }
        //     return view;
        //   }
                  
                  
                  
                
                
                
                
                
                
                // var trailheadsLayer = new FeatureLayer({
                //     url: "https://services1.arcgis.com/SZRnJrFMenczQuyb/arcgis/rest/services/moshtest1/FeatureServer"
                // });
            
                // map.add(trailheadsLayer);
                
                
                
                
                
                
                
                
                // function switchView() {
                //     var is3D = appConfig.activeView.type === "3d";
                  
                //     // remove the reference to the container for the previous view
                //     appConfig.activeView.container = null;
                  
                //     if (is3D) {
                //       // if the input view is a SceneView, set the viewpoint on the
                //       // mapView instance. Set the container on the mapView and flag
                //       // it as the active view
                //       appConfig.mapView.viewpoint = appConfig.activeView.viewpoint.clone();
                //       appConfig.mapView.container = appConfig.container;
                //       appConfig.activeView = appConfig.mapView;
                //       switchButton.value = "3D";
                //     } else {
                //       appConfig.sceneView.viewpoint = appConfig.activeView.viewpoint.clone();
                //       appConfig.sceneView.container = appConfig.container;
                //       appConfig.activeView = appConfig.sceneView;
                //       switchButton.value = "2D";
                //     }
                //   }
                    
                
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
        
                // var graphicsLayer = new GraphicsLayer();
                // map.add(graphicsLayer);
            
                // var editThisAction = {
                //     title: 'Edit',
                //     id: 'edit-this',
                //     className: 'esri-icon-edit'
                // };
                
                // var expandThisAction = {
                //     title: 'Expand',
                //     id: 'expand-this',
                //     className: 'esri-icon-zoom-out-fixed'
                // };
                
                // let points = this.state.points;
                // view.popup.autoOpenEnabled = false;
                // view.popup.on("trigger-action", function(event) {
                //     // Execute the measureThis() function if the measure-this action is clicked
                //     if (event.action.id === "edit-this") {
                //         editThis(event);
                //     }
                //     if (event.action.id === "expand-this") {
                //         expandThis(event);
                //     }
                // });
                
                // let editThis = (event) => {
                //     console.log('edit', event);
                // }
                
                // let expandThis = (event) => { 
                //     console.log('expand', event.target.project);
                //     view.popup.close();
                //     this.props.handleExpandProject(event.target.project);
                // }
                
                // view.on('click', (event) => {
                //     if (this.props.allowAddPoint) {
                //         let point = {
                //             title: `point ${this.state.points.length}`,
                //             type: "point",
                //             x: event.mapPoint.longitude,
                //             y: event.mapPoint.latitude,
                //             z: 500
                //         };
                //         this.props.addPoint(point);
                //         this.setState({points});
                //         // var polyline = {
                //         //     type: "polyline",
                //         //     paths: [
                //         //     [event.mapPoint.longitude, event.mapPoint.latitude, 0],
                //         //     [event.mapPoint.longitude, event.mapPoint.latitude, 490]
                //         //     ]
                //         // };
                    
                //         // var lineSymbol = {
                //         //     type: "simple-line",
                //         //     color: [226, 119, 40],
                //         //     width: 4
                //         // };
                
                //         // var polylineGraphic = new Graphic({
                //         //     geometry: polyline,
                //         //     symbol: lineSymbol
                //         // });
                
                //         // graphicsLayer.add(polylineGraphic);
                        
                        
                //         // var pointGraphic = new Graphic({
                //         //     geometry: point,
                //         //     symbol: markerSymbol
                //         // });
                        
                //         // graphicsLayer.add(pointGraphic);
                //     }

                //     // view.hitTest(event).then(function(response) {
                        
                //     //     // check if a graphic is returned from the hitTest
                //     //     if (response.results[0].graphic) {
                //     //         let title = response.results[0].graphic.point.title;
                //     //         let content = response.results[0].graphic.point.content;

                //     //         view.popup.open({
                //     //             // Set the popup's title to the coordinates of the location
                //     //             project: response.results[0].graphic.point,
                //     //             title: title,
                //     //             location: event.mapPoint, // Set the location of the popup to the clicked location
                //     //             content: content,
                //     //             actions: [editThisAction, expandThisAction]
                //     //         });
                            
                //     //         //this.props.addPoint(response.results[0].graphic.point);
                //     //         //this.props.setSelectedProject(response.results[0].graphic.point);
                //     //         //this.setState({selectedPoint: response.results[0].graphic.point});
                //     //     }
                //     // });
                    
                // });
                
                
            
                // this.state.points.forEach(point => {
                //     var polyline = {
                //         type: "polyline",
                //         paths: [
                //             [point.x, point.y, 0],
                //             [point.x, point.y, 490]
                //         ]
                //     };
                
                //     var lineSymbol = {
                //         type: "simple-line",
                //         color: [226, 119, 40],
                //         width: 4
                //     };
            
                //     var polylineGraphic = new Graphic({
                //         geometry: polyline,
                //         symbol: lineSymbol
                //     });
            
                //     graphicsLayer.add(polylineGraphic);
                    
                //     var pointGraphic = new Graphic({
                //         point: point,
                //         geometry: point,
                //         symbol: markerSymbol
                //     });
                //     graphicsLayer.add(pointGraphic);
                //     graphicsLayer
                //         .when(function() {
                //             return graphicsLayer.queryExtent();
                //         })
                //         .then(function(response) {
                //             view.goTo(response.extent);
                //         });
                // })
                
                
                
                
                
                /************************************************************
 * Creates a new WebMap instance. A WebMap must reference
 * a PortalItem ID that represents a WebMap saved to
 * arcgis.com or an on-premise portal.
 ************************************************************/

var webmap = new WebMap({
    portalItem: {
      id: "b9a2230cb57b4d4fa0ed91944859962f"
    }
  });
  
  /************************************************************
   * Set the WebMap instance to the map property in a MapView.
   ************************************************************/
  view = new SceneView({
    map: webmap,
    container: "pointTestViewDiv"
  });
                
                
                
                
                
                
                
                
                
        //         var switchButton = document.getElementById("switch-btn");

        // var appConfig = {
        //   mapView: null,
        //   sceneView: null,
        //   activeView: null,
        //   container: "pointTestViewDiv" // use same container for views
        // };

        // var initialViewParams = {
        //   zoom: 3.3,
        //   center: [-45, 39],
        //   camera: camera,
        //   container: appConfig.container
        // };
        // var webmap = new WebMap({
        //   portalItem: {
        //     // autocasts as new PortalItem()
        //     id: "7ee3c8a93f254753a83ac0195757f137"
        //   }
        // });
        // var scene = new WebScene({
        //   portalItem: {
        //     // autocasts as new PortalItem()
        //     id: "c8cf26d7acab4e45afcd5e20080983c1"
        //   }
        // });
        // // create 2D view and and set active
        // appConfig.mapView = createView(initialViewParams, "2d");
        // appConfig.mapView.map = webmap;
        // appConfig.activeView = appConfig.mapView;

        // // create 3D view, won't initialize until container is set
        // initialViewParams.container = null;
        // initialViewParams.map = scene;
        // //appConfig.sceneView = createView(initialViewParams, "3d");
        // appConfig.sceneView = new SceneView({
        //     container: "pointTestViewDiv",
        //     map: scene,
        //     camera: camera
        // }); 
        
        // // view = new SceneView({
        // //     container: "pointTestViewDiv",
        // //     map: map,
        // //     camera: camera
        // // }); 

        // // switch the view between 2D and 3D each time the button is clicked
        // switchButton.addEventListener("click", function() {
        //   switchView();
        // });

        // // Switches the view from 2D to 3D and vice versa
        // function switchView() {
        //   var is3D = appConfig.activeView.type === "3d";
        //   var activeViewpoint = appConfig.activeView.viewpoint.clone();

        //   // remove the reference to the container for the previous view
        //   appConfig.activeView.container = null;

        //   if (is3D) {
        //     // if the input view is a SceneView, set the viewpoint on the
        //     // mapView instance. Set the container on the mapView and flag
        //     // it as the active view
        //     appConfig.mapView.viewpoint = activeViewpoint;
        //     appConfig.mapView.container = appConfig.container;
        //     appConfig.activeView = appConfig.mapView;
        //     switchButton.value = "3D";
        //   } else {
        //     appConfig.sceneView.viewpoint = activeViewpoint;
        //     appConfig.sceneView.container = appConfig.container;
        //     appConfig.activeView = appConfig.sceneView;
        //     switchButton.value = "2D";
        //   }
        // }

        // // convenience function for creating a 2D or 3D view
        // function createView(params, type) {
        //   var view;
        //   var is2D = type === "2d";
        //   if (is2D) {
        //     view = new MapView(params);
        //     return view;
        //   } else {
        //     view = new SceneView(params);
        //   }
        //   return view;
        // }
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
            })
    }
 
    render() {
        return ( 
            <div style = { styles.container } >
                <div id = 'pointTestViewDiv' style = { styles.mapDiv } >
                    
                </div>
                <div id="infoDiv">
                    <input
                        className="esri-component esri-widget--button esri-widget esri-interactive"
                        type="button"
                        id="switch-btn"
                        value="3D"
                    />
                </div>
            </div>
        );
    }
}

export default PointTest;