import React from 'react';
import { Prompt } from "react-router-dom";
import {Helmet} from 'react-helmet';
//import { Button } from "react-bootstrap";
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-responsive-modal';
import ContactStrip from '../components/contactpage/ContactStrip';
import CustomersStrip from '../components/common/CustomersStrip';
import Footer from '../components/common/Footer';
import HomePagePleased from '../components/homepage/HomePagePleased';
import HomePagePleasedMobile from '../components/homepage/HomePagePleasedMobile';
import HomePageEvents from '../components/homepage/HomePageEvents';
import HomePageEventsToolbar from '../components/homepage/HomePageEventsToolbar';
import HomePageIntouch from '../components/homepage/HomePageIntouch';
import HomePageTell from '../components/homepage/HomePageTell';
import Navigation from '../components/common/Navigation';
import PageUpStrip from '../components/common/PageUpStrip';
import SocialMedia from '../components/common/SocialMedia';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import {
    startEditHomePage,
    startSetHomePage,
    startAddHomePageTell,
    startEditHomePageSeo,
    startDeleteHomePageImage
} from '../actions/homepage';

import { iconRatioOn } from '../reusableFunctions/iconRatioOn';
import { iconRatioOut } from '../reusableFunctions/iconRatioOut';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
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

    uploadWidget = (e) => {
        const { dataset } = e.target;
        const { name, index, field, action, publicid } = dataset;
        const homepage = JSON.parse(JSON.stringify(this.state.homepage));
        var myUploadWidget = cloudinary.openUploadWidget({ 
            cloud_name: 'dz7woxmn2', 
            upload_preset: 'rsrmcqga', 
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
                    homepage[name][index][field] = result.info.secure_url;
                    homepage[name][index].publicId = result.info.public_id;

                    const tempTell = homepage.tell;
                    const tell = [];
                    Object.keys(tempTell).forEach(function eachKey(key) { tell.push({"id": key, ...tempTell[key]}) });

                    const sortedTell = tell.sort((a, b) => {
                        return a.order > b.order ? 1 : -1;
                    });

                    const fbTell = {};
                    sortedTell.map((tellItem, index) => {
                        fbTell[tellItem.id] = tellItem;
                    })

                    homepage.tell = fbTell;
                    this.setState({
                        tell,
                        homepage
                    })
                    this.setLocalTell(JSON.parse(JSON.stringify(homepage)));
                    this.props.startDeleteHomePageImage( homepage, publicid );
                    myUploadWidget.close();

                    this.onUpdateHomePage();
                }
            }
        );
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




    handleScroll = () => {
        this.setState( handlePageScroll( this.state.pageupImageClassName, this.props.navigation, this.state.navigation.homepageCarouselDone ));
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
        
        if (typeof(window) !== "undefined") {
            window.addEventListener('scroll', this.handleScroll);
        }

        if (this.props.navigation.homepageCarouselDone === true) {
            this.setState({
                pageupImageClassName: 'pageup__image__absolute',
                navigation: this.props.navigation
            });
        } else {
            this.setState({
                navigation: this.props.navigation
            });
        }
        
        

        this.props.startSetHomePage((err, startSetHomePageResponse) => {
            if (err) { throw err; }
            const homepage = JSON.parse(JSON.stringify(startSetHomePageResponse));

            if (!homepage.seo) {
                homepage.seo = {
                    title: '',
                    description: '',
                    keyWords: ''
                }
            }
            
            const tempTell = startSetHomePageResponse.tell;
            const tell = [];
            Object.keys(tempTell).forEach(function eachKey(key) { tell.push({"id": key, ...tempTell[key]}) });

            const sortedTell = tell.sort((a, b) => {
                return a.order > b.order ? 1 : -1;
            });

            const fbTell = {};
            sortedTell.map((tellItem, index) => {
                fbTell[tellItem.id] = tellItem;
            })

            homepage.tell = fbTell;

            this.setState({
                tell,
                tellOrigin: tell,
                seo: homepage.seo,
                homepage,
                homepageOrigin: JSON.parse(JSON.stringify(homepage))
            });
            

            
            this.setTell(JSON.parse(JSON.stringify(homepage)));
            this.setLocalTell(JSON.parse(JSON.stringify(homepage)));
        });
    }

    setTell = (homepage) => {
        const tempTell = homepage.tell;
        const tell = [];
        Object.keys(tempTell).forEach(function eachKey(key) { tell.push({"id": key, ...tempTell[key]}) });
        this.setState({
            tell,
            tellOrigin: tell
        });
    }


    componentWillUnmount = () => {
        if (typeof(window) !== "undefined") {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }


    addNewTell = () => {
        const homepage = this.state.homepage;
        const order = Number(this.state.tell.length)+1;
        const tellData = {
            name: '',
            position:'',
            company: 0,
            createdAt: 0,
            text: '',
            order: order,
            visible: false
        }
        this.props.startAddHomePageTell(homepage, tellData).then((res) => {

            const tempTell = res.tell;
            const tell = [];
            Object.keys(tempTell).forEach(function eachKey(key) { tell.push({"id": key, ...tempTell[key]}) });

            const sortedTell = tell.sort((a, b) => {
                return a.order > b.order ? 1 : -1;
            });

            const fbTell = {};
            sortedTell.map((tellItem, index) => {
                fbTell[tellItem.id] = tellItem;
            })

            homepage.tell = fbTell;

            this.setState({
                tell,
                tellOrigin: tell,
                //homepage,
                homepageOrigin: JSON.parse(JSON.stringify(homepage)),
            });





//to do =======================   set tell and localTell
        });
    }

    setLocalTell = (homepage) => {
        const obj = homepage.tell;
        if ( obj ){
            var localTell = Object.keys(obj).map((key) => {
                const keyedObj = {id: String(key), ...obj[key]};
                return [keyedObj];
            });
            this.setState({
                localTell: localTell,
                localTellOrigin: JSON.parse(JSON.stringify(localTell))
            });
        }
    }

    setTellIndex = (e) => {
        const tellIndex = e.target.dataset.index;
        this.setState(() => ({ tellIndex: tellIndex }));
    }


    setIconRatioOn = (e) => {
        this.setState(iconRatioOn(e));
    }

    setIconRatioOut = (e) => {
        this.setState(iconRatioOut(e));
    }


    onToggleHomepageSeo = () => {
        this.setState({
            seoHomepageModalIsOpen: !this.state.seoHomepageModalIsOpen
        });
    }

    onSeoTitleChange = (e) => {
        const title = e.target.value;
        const seo = this.state.seo;
        seo.title = title;
        this.setState({
            seo
        });
    }

    onSeoDescriptionChange = (e) => {
        const description = e.target.value;
        const seo = this.state.seo;
        seo.description = description;
        this.setState({
            seo
        });
    }

    onSeoKeyWordsChange = (e) => {
        const keyWords = e.target.value;
        const seo = this.state.seo;
        seo.keyWords = keyWords;
        this.setState({
            seo
        });
    }

    updateHomepageSeo = () => {
        const seo = this.state.seo;
        this.props.startEditHomePageSeo(seo);
        this.onToggleHomepageSeo();
    }





    onDeleteTell = (e) => {
        const id = e.target.dataset.id;
        const order = e.target.dataset.order;
        const publicId = e.target.dataset.publicid;
        const tell = [];
        const tellOld = this.state.tell;

        for (let i = 0; i < tellOld.length; i++) {
            if (id !== tellOld[i].id) {
                if (tellOld[i].order > order) {
                    tellOld[i].order = tellOld[i].order-1;
                }
                tell.push(tellOld[i]);
            }
        }

        const fbTell = {};
        const hpTell = {};
        tell.map((tellItem, index) => {
            fbTell[tellItem.id] = tellItem;
            hpTell[tellItem.id] = tellItem;
        })
        
        fbTell[id] = null;
        
        const homepage = this.state.homepage;
        homepage.tell = hpTell;

        this.setState({
            tell
        });

        this.onUpdateHomePage();
    }



    onTellOrderBlur = (e) => {
        const tell = this.state.tell;
        let newOrder = e.target.value;
        if (newOrder > tell.length) {
            newOrder = tell.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        const id = e.target.dataset.id;
        if ( Number(newOrder) > Number(oldOrder) ) {
            for (let i = 0; i < tell.length; i++) {
                if (id !== tell[i].id) {
                    if (tell[i].order <= newOrder && tell[i].order > oldOrder) {
                        tell[i].order = tell[i].order-1;
                    }
                }
            }
        } else if ( Number(newOrder) < Number(oldOrder) ) {
            for (let i = 0; i < tell.length; i++) {
                
                if (id !== tell[i].id) {
                    if (tell[i].order < oldOrder && tell[i].order >= newOrder) {
                        tell[i].order = Number(tell[i].order)+1;
                    }
                }
            }
        }
        tell.sort((a, b) => {
            return a.order > b.order ? 1 : -1;
        });

        const fbTell = {};
        tell.map((tellItem, index) => {
            fbTell[tellItem.id] = tellItem;
        })
        
        const homepage = JSON.parse(JSON.stringify(this.state.homepage));
        homepage.tell = fbTell;

        this.setState({
            tell,
            homepage
        });
    }

    onTellOrderChange = (e) => {
        const tell = this.state.tell;
        let newOrder = e.target.value;
        if (newOrder > tell.length) {
            newOrder = tell.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        tell[e.target.dataset.index].order = Number(newOrder);
        this.setState({
            tell
        });
    }

    onTellOrderKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onTellOrderBlur(e);
        }
    }

    startEditTell = () => {
        this.setState({
            hideTellEditPanel: !this.state.hideTellEditPanel
        });
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

                

                <Modal open={this.state.seoHomepageModalIsOpen} onClose={this.onToggleHomepageSeo} center dir={this.props.lang === "he" ? 'rtl' : 'ltr'}>
                    <div className="backoffice__seo__modal">
                        <h4 className="Heebo-Regular">seo</h4>
                        <div className="backoffice__seo__modal__left">
                            <input
                                className="events__tabs__button"
                                type="text"
                                placeholder="כותרת לדף (title)"
                                value={this.state.seo.title}
                                onChange={this.onSeoTitleChange}
                            />
                            <br />
                            <textarea
                                type="text"
                                placeholder="תאור"
                                value={this.state.seo.description}
                                onChange={this.onSeoDescriptionChange}
                            />
                            <br />
                            <textarea
                                type="text"
                                placeholder="מילות מפתח"
                                value={this.state.seo.keyWords}
                                onChange={this.onSeoKeyWordsChange}
                            />
                            <br />
                        </div>
                        <div className="backoffice__seo__modal__right">
                            <input
                                value="כותרת"
                                readOnly
                            />
                            <br />
                            <textarea
                                value="תאור"
                                readOnly
                            />
                            <br />
                            <textarea
                                value="מילות מפתח"
                                readOnly
                            />
                            <br />
                        </div>
                        <br />
                        <Button bsStyle="success" onClick={this.updateHomepageSeo}>עדכון</Button>
                    </div>
                </Modal>





                
                <Navigation 
                    {...this.props}
                    langLink='/עב'
                    langLinkEng='/en'
                    categories={this.props.eventsCategories}
                />
                <div className="homepage__structure">
                    <div className="homepage__left">

                        { 
                            this.props.isAuthenticated === true ? 
                                <div className="about__edit__panel__box">
                                    <div className="about__edit__panel">
                                        <button className="backoffice_button" onClick={this.onUpdateHomePage}>
                                            <img className="backoffice_icon" src="/images/backoffice/save.svg" alt="שמירה" />
                                        </button>
                                        <button className="backoffice_button" onClick={this.props.startLogout}>
                                            <img className="backoffice_icon" src="/images/backoffice/exit.svg" alt="יציאה" />
                                        </button>
                                        <button className="backoffice_button" onClick={this.onToggleHomepageSeo}>
                                            seo
                                        </button>
                                    </div>
                                </div>
                            :
                                null
                        }
                        <HomePagePleased
                            {...this.props}
                            field='pleasedText'
                            action='setString'
                            homepage={this.state.homepage}
                            homepageOrigin={this.state.homepageOrigin}
                            onChange={this.setData}
                        />
                        <HomePagePleasedMobile
                            {...this.props}
                            field='pleasedText'
                            action='setString'
                            homepage={this.state.homepage}
                            homepageOrigin={this.state.homepageOrigin}
                            onChange={this.setData}
                        />
                        <HomePageEvents 
                            {...this.props}
                            action='setString'
                            name='events'
                            homepage={this.state.homepage}
                            homepageOrigin={this.state.homepageOrigin}
                            onChange={this.setData}
                            uploadWidget={this.uploadWidget}
                            ratioGreenArrow={this.state.ratioGreenArrow}
                            setIconRatioOn={this.setIconRatioOn}
                            setIconRatioOut={this.setIconRatioOut} 
                        />
                        
                    </div>
                    
                    
                </div>
                
                <div hidden={this.state.pageupImageClassName === 'pageup__image'} className="pageup__image__fake desktop"> </div>
                <PageUpStrip
                    pageupImageClassName={this.state.pageupImageClassName}
                />
                <div id='fake_pageupstrip'> </div>

                <ContactStrip lang={this.props.lang} />
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