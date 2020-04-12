import React from 'react';
import { Prompt } from "react-router-dom";
import {Helmet} from 'react-helmet';
import PointTest from './PointTest';
import SideBar from './SideBar';
import BuildingTest from './BuildingTest';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { startAddPoint, startEditProject } from '../actions/points';
import isEqual from 'lodash.isequal';
import { setLanguage } from "redux-i18n";
import ReactGA from 'react-ga';
import ProjectDetailsPage from './ProjectDetailsPage';

function initializeReactGA(url) {
    ReactGA.initialize('UA-128960221-1');
    ReactGA.pageview(url);
}
//initializeReactGA();

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seo: {
                title: 'נאוה קיינר-פרסוב',
                titleEng: 'Nava Kainer-Persov'
            },
            navigation: {},
            points: this.props.points,
            allowAddPoint: false,
            sidebarClickedItemId: null,
            selectedProject: null,
            showSelectedProject: false,
            table: [],
            needSave: false
        }
    }

    setData = (e) => {
		const { value, dataset } = e.target;
		const { name, index, action } = dataset;
		const selectedProject = JSON.parse(JSON.stringify(this.state.selectedProject));

        // console.log(name);
        // console.log(value);
        // console.log(action);
        console.log(selectedProject.extendedContent[name]);
        switch (action) {
			case "setString":
                if(name === 'content' || name === 'tableOptions' || name === 'image') {
                    selectedProject.extendedContent[name] = value;
                } else {
                    selectedProject[name] = value;
                }   
                break;
			default:
				break;
        };

        console.log(selectedProject.extendedContent[name]);
        this.setState({
            selectedProject,
            needSave: true
        });

        // if (typeof(window) !== "undefined") {     
        //     if(isEqual(this.state.homepageOrigin, homepage)){ 
        //         window.removeEventListener("beforeunload", this.unloadFunc);
        //     } else {
        //         window.addEventListener("beforeunload", this.unloadFunc);
        //     }
        // }
    }

    unloadFunc = (e) => {
        var confirmationMessage = "o/";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }

    // update database

    onUpdateProject = () => {
        const project = JSON.parse(JSON.stringify(this.state.selectedProject));
        this.props.startEditProject({
            project: project
        });
        
        this.setState(() => ({ projectOrigin: project, needSave: false }));
        if (typeof(window) !== "undefined") {
            window.removeEventListener("beforeunload", this.unloadFunc);
        }
    }
    
    uploadWidget = (e) => {
        const { dataset } = e.target;
        const { id } = dataset;
        const eventId = this.state.eventId;
        var myUploadWidget;
        myUploadWidget = cloudinary.openUploadWidget({ 
            cloud_name: 'dewafmxth', 
            upload_preset: 'ml_default', 
            sources: [
                "local",
                "url",
                "image_search",
                "facebook",
                "dropbox",
                "instagram",
                "camera"
            ],
            fonts: {
                default: null,
                "'Cute Font', cursive": "https://fonts.googleapis.com/css?family=Cute+Font",
                "'Gamja Flower', cursive": "https://fonts.googleapis.com/css?family=Gamja+Flower|PT+Serif"
            }
        },
            (error, result) => {
                if (error) {
                    console.log(error);
                }
                if (result.event === "success") {
                    const image = {
                        publicId: result.info.public_id,
                        src: result.info.secure_url,
                        width: result.info.width,
                        height: result.info.height,
                        alt: '',
                    };
                        
                    let e = {
                        target: {
                            value: image.src,
                            dataset: {
                                action: 'setString',
                                name: 'image'
                            }
                        }
                    }
                    this.setData(e);
                    myUploadWidget.close();
                }
            }
        );
        myUploadWidget.open();
    }

    setUrlLang = () => {
        if (this.props.urlLang !== undefined && this.props.lang !== this.props.urlLang) {
            this.props.setLanguage(this.props.urlLang);
        }
    }

    componentDidMount = () => {
        this.setUrlLang();
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.selectedProject && !isEqual(this.state.selectedProject, prevState.selectedProject) && this.state.selectedProject.extendedContent && this.state.selectedProject.extendedContent.table) {
            let tableArray = [];
            for (var key in this.state.selectedProject.extendedContent.table) {
                
                let categoryObject = this.state.selectedProject.extendedContent.table[key];
                let category = {
                    color: categoryObject.color,
                    name: categoryObject.name,
                    subcategories: []
                };
                let subcategories = categoryObject.categories;
                for (var key1 in subcategories) {
                    let subcategoryObject = subcategories[key1];
                    let subcategory = {
                        name: subcategoryObject.name,
                        options: []
                    };
                    let options = subcategoryObject.options;
                    for (var key2 in options) {
                        let optionObject = options[key2];
                        subcategory.options.push(optionObject);
                    }
                    category.subcategories.push(subcategory);
                }
                tableArray.push(category);
            }
            if ( !isEqual(tableArray, this.state.table)) {
                this.setState({table: tableArray});
            }
        }
    }
    
    addPoint = (point) => {
        let points = this.state.points;
        points.push(point);
        this.setState({allowAddPoint: false});
        this.props.startAddPoint(point);
    }
    
    allowAddPoint = () => {
        this.setState({allowAddPoint: !this.state.allowAddPoint});
    }
    
    handleSideBarClick = (event) => {
        this.setState({
            sidebarClickedItemId: event.target.dataset.id
        })
    }
    
    handleExpandProject = (selectedProject) => {
        this.setState({
            selectedProject: selectedProject,
            showSelectedProject: true
        })
    }
    
    hideProject = () => {
        this.setState({
            selectedProject: null,
            showSelectedProject: false
        })
    }
    
    setSelectedProject = (selectedProject) => {
        //console.log('in selectedProject', selectedProject);
        // this.setState({
        //     selectedProject: selectedProject
        // })
    }

    render() {
        return (
            <div className="container-fluid">
                
                <Prompt
                    style={{background: "red"}}
                    when={!isEqual(this.state.homepageOrigin, this.state.homepage)}
                    message="Changes you made may not be saved."
                /> 

                <Helmet>
                {
                    this.props.lang === "he" ?
                        <title>{this.state.seo.title}</title>
                    :
                        <title>{this.state.seo.titleEng}</title>
                }
                    
                </Helmet>

                <Navigation 
                    {...this.props}
                    langLink='/עב'
                    langLinkEng='/en'
                    categories={this.props.eventsCategories}
                />
                {
                    this.props.isAuthenticated ?
                        <div style={{position: 'absolute', zIndex: 15009, top: '1.7rem', left: $( window ).width() / 2 - 85, color: '#fff', cursor: 'pointer'}} onClick={this.props.startLogout}>
                            יציאה
                        </div>
                    :
                        null
                }
                
                {
                    this.props.isAuthenticated && this.state.selectedProject ?
                        <div style={{position: 'absolute', zIndex: 15009, top: '1.7rem', left: $( window ).width() / 2 + 50, color: this.state.needSave ? 'red' : '#fff', cursor: 'pointer'}} onClick={this.onUpdateProject}>
                            שמירה
                        </div>
                    :
                        null
                }
                
                {
                    this.props.isAuthenticated && !this.state.selectedProject ?
                        <div style={{position: 'absolute', zIndex: 15009, top: '1.7rem', left: $( window ).width() / 2 + 50, color: this.state.allowAddPoint ? 'red' : '#fff', cursor: 'pointer'}} onClick={this.allowAddPoint}>
                            הוספה
                        </div>
                    :
                        null
                }
                
                
                {/*
                <div style={{ float: 'left', display: 'inline-block', height: $( window ).height() - 60, width: $( window ).width() * 0.49 }}>
                    
                    <BuildingTest />
                    
                </div>
                */}
                
                <SideBar
                    sidebarClickedItemId={this.state.sidebarClickedItemId}
                    handleSideBarClick={this.handleSideBarClick}
                    points={this.state.points}
                />
                
                {
                    this.state.selectedProject ?
                        <div
                            className="homepage__project__details__container"
                            style={{ 
                                height: $( window ).height() - 60,
                                width: $( window ).width() - 170
                            }}
                        >
                            <ProjectDetailsPage
                                hideProject={this.hideProject}
                                table={this.state.table}
                                tableTemplate={this.props.tableTemplate}
                                selectedProject={this.state.selectedProject}
                                isAuthenticated={this.props.isAuthenticated}
                                onChange={this.setData}
                                uploadWidget={this.uploadWidget}
                            />
                        </div>
                    :
                        null
                }
                
                <div style={{ float: 'right', display: 'inline-block', height: $( window ).height() - 60, width: $( window ).width() - 170 }}>
                    
                    <PointTest
                        sidebarClickedItemId={this.state.sidebarClickedItemId}
                        points={this.state.points}
                        addPoint={this.addPoint}
                        allowAddPoint={this.state.allowAddPoint}
                        setSelectedProject={this.setSelectedProject}
                        handleExpandProject={this.handleExpandProject}
                    />
                    
                </div>
                
                <Footer lang={this.props.lang} />
            </div>
        );
    }
} 


const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    eventsCategories: state.eventspage,
    points: state.points,
    tableTemplate: state.tableTemplate,
    homepage: state.homepage,
    navigation: state.navigation,
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    setLanguage: (lang) => dispatch(setLanguage(lang)),
    startAddPoint: (point) => dispatch(startAddPoint(point)),
    startEditProject: (project) => dispatch(startEditProject(project))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);






// <Scene
//                         style={{ width: '100%', height: '100%', fontSize: 3, color: '#000' }}
//                         mapProperties={{ basemap: 'topo-vector' }} // 'satellite'
//                         viewProperties={{
//                             center: [-122.4443, 47.2529],
//                             zoom: 2
//                         }}
//                     >
//                         <BermudaTriangle />
//                     </Scene>
                    
//                     <WebMapView />










//{this.state.seo.title ? (window.prerenderReady = true) : null}



// <Map
//                         mapProperties={{ basemap: 'topo-vector' }} // 'satellite'
//                         viewProperties={{
//                             center: [-70, 25],
//                             zoom: 4
//                         }}>
                        
//                     </Map>