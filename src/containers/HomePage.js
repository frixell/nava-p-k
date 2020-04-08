import React from 'react';
import { Prompt } from "react-router-dom";
import {Helmet} from 'react-helmet';
import { Map } from '@esri/react-arcgis';
import { Scene } from '@esri/react-arcgis';
//esri/views/SceneView
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import {
    startEditHomePage,
    startSetHomePage,
    startAddHomePageTell,
    startEditHomePageSeo,
    startDeleteHomePageImage
} from '../actions/homepage';

import isEqual from 'lodash.isequal';
import { setLanguage } from "redux-i18n";

import ReactGA from 'react-ga';

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
            localTellOrigin: []
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

        this.setUrlLang();

        this.setGoogleAnalytics();
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
                <div style={{height: $( window ).height() - 132, width: $( window ).width() }}>
                    
                    <Scene
                        style={{ width: '100%', height: '100%', fontSize: 3, color: '#000' }}
                        mapProperties={{ basemap: 'topo-vector' }} // 'satellite'
                        viewProperties={{
                            center: [-122.4443, 47.2529],
                            zoom: 2
                        }}
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
    homepage: state.homepage,
    navigation: state.navigation,
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startAddHomePageTell: (homepage, tellData) => dispatch(startAddHomePageTell(homepage, tellData)),
    startSetHomePage: (done) => dispatch(startSetHomePage(done)),
    startEditHomePage: (updates) => dispatch(startEditHomePage(updates)),
    startEditHomePageSeo: (seo) => dispatch(startEditHomePageSeo(seo)),
    startDeleteHomePageImage: ( homepage, publicid ) => dispatch(startDeleteHomePageImage( homepage, publicid )),
    setLanguage: (lang) => dispatch(setLanguage(lang))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);



//{this.state.seo.title ? (window.prerenderReady = true) : null}



// <Map
//                         mapProperties={{ basemap: 'topo-vector' }} // 'satellite'
//                         viewProperties={{
//                             center: [-70, 25],
//                             zoom: 4
//                         }}>
                        
//                     </Map>