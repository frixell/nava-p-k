import React from 'react';
import { Prompt } from "react-router-dom";
import {Helmet} from 'react-helmet';
import { Map } from '@esri/react-arcgis';
import { Scene } from '@esri/react-arcgis';

import BermudaTriangle from './BermudaTriangle';
//import WebMapView from './WebMapView';
import MapTest from './MapTest';
import PointTest from './PointTest';
import BuildingTest from './BuildingTest';

//esri/views/SceneView
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { startAddPoint } from '../actions/points';

import isEqual from 'lodash.isequal';
import { setLanguage } from "redux-i18n";

import ReactGA from 'react-ga';

// [
//     {
//         type: "point",
//         x: -0.178,
//         y: 51.48791,
//         z: 1010
//     },
//     {
//         type: "point",
//         x: -0.278,
//         y: 51.58991,
//         z: 1010
//     },
//     {
//         type: "point",
//         x: -0.078,
//         y: 51.68991,
//         z: 1010
//     },
//     {
//         type: "point", // autocasts as new Point()
//         x: -0.128,
//         y: 51.46991,
//         z: 1010
//     }
// ]

function initializeReactGA(url) {
    ReactGA.initialize('UA-128960221-1');
    ReactGA.pageview(url);
}
//initializeReactGA();

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        const tempTell = [];
        this.state = {
            ratio: 1,
            ratioFacebook: 1,
            ratioInstagram: 1,
            ratioMail: 1,
            ratioPhone: 1,
            ratioGreenArrow: 1,
            homepageOrigin: {},
            homepage: {},
            tellIndex: 0,
            pageupImageClassName: 'pageup__image__absolute__homepage',
            navigation: {},
            seoHomepageModalIsOpen: false,
            seo: {
                title: '',
                description: '',
                keyWords: '',
            },
            hideTellEditPanel: true,
            tellOrigin: [],
            tell: [],
            localTell: [],
            localTellOrigin: [],
            points: this.props.points,
            allowAddPoint: false,
            sidebarClickedItemId: null,
            selectedProject: null,
            showSelectedProject: false,
            table: []
        }
    }

    setData = (e) => {
		const { value, dataset } = e.target;
		const { name, index, field, action, order } = dataset;
		const homepage = JSON.parse(JSON.stringify(this.state.homepage));
        const tell = JSON.parse(JSON.stringify(this.state.tell));


        console.log(name);
        console.log(index);
        console.log(field);
        console.log(action);

        switch (action) {
			case "setString":
                if (field) {
                    if( name === "tell" ) {
                        homepage[name][index][field] = value;
                        tell[order][field] = value;
                    } else {
                        homepage[name][index][field] = value;
                    }
                } else {
                    homepage[name] = value;
                }
                break;
			default:
				break;
        };

        this.setState({
            homepage,
            tell
        });

        this.setLocalTell(JSON.parse(JSON.stringify(homepage)));
        if (typeof(window) !== "undefined") {     
            if(isEqual(this.state.homepageOrigin, homepage)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
	}

    unloadFunc = (e) => {
        var confirmationMessage = "o/";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }

    // update database

    onUpdateHomePage = () => {
        const homepage = JSON.parse(JSON.stringify(this.state.homepage));
        this.props.startEditHomePage({
            homepage: homepage
        });
        this.setState(() => ({ homepageOrigin: homepage }));
        this.setTell(JSON.parse(JSON.stringify(homepage)));
        this.setLocalTell(JSON.parse(JSON.stringify(homepage)));
        if (typeof(window) !== "undefined") {
            window.removeEventListener("beforeunload", this.unloadFunc);
        }
    }


    setUrlLang = () => {
        if (this.props.urlLang !== undefined && this.props.lang !== this.props.urlLang) {
            this.props.setLanguage(this.props.urlLang);
        }
    }

    setGoogleAnalytics = () => {
        if (this.props.urlLang !== undefined && this.props.lang !== this.props.urlLang) {
            initializeReactGA(`/${this.props.urlLang}`);
        } else {
            initializeReactGA('/');
        }
        
    }

    componentDidMount = () => {
        console.log('mounted');
        this.setUrlLang();

        this.setGoogleAnalytics();
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.selectedProject && !isEqual(this.state.selectedProject, prevState.selectedProject) && this.state.selectedProject.extendedContent && this.state.selectedProject.extendedContent.table) {
            let tableArray = [];
            for (var key in this.state.selectedProject.extendedContent.table) {
                
                let categoryObject = this.state.selectedProject.extendedContent.table[key];
                console.log('categoryObject', categoryObject);
                let category = {
                    color: categoryObject.color,
                    name: categoryObject.name,
                    subcategories: []
                };
                let subcategories = categoryObject.categories;
                console.log('subcategories', subcategories);
                for (var key1 in subcategories) {
                    let subcategoryObject = subcategories[key1];
                    console.log('subcategoryObject', subcategoryObject);
                    let subcategory = {
                        name: subcategoryObject.name,
                        options: []
                    };
                    let options = subcategoryObject.options;
                    for (var key2 in options) {
                        let optionObject = options[key2];
                        subcategory.options.push(optionObject);
                        console.log('subcategory', subcategory);
                    }
                    category.subcategories.push(subcategory);
                    console.log('category', category);
                }
                tableArray.push(category);
                console.log('tableArray', tableArray);
            }
            if ( !isEqual(tableArray, this.state.table)) {
                this.setState({table: tableArray});
            }
        }
    }
    
    addPoint = (point) => {
        let points = this.state.points;
        points.push(point);
        //this.setState({points, allowAddPoint: false});
        this.setState({allowAddPoint: false});
        console.log('adding point', point);
        this.props.startAddPoint(point);
    }
    
    allowAddPoint = () => {
        this.setState({allowAddPoint: true});
    }
    
    handleSidebarClick = (event) => {
        console.log(event.target.dataset.id);
        this.setState({
            sidebarClickedItemId: event.target.dataset.id
        })
    }
    
    handleExpandProject = (selectedProject) => {
        console.log('selectedProject', selectedProject);
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
        console.log('in selectedProject', selectedProject);
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
                        <div style={{position: 'absolute', zIndex: 15009, top: '2rem', left: '45vw', color: '#fff'}} onClick={this.allowAddPoint}>
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
                <div style={{
                    float: 'left',
                    display: 'inline-block',
                    paddingTop: "2rem",
                    height: $( window ).height() - 60,
                    width: '162px' }}
                >
                    {
                        this.state.points.map((point, index) => {
                            return (
                                <div onClick={this.handleSidebarClick} data-id={point.id} className="sidebar__listItem" key={index}>{point.title}</div>
                            );
                        })
                    }
                </div>
                {
                    this.state.selectedProject ?
                        <div style={{ 
                            position: 'absolute',
                            zIndex: 5,
                            background: '#fff',
                            padding: '20px',
                            paddingTop: '30px',
                            right: 0,
                            top: '60px',
                            height: $( window ).height() - 60,
                            width: $( window ).width() - 170 }}
                        >
                            <div style={{
                                    display: 'inline-block',
                                    width: '50%'
                                }}>
                                <div
                                    className='customers__next__arrow'
                                    onClick={this.hideProject}
                                    style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        left: '20px',
                                        zIndex: 5897
                                    }} 
                                />
                                <div style={{
                                    color: '#fff',
                                    fontWheight: 'bold',
                                    fontSize: 20,
                                    textAlign: 'center',
                                    background: '#6c7680',
                                    width: '100%',
                                    height: '3rem',
                                    float: 'left'
                                }}>
                                    {this.state.selectedProject.extendedContent.title}
                                </div>
                                <div style={{
                                    color: '#000',
                                    fontSize: 11,
                                    width: '100%',
                                    float: 'left',
                                    borderTop: '1px solid black',
                                    borderLeft: '1px solid black',
                                    borderRight: '1px solid black',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {
                                        this.state.table && this.state.table.map((category, index) => {
                                            return (
                                                <div key={`a${index}`} style={{
                                                    display: 'flex',
                                                    flexDirection: 'row'
                                                }}>
                                                    <div style={{
                                                        background: category.color,
                                                        fontSize: 14,
                                                        fontWeight: 'bold',
                                                        width: '20%',
                                                        minHeight: '50px',
                                                        padding: 5,
                                                        borderRight: '1px solid black',
                                                        borderBottom: '1px solid black'
                                                    }}>
                                                        {category.name}
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        width: '80%'
                                                    }}>
                                                        {
                                                            category.subcategories.map((subcategory, index) => {
                                                                return (
                                                                    <div key={`b${index}`} style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        display: 'flex',
                                                                        flexDirection: 'row',
                                                                        borderBottom: '1px solid black',
                                                                    }}>
                                                                        <div style={{
                                                                            fontWeight: 'bold',
                                                                            width: '40%',
                                                                            height: '100%',
                                                                            padding: 5,
                                                                            borderRight: '1px solid black',
                                                                            lineHeight: '12px'
                                                                        }}>
                                                                            {subcategory.name}
                                                                        </div>
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            width: '60%'
                                                                        }}>
                                                                            {
                                                                                subcategory.options.map((option, index) => {
                                                                                    if (option.show) {
                                                                                        return (
                                                                                            <div key={`c${index}`} style={{
                                                                                                width: '100%',
                                                                                                height: '100%',
                                                                                                padding: 5,
                                                                                                lineHeight: '12px'
                                                                                            }}>
                                                                                                {option.name}
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 10
                                }}>
                                    <img width="100%" src={this.state.selectedProject.extendedContent.image} />
                                </div>
                            </div>
                            <div style={{
                                display: 'inline-block',
                                color: '#000',
                                fontSize: 14,
                                width: '48%',
                                float: 'right'
                            }}>
                                {this.state.selectedProject.extendedContent.content}
                            </div>
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
    homepage: state.homepage,
    navigation: state.navigation,
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    setLanguage: (lang) => dispatch(setLanguage(lang)),
    startAddPoint: (point) => dispatch(startAddPoint(point))
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