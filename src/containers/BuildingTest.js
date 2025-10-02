import React, { Component } from 'react';
import {loadModules} from 'esri-loader'
 

const styles = {
    container: {
        height: '100%',
        color: '#000',
        fontSize: 2

    },
        mapDiv: {
        height: '100%',
    },
}

class BuildingTest extends Component {
    state ={
        coordinates: []
    }

    componentDidMount() {
            loadModules(["esri/WebScene", "esri/views/SceneView", "esri/layers/BuildingSceneLayer", "esri/widgets/Slice", "esri/widgets/LayerList", "esri/core/Collection"])
                .then(([WebScene, SceneView, BuildingSceneLayer, Slice, LayerList, Collection]) => {
                    const webscene = new WebScene({
                        portalItem: {
                        id: "c7470b0e4e4c44288cf287d658155300"
                        }
                    });
            
                    const view = new SceneView({
                        container: "viewDiv",
                        map: webscene
                    });
            
                    // Create the BuildingSceneLayer and add it to the webscene
                    const buildingLayer = new BuildingSceneLayer({
                        url:
                        "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/BSL__4326__US_Redlands__EsriAdminBldg_PublicDemo/SceneServer",
                        title: "Administration Building, Redlands - Building Scene Layer"
                    });
                    webscene.layers.add(buildingLayer);
            
                    const excludedLayers = [];
                    let doorsLayer;
            
                    buildingLayer.when(function() {
                        // Iterate through the flat array of sublayers and extract the ones
                        // that should be excluded from the slice widget
                        buildingLayer.allSublayers.forEach(function(layer) {
                        // modelName is standard accross all BuildingSceneLayer,
                        // use it to identify a certain layer
                        switch (layer.modelName) {
                            // Because of performance reasons, the Full Model view is
                            // by default set to false. In this scene the Full Model should be visible.
                            case "FullModel":
                            layer.visible = true;
                            break;
                            case "Overview":
                            case "Roofs":
                            case "Walls":
                            case "Rooms":
                            layer.visible = false;
                            break;
                            // Extract the layers that should not be hidden by the slice widget
                            case "Doors":
                            doorsLayer = layer;
                            excludedLayers.push(layer);
                            case "StructuralColumns":
                            case "Floors":
                            case "Furniture":
                            case "CurtainWallPanels":
                            excludedLayers.push(layer);
                            break;
                            default:
                            layer.visible = true;
                        }
                        });
                    });
            
                    view.when(function() {
                        const sliceButton = document.getElementById("slice");
                        view.ui.add(sliceButton, "top-right");
                        let sliceWidget = null;
            
                        sliceButton.addEventListener("click", function() {
                        if (sliceWidget) {
                            sliceWidget.destroy();
                            sliceWidget = null;
                            sliceButton.classList.remove("active");
                        } else {
                            sliceWidget = new Slice({
                            view: view
                            });
                            sliceWidget.viewModel.newSlice();
                            // programmatically add layers that should be excluded from slicing
                            sliceWidget.viewModel.excludedLayers.addMany(excludedLayers);
                            view.ui.add(sliceWidget, "top-right");
                            sliceButton.classList.add("active");
                        }
                        });
                    });
            
                    document
                        .getElementById("color")
                        .addEventListener("change", function(event) {
                        if (event.target.checked) {
                            // A renderer can be set on a BuildingComponentSublayer
                            doorsLayer.renderer = {
                            type: "unique-value", // autocasts as new UniqueValueRenderer()
                            field: "AssemblyDesc",
                            uniqueValueInfos: [
                                {
                                // All interior doors are displayed red
                                value: "Interior Doors",
                                symbol: {
                                    type: "mesh-3d", // autocasts as new MeshSymbol3D()
                                    symbolLayers: [
                                    {
                                        type: "fill", // autocasts as new FillSymbol3DLayer()
                                        material: {
                                        color: "red"
                                        }
                                    }
                                    ]
                                }
                                }
                            ]
                            };
                        } else {
                            doorsLayer.renderer = null;
                        }
                        });
            
                    view.ui.empty("top-left");
                    view.ui.add("menu", "top-left");
            
                    // Add a layer list widget
                    const layerList = new LayerList({
                        view: view
                    });
            
                    view.ui.add(layerList, "top-left");
                })
    }
 
    render() {
        return ( 
            <div style = { styles.container } >
                <div id = 'viewDiv' style = { styles.mapDiv } >
                    
                </div>
                <button className="esri-button" id="slice" type="button" title="Slice layers">
                    Slice layers
                </button>
                <div id="menu" className="esri-widget">
                    <input type="checkbox" id="color" />
                    <label htmlFor="color">Display all interior doors with a red color</label>
                </div>
            </div>
        );
    }
}

export default BuildingTest;