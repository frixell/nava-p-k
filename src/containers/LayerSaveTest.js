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

class LayerSaveTest extends Component {
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
            "esri/layers/FeatureLayer",
            "esri/Graphic",
            "esri/widgets/Expand",
            "esri/widgets/FeatureForm",
            "esri/widgets/FeatureTemplates",
            "esri/widgets/LayerList"
        ]) // "esri/widgets/BasemapGallery", "esri/widgets/Locate", "esri/widgets/Search",
            .then(([Map, MapView, FeatureLayer, Graphic, Expand, FeatureForm, FeatureTemplates, LayerList]) => { // BasemapGallery, Search, 
    
    
    
    
    
    


    // componentDidMount() {
    //     loadModules(["esri/Map",
    //         "esri/views/MapView",
    //         "esri/WebMap",
    //         "esri/widgets/LayerList",
    //         "esri/widgets/BasemapGallery",
    //         "esri/widgets/Legend",
    //         "esri/views/SceneView",
    //         "esri/layers/GraphicsLayer",
    //         "esri/Graphic",
    //         "esri/Camera",
    //         "esri/widgets/Editor",
    //         "esri/popup/content/TextContent",
    //         "esri/widgets/Expand",
    //         "esri/layers/FeatureLayer"
    //     ]) // "esri/widgets/BasemapGallery", "esri/widgets/Locate", "esri/widgets/Search",
    //         .then(([Map, MapView, WebMap, LayerList, BasemapGallery, Legend, SceneView, GraphicsLayer, Graphic, Expand, FeatureLayer]) => { // BasemapGallery, Search, 
                // var map = new Map({
                //     basemap: "streets"
                // });
                
                
                // const featureLayer = new FeatureLayer({
                //     url:
                //     "https://services1.arcgis.com/SZRnJrFMenczQuyb/arcgis/rest/services/moshtest1/FeatureServer",
                //     outFields: ["*"],
                //     popupEnabled: false,
                //     id: "projectsLayer"
                // });
                
                
                // //let webmapId = "8ef14a1ee2544a1c9c9c26f3079267ab";
                
                // let webmapId = "b9a2230cb57b4d4fa0ed91944859962f";
                // if (window.location.href.indexOf("?id=") > 0) {
                //     webmapId = window.location.href.split("?id=")[1];
                // }
        
                // var webmap = new WebMap({
                //     portalItem: {
                //     id: webmapId //"b9a2230cb57b4d4fa0ed91944859962f"
                //     }
                // });
                
                // view = new MapView({
                //     popup: {
                //         dockEnabled: true,
                //         dockOptions: {
                //         // Disables the dock button from the popup
                //         buttonEnabled: false,
                //         // Ignore the default sizes that trigger responsive docking
                //         breakpoint: false,
                //         position: 'top-left'
                //         }
                //     },
                //     container: "pointTestViewDiv", // Reference to the scene div created in step 5
                //     map: webmap//, // Reference to the map object created before the scene
                //     //zoom: 3, // Sets zoom level based on level of detail (LOD)
                //     //center: [-20, 35] // Sets center point of view using longitude,latitude
                // });
                
                // // view.ui.add(
                // //     [
                // //     new Expand({
                // //         content: new Legend({
                // //         view: view
                // //         }),
                // //         view: view,
                // //         group: "top-left"
                // //     }),
                // //     new Expand({
                // //         content: new LayerList({ view: view }),
                // //         view: view,
                // //         group: "top-left"
                // //     }),
                // //     new Expand({
                // //         content: new BasemapGallery({
                // //         view: view
                // //         }),
                // //         view: view,
                // //         expandIconClass: "esri-icon-basemap",
                // //         group: "top-left"
                // //     })
                // //     ],
                // //     "top-left"
                // // );
                
                
                // //featured layer - moshtest1
                // //6b2a806aa0a34c52bdcf49731ece19aa
                // // const layer = new FeatureLayer({
                // //     // URL to the service
                // //     url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0"
                // // });
                // // webmap.add(layer);
                
                // var testgraphicsLayer = new GraphicsLayer();
                // //webmap.add(testgraphicsLayer);
                
                // var graphicsLayer = new GraphicsLayer();
                // //webmap.add(graphicsLayer);
                
                
                
                // // BaseMap Widget
                
                // // var basemapGallery = new BasemapGallery({
                // //     view: view
                // // });
                
                // // var bgExpand = new Expand({
                // //     view: view,
                // //     content: basemapGallery
                // //   });

                // // view.ui.add(bgExpand, {
                // //     position: "bottom-right"
                // // });
                
                
                // // Search Widget
                
                // // const searchWidget = new Search({
                // //     view: view
                // // });

                // // view.ui.add(searchWidget, {
                // //     position: "bottom-right",
                // //     index: 2
                // // });
        
                
                
                // var expandThisAction = {
                //     title: 'Expand',
                //     id: 'expand-this',
                //     className: 'esri-icon-zoom-out-fixed'
                // };
                
                // let points = this.state.points;
                
                
                
                // view.popup.autoOpenEnabled = false;
                // view.popup.on("trigger-action", function(event) {
                //     if (event.action.id === "expand-this") {
                //         expandThis(event);
                //     }
                // });
                
                // let expandThis = (event) => { 
                //     console.log('expand', event.target.project);
                //     view.popup.close();
                //     this.props.handleExpandProject(event.target.project);
                // }
                
                // view.on('click', (event) => {
                //     console.log('in click');
                //     if (this.props.allowAddPoint) {
                //         let point = {
                //             //project: {},
                //             title: `point ${this.state.points.length + 1}`,
                //             type: "point",
                //             x: event.mapPoint.longitude,
                //             y: event.mapPoint.latitude,
                //             z: 500
                //         };
                //         this.props.addPoint(point).then(respoint => {
                //             console.log(respoint);
                            
                //             //points.push(respoint);
                //             //this.setState({points});
                //             // var polyline = {
                //             //     type: "polyline",
                //             //     paths: [
                //             //     [event.mapPoint.longitude, event.mapPoint.latitude, 0],
                //             //     [event.mapPoint.longitude, event.mapPoint.latitude, 490]
                //             //     ]
                //             // };
                        
                //             // var lineSymbol = {
                //             //     type: "simple-line",
                //             //     color: [226, 119, 40],
                //             //     width: 4
                //             // };
                    
                //             // var polylineGraphic = new Graphic({
                //             //     geometry: polyline,
                //             //     symbol: lineSymbol
                //             // });
                    
                //             // graphicsLayer.add(polylineGraphic);
                            
                            
                //             var pointGraphic = new Graphic({
                //                 //point: respoint,
                //                 geometry: point,
                //                 symbol: markerSymbol
                //             });
                            
                            
                //             var graphic = new Graphic({
                //                 geometry: {
                //                     type: "point",
                //                     latitude: event.mapPoint.latitude,
                //                     longitude: event.mapPoint.longitude,
                //                 },
                //                 attributes: null//{title: `point ${this.state.points.length + 1}`}
                //             });
                            
                            
                            
                            
                            
                //             testgraphicsLayer.add(graphic);
                //         });
                        
                //     }

                //     view.hitTest(event).then(function(response) {
                //         // check if a graphic is returned from the hitTest
                //         let results = response.results[0].graphic
                //         if (results) {
                //             console.log('in click graphic', response.results[0]);
                //             let title = (results.point && results.point.title) || 'Edit this';
                //             let content = (results.point && results.point.content) || 'Edit this';
                            
                //             view.popup.open({
                //                 // Set the popup's title to the coordinates of the location
                //                 project: results.point || {},
                //                 title: title,
                //                 location: event.mapPoint, // Set the location of the popup to the clicked location
                //                 content: content,
                //                 actions: [expandThisAction] // editThisAction, 
                //             });
                            
                //             //this.props.addPoint(response.results[0].graphic.point);
                //             //this.props.setSelectedProject(response.results[0].graphic.point);
                //             //this.setState({selectedPoint: response.results[0].graphic.point});
                //         }
                //     });
                    
                // });
                
                
            
                // this.state.points.forEach(point => {
                //     // var polyline = {
                //     //     type: "polyline",
                //     //     paths: [
                //     //         [point.x, point.y, 0],
                //     //         [point.x, point.y, 490]
                //     //     ]
                //     // };
                
                //     // var lineSymbol = {
                //     //     type: "simple-line",
                //     //     color: [226, 119, 40],
                //     //     width: 4
                //     // };
            
                //     // var polylineGraphic = new Graphic({
                //     //     geometry: polyline,
                //     //     symbol: lineSymbol
                //     // });
            
                //     // graphicsLayer.add(polylineGraphic);
                    
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
                
                
                
                // view.when(function() {
                //     // When the webmap and view resolve, display the webmap's
                //     // new title in the Div
                //     var title = document.getElementById("webMapTitle");
                //     var save = document.getElementById("saveWebMap");
                //     save.disabled = false;
                //     save.addEventListener("click", function() {
                //     // item automatically casts to a PortalItem instance by saveAs
                //     var item = {
                //         title: title.value
                //     };
        
                //     // Update properties of the WebMap related to the view.
                //     // This should be called just before saving a webmap.
                //     webmap.updateFrom(view);
        
                //     webmap
                //         .saveAs(item)
                //         // Saved successfully
                //         .then(function(item) {
                //         // link to the newly-created web scene item
                //         var itemPageUrl =
                //             item.portal.url + "/home/item.html?id=" + item.id;
                //         var link =
                //             '<a target="_blank" href="' +
                //             itemPageUrl +
                //             '">' +
                //             title.value +
                //             "</a>";
        
                //         statusMessage(
                //             "Save WebMap",
                //             "<br> Successfully saved as <i>" + link + "</i>"
                //         );
                //         })
                //         // Save didn't work correctly
                //         .catch(function(error) {
                //         statusMessage("Save WebMap", "<br> Error " + error);
                //         });
                //     });
        
                //     var overlay = document.getElementById("overlayDiv");
                //     var ok = overlay.getElementsByTagName("input")[0];
        
                //     function statusMessage(head, info) {
                //     document.getElementById("head").innerHTML = head;
                //     document.getElementById("info").innerHTML = info;
                //     overlay.style.visibility = "visible";
                //     }
        
                //     ok.addEventListener("click", function() {
                //     overlay.style.visibility = "hidden";
                //     });
        
                //     view.ui.add("sidebarDiv", "top-right");
                // });
                
                
                
                
                
                
                
                
                
                
                
                
                // "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/IncidentsReport/FeatureServer/0"
                // "https://services1.arcgis.com/SZRnJrFMenczQuyb/arcgis/rest/services/moshtest1/FeatureServer"
                // "https://services1.arcgis.com/SZRnJrFMenczQuyb/arcgis/rest/services/copytest1/FeatureServer"
                let editFeature, highlight;

                
                var testRenderer = {
                    type: "simple",
                    symbol: {
                        type: "picture-marker",
                        url: "https://image.flaticon.com/icons/svg/2806/2806609.svg",
                        width: "40px",
                        height: "40px"
                    }
                }
                
                var testLabels = {
                    symbol: {
                    type: "text",
                    color: "#FFFFFF",
                    haloColor: "#5E8D74",
                    haloSize: "2px",
                    font: {
                        size: "12px",
                        family: "Noto Sans",
                        style: "italic",
                        weight: "normal"
                    }
                    },
                    labelPlacement: "above-center",
                    labelExpressionInfo: {
                    expression: "$feature.title"
                    }
                };
                  
                  
                const featureLayer = new FeatureLayer({
                url:
                    "https://services1.arcgis.com/SZRnJrFMenczQuyb/arcgis/rest/services/copytest1/FeatureServer",
                    outFields: ["*"],
                    popupEnabled: false,
                    id: "incidentsLayer",
                    renderer: testRenderer,
                    labelingInfo: [testLabels]
                });
                const featureLayer2 = new FeatureLayer({
                    url:
                    "https://services1.arcgis.com/SZRnJrFMenczQuyb/arcgis/rest/services/moshtest1/FeatureServer",
                    outFields: ["*"],
                    popupEnabled: false,
                    id: "incidentsLayer2"
                });

                const map = new Map({
                basemap: "topo",
                //basemap: "dark-gray",
                layers: [featureLayer, featureLayer2]
                });

                const view = new MapView({
                container: "pointTestViewDiv",
                map: map,
                center: [-20, 35],
                zoom: 3
                });
                
                
                var layerList = new LayerList({
                    view: view
                });
        
                view.ui.add(layerList, {
                    position: "bottom-left"
                });
                  
                  
                  
                
                //zoom: 3, // Sets zoom level based on level of detail (LOD)
                //     //center: [-20, 35] // Sets center point of view using longitude,latitude

                // New FeatureForm and set its layer to 'Incidents' FeatureLayer.
                // FeatureForm displays attributes of fields specified in fieldConfig.
                const featureForm = new FeatureForm({
                    container: "formDiv",
                    layer: featureLayer,
                    fieldConfig: [
                        {
                            name: "title",
                            label: "Project Title"
                        },
                        {
                        name: "content",
                        label: "Project Content"
                        },
                        {
                        name: "image",
                        label: "Project Image Link"
                        },
                        {
                        name: "tableoptions",
                        label: "Project Table"
                        }
                    ]
                });

                // Listen to the feature form's submit event.
                // Update feature attributes shown in the form.
                featureForm.on("submit", function() {
                if (editFeature) {
                    // Grab updated attributes from the form.
                    const updated = featureForm.getValues();

                    // Loop through updated attributes and assign
                    // the updated values to feature attributes.
                    Object.keys(updated).forEach(function(name) {
                    editFeature.attributes[name] = updated[name];
                    });

                    // Setup the applyEdits parameter with updates.
                    const edits = {
                    updateFeatures: [editFeature]
                    };
                    applyEditsToIncidents(edits);
                    document.getElementById("pointTestViewDiv").style.cursor = "auto";
                }
                });

                // Check if the user clicked on the existing feature
                selectExistingFeature();

                // The FeatureTemplates widget uses the 'addTemplatesDiv'
                // element to display feature templates from incidentsLayer
                const templates = new FeatureTemplates({
                    container: "addTemplatesDiv",
                    layers: [featureLayer]
                });

                // Listen for when a template item is selected
                templates.on("select", function(evtTemplate) {
                // Access the template item's attributes from the event's
                // template prototype.
                let attributes = evtTemplate.template.prototype.attributes;
                unselectFeature();
                document.getElementById("pointTestViewDiv").style.cursor = "crosshair";

                // With the selected template item, listen for the view's click event and create feature
                const handler = view.on("click", function(event) {
                    // remove click event handler once user clicks on the view
                    // to create a new feature
                    handler.remove();
                    event.stopPropagation();
                    featureForm.feature = null;

                    if (event.mapPoint) {
                    let point = event.mapPoint.clone();
                    point.z = undefined;
                    point.hasZ = false;

                    // Create a new feature using one of the selected
                    // template items.
                    editFeature = new Graphic({
                        geometry: point,
                        attributes: {
                        IncidentType: attributes.IncidentType
                        }
                    });

                    // Setup the applyEdits parameter with adds.
                    const edits = {
                        addFeatures: [editFeature]
                    };
                    applyEditsToIncidents(edits);
                    document.getElementById("pointTestViewDiv").style.cursor = "auto";
                    } else {
                    console.error("event.mapPoint is not defined");
                    }
                });
                });

                // Call FeatureLayer.applyEdits() with specified params.
                function applyEditsToIncidents(params) {
                // unselectFeature();
                featureLayer
                    .applyEdits(params)
                    .then(function(editsResult) {
                    // Get the objectId of the newly added feature.
                    // Call selectFeature function to highlight the new feature.
                    if (
                        editsResult.addFeatureResults.length > 0 ||
                        editsResult.updateFeatureResults.length > 0
                    ) {
                        unselectFeature();
                        let objectId;
                        if (editsResult.addFeatureResults.length > 0) {
                        objectId = editsResult.addFeatureResults[0].objectId;
                        } else {
                        featureForm.feature = null;
                        objectId = editsResult.updateFeatureResults[0].objectId;
                        }
                        selectFeature(objectId);
                        if (addFeatureDiv.style.display === "block") {
                        toggleEditingDivs("none", "block");
                        }
                    }
                    // show FeatureTemplates if user deleted a feature
                    else if (editsResult.deleteFeatureResults.length > 0) {
                        toggleEditingDivs("block", "none");
                    }
                    })
                    .catch(function(error) {
                    console.log("===============================================");
                    console.error(
                        "[ applyEdits ] FAILURE: ",
                        error.code,
                        error.name,
                        error.message
                    );
                    console.log("error = ", error);
                    });
                }

                // Check if a user clicked on an incident feature.
                function selectExistingFeature() {
                view.on("click", function(event) {
                    // clear previous feature selection
                    unselectFeature();
                    if (
                    document.getElementById("pointTestViewDiv").style.cursor != "crosshair"
                    ) {
                    view.hitTest(event).then(function(response) {
                        // If a user clicks on an incident feature, select the feature.
                        if (response.results.length === 0) {
                        toggleEditingDivs("block", "none");
                        } else if (
                        response.results[0].graphic &&
                        response.results[0].graphic.layer.id == "incidentsLayer"
                        ) {
                        if (addFeatureDiv.style.display === "block") {
                            toggleEditingDivs("none", "block");
                        }
                        selectFeature(
                            response.results[0].graphic.attributes[
                                featureLayer.objectIdField
                            ]
                        );
                        }
                    });
                    }
                });
                }

                // Highlights the clicked feature and display
                // the feature form with the incident's attributes.
                function selectFeature(objectId) {
                // query feature from the server
                featureLayer
                    .queryFeatures({
                    objectIds: [objectId],
                    outFields: ["*"],
                    returnGeometry: true
                    })
                    .then(function(results) {
                        console.log('results', results);
                    if (results.features.length > 0) {
                        editFeature = results.features[0];
                        console.log('editFeature', editFeature);
                        // display the attributes of selected feature in the form
                        featureForm.feature = editFeature;

                        // highlight the feature on the view
                        view.whenLayerView(editFeature.layer).then(function(layerView) {
                            highlight = layerView.highlight(editFeature);
                        });
                    }
                    });
                }

                // Expand widget for the editArea div.
                const editExpand = new Expand({
                    expandIconClass: "esri-icon-edit",
                    expandTooltip: "Expand Edit",
                    expanded: false,
                    view: view,
                    content: document.getElementById("editArea")
                });

                view.ui.add(editExpand, "top-right");
                // input boxes for the attribute editing
                const addFeatureDiv = document.getElementById("addFeatureDiv");
                const attributeEditing = document.getElementById("featureUpdateDiv");

                // Controls visibility of addFeature or attributeEditing divs
                function toggleEditingDivs(addDiv, attributesDiv) {
                    addFeatureDiv.style.display = addDiv;
                    attributeEditing.style.display = attributesDiv;

                    document.getElementById(
                        "updateInstructionDiv"
                    ).style.display = addDiv;
                }

                // Remove the feature highlight and remove attributes
                // from the feature form.
                function unselectFeature() {
                    if (highlight) {
                        highlight.remove();
                    }
                }

                // Update attributes of the selected feature.
                document.getElementById("btnUpdate").onclick = function() {
                // Fires feature form's submit event.
                featureForm.submit();
                };

                // Delete the selected feature. ApplyEdits is called
                // with the selected feature to be deleted.
                document.getElementById("btnDelete").onclick = function() {
                // setup the applyEdits parameter with deletes.
                const edits = {
                    deleteFeatures: [editFeature]
                };
                applyEditsToIncidents(edits);
                document.getElementById("pointTestViewDiv").style.cursor = "auto";
                };
            })
    }
 
    render() {
        return ( 
            <div style={ styles.container } >
                <div id='pointTestViewDiv' style={ styles.mapDiv } >
                    
                </div>
                <div id="editArea" className="editArea-container esri-widget--panel">
                <div id="addFeatureDiv" style={{display:'block'}}>
                    <h3 className="list-heading">Edit Projects</h3>
                    
                    <div id="addTemplatesDiv" style={{background:'#fff'}}></div>
                </div>

                <div id="featureUpdateDiv" style={{display:'none', marginTop: '1em'}}>
                    <h3 className="list-heading">Edit project information</h3>
                    <div id="attributeArea">
                        <div id="formDiv"></div>
                        <input
                            type="button"
                            className="esri-button"
                            value="Update project info"
                            id="btnUpdate"
                        />
                    </div>
                    <br />
                    <div id="deleteArea">
                        <input
                            type="button"
                            className="esri-button"
                            value="Delete project"
                            id="btnDelete"
                        />
                    </div>
                </div>

                    <div id="updateInstructionDiv" style={{textAlign:'center', display:'block'}}>
                        <p className="or-wrap"><span className="or-text">Or</span></p>
                        <p id="selectHeader">Select a project to edit or delete.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default LayerSaveTest;