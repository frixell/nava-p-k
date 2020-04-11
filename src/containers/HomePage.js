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
import { startAddPoint } from '../actions/points';
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

    componentDidMount = () => {
        this.setUrlLang();
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
                <div
                    className="homepage__sidebar__container"
                    style={{
                        height: $( window ).height() - 60
                    }}
                >
                    <SideBar 
                        handleSideBarClick={this.handleSideBarClick}
                        points={this.state.points}
                    />
                </div>
                {
                    this.state.selectedProject ?
                        <div
                            className="homepage__project__details__container"
                            style={{ 
                                height: $( window ).height() - 60,
                                width: $( window ).width() - 170
                            }}
                        >
                            <ProjectDetailsPage hideProject={this.hideProject} table={this.state.table} selectedProject={this.state.selectedProject} />
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