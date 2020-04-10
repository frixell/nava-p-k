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
            sidebarClickedItemId: null
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
    
    addPoint = (point) => {
        let points = this.state.points;
        points.push(point);
        this.setState({points, allowAddPoint: false});
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
                <div style={{ float: 'left', display: 'inline-block', paddingTop: "2rem", height: $( window ).height() - 60, width: '125px' }}>
                    {
                        this.state.points.map((point, index) => {
                            return (
                                <div onClick={this.handleSidebarClick} data-id={point.id} className="sidebar__listItem" key={index}>{point.title}</div>
                            );
                        })
                    }
                </div>
                <div style={{ float: 'right', display: 'inline-block', height: $( window ).height() - 60, width: $( window ).width() - 135 }}>
                    
                    <PointTest
                        sidebarClickedItemId={this.state.sidebarClickedItemId}
                        points={this.state.points}
                        addPoint={this.addPoint}
                        allowAddPoint={this.state.allowAddPoint}
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