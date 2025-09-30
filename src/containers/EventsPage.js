import React from 'react';
import {Helmet} from 'react-helmet';
import AutosizeInput from 'react-input-autosize';
import Button from '@mui/material/Button';
import Modal from 'react-responsive-modal';
import ContactStrip from '../components/contactpage/ContactStrip';
import CustomersStrip from '../components/common/CustomersStrip';
import Footer from '../components/common/Footer';
import EventsHeader from '../components/eventspage/EventsHeader';
import EventsTabs from '../components/eventspage/EventsTabs';
import EventsTabsEditor from '../components/eventspage/EventsTabsEditor';
import EventsText from '../components/eventspage/EventsText';
import EventsEvents from '../components/eventspage/EventsEvents';
import EventHeader from '../components/eventpage/EventHeader';
import Navigation from '../components/common/Navigation';
import PageUpStrip from '../components/common/PageUpStrip';
import SocialMedia from '../components/common/SocialMedia';
import { connect } from 'react-redux';
import { withRouter } from "../routers/withRouter";
import { startLogout } from '../actions/auth';
import {
    startAddCategory,
    startSetSubcategories,
    startAddSubcategory,
    startSetItems,
    startAddItem,
    startUpdateEventImage,
    setCategoryId,
    setSubcategoryId,
    startEditCategory,
    startEditSubCategories,
    startHookSubcategory,
    startHookEvent,
    startToggleShowSubcategory,
    startToggleShowEvent,
    startEditEvents,
    startEditEvent,
    startSetImages,
    startSetAllSubcategories,
    startSetAllEvents,
    startEditSeo,
    startEditSubSeo
} from '../actions/eventspage';

import { iconRatioOn } from '../reusableFunctions/iconRatioOn';
import { iconRatioOut } from '../reusableFunctions/iconRatioOut';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import { handleEventsSaveButtonScroll } from '../reusableFunctions/handleEventsSaveButtonScroll';
import isEqual from 'lodash.isequal';
import { stringReplace } from '../reusableFunctions/stringReplace';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ReactGA from 'react-ga';

import {
  CustomView,
  isTablet,
  isIOS,
  osVersion,
  isChrome,
  isEdge,
  isIE,
  isFirefox 
} from "react-device-detect";

import $ from 'jquery';


function initializeReactGA(url) {
    ReactGA.initialize('UA-128960221-1');
    ReactGA.pageview(url);
}
//initializeReactGA();


class EventsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ratio: 1,
            ratioFacebook: 1,
            ratioInstagram: 1,
            ratioMail: 1,
            ratioPhone: 1,
            ratioGreenArrow: 1,
            categoryOrigin: {},
            category: {
                id: '',
                name: '',
                nameEng: '',
                text: '',
                textEng: '',
                showLines: 1
            },
            subcategory: {
                name: '',
                nameEng: '',
                text: '',
                textEng: '',
                showLines: 1
            },
            allSubCategories: this.props.eventsObject.allSubCategories,
            subCategoriesOrigin: [],
            subCategories: [],
            subcategoryId: '',
            subcategoryName: 'הכל',
            allEvents: this.props.eventsObject.allEvents,
            itemsOrigin: [],
            items: [],
            itemsCurrentOrigin: [],
            itemsCurrentCheck: [],
            itemsCurrent: [],
            editCategoryModalIsOpen: false,
            newSubcategoryNameModalIsOpen: false,
            newSubcategoryName: '',
            newSubCategoryNameModalAlert: '',
            newItemNameModalIsOpen: false,
            newItemName: '',
            newItemNameModalAlert: '',
            hideSubcategoriesEditPanel: true,
            pageupImageClassName: 'pageup__image__absolute',
            seoModalIsOpen: false,
            seo: {
                title: '',
                description: '',
                keyWords: '',
            },
            showItemModal: false,
            showItem: '',
            eventId: '',
            eventName: '',
            eventNameEng: '',
            eventNameOrigin: '',
            eventText: '',
            eventTextOrigin: '',
            eventTextEng: '',
            eventTextEngOrigin: '',
            eventShowLines: '5',
            showSubcategoryId: '',
            showCategoryId: '',
            showCurrentItems: [],
            galleryImages: [],
            currentURL: '',
            langLink: '',
            langLinkEng: '',
            windowScrollTop: 0,
            backofficeSaveButtonClassName: 'backoffice__events__events__buttons'
        }
    }

    setIconRatioOn = (e) => {
        this.setState(iconRatioOn(e));
    }

    setIconRatioOut = (e) => {
        this.setState(iconRatioOut(e));
    }

    uploadWidget = (e) => {
        const { dataset } = e.target;
        const { action, field, index, name } = dataset;
        var myUploadWidget = cloudinary.openUploadWidget({ 
            cloud_name: 'dz7woxmn2', 
            upload_preset: 'rsrmcqga',
            thumbnailTransformation: [ {width: 255, height: 255, crop: 'mpad'}, {width: 800, height: 500, crop: 'mpad'} ] ,
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
                        image: result.info.secure_url
                    };
                    this.props.startUpdateEventImage(index, image).then(()=> {
                        const category = this.props.category;
                        this.props.startSetItems(category.id).then((items)=> {
                            const itemsCurrent = [];
                            let sortedItemsCurrent = [];
                            if ( this.state.subcategoryId === undefined || this.state.subcategoryId === '' ) {
                                items.map((item, index) => {
                                    itemsCurrent.push(item);
                                });
                                sortedItemsCurrent = itemsCurrent.sort((a, b) => {
                                    return a.categories[this.state.categoryId+'order'] > b.categories[this.state.categoryId+'order'] ? 1 : -1;
                                });
                            } else {
                                items.map((item, index) => {
                                    if(item.subcategories[this.state.subcategoryId]){
                                        itemsCurrent.push(item);
                                    }
                                });
                                sortedItemsCurrent = itemsCurrent.sort((a, b) => {
                                    return a.subcategories[this.state.subcategoryId+'order'] > b.subcategories[this.state.subcategoryId+'order'] ? 1 : -1;
                                });
                            }
                            this.setState({
                                items,
                                itemsCurrent: sortedItemsCurrent
                            });
                        });
                        
                    });
                    myUploadWidget.close();
                }
            }
        );
    }

    handleScroll = () => {
        this.setState(handlePageScroll(this.state.pageupImageClassName));
        this.setState(handleEventsSaveButtonScroll(this.state.backofficeSaveButtonClassName));
    }

    getEventId = (eventName, getEventIdItemsCurrent) => {
        let eventId = '';
        let eventNameEng = '';
        let eventText = '';
        let eventTextEng = '';
        let eventImage = '';
        let eventShowLines = 1;
        let seo = {};
        const items = getEventIdItemsCurrent;
        items.map((item) => {
            if (eventName === item.name) {     
                eventId = item.id;
                eventNameEng = item.nameEng,
                eventText = item.text;
                eventTextEng = item.textEng;
                eventImage = item.image;
                eventShowLines = item.showLines;
                if (!item.seo) {
                    item.seo = {
                        title: '',
                        description: '',
                        keyWords: ''
                    }
                }
                this.setState({
                    seo: item.seo
                });
            }
        });
        
        const currentItems = [];
        if ( this.state.subcategoryId === undefined || this.state.subcategoryId === '' ) {
            items.map((item, index) => {
                currentItems.push(item);
            });
        } else {
            items.map((item, index) => {
                if(item.subcategories[this.state.subcategoryId]){
                    currentItems.push(item);
                }
            });
        }
        
        const stripItems = [];
        let itemLocation = 0;
        let nextItem = '';
        let prevItem = '';
        let inId = '';
        let inName = '';
        let firstListName = '';
        let lastListName = '';
        let inPrevName = '';
        let doneId = false;
        items.map((item, index) => {
            if (item.id === eventId) {
                itemLocation = index;
            }
        });
        currentItems.map((item, index) => {
            if (index === 0) {
                firstListName = stringReplace(item.name, ' ', '_');
            } else if (index === currentItems.length-1) {
                lastListName = stringReplace(item.name, ' ', '_');
            }
            inId = item.id;
            inName = stringReplace(item.name, ' ', '_');
            if (item.id === eventId) {
                prevItem = inPrevName;
                doneId = true;
                //itemLocation = index;
            } else {
                if (doneId) {
                    nextItem = inName;
                    doneId = false;
                }
                stripItems.push(item);
            }
            inPrevName = stringReplace(item.name, ' ', '_');
        });
        if (prevItem === '') {
            prevItem = lastListName;
        }
        if (nextItem === '') {
            nextItem = firstListName;
        }
 
        let start = 0;
        let end = stripItems.length;
        if (end > 3) {
            for (var i=0; i<3; i++) {
                let randomIndex = Math.floor(Math.random() * (end - start)) + start;
                let selectedItem = stripItems[randomIndex];
                stripItems[randomIndex] = stripItems[start];
                stripItems[start] = selectedItem;
                start++;
            }
            stripItems.splice(3, stripItems.length-3);
        }
        if( eventShowLines === undefined){
            eventShowLines = 1;
        }
        if( eventText === undefined){
            eventText = "";
        }
        this.setState({
            eventId,
            eventNameEng,
            eventText,
            eventTextEng,
            eventTextOrigin: eventText,
            eventShowLines,
            eventShowLinesOrigin: eventShowLines,
            itemLocation,
            nextItem,
            prevItem,
            currentItems,
            stripItems
        });
        this.props.startSetImages(eventId, this.props.showCategoryId, itemLocation).then((images)=> {
            images.sort((a, b) => {
                return a.eventsIds[eventId+'order'] > b.eventsIds[eventId+'order'] ? 1 : -1;
            });
            let galleryImages = [eventImage]
            if (this.state.windowWidth !== 0) {
                if (this.state.windowWidth > 767) {
                    galleryImages = [eventImage.replace('image/upload', 'image/upload/t_shopBig')];
                } else {
                    galleryImages = [eventImage.replace('image/upload', 'image/upload/t_shopSmall')];
                }
            }
            
            this.setState({
                imagesOrigin: JSON.parse(JSON.stringify(images)),
                images,
                galleryImages
            });
         });
        
        
    }


    getEventData = (eventNameCheck) => {
        const items = this.props.eventsObject[this.props.categoryId+'items'];
        if (items) {
            items.map((item) => {
                if ( item.name === eventNameCheck || item.nameEng === eventNameCheck ) {
                    const eventName = item.name;
                    const eventNameEng = item.nameEng;
                    const eventNameOrigin = item.name;
                    const eventNameEngOrigin = item.nameEng;
                    const eventText = item.text;
                    const eventTextEng = item.textEng;
                    
                    let galleryImages = [item.image];
                    if (this.state.windowWidth !== 0) {
                        if (this.state.windowWidth > 767) {
                            galleryImages = [item.image.replace('image/upload', 'image/upload/t_shopBig')];
                        } else {
                            galleryImages = [item.image.replace('image/upload', 'image/upload/t_shopSmall')];
                        }
                    }
                    this.setState({
                        eventName,
                        eventNameOrigin,
                        eventNameEng,
                        eventNameEngOrigin,
                        eventText,
                        eventTextEng,
                        galleryImages
                    });
                }
            });
        }
        
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props !== prevProps) {
            if (this.props.match.params.event) {
                const eventName = stringReplace(this.props.match.params.event, '_', ' ');
                this.getEventData(eventName);
            }
        }
    }

    setScrollEventListener = () => {
        if (typeof(window) !== "undefined") {
            window.addEventListener('scroll', this.handleScroll);
        }
    }

    checkForCategoryChange = () => {
        const nextCategory = this.props.eventsObject.categories[this.props.categoryIndex].id;
        const prevCategory = this.props.eventsObject.categoryId;
        if (nextCategory !== prevCategory) {
            this.props.setCategoryId(nextCategory);
            this.props.setSubcategoryId('');
        }
        if (!prevCategory) {
            this.props.setCategoryId(nextCategory);
        }
    }

    setCategoryToState = (category) => {
        if (!category.seo) {
            category.seo = {
                title: '',
                description: '',
                keyWords: ''
            }
        }
        this.setState({
            category: category,
            categoryOrigin: JSON.parse(JSON.stringify(category)),
            seo: category.seo
        });
        return category;
    }

    setUrlLang = () => {
        if (this.props.i18n.language !== this.props.urlLang) {
            this.props.i18n.changeLanguage(this.props.urlLang);
        }
    }

    setSubcategoryToState = () => {
        let subcategoryName = '';
        let subcategoryNameEng = '';

        this.state.allSubCategories.map((subcategory) => {
            if (this.props.match.params.subcategory) {
                if ((subcategory.name === stringReplace(this.props.match.params.subcategory, '_', ' ')) || (subcategory.nameEng === stringReplace(this.props.match.params.subcategory, '_', ' '))) {
                    subcategoryName = subcategory.name;
                    subcategoryNameEng = subcategory.nameEng;
                    this.setState({
                        subcategory,
                        subcategoryId: subcategory.id,
                        subcategoryName,
                        subcategoryNameEng
                    });
                }
            }
            
        });
        return {subcategoryName, subcategoryNameEng}
    }

    setGoogleAnalytics = (url) => {
        initializeReactGA(url);
    }

    componentDidMount = () => {

        if (!this.state.windowWidth) {
            let windowWidth = 0;
            if (typeof(window) !== "undefined") {
                windowWidth = $( window ).width();
            }
            this.setState({ 
                windowWidth
            });
        }
        
        let itemsCurrent = [];
        
        this.setUrlLang();

        this.setGoogleAnalytics(`/${this.props.location.pathname}`);

        this.setScrollEventListener();

        this.checkForCategoryChange();
        
        //this.getAllSubcategoriesAndEvents();

        this.props.startSetAllSubcategories().then(() => {
            this.setState({
                allSubCategories: JSON.parse(JSON.stringify(this.props.eventsObject.allSubCategories))
            });
            this.props.startSetAllEvents().then(() => {
                this.setState({
                    allEvents: JSON.parse(JSON.stringify(this.props.eventsObject.allEvents))
                });
            

                const category = this.setCategoryToState(JSON.parse(JSON.stringify(this.props.eventsObject.categories[this.props.categoryIndex])));
                const subcategoryName = this.setSubcategoryToState().subcategoryName;
                const subcategoryNameEng = this.setSubcategoryToState().subcategoryNameEng;

                const categoryId = this.props.category.id;

                let getEventIdItemsCurrent = '';
                let eventId = '';
                let eventName = '';
                let eventNameEng = '';
                let eventText = '';
                let eventTextEng = '';
                let eventImage = '';
                let eventNameOrigin = '';
                let eventNameEngOrigin = '';

                if (!this.props.eventsObject[categoryId]) {
                    this.props.startSetSubcategories(categoryId).then((subCategories)=> {
                        subCategories.sort((a, b) => {
                            return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                        });
                        this.setState({
                            subCategoriesOrigin: JSON.parse(JSON.stringify(subCategories)),
                            subCategories
                        });
                        this.getSubcategorytId(subcategoryName, subCategories);
                        this.props.eventsObject.categories.map((category, index) => {
                            if (category.id !== categoryId) {
                                this.props.startSetItems(category.id).then((items)=> {

                                });
                            }
                        });
                        
                        this.props.startSetItems(categoryId).then((items)=> {
                            items.sort((a, b) => {
                                return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                            });
                            getEventIdItemsCurrent = JSON.parse(JSON.stringify(items));

                            let eventNameCheck = '';
                            if ( this.props.categoryName !== undefined ) {
                                if(this.props.match.params.event) {
                                    eventNameCheck = stringReplace(this.props.match.params.event, '_', ' ');
                                }

                                itemsCurrent.map((item) => {
                                    if (item.name === eventNameCheck || item.nameEng === eventNameCheck) {
                                        eventName = item.name;
                                        eventNameEng = item.nameEng;
                                        eventText = item.text;
                                        eventTextEng = item.textEng;
                                        eventImage = item.image;
                                        eventNameEngOrigin = item.nameEng;
                                    }
                                });

                                eventNameOrigin = eventName;
                                this.getEventId(eventName, getEventIdItemsCurrent);
                                this.setState({
                                    eventName,
                                    eventNameEng,
                                    eventNameOrigin,
                                    eventNameEngOrigin,
                                    showItemModal: true
                                });
                            }
                            this.setState({
                                itemsOrigin: JSON.parse(JSON.stringify(items)),
                                itemsCurrentOrigin: JSON.parse(JSON.stringify(items)),
                                itemsCurrentCheck: JSON.parse(JSON.stringify(items)),
                                itemsCurrent: JSON.parse(JSON.stringify(items)),
                                items: JSON.parse(JSON.stringify(items)),
                            });
                            
                        });
                    });

                } else if (this.props.eventsObject[categoryId] && !this.props.eventsObject[categoryId+'items']) {
                    this.props.eventsObject.categories.map((category, index) => {
                        if (category.id !== categoryId) {
                            this.props.startSetItems(category.id).then((items)=> {

                            });
                        }
                    });
                    const subcategories = this.props.eventsObject[categoryId];
                    subcategories.sort((a, b) => {
                        return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                    });
                    this.getSubcategorytId(subcategoryName, subcategories);

                    this.props.startSetItems(categoryId).then((unsortedItems)=> {

                        const itemsSet = unsortedItems;
                        itemsSet.sort((a, b) => {
                            return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                        });

                        if (this.state.subcategoryId === '') {
                            itemsSet.map((event, index) => {
                                itemsCurrent.push(event);
                            });
                        } else {
                            itemsSet.map((event, index) => {
                                if(event.subcategories[this.state.subcategoryId] === true) {
                                    itemsCurrent.push(event);
                                }
                            });
                            const sortedItemsCurrent = itemsCurrent.sort((a, b) => {
                                return a.subcategories[this.state.subcategoryId+'order'] > b.subcategories[this.state.subcategoryId+'order'] ? 1 : -1;
                            });
                        }
                        getEventIdItemsCurrent = JSON.parse(JSON.stringify(itemsCurrent));

                        let eventNameCheck = '';
                        
                        if ( this.props.categoryName !== undefined ) {
                            if(this.props.match.params.event) {
                                eventNameCheck = stringReplace(this.props.match.params.event, '_', ' ');
                            }
                            itemsCurrent.map((item) => {
                                if (item.name === eventNameCheck || item.nameEng === eventNameCheck) {
                                    eventId = item.id;
                                    eventName = item.name;
                                    eventNameEng = item.nameEng;
                                    eventText = item.text;
                                    eventTextEng = item.textEng;
                                    eventImage = item.image;
                                    eventNameEngOrigin = item.nameEng;
                                }
                            });
                            const eventNameOrigin = eventName;
                            this.getEventId(eventName, getEventIdItemsCurrent);
                            this.setState({
                                eventName,
                                eventNameOrigin,
                                eventNameEng,
                                eventNameEngOrigin,
                                showItemModal: true
                            });
                        }




                        this.setState({
                            subCategoriesOrigin: JSON.parse(JSON.stringify(subcategories)),
                            subCategories: subcategories,
                            itemsOrigin: JSON.parse(JSON.stringify(itemsSet)),
                            itemsCurrentOrigin: JSON.parse(JSON.stringify(itemsCurrent)),
                            itemsCurrentCheck: JSON.parse(JSON.stringify(itemsCurrent)),
                            itemsCurrent: JSON.parse(JSON.stringify(itemsCurrent)),
                            items: JSON.parse(JSON.stringify(itemsSet))
                        });
                        this.setLangLink(category, subcategoryName, subcategoryNameEng, eventName, eventNameEng);

                        if (this.props.match.params.event) {

                            const e = {};
                            e.target = {};
                            e.target.dataset = {};
                            e.target.dataset.id = eventId;
                            e.target.dataset.title = eventName;
                            e.target.dataset.titleeng = eventNameEng;
                            e.target.dataset.image = eventImage;
                            e.target.dataset.text = eventText;
                            e.target.dataset.texteng = eventTextEng;
                            e.target.dataset.subcategoryid = this.state.subcategoryId;
                            e.target.dataset.categoryid = categoryId;

                            
                            setTimeout(function() { //Start the timer
                                this.onInfoToggleOpen(e);
                            }.bind(this), 500);

                        }
                    });
                } else {
                    this.props.eventsObject.categories.map((category, index) => {
                        if (category.id !== categoryId) {
                            this.props.startSetItems(category.id).then((items)=> {

                            });
                        }
                    });
                    const subcategories = this.props.eventsObject[categoryId];
                    subcategories.sort((a, b) => {
                        return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                    });
                    const subcategoryId = this.getSubcategorytId(subcategoryName, subcategories);
                    const itemsSet = this.props.eventsObject[categoryId+'items'];
                    itemsSet.sort((a, b) => {
                        return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                    });

                    if (subcategoryId === '' || !subcategoryId) {
                        itemsSet.map((event, index) => {
                            itemsCurrent.push(event);
                        });
                    } else {
                        itemsSet.map((event, index) => {
                            if(event.subcategories[subcategoryId] === true) {
                                itemsCurrent.push(event);
                            }
                        });
                        itemsCurrent.sort((a, b) => {
                            return a.subcategories[subcategoryId+'order'] > b.subcategories[subcategoryId+'order'] ? 1 : -1;
                        });
                    }
                    getEventIdItemsCurrent = JSON.parse(JSON.stringify(itemsCurrent));

                    if ( this.props.categoryName !== undefined ) {
                        let eventNameCheck = '';
                        if(this.props.match.params.event) {
                            eventNameCheck = stringReplace(this.props.match.params.event, '_', ' ');
                        }
                        itemsCurrent.map((item) => {
                            if (item.name === eventNameCheck || item.nameEng === eventNameCheck) {
                                eventName = item.name;
                                eventNameEng = item.nameEng;
                                eventNameEngOrigin = item.nameEng;
                            }
                        });
                        eventNameOrigin = eventName;
                        this.getEventId(eventName, getEventIdItemsCurrent);
                        this.setState({
                            eventName,
                            eventNameOrigin,
                            showItemModal: true
                        });
                    }



                    this.setState({
                        subCategoriesOrigin: JSON.parse(JSON.stringify(subcategories)),
                        subCategories: subcategories,
                        itemsOrigin: JSON.parse(JSON.stringify(itemsSet)),
                        itemsCurrentOrigin: JSON.parse(JSON.stringify(itemsCurrent)),
                        itemsCurrentCheck: JSON.parse(JSON.stringify(itemsCurrent)),
                        itemsCurrent: JSON.parse(JSON.stringify(itemsCurrent)),
                        items: JSON.parse(JSON.stringify(itemsSet))
                    });
                }
            });
        });
        
        
    }

    scrollToTop = () => {
        let ipadOs = 0;
        if (!!isTablet && !!isIOS) {
            ipadOs = (Number(osVersion.split(".")[0]));
        }
        if ((!!isTablet && !!isIOS && ipadOs<10) || !!isEdge || !!isIE) {
            setTimeout(function() {
                window.scroll( 0, 0 );
            }.bind(this), 50);
        } else {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    scrollToLastShopY = (lastShopY) => {
        let ipadOs = 0;
        if (!!isTablet && !!isIOS) {
            ipadOs = (Number(osVersion.split(".")[0]));
        }
        if ((!!isTablet && !!isIOS && ipadOs<10) || !!isEdge || !!isIE) {
            setTimeout(function() {
                window.scroll( 0, lastShopY );
            }.bind(this), 50);
        } else {
            window.scroll({
                top: lastShopY,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    scrollToItem = () => {
        const itemPageTop = $("#itemPage").offset().top;
        let navbarHeight = 0;
        let diff = 0;
        const windowWidth = $(window).width();
        if (windowWidth < 768) {
            navbarHeight = $('#navbarM').height();
        } else {
            navbarHeight = $('#navbarD').height();
        }

        let ipadOs = 0;
        if (!!isTablet && !!isIOS) {
            ipadOs = (Number(osVersion.split(".")[0]));
        }
        if ((!!isTablet && !!isIOS && ipadOs<10) || !!isEdge || !!isIE) {
            setTimeout(function() {
                window.scroll( 0, itemPageTop - navbarHeight );
            }.bind(this), 50);
        } else {
            
            setTimeout(function() {
                window.scroll({
                    top: itemPageTop - navbarHeight,
                    left: 0,
                    behavior: 'smooth'
                });
            }.bind(this), 50);
        }
    }

    setLangLink = (category, subcategoryName, subcategoryNameEng, eventName, eventNameEng) => {

        if (category && (this.props.match.params.subcategory === undefined || (subcategoryName === '' && subcategoryNameEng === '')) && this.props.match.params.event === undefined) {
            this.setState({
                langLink: "/"+stringReplace(category.name, ' ', '_'),
                langLinkEng: "/"+stringReplace(category.nameEng, ' ', '_')
            });
        }

        if (category && subcategoryName && subcategoryNameEng && this.props.match.params.event === undefined) {
            this.setState({
                langLink: "/"+stringReplace(subcategoryName, ' ', '_')+"/"+stringReplace(category.name, ' ', '_'),
                langLinkEng: "/"+stringReplace(category.nameEng, ' ', '_')+"/"+stringReplace(subcategoryNameEng, ' ', '_')
            });
        }

        if (category && subcategoryName && subcategoryNameEng && eventName && eventNameEng) {
            this.setState({
                langLink: "/"+stringReplace(eventName, ' ', '_')+"/"+stringReplace(subcategoryName, ' ', '_')+"/"+stringReplace(category.name, ' ', '_'),
                langLinkEng: "/"+stringReplace(category.nameEng, ' ', '_')+"/"+stringReplace(subcategoryNameEng, ' ', '_')+"/"+stringReplace(eventNameEng, ' ', '_')
            });
        }
    }

    setSubcategoryId = (e) => {
        const categoryId = this.state.category.id;
        const subcategoryId = e.target.dataset.id;
        const subcategoryName = e.target.dataset.name;
        const subcategoryNameEng = e.target.dataset.nameeng;
        const category = this.setCategoryToState(JSON.parse(JSON.stringify(this.props.eventsObject.categories[this.props.categoryIndex])));
        this.setState({
            subcategoryId,
            subcategoryName,
            subcategoryNameEng
        });
        this.props.setCategoryId(categoryId);
        this.props.setSubcategoryId(subcategoryId);
        let itemsCurrent = [];
        let setOrder = 0;
        if (subcategoryId === '') {
            const storeEvents = this.props.eventsObject[categoryId+'items'];
            this.setState({
                items: storeEvents
            });
            itemsCurrent = JSON.parse(JSON.stringify(storeEvents));
            itemsCurrent.sort((a, b) => {
                return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
            });
        } else {
            this.state.items.map((item, index) => {
                if (item.subcategories[subcategoryId] === true) {
                    setOrder++;
                    if (!item.subcategories[subcategoryId+'order']) {
                        item.subcategories[subcategoryId+'order'] = setOrder;
                        item.categories[categoryId+'order'] = index;
                        this.state.items[index].subcategories[subcategoryId+'order'] = setOrder;
                    }
                    itemsCurrent.push(item);
                }
            });
            itemsCurrent.sort((a, b) => {
                return a.subcategories[subcategoryId+'order'] > b.subcategories[subcategoryId+'order'] ? 1 : -1;
            });
        }
        
        this.setState({
            itemsCurrentOrigin: JSON.parse(JSON.stringify(itemsCurrent)),
            itemsCurrentCheck: JSON.parse(JSON.stringify(itemsCurrent)),
            itemsCurrent
        });
        if(subcategoryId === '') {
            if (this.props.i18n.language === 'he') {
                this.props.history.push(`/${stringReplace(this.state.category.name, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(this.state.category.name, ' ', '_')}`);
            } else {
                this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}`);
            }
        } else {
            if (this.props.i18n.language === 'he') {
                this.props.history.push(`/${stringReplace(subcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(subcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
            } else {
                this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(subcategoryNameEng, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(subcategoryNameEng, ' ', '_')}`);
            }
        }
        
        if (subcategoryId !== '') {
            this.state.subCategories.map((subcategory) => {
                if (subcategoryName === subcategory.name) {
                    const subcategoryNameEng = subcategory.nameEng;
                    const subcategoryText = subcategory.text;
                    const subcategoryTextEng = subcategory.textEng;
                    const subcategoryShowLines = subcategory.showLines;
                    if (!subcategory.seo) {
                        subcategory.seo = {
                            title: '',
                            description: '',
                            keyWords: ''
                        }
                    }
                    const subCategory = {
                        name: subcategoryName,
                        nameEng: subcategoryNameEng,
                        text: subcategoryText,
                        textEng: subcategoryTextEng,
                        showLines: subcategoryShowLines
                    }
                
                    this.setState({
                        seo: subcategory.seo,
                        subcategory: subCategory
                    });
                }
            });
        } else {
            this.setState({
                seo: this.state.category.seo
            });
        }
        
        this.setLangLink(category, subcategoryName, subcategoryNameEng);
    }

    getSubcategorytId = (subcategoryName, subcategories) => {
        let subcategoryId = '';
        //let subcategoryName = '';
        let subcategoryNameEng = '';
        let subcategoryText = '';
        let subcategoryTextEng = '';
        let subcategoryShowLines = 1;
        let seo = {};
        subcategories.map((subCategory) => {
            if (subcategoryName === subCategory.name) {
                subcategoryId = subCategory.id;
                //subcategoryName = subCategory.name;
                subcategoryNameEng = subCategory.nameEng;
                subcategoryText = subCategory.text;
                subcategoryTextEng = subCategory.textEng;
                subcategoryShowLines = subCategory.showLines;
                if (!subCategory.seo) {
                    subCategory.seo = {
                        title: '',
                        description: '',
                        keyWords: ''
                    }
                }
                const subcategory = {
                    name: subcategoryName,
                    nameEng: subcategoryNameEng,
                    text: subcategoryText,
                    textEng: subcategoryTextEng,
                    showLines: subcategoryShowLines
                }
                this.setState({
                    seo: subCategory.seo,
                    subcategory
                });
            }
        });
        this.setState({
            subcategoryId
        });
        return subcategoryId;
    }

    componentWillUnmount = () => {
        if (typeof(window) !== "undefined") {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }

    // update database . ---   category data ( name, text, showlines - number of lines to show on load)

    onUpdateCategory = () => {
        if (this.state.subcategoryId === '') {
            const category = JSON.parse(JSON.stringify(this.state.category));
            this.props.startEditCategory(category);
            this.setState(() => ({ 
                category: category,
                categoryOrigin: JSON.parse(JSON.stringify(category))
            }));
        } else {
            const categoryId = this.state.category.id;
            const subcategories = this.state.subCategories;
            subcategories.map((subcategory, index) => {
                if (this.state.subcategoryId === subcategory.id) {
                    subcategories[index].text = this.state.subcategory.text ? this.state.subcategory.text : '';
                    subcategories[index].showLines = this.state.subcategory.showLines ? this.state.subcategory.showLines : '3';
                }
            })
            const fbSubCategories = {};
            subcategories.map((subcategory, index) => {
                fbSubCategories[subcategory.id] = subcategory;
            })
            this.props.startEditSubCategories(fbSubCategories, subcategories, categoryId);

        }
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.subCategoriesOrigin, this.state.subCategories) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
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

    onCategoryNameChange = (e) => {
        const category = this.state.category;
        category.name = e.target.value;
        this.setState({
            category
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.categoryOrigin, category) && isEqual(this.state.subCategoriesOrigin, this.state.subCategories) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onCategoryTextChange = (e) => {
        const category = this.state.category;
        const subcategory = this.state.subcategory;
        if (this.state.subcategoryId === '') {
            category.text = e.target.value;
            this.setState({
                category
            });
        } else {
            if (this.props.i18n.language === 'he') {
                subcategory.text = e.target.value;
            } else {
                subcategory.textEng = e.target.value;
            }
            
            this.setState({
                subcategory
            });
        }
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.categoryOrigin, category) && isEqual(this.state.subCategoriesOrigin, this.state.subCategories) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onCategoryShowLinesChange = (e) => {
        const category = this.state.category;
        const subcategory = this.state.subcategory;
        if (this.state.subcategoryId === '') {
            category.showLines = e.target.value;
            this.setState({
                category
            });
        } else {
            subcategory.showLines = e.target.value;
            this.setState({
                subcategory
            });
        }
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.categoryOrigin, category) && isEqual(this.state.subCategoriesOrigin, this.state.subCategories) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    startAddNewItem = () => {        
        this.setState({
            newItemNameModalIsOpen: true
        });
    }

    addNewItem = () => {
        let nameFlag = false;
        this.props.eventsObject.allEvents.map((event, index) => {
            if(event.name === this.state.newItemName) {
                nameFlag = true;
            }
        })

        if(nameFlag === true) {
            this.setState({
                newItemNameModalAlert: 'שם אירוע קיים במערכת'
            });
        } else if (this.state.newItemName === '') {
            this.setState({
                newItemNameModalAlert: 'שם אירוע חייב לכלול אות אחת לפחות'
            });
        } else {

            const categoryId = this.state.category.id;
            const subcategoryId = this.state.subcategoryId;
            const name = this.state.newItemName;
            const order = this.state.itemsCurrent.length+1;
            const catOrder = this.state.items.length+1;
            const event = {
                name: name,
                nameEng: name,
                image: '',
                visible: false,
                categories: {
                    [categoryId]: true,
                    [categoryId+'order']: catOrder
                },
                subcategories: {
                    [subcategoryId]: true,
                    [subcategoryId+'order']: order
                }
            };

            this.props.eventsObject.allSubCategories.map((subcategory, index) => {
                let obj = subcategory.categories;
                if (subcategory.id === subcategoryId) {
                    const categoriesArr = [];
                    Object.keys(obj).map((key) => {
                        const keyedObj = {id: String(key), ...obj[key]};
                        if (!String(key).includes("order")) {
                            categoriesArr.push(keyedObj);
                        }
                    });
                    categoriesArr.map((catId, index) => {
                        if (event.categories) {
                            if(event.categories[catId.id] !== true) {
                                event.categories[catId.id] = true;
                                event.categories[catId.id+'order'] = this.props.eventsObject[catId.id+'items'].length+1;
                            }
                        } else {
                            const categoryObject = {
                                [catId.id]: true,
                                [catId.id+'order']: this.props.eventsObject[catId.id+'items'].length+1
                            }
                            event.categories = categoryObject;
                        }
                    });
                }
            });

            this.props.startAddItem(event, categoryId, catOrder, subcategoryId, order).then((items)=> {
                this.getAllData(categoryId, subcategoryId);
                this.setState({
                    newItemNameModalIsOpen: false,
                    newItemName: '',
                    newItemNameModalAlert: ''
                });
            });
        }
    }

    onNewItemNameChange = (e) => {
        const newItemName = e.target.value;
        this.setState({
            newItemName
        });
    }

    onToggleNewItemName = () => {
        this.setState({
            newItemNameModalIsOpen: !this.state.newItemNameModalIsOpen
        });
    }

    startAddNewSubcategory = () => {
        this.setState({
            newSubcategoryNameModalIsOpen: true
        });
    }

    addNewSubcategory = () => {
        let nameFlag = false;
        this.props.eventsObject.allSubCategories.map((subCategory, index) => {
            if(subCategory.name === this.state.newSubcategoryName) {
                nameFlag = true;
            }
        })

        if(nameFlag === true) {
            this.setState({
                newSubCategoryNameModalAlert: 'שם תת-קטגוריה קיים במערכת'
            });
        } else if (this.state.newSubcategoryName === '') {
            this.setState({
                newSubCategoryNameModalAlert: 'שם תת-קטגוריה חייב לכלול אות אחת לפחות'
            });
        } else {
            const categoryId = this.state.category.id;
            const subcategoryId = this.state.subcategoryId;
            const name = this.state.newSubcategoryName;
            const subcategory = {
                name: name,
                visible: false,
                categories: {
                    [categoryId]: true
                }
            };
            const order = this.state.subCategories.length+1;
            this.props.startAddSubcategory(subcategory, order).then((subCategories)=> {
                this.getAllData(categoryId, subcategoryId);
                this.setState({
                    newSubcategoryNameModalIsOpen: false,
                    newSubcategoryName: ''
                });
            });
        }
        
    }

    onNewSubcategoryNameChange = (e) => {
        const newSubcategoryName = e.target.value;
        this.setState({
            newSubcategoryName
        });
    }

    onToggleNewSubcategoryName = () => {
        this.setState({
            newSubcategoryNameModalIsOpen: !this.state.newSubcategoryNameModalIsOpen
        });
    }

    

    startEditSubcategory = () => {
        this.setState({
            hideSubcategoriesEditPanel: !this.state.hideSubcategoriesEditPanel
        });
    }

    onToggleEditSubcategory = () => {
        this.setState({
            hideSubcategoriesEditPanel: !this.state.hideSubcategoriesEditPanel
        });
    }

    editCategory = () => {
        const categoryId = this.state.category.id;
        const subcategoryId = this.state.subcategoryId;
        const name = this.state.newItemName;
        const order = this.state.itemsCurrent.length+1;
        const catOrder = this.state.items.length+1;
        const item = {
            name: name,
            image: '',
            visible: false,
            categories: {
                [categoryId]: true,
                [categoryId+'order']: catOrder
            },
            subcategories: {
                [subcategoryId]: true,
                [subcategoryId+'order']: order
            }
        };
        this.props.startAddItem(item, categoryId, catOrder, subcategoryId, order).then((items)=> {
            this.setState({
                items,
                newItemNameModalIsOpen: false,
                newItemName: ''
            });
        });
        
    }

    onSubcategoryNameChange = (e) => {
        const index = e.target.dataset.index;
        const subCategoryNewName = e.target.value;
        const subCategories = JSON.parse(JSON.stringify(this.state.subCategories));
        if (this.props.i18n.language === 'he') {
            subCategories[index].name = subCategoryNewName;
        } else {
            subCategories[index].nameEng = subCategoryNewName;
        }
        
        this.setState({
            subCategories
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.categoryOrigin, this.state.category) && isEqual(this.state.subCategoriesOrigin, subCategories) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onSubcategoryNameBlur = (e) => {
        let nameFlag = false;
        let oldName = '';
        const allSubCategories = JSON.parse(JSON.stringify(this.state.allSubCategories));
        const subCategories = JSON.parse(JSON.stringify(this.state.subCategories));
        const subCategoryNewName = e.target.value;
        const subCategoryId = e.target.dataset.id;
        allSubCategories.map((subcategory, index) => {
            if (subcategory.id === subCategoryId) {
                oldName = subcategory.name;
            }
        })
        allSubCategories.map((subcategory, index) => {
            if (subcategory.name === subCategoryNewName && subcategory.id !== subCategoryId) {
                nameFlag = true;
            }
        })
        if (nameFlag === true) {
            alert("שם תת-קטגוריה קיים במערכת");
            e.target.value = oldName;
            subCategories.map((subcategory, index) => {
                if (subcategory.id === subCategoryId) {
                    subCategories[index].name = oldName;
                    this.setState({
                        subCategories
                    });
                }
            })
        } else {
            if (typeof(window) !== "undefined") {
                if(isEqual(this.state.categoryOrigin, this.state.category) && isEqual(this.state.subCategoriesOrigin, subCategories) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
                    window.removeEventListener("beforeunload", this.unloadFunc);
                } else {
                    window.addEventListener("beforeunload", this.unloadFunc);
                }
            }
        }
    }

    onSubcategoryOrderBlur = (e) => {
        const subCategories = JSON.parse(JSON.stringify(this.state.subCategories));
        const categoryId = this.state.category.id;
        let newOrder = e.target.value;
        if (newOrder > subCategories.length) {
            newOrder = subCategories.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        const id = e.target.dataset.id;
        if ( Number(newOrder) > Number(oldOrder) ) {
            for (let i = 0; i < subCategories.length; i++) {
                if (id !== subCategories[i].id) {
                    if (subCategories[i].categories[categoryId+'order'] <= newOrder && subCategories[i].categories[categoryId+'order'] > oldOrder) {
                        subCategories[i].categories[categoryId+'order'] = subCategories[i].categories[categoryId+'order']-1;
                    }
                }
            }
        } else if ( Number(newOrder) < Number(oldOrder) ) {
            for (let i = 0; i < subCategories.length; i++) {
                
                if (id !== subCategories[i].id) {
                    if (subCategories[i].categories[categoryId+'order'] < oldOrder && subCategories[i].categories[categoryId+'order'] >= newOrder) {
                        subCategories[i].categories[categoryId+'order'] = Number(subCategories[i].categories[categoryId+'order'])+1;
                    }
                }
            }
        }
        subCategories.sort((a, b) => {
            return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
        });
        this.setState({
            subCategories
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.categoryOrigin, this.state.category) && isEqual(this.state.subCategoriesOrigin, subCategories) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onSubcategoryOrderChange = (e) => {
        const subCategories = JSON.parse(JSON.stringify(this.state.subCategories));
        const categoryId = this.state.category.id;
        let newOrder = e.target.value;
        if (newOrder > subCategories.length) {
            newOrder = subCategories.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        subCategories[e.target.dataset.index].categories[categoryId+'order'] = Number(newOrder);
        this.setState({
            subCategories
        });
    }

    onSubcategoryOrderKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onSubcategoryOrderBlur(e);
        }
    }

    updateSubcategories = () => {
        const categoryId = this.state.category.id;
        const subcategories = this.state.subCategories;
        const fbSubCategories = {};
        subcategories.map((subcategory, index) => {
            fbSubCategories[subcategory.id] = subcategory;
        })
        this.props.startEditSubCategories(fbSubCategories, subcategories, categoryId);

        this.setState({
            subCategoriesOrigin: subcategories
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.categoryOrigin, this.state.category) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    toggleHookSubcategory = (e) => {
        const categoryId = this.state.category.id;
        const subcategoryId = e.target.dataset.id;
        const subCategoryIndex = e.target.dataset.index;
        let showStatus = e.target.dataset.showstatus;
        if (showStatus === 'true') {
            showStatus = true;
        } else if (showStatus === 'false') {
            showStatus = null;
        }
        const fbSubcategoriesToUpdate = {};
        const fbEventsToUpdate = {};
        const subcategoriesToUpdate = [];
        const subcategories = this.state.subCategories;
        if (showStatus === null) {
            subcategories.map((subcategory, index) => {
                if(subcategory.id === subcategoryId) {
                    subcategory.categories[categoryId] = null;
                    subcategory.categories[categoryId+'order'] = null;
                    fbSubcategoriesToUpdate[subcategory.id] = subcategory;
                }
                if(subcategory.categories[categoryId+'order'] > subCategoryIndex) {
                    subcategory.categories[categoryId+'order'] = subcategory.categories[categoryId+'order']-1;
                    fbSubcategoriesToUpdate[subcategory.id] = subcategory;
                }
                subcategoriesToUpdate.push(subcategory);
            });
            const eventsForReorder = [];
            const eventsToRemove = [];
            const newAllItems = [];
            this.state.items.map((event, index) => {
                if (event.subcategories[subcategoryId] === true) {
                    let eventExists = false;
                    let obj = event.subcategories;
                    const subcategoriesArr = [];
                    Object.keys(obj).map((key) => {
                        const keyedObj = {id: String(key), ...obj[key]};
                        if (!String(key).includes("order")) {
                            subcategoriesArr.push(keyedObj);
                        }
                    });

                    subcategoriesArr.map((subcategory, index) => {
                        this.state.allSubCategories.map((allSubcategory, index) => {
                            if(subcategory.id === allSubcategory.id) {
                                if(allSubcategory.id !== subcategoryId) {
                                    if (allSubcategory.categories[categoryId] === true) {
                                        eventExists = true;
                                    }
                                }
                            }
                        })
                    })

                    if (eventExists === false) {
                        eventsForReorder.push(JSON.parse(JSON.stringify(event)));
                        event.categories[categoryId] = null;
                        event.categories[categoryId+'order'] = null;
                        eventsToRemove.push(event);
                        fbEventsToUpdate[event.id] = event;
                    }
                    
                } else {
                    newAllItems.push(event);
                }
            });

            eventsForReorder.sort((a, b) => {
                return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? -1 : 1;
            });
            eventsForReorder.map((event, index) => {
                const removedIndex = event.categories[categoryId+'order'];
                newAllItems.map((allEvent, index) => {
                    if (allEvent.categories[categoryId+'order'] >= removedIndex) {
                        allEvent.categories[categoryId+'order'] = allEvent.categories[categoryId+'order'] - 1;
                        fbEventsToUpdate[allEvent.id] = allEvent;
                    }
                })
            });
        } else {
            const eventsToAdd = [];
            let orderCounter = Number(this.state.items.length);
            this.props.eventsObject.allEvents.map((event, index) => {
                if (event.subcategories) {
                    if (event.subcategories[subcategoryId] === true) {
                        let eventExists = false;
                        let obj = event.subcategories;
                        const subcategoriesArr = [];
                        Object.keys(obj).map((key) => {
                            const keyedObj = {id: String(key), ...obj[key]};
                            if (!String(key).includes("order")) {
                                subcategoriesArr.push(keyedObj);
                            }
                        });
                        subcategoriesArr.map((subcategory, index) => {
                            this.state.allSubCategories.map((allSubcategory, index) => {
                                if(subcategory.id === allSubcategory.id) {
                                    if(allSubcategory.id !== subcategoryId) {
                                        if (allSubcategory.categories[categoryId] === true) {
                                            eventExists = true;
                                        }
                                    }
                                }
                            })
                        })
                        if (eventExists === false) {
                            orderCounter++
                            if (event.categories) {
                                event.categories[categoryId] = showStatus;
                                event.categories[categoryId+'order'] = orderCounter;
                            } else {
                                const eventToAddObject = {
                                    [categoryId]: showStatus,
                                    [categoryId+'order']: orderCounter
                                }
                                event.categories = eventToAddObject;
                            }
                            eventsToAdd.push(event);
                            fbEventsToUpdate[event.id] = event;
                        }
                    }
                }
            });
            this.props.eventsObject.allSubCategories.map((subCategory, index) => {
                if (subCategory.id === subcategoryId) {
                    const subcategoryId = e.target.dataset.id;
                    const categoryId = this.state.category.id;
                    const categoryOrder = Number(this.state.subCategories.length)+1;
                    const subcategoryToAdd =  subCategory;
                    if (!subcategoryToAdd.categories) {
                        subcategoryToAdd.categories = {};
                    }
                    subcategoryToAdd.categories[categoryId] = showStatus;
                    subcategoryToAdd.categories[categoryId+'order'] = categoryOrder;
                    const subcategoryAllOrder = index;
                    fbSubcategoriesToUpdate[subcategoryId] = subcategoryToAdd;
                }
            });
        }
        this.props.startHookSubcategory( fbSubcategoriesToUpdate, fbEventsToUpdate ).then((res) => {
            this.getAllData(categoryId, subcategoryId);
            if(showStatus === true) {
                this.onToggleNewSubcategoryName();
            }
        });
    }

    toggleShowItem = (e) => {
        const categoryId = this.state.category.id;
        const subcategoryId = this.state.subcategoryId;
        const eventId = e.target.dataset.id;
        let visible = e.target.dataset.visible;
        if (visible === 'true') {
            visible = true;
        } else if (visible === 'false') {
            visible = false;
        }
        this.props.startToggleShowEvent(categoryId, subcategoryId, eventId, visible).then((res) => {
            const items = JSON.parse(JSON.stringify(this.state.items));
            let itemsIndex = 0;
            items.map((item, index) => {
                if ( item.id === eventId ) {
                    itemsIndex = index;
                }
            })
            items[itemsIndex].visible = visible;
            const itemsCurrent = JSON.parse(JSON.stringify(this.state.itemsCurrent));
            let itemsCurrentIndex = 0;
            itemsCurrent.map((item, index) => {
                if ( item.id === eventId ) {
                    itemsCurrentIndex = index;
                }
            })
            itemsCurrent[itemsCurrentIndex].visible = visible;
            this.setState({
                itemsOrigin: JSON.parse(JSON.stringify(items)),
                items: items,
                itemsCurrentOrigin: JSON.parse(JSON.stringify(itemsCurrent)),
                itemsCurrentCheck: JSON.parse(JSON.stringify(itemsCurrent)),
                itemsCurrent: itemsCurrent
            });
        });
    }

    toggleShowSubcategory = (e) => {
        const categoryId = this.state.category.id;
        const subcategoryId = e.target.dataset.id;
        let visible = e.target.dataset.visible;
        if (visible === 'true') {
            visible = true;
        } else if (visible === 'false') {
            visible = false;
        }
        this.props.startToggleShowSubcategory(categoryId, subcategoryId, visible).then((res) => {
            const subcategories = JSON.parse(JSON.stringify(this.state.subCategories));
            let subcategoriesIndex = 0;
            subcategories.map((subcategory, index) => {
                if ( subcategory.id === subcategoryId ) {
                    subcategoriesIndex = index;
                }
            })
            subcategories[subcategoriesIndex].visible = visible;
            this.setState({
                subCategoriesOrigin: JSON.parse(JSON.stringify(subcategories)),
                subCategories: subcategories
            });
        });
    }

    toggleHookEvent = (e) => {
        const categoryId = this.state.category.id;
        const subcategoryId = this.state.subcategoryId;
        const eventId = e.target.dataset.id;
        const eventIndex = e.target.dataset.order;
        let showStatus = e.target.dataset.showstatus;
        if (showStatus === 'true') {
            showStatus = true;
        } else if (showStatus === 'false') {
            showStatus = null;
        }

        const fbEventsToUpdate = {};
        let eventsToUpdate = [];
        const subcategories = this.state.subCategories;
        const eventsAll = this.state.allEvents;
        const events = this.state.items;
        let eventsCurrent = [];
        let eventCategoryIndex = 0;
        if (showStatus === null) {
            let eventExists = false;
            let globalEvent = {};
            this.props.eventsObject.allEvents.map((event, index) => {
                if (event.id === eventId) {
                    globalEvent = event;
                }
                if (event.subcategories) {
                    if (event.subcategories[subcategoryId]===true) {
                        eventsCurrent.push(event);
                    }
                }
            });
            eventsCurrent.map((event, index) => {
                if (event.id === eventId) {
                    eventCategoryIndex = event.categories[categoryId+'order'];
                    event.subcategories[subcategoryId] = null;
                    event.subcategories[subcategoryId+'order'] = null;
                    fbEventsToUpdate[event.id] = event;
                    subcategories.map((subcategory, index) => {
                        if (subcategory.id !== subcategoryId) {
                            if (event.subcategories[subcategory.id] === true) {
                                eventExists = true;
                            }
                        }
                    });
                }
                if (event.subcategories[subcategoryId+'order'] > eventIndex) {
                    event.subcategories[subcategoryId+'order'] = event.subcategories[subcategoryId+'order']-1;
                    fbEventsToUpdate[event.id] = event;
                }
                eventsToUpdate.push(event);
            });
            if (eventExists === false) {
                eventsToUpdate = [];
                events.map((event, index) => {
                    if (event.id === eventId) {
                        event.categories[categoryId] = null;
                        event.categories[categoryId+'order'] = null;
                        event.subcategories[subcategoryId] = null;
                        event.subcategories[subcategoryId+'order'] = null;
                        fbEventsToUpdate[event.id] = event;
                    }
                    if (event.categories[categoryId+'order'] > eventCategoryIndex) {
                        event.categories[categoryId+'order'] = event.categories[categoryId+'order']-1;
                        if (fbEventsToUpdate[event.id]) {
                            event.subcategories[subcategoryId] = fbEventsToUpdate[event.id].subcategories[subcategoryId];
                            event.subcategories[subcategoryId+'order'] = fbEventsToUpdate[event.id].subcategories[subcategoryId+'order'];
                        }
                        fbEventsToUpdate[event.id] = event;
                    }
                    eventsToUpdate.push(event);
                });
            }
            this.props.eventsObject.allSubCategories.map((subcategory, index) => {
                let obj = subcategory.categories;
                if (subcategory.id === subcategoryId) {
                    const categoriesArr = [];
                    Object.keys(obj).map((key) => {
                        const keyedObj = {id: String(key), ...obj[key]};
                        if (!String(key).includes("order")) {
                            categoriesArr.push(keyedObj);
                        }
                    });
                    categoriesArr.map((catId, index) => {
                        if (catId.id !== categoryId) {
                            eventExists = false;
                            if (this.props.eventsObject[catId.id].length > 1) {
                                this.props.eventsObject[catId.id].map((subcategory, index) => {
                                    if (subcategory.id !== subcategoryId) {
                                        if (globalEvent.subcategories[subcategory.id] === true){
                                            eventExists = true;
                                        }
                                    }
                                });
                            }
                            if (eventExists === false) {
                                this.props.eventsObject[catId.id+'items'].map((event, index) => {
                                    if (event.id === eventId) {
                                        fbEventsToUpdate[event.id].categories[catId.id] = null;
                                        fbEventsToUpdate[event.id].categories[catId.id+'order'] = null;
                                    } else {
                                        if (event.categories[catId.id+'order'] > globalEvent.categories[catId.id+'order']) {
                                            event.categories[catId.id+'order'] = event.categories[catId.id+'order'] - 1;
                                            if (fbEventsToUpdate[event.id]) {
                                                fbEventsToUpdate[event.id].categories[catId.id+'order'] = event.categories[catId.id+'order'];
                                            } else {
                                                fbEventsToUpdate[event.id] = event;
                                            }
                                        }
                                    }
                                });
                            }
                        } 
                    });
                }
            });
        } else {
            this.props.eventsObject.allEvents.map((event, index) => {
                if (event.subcategories) {
                    if (event.subcategories[subcategoryId]===true) {
                        eventsCurrent.push(event);
                    }
                }
            });
            eventsAll.map((event, index) => {
                if (event.id === eventId) {
                    if (event.subcategories) {
                        event.subcategories[subcategoryId] = true;
                        event.subcategories[subcategoryId+'order'] = eventsCurrent.length+1;
                    } else {
                        const subcategoryObject = {
                            [subcategoryId]: true,
                            [subcategoryId+'order']: eventsCurrent.length+1
                        }
                        event.subcategories = subcategoryObject;
                    }
                    this.props.eventsObject.allSubCategories.map((subcategory, index) => {
                        let obj = subcategory.categories;
                        if (subcategory.id === subcategoryId) {
                            const categoriesArr = [];
                            Object.keys(obj).map((key) => {
                                const keyedObj = {id: String(key), ...obj[key]};
                                if (!String(key).includes("order")) {
                                    categoriesArr.push(keyedObj);
                                }
                            });
                            categoriesArr.map((catId, index) => {
                                if (event.categories) {
                                    if(event.categories[catId.id] !== true) {
                                        event.categories[catId.id] = true;
                                        event.categories[catId.id+'order'] = this.props.eventsObject[catId.id+'items'].length+1;
                                    }
                                } else {
                                    const categoryObject = {
                                        [catId.id]: true,
                                        [catId.id+'order']: this.props.eventsObject[catId.id+'items'].length+1
                                    }
                                    event.categories = categoryObject;
                                }
                            });
                        }
                    });
                    fbEventsToUpdate[event.id] = event;
                    eventsToUpdate.push(event);
                }
            });
        }
        this.props.startHookEvent( fbEventsToUpdate ).then((res) => {
            this.getAllData(categoryId, subcategoryId);
            if(showStatus === true) {
                this.onToggleNewItemName();
            }
        
        });
    }

    getAllData = (categoryId, subcategoryId) => {
        this.props.startSetSubcategories(categoryId).then((subCategories)=> {
            if(subCategories.length>1){
                subCategories.sort((a, b) => {
                    return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                });
            }
            this.setState({
                subCategoriesOrigin: JSON.parse(JSON.stringify(subCategories)),
                subCategories
            });
            this.props.eventsObject.categories.map((category, index) => {
                if (category.id !== categoryId) {
                    this.props.startSetItems(category.id).then((items)=> {
                    });
                }
            });
            this.props.startSetItems(categoryId).then((items)=> {
                const itemsCurrent = [];
                items.map((item, index) => {
                    if (this.state.subcategoryId === '') {
                        itemsCurrent.push(item);
                    } else if (item.subcategories[subcategoryId] === true) {
                        itemsCurrent.push(item);
                    }
                });
                if (this.state.subcategoryId === '') {
                    itemsCurrent.sort((a, b) => {
                        return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                    });
                } else {
                    itemsCurrent.sort((a, b) => {
                        return a.subcategories[subcategoryId+'order'] > b.subcategories[subcategoryId+'order'] ? 1 : -1;
                    });
                }
                this.setState({
                    items: JSON.parse(JSON.stringify(items)),
                    itemsOrigin: JSON.parse(JSON.stringify(items)),
                    itemsCurrentOrigin: JSON.parse(JSON.stringify(itemsCurrent)),
                    itemsCurrentCheck: JSON.parse(JSON.stringify(itemsCurrent)),
                    itemsCurrent: JSON.parse(JSON.stringify(itemsCurrent))
                });
            });
            this.props.startSetAllSubcategories().then(() => {
                this.setState({
                    allSubCategories: JSON.parse(JSON.stringify(this.props.eventsObject.allSubCategories))
                });
                this.props.startSetAllEvents().then(() => {
                this.setState({
                    allEvents: JSON.parse(JSON.stringify(this.props.eventsObject.allEvents))
                });
            });
            });
        });
    }

    onItemOrderBlur = (e) => {
        const type = e.target.dataset.type;
        const items = this.state.items;
        const itemsCurrent = this.state.itemsCurrent;
        const itemId = e.target.dataset.id;
        const categoryId = this.state.category.id;
        const subcategoryId = e.target.dataset.subcategoryid;
        const index = e.target.dataset.index;
        const subCategories = this.state.subCategories; 
        let newOrder = e.target.value;
        if (newOrder > itemsCurrent.length) {
            newOrder = itemsCurrent.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        const id = e.target.dataset.id;
        if (type==="all") {
            if ( Number(newOrder) > Number(oldOrder) ) {
                for (let i = 0; i < itemsCurrent.length; i++) {
                    if (id !== itemsCurrent[i].id) {
                        if (itemsCurrent[i].categories[categoryId+'order'] <= newOrder && itemsCurrent[i].categories[categoryId+'order'] > oldOrder) {
                            itemsCurrent[i].categories[categoryId+'order'] = itemsCurrent[i].categories[categoryId+'order']-1;
                        }
                    }
                }
            } else if ( Number(newOrder) < Number(oldOrder) ) {
                for (let i = 0; i < itemsCurrent.length; i++) {
                    if (id !== itemsCurrent[i].id) {
                        if (itemsCurrent[i].categories[categoryId+'order'] < oldOrder && itemsCurrent[i].categories[categoryId+'order'] >= newOrder) {
                            itemsCurrent[i].categories[categoryId+'order'] = Number(itemsCurrent[i].categories[categoryId+'order'])+1;
                        }
                    }
                }
            }
            itemsCurrent.sort((a, b) => {
                return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
            });
        } else {
            if ( Number(newOrder) > Number(oldOrder) ) {
                for (let i = 0; i < itemsCurrent.length; i++) {
                    if (id !== itemsCurrent[i].id) {
                        if (itemsCurrent[i].subcategories[subcategoryId+'order'] <= newOrder && itemsCurrent[i].subcategories[subcategoryId+'order'] > oldOrder) {
                            itemsCurrent[i].subcategories[subcategoryId+'order'] = itemsCurrent[i].subcategories[subcategoryId+'order']-1;
                        }
                    }
                }
            } else if ( Number(newOrder) < Number(oldOrder) ) {
                for (let i = 0; i < itemsCurrent.length; i++) {
                    if (id !== itemsCurrent[i].id) {
                        if (itemsCurrent[i].subcategories[subcategoryId+'order'] < oldOrder && itemsCurrent[i].subcategories[subcategoryId+'order'] >= newOrder) {
                            itemsCurrent[i].subcategories[subcategoryId+'order'] = Number(itemsCurrent[i].subcategories[subcategoryId+'order'])+1;
                        }
                    }
                }
            }
            itemsCurrent.sort((a, b) => {
                return a.subcategories[subcategoryId+'order'] > b.subcategories[subcategoryId+'order'] ? 1 : -1;
            });
        }

        items.map((allItem, index) => {
            itemsCurrent.map((item) => {
                if (allItem.id === item.id) {
                    items[index] = item;
                }
            })
        })

        this.setState({
            items: JSON.parse(JSON.stringify(items)),
            itemsCurrentCheck: JSON.parse(JSON.stringify(itemsCurrent)),
            itemsCurrent
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.categoryOrigin, this.state.category) && isEqual(this.state.subCategoriesOrigin, this.state.subCategories) && isEqual(itemsCurrent, this.state.itemsCurrentOrigin)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onItemOrderChange = (e) => {
        const type = e.target.dataset.type;
        const items = this.state.items;
        const itemsCurrent = this.state.itemsCurrent;
        const itemId = e.target.dataset.id;
        const categoryId = this.state.category.id;
        const subcategoryId = e.target.dataset.subcategoryid;
        const index = e.target.dataset.index;
        let newOrder = e.target.value;
        if (newOrder > itemsCurrent.length) {
            newOrder = itemsCurrent.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(index)+1;
        if (type==="all") {
            itemsCurrent[index].categories[categoryId+'order'] = Number(newOrder);
        } else {
            itemsCurrent[index].subcategories[subcategoryId+'order'] = Number(newOrder);
        }
        
        this.setState({
            itemsCurrent
        });
    }

    onItemOrderKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onItemOrderBlur(e);
        }
    }


    updateItems = () => {
        const categoryId = this.state.category.id;
        const subcategoryId = this.state.subcategoryId;
        const itemsCurrent = this.state.itemsCurrent;
        const items = this.state.items;

        let events = this.state.items;
        if ( subcategoryId === '' ) {
            events = this.state.itemsCurrent;
        }
        
        const fbEvents = {};
        itemsCurrent.map((item, index) => {
            fbEvents[item.id] = item;
        });

        items.map((allItem, index) => {
            itemsCurrent.map((item) => {
                if (allItem.id === item.id) {
                    items[index] = item;
                }
            })
        })

        this.setState({
            items: items,
            itemsOrigin: items,
            itemsCurrentOrigin: JSON.parse(JSON.stringify(itemsCurrent)),
            itemsCurrentCheck: JSON.parse(JSON.stringify(itemsCurrent))
        });
        this.props.startEditEvents(fbEvents, events, categoryId);
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.categoryOrigin, this.state.category) && isEqual(this.state.subCategoriesOrigin, this.state.subCategories)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onToggleSeo = () => {
        this.setState({
            seoModalIsOpen: !this.state.seoModalIsOpen
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

    updateSeo = () => {
        const seo = this.state.seo;
        const categoryId = this.state.category.id;
        const subcategoryId = this.state.subcategoryId;
        let link = '';
        if(this.state.subcategoryId === '') {
            link = this.props.location.pathname;
            this.props.startEditSeo(seo, categoryId, link);
        } else {
            link = 'subcategories/' + this.props.match.params.subcategory;
            this.props.startEditSubSeo(seo, categoryId, subcategoryId, link);
        }
        this.onToggleSeo();
    }



    onEventNameChange = (e) => {
        let eventName = this.state.eventNameOrigin;
        let eventNameEng = this.state.eventNameEngOrigin;
        if (this.props.i18n.language === 'he') {
            eventName = e.target.value;
            this.setState({
                eventName
            });
        } else {
            eventNameEng = e.target.value;
            this.setState({
                eventNameEng
            });
        }
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.eventNameOrigin, eventName) && isEqual(this.state.eventTextOrigin, this.state.eventText) && isEqual(this.state.eventShowLinesOrigin, this.state.eventShowLines)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onEventTextChange = (e) => {
        let eventText = this.state.eventTextOrigin;
        let eventTextEng = this.state.eventTextEngOrigin;
        if (this.props.i18n.language === 'he') {
            eventText = e.target.value;
            this.setState({
                eventText
            });
        } else {
            eventTextEng = e.target.value;
            this.setState({
                eventTextEng
            });
        }
        
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.eventNameOrigin, this.state.eventName) && isEqual(this.state.eventTextOrigin, eventText) && isEqual(this.state.eventShowLinesOrigin, this.state.eventShowLines)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onEventShowLinesChange = (e) => {
        const eventShowLines = Number(e.target.value);
        this.setState({
            eventShowLines
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.eventNameOrigin, this.state.eventName) && isEqual(this.state.eventTextOrigin, this.state.eventText) && isEqual(this.state.eventShowLinesOrigin, eventShowLines)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onUpdateEvent = () => {
        let nameFlag = false;
        this.props.eventsObject.allEvents.map((event, index) => {
            if (this.props.i18n.language === 'he') {
                if(event.name === this.state.eventName && this.state.eventName !== this.state.eventNameOrigin) {
                    nameFlag = true;
                }
            } else {
                if(event.nameEng === this.state.eventNameEng && this.state.eventNameEng !== this.state.eventNameEngOrigin) {
                    nameFlag = true;
                }
            }
            
        })
        if(nameFlag === true) {
            this.setState({
                itemNameModalAlert: 'שם ציור קיים במערכת',
                itemNameModalIsOpen: true
            });
        } else if (this.state.eventName === '') {
            this.setState({
                itemNameModalAlert: 'שם ציור חייב לכלול אות אחת לפחות',
                itemNameModalIsOpen: true
            });
        } else {
            const eventName = JSON.parse(JSON.stringify(this.state.eventName));
            const eventNameEng = JSON.parse(JSON.stringify(this.state.eventNameEng));
            const eventText = this.state.eventText;
            const eventTextEng = this.state.eventTextEng;
            const eventShowLines = this.state.eventShowLines;
            const eventId = this.state.eventId;
            this.props.startEditEvent(eventName, eventNameEng, eventText, eventTextEng, eventShowLines, eventId).then(() => {
                let gotoNewLocation = false;
                if((eventName !== this.state.eventNameOrigin) || (eventNameEng !== this.state.eventNameEngOrigin)) {
                    gotoNewLocation = true;
                }
                this.setState(() => ({
                    eventName,
                    eventText,
                    eventNameEng,
                    eventTextEng,
                    eventShowLines,
                    eventNameOrigin: eventName,
                    eventTextOrigin: eventText,
                    eventNameEngOrigin: eventNameEng,
                    eventTextEngOrigin: eventTextEng,
                    eventShowLinesOrigin: eventShowLines
                }));
                if (typeof(window) !== "undefined") {
                    window.removeEventListener("beforeunload", this.unloadFunc);
                }
                if(gotoNewLocation === true) {

                    let subcategoryNameEng = this.state.subcategoryNameEng || 'All';

                    if (this.props.i18n.language === 'he') {
                        this.props.history.push(`/${stringReplace(eventName, ' ', '_')}/${stringReplace(this.state.subcategoryName, ' ', '_')}/${stringReplace(this.props.categoryName, ' ', '_')}`);
                        this.setGoogleAnalytics(`/${stringReplace(eventName, ' ', '_')}/${stringReplace(this.state.subcategoryName, ' ', '_')}/${stringReplace(this.props.categoryName, ' ', '_')}`);
                    } else {
                        this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(subcategoryNameEng, ' ', '_')}/${stringReplace(eventNameEng, ' ', '_')}`);
                        this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(subcategoryNameEng, ' ', '_')}/${stringReplace(eventNameEng, ' ', '_')}`);
                    }  
                    
                }
                this.setData(eventName, eventNameEng);
            });
        }
    }

    setData = (eventName, eventNameEng) => {
        let subcategoryId = '';
        if (this.state.subcategoryId) {
            subcategoryId = this.state.subcategoryId;
        } else if (!this.state.subcategoryId && this.props.eventsObject.subcategoryId) {
            subcategoryId = this.props.showSubcategoryId;
        }
        this.setState({
            subcategoryId
        });

        this.props.startSetAllSubcategories().then(() => {
            this.setState({
                allSubCategories: JSON.parse(JSON.stringify(this.props.eventsObject.allSubCategories))
            });
            this.props.startSetAllEvents().then(() => {
                this.setState({
                    allEvents: JSON.parse(JSON.stringify(this.props.eventsObject.allEvents))
                });
                let subcategoryName = this.state.subcategoryName;
                let subcategoryNameEng = this.state.subcategoryNameEng;
                if (this.props.eventsObject.subcategoryId === undefined || (!this.state.subcategoryId && this.props.eventsObject.subcategoryId === '')) {
                    this.setState({
                        subcategoryName: 'הכל',
                        subcategoryNameEng: 'All'
                    });
                } else {
                    this.props.eventsObject.allSubCategories.map((subcategory, index) => {
                        if(subcategory.id === this.props.showSubcategoryId) {
                            this.subcategoryName = subcategory.name;
                            this.subcategoryNameEng = subcategory.nameEng;
                            this.setState({
                                subcategoryName: this.subcategoryName,
                                subcategoryNameEng: this.subcategoryNameEng
                            });
                        }
                    });
                }
                
                this.setState({
                    subcategoryName,
                    subcategoryNameEng
                });

                //const eventName = this.props.showItem;
                this.setState({
                    eventName,
                    eventNameEng,
                    eventNameOrigin: eventName,
                    eventNameEngOrigin: eventNameEng
                });
                const categoryId = this.props.categoryId;
                if (!this.props.eventsObject[this.props.categoryId]) {
                    this.props.startSetSubcategories(categoryId).then((subCategories)=> {
                        if(subCategories.length>1){
                            subCategories.sort((a, b) => {
                                return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                            });
                        }
                        this.setState({
                            subCategories
                        });
                        this.getSubcategorytId(subcategoryName, subCategories);
                        this.props.startSetItems(categoryId).then((items)=> {


                            const itemsCurrent = [];
                            items.map((item, index) => {
                                if (this.state.subcategoryId === '') {
                                    itemsCurrent.push(item);
                                } else if (item.subcategories[subcategoryId] === true) {
                                    itemsCurrent.push(item);
                                }
                            });
                            if (this.state.subcategoryId === '') {
                                itemsCurrent.sort((a, b) => {
                                    return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                                });
                            } else {
                                itemsCurrent.sort((a, b) => {
                                    return a.subcategories[subcategoryId+'order'] > b.subcategories[subcategoryId+'order'] ? 1 : -1;
                                });
                            }

                            this.setState({
                                items,
                                itemsCurrent
                            });
                            this.getEventId(eventName, this.props.items);
                        });
                    });
                } else if (this.props.eventsObject[this.props.categoryId] && !this.props.eventsObject[this.props.categoryId+'items']) {
                    this.props.startSetSubcategories(categoryId).then((subCategories)=> {
                        if(subCategories.length>1){
                            subCategories.sort((a, b) => {
                                return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                            });
                        }
                        this.setState({
                            subCategories
                        });
                        this.getSubcategorytId(subcategoryName, subCategories);
                        this.props.startSetItems(categoryId).then((items)=> {
                            const itemsCurrent = [];
                            items.map((item, index) => {
                                if (this.state.subcategoryId === '') {
                                    itemsCurrent.push(item);
                                } else if (item.subcategories[subcategoryId] === true) {
                                    itemsCurrent.push(item);
                                }
                            });
                            if (this.state.subcategoryId === '') {
                                itemsCurrent.sort((a, b) => {
                                    return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                                });
                            } else {
                                itemsCurrent.sort((a, b) => {
                                    return a.subcategories[subcategoryId+'order'] > b.subcategories[subcategoryId+'order'] ? 1 : -1;
                                });
                            }
                            this.setState({
                                items,
                                itemsCurrent
                            });
                            this.getEventId(eventName, this.props.items);
                        });
                    });
                } else {
                    this.props.startSetSubcategories(categoryId).then((subCategories)=> {
                        if(subCategories.length>1){
                            subCategories.sort((a, b) => {
                                return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                            });
                        }
                        this.setState({
                            subCategories
                        });
                        this.getSubcategorytId(subcategoryName, subCategories);
                        this.props.startSetItems(categoryId).then((items)=> {
                            const itemsCurrent = [];
                            items.map((item, index) => {
                                if (this.state.subcategoryId === '') {
                                    itemsCurrent.push(item);
                                } else if (item.subcategories[subcategoryId] === true) {
                                    itemsCurrent.push(item);
                                }
                            });
                            if (this.state.subcategoryId === '') {
                                itemsCurrent.sort((a, b) => {
                                    return a.categories[categoryId+'order'] > b.categories[categoryId+'order'] ? 1 : -1;
                                });
                            } else {
                                itemsCurrent.sort((a, b) => {
                                    return a.subcategories[subcategoryId+'order'] > b.subcategories[subcategoryId+'order'] ? 1 : -1;
                                });
                            }
                            this.setState({
                                items,
                                itemsCurrent
                            });
                            this.getEventId(eventName, items);
                        });
                    });
                }
            });
        });
    }

    onInfoToggleOpen = (e) => {
        console.log('in toggle');
        const eventId = e.target.dataset.id;
        let showItem = e.target.dataset.title;
        let showItemEng = e.target.dataset.titleeng;
        let showImage = e.target.dataset.image;
        let eventName = e.target.dataset.title;
        let eventNameEng = e.target.dataset.titleeng;
        let eventText = e.target.dataset.text;
        let eventTextEng = e.target.dataset.texteng;
        let showSubcategoryId = e.target.dataset.subcategoryid;
        let showCategoryId = e.target.dataset.categoryid;
        console.log(eventId);
        console.log(showItem);
        console.log(showItemEng);
        console.log(showImage);
        console.log(eventName);
        console.log(eventNameEng);
        console.log(eventText);
        console.log(eventTextEng);
        console.log(showSubcategoryId);
        console.log(showCategoryId);
        if (this.state.showItem !== '') {
            showItem = '';
            showItemEng = '';
        }
        if (this.state.showSubcategoryId !== '') {
            showSubcategoryId = '';
        }
        let showCurrentItems = this.state.itemsCurrent;

        const galleryImages = [showImage];
        this.setState({
            eventId,
            showItemModal: true,
            showItem,
            showItemEng,
            eventName,
            eventNameEng,
            eventText,
            eventTextEng,
            showImage,
            showCategoryId,
            showSubcategoryId,
            showCurrentItems,
            galleryImages
        });
        
        let linkSubcategoryName = this.state.subcategory.name;
        if (linkSubcategoryName === '' || linkSubcategoryName === undefined) {
            linkSubcategoryName = "הכל";
        }
        let linkSubcategoryNameEng = this.state.subcategory.nameEng;
        if (linkSubcategoryNameEng === '' || linkSubcategoryNameEng === undefined) {
            linkSubcategoryNameEng = "All";
        }
        if (this.props.i18n.language === 'he') {
            if (eventName) {
                this.props.history.push(`/${stringReplace(eventName, ' ', '_')}/${stringReplace(linkSubcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(eventName, ' ', '_')}/${stringReplace(linkSubcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                const windowScrollTop = $(window).scrollTop();
                this.setState({
                    windowScrollTop
                });
                this.scrollToItem();
            } else {
                this.props.history.push(`/${stringReplace(linkSubcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(linkSubcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                this.scrollToLastShopY(this.state.windowScrollTop);
                this.setState({
                    windowScrollTop: 0
                });
            }
            this.setLangLink(this.state.category, stringReplace(linkSubcategoryName, ' ', '_'), stringReplace(linkSubcategoryNameEng, ' ', '_'), eventName, eventNameEng);
            
        } else {
            if (eventNameEng) {
                this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(linkSubcategoryNameEng, ' ', '_')}/${stringReplace(eventNameEng, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(linkSubcategoryNameEng, ' ', '_')}/${stringReplace(eventNameEng, ' ', '_')}`);
                const windowScrollTop = $(window).scrollTop();
                this.setState({
                    windowScrollTop
                });
                this.scrollToItem();
            } else {
                this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(linkSubcategoryNameEng, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(linkSubcategoryNameEng, ' ', '_')}`);
                this.scrollToLastShopY(this.state.windowScrollTop);
                this.setState({
                    windowScrollTop: 0
                });
            }
            this.setLangLink(this.state.category, stringReplace(linkSubcategoryName, ' ', '_'), stringReplace(linkSubcategoryNameEng, ' ', '_'), eventName, eventNameEng);
            
        }
        
        
    }

    onInfoToggleClose = (e) => {
        const eventId = e.target.dataset.id;
        let showItem = e.target.dataset.title;
        let showItemEng = e.target.dataset.titleeng;
        let showImage = e.target.dataset.image;
        let eventName = e.target.dataset.title;
        let eventNameEng = e.target.dataset.titleeng;
        let eventText = e.target.dataset.text;
        let eventTextEng = e.target.dataset.texteng;
        let showSubcategoryId = e.target.dataset.subcategoryid;
        let showCategoryId = e.target.dataset.categoryid;
        if (this.state.showItem !== '') {
            showItem = '';
            showItemEng = '';
        }
        if (this.state.showSubcategoryId !== '') {
            showSubcategoryId = '';
        }
        let showCurrentItems = this.state.itemsCurrent;

        const galleryImages = [showImage];
        setTimeout(function() {
            this.setState({
                eventId,
                showItemModal: false,
                showItem,
                showItemEng,
                eventName,
                eventNameEng,
                eventText,
                eventTextEng,
                showImage,
                showCategoryId,
                showSubcategoryId,
                showCurrentItems,
                galleryImages
            });
        }.bind(this), 500);
        let linkSubcategoryName = this.state.subcategory.name;
        if (linkSubcategoryName === '' || linkSubcategoryName === undefined) {
            linkSubcategoryName = "הכל";
        }
        let linkSubcategoryNameEng = this.state.subcategory.nameEng;
        if (linkSubcategoryNameEng === '' || linkSubcategoryNameEng === undefined) {
            linkSubcategoryNameEng = "All";
        }
        if (this.props.i18n.language === 'he') {
            if (eventName) {
                this.props.history.push(`/${stringReplace(eventName, ' ', '_')}/${stringReplace(linkSubcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(eventName, ' ', '_')}/${stringReplace(linkSubcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                const windowScrollTop = $(window).scrollTop();
                this.setState({
                    windowScrollTop
                });
                this.scrollToItem();
            } else {
                this.props.history.push(`/${stringReplace(linkSubcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(linkSubcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
                this.scrollToLastShopY(this.state.windowScrollTop);
                this.setState({
                    windowScrollTop: 0
                });
            }
            this.setLangLink(this.state.category, stringReplace(linkSubcategoryName, ' ', '_'), stringReplace(linkSubcategoryNameEng, ' ', '_'), eventName, eventNameEng);
            
        } else {
            if (eventNameEng) {
                this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(linkSubcategoryNameEng, ' ', '_')}/${stringReplace(eventNameEng, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(linkSubcategoryNameEng, ' ', '_')}/${stringReplace(eventNameEng, ' ', '_')}`);
                const windowScrollTop = $(window).scrollTop();
                this.setState({
                    windowScrollTop
                });
                this.scrollToItem();
            } else {
                this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(linkSubcategoryNameEng, ' ', '_')}`);
                this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(linkSubcategoryNameEng, ' ', '_')}`);
                this.scrollToLastShopY(this.state.windowScrollTop);
                this.setState({
                    windowScrollTop: 0
                });
            }
            this.setLangLink(this.state.category, stringReplace(linkSubcategoryName, ' ', '_'), stringReplace(linkSubcategoryNameEng, ' ', '_'), eventName, eventNameEng);
            
        }
        
        
    }

    gotoNextEvent = (e) => {
        const itemsAll = this.state.itemsCurrent;
        let items = [];
        if (this.props.isAuthenticated === true) {
            items = itemsAll;
        } else {
            itemsAll.map((item) => {
                if (item.visible === true) {
                    items.push(item);
                }
            });
        }
        const lng = items.length;
        const eventName = e.target.dataset.eventname;
        let nextItem = '';
        let nextItemEng = '';
        let eventId = '';
        items.map((item, index) => {
            if (item.name === e.target.dataset.eventname) {
                if (index === Number(lng)-1) {
                    nextItem = items[0].name;
                    nextItemEng = items[0].nameEng;
                    eventId = items[0].id; 
                } else {
                    nextItem = items[Number(index)+1].name;
                    nextItemEng = items[Number(index)+1].nameEng;
                    eventId = items[Number(index)+1].id;
                }
            }
        });
        let subcategoryName = this.state.subcategoryName;
        let subcategoryNameEng = this.state.subcategoryNameEng;
        
        if (subcategoryName === '' || subcategoryName === undefined) {
            subcategoryName = 'הכל';
            subcategoryNameEng = 'All';
        }
        
        if (subcategoryNameEng === '' || subcategoryNameEng === undefined) {
            subcategoryName = 'הכל';
            subcategoryNameEng = 'All';
        }

        if (this.props.i18n.language === 'he') {
            this.props.history.push(`/${stringReplace(nextItem, ' ', '_')}/${stringReplace(subcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
            this.setGoogleAnalytics(`/${stringReplace(nextItem, ' ', '_')}/${stringReplace(subcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
            this.setLangLink(this.state.category, stringReplace(subcategoryName, ' ', '_'), stringReplace(subcategoryNameEng, ' ', '_'), nextItem, nextItemEng);
        } else {
            this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(subcategoryNameEng, ' ', '_')}/${stringReplace(nextItemEng, ' ', '_')}`);
            this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(subcategoryNameEng, ' ', '_')}/${stringReplace(nextItemEng, ' ', '_')}`);
            this.setLangLink(this.state.category, stringReplace(subcategoryName, ' ', '_'), stringReplace(subcategoryNameEng, ' ', '_'), nextItem, nextItemEng);
        }
        
        this.setState({
            eventId
        });
    }
    

    gotoPrevEvent = (e) => {
        const eventName = e.target.dataset.eventname;

        const itemsAll = this.state.itemsCurrent;
        let items = [];
        if (this.props.isAuthenticated === true) {
            items = itemsAll;
        } else {
            itemsAll.map((item) => {
                if (item.visible === true) {
                    items.push(item);
                }
            });
        }

        const lng = items.length;
        let prevItem = '';
        let prevItemEng = '';
        let eventId = '';
        items.map((item, index) => {
            if (item.name === eventName) {
                if (index === 0) {
                    prevItem = items[Number(lng)-1].name;
                    prevItemEng = items[Number(lng)-1].nameEng;
                    eventId = items[Number(lng)-1].id; 
                } else {
                    prevItem = items[Number(index)-1].name;
                    prevItemEng = items[Number(index)-1].nameEng;
                    eventId = items[Number(index)-1].id; 
                }
            }
        });
        let subcategoryName = this.state.subcategoryName;
        let subcategoryNameEng = this.state.subcategoryNameEng;

        if (subcategoryName === '' || subcategoryName === undefined) {
            subcategoryName = 'הכל';
        }
        
        if (subcategoryNameEng === ''|| subcategoryNameEng === undefined) {
            subcategoryNameEng = 'All';
        }

        if (this.props.i18n.language === 'he') {
            this.props.history.push(`/${stringReplace(prevItem, ' ', '_')}/${stringReplace(subcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
            this.setGoogleAnalytics(`/${stringReplace(prevItem, ' ', '_')}/${stringReplace(subcategoryName, ' ', '_')}/${stringReplace(this.state.category.name, ' ', '_')}`);
            this.setLangLink(this.state.category, stringReplace(subcategoryName, ' ', '_'), stringReplace(subcategoryNameEng, ' ', '_'), prevItem, prevItemEng);
        } else {
            this.props.history.push(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(subcategoryNameEng, ' ', '_')}/${stringReplace(prevItemEng, ' ', '_')}`);
            this.setGoogleAnalytics(`/${stringReplace(this.state.category.nameEng, ' ', '_')}/${stringReplace(subcategoryNameEng, ' ', '_')}/${stringReplace(prevItemEng, ' ', '_')}`);
            this.setLangLink(this.state.category, stringReplace(subcategoryName, ' ', '_'), stringReplace(subcategoryNameEng, ' ', '_'), prevItem, prevItemEng);
        }
        
        this.setState({
            eventId
        });
    }

    render() {
        return (
            <div id="shopPage" className="container-fluid">


                <Helmet>
                    <title>{this.state.seo.title}</title>
                </Helmet>

                

                <Modal
                    open={this.state.newSubcategoryNameModalIsOpen}
                    onClose={this.onToggleNewSubcategoryName}
                    center
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal',
                        closeButton: 'custom-close-button'                     
                    }}
                >
                    <h2 className="Heebo-Medium">הוספת תת-קטגוריה חדשה</h2>
                    <h4 className="Heebo-Regular">נא למלא שם לתת-הקטגוריה החדשה</h4>
                    <h4 className="Heebo-Regular">{this.state.newSubCategoryNameModalAlert}</h4>
                    <div dir="rtl">
                        <AutosizeInput
                            className="events__tabs__button"
                            type="text"
                            placeholder="שם תת-הקטגוריה"
                            value={this.state.newSubcategoryName}
                            onChange={this.onNewSubcategoryNameChange}
                        />
                        <Button bsStyle="success" onClick={this.addNewSubcategory}>המשך</Button>
                        <h2 className="Heebo-Medium margin-top">חיבור תת-קטגוריה קיימת</h2>
                        {
                            this.state.allSubCategories ?
                                this.state.allSubCategories.map((subCategory, index) => {
                                    if (!subCategory.categories || subCategory.categories[this.state.category.id] !== true) {
                                        return <button
                                                    key={subCategory.id}
                                                    data-id={subCategory.id}
                                                    data-showstatus={true}
                                                    className="events__tabs__button"
                                                    onClick={this.toggleHookSubcategory}
                                                >
                                                    {subCategory.name}
                                                </button>
                                    }
                                })
                            :
                                null
                        }
                    </div>
                </Modal>


                <Modal
                    open={this.state.newItemNameModalIsOpen}
                    onClose={this.onToggleNewItemName}
                    center
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal',
                        closeButton: 'custom-close-button'                    
                    }}
                >
                    <h2 className="Heebo-Medium">הוספת פריט חדש</h2>
                    <h4 className="Heebo-Regular">נא למלא שם לפריט החדש</h4>
                    <h4 className="Heebo-Regular">{this.state.newItemNameModalAlert}</h4>
                    
                    <div dir="rtl">
                        <AutosizeInput
                            className="events__tabs__button"
                            type="text"
                            placeholder="שם פריט"
                            value={this.state.newItemName}
                            onChange={this.onNewItemNameChange}
                        />
                        <Button bsStyle="success" onClick={this.addNewItem}>המשך</Button>
                        <h2 className="Heebo-Medium margin-top">חיבור פריט קיים</h2>
                        {
                            this.state.allEvents ?
                                this.state.allEvents.map((event, index) => {
                                    if (!event.subcategories || event.subcategories[this.state.subcategoryId] !== true) {
                                        return <button
                                                    key={event.id}
                                                    data-id={event.id}
                                                    data-showstatus={true}
                                                    className="events__tabs__button"
                                                    onClick={this.toggleHookEvent}
                                                >
                                                    {event.name}
                                                </button>
                                    }
                                })
                            :
                                null
                        }
                    </div>
                </Modal>

                <Modal
                    open={this.state.seoModalIsOpen}
                    onClose={this.onToggleSeo}
                    center 
                    dir="rtl"
                >
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
                        <Button bsStyle="success" onClick={this.updateSeo}>עדכון</Button>
                    </div>
                </Modal>

                <Navigation 
                    {...this.props}
                    langLink={this.state.langLink}
                    langLinkEng={this.state.langLinkEng}
                />
                <div className="homepage__structure">
                    <div className="events__left">

                        { 
                            this.props.isAuthenticated === true ? 
                                <div className="about__edit__panel__box">
                                    <div className="about__edit__panel">
                                        <button className="backoffice_button" onClick={this.props.startLogout}>
                                            <img className="backoffice_icon" src="/images/backoffice/exit.svg" alt="יציאה" />
                                        </button>
                                        <button className="backoffice_button" onClick={this.onToggleSeo}>
                                            seo
                                        </button>
                                    </div>
                                </div>
                            :
                                null
                        }


                        <div className="homepage__events-header">
                            <h1 className="homepage__events-header__text Heebo-Medium" dir="rtl">{this.context.t("homepageEventsTitle")}</h1>
                        </div>


                        <EventsHeader
                            categoryOrigin={this.state.categoryOrigin}
                            categoryName={this.state.category.name}
                            categoryNameEng={this.state.category.nameEng}
                            categoryId={this.state.category.id}
                            isAuthenticated={this.props.isAuthenticated}
                            onChange={this.onCategoryNameChange}
                            onUpdateCategory={this.onUpdateCategory}
                            lang={this.props.i18n.language}
                        />
                        <EventsTabs
                            categoryId={this.state.category.id}
                            subcategoryId={this.state.subcategoryId}
                            subCategoriesOrigin={this.state.subCategoriesOrigin}
                            subCategories={this.state.subCategories}
                            isAuthenticated={this.props.isAuthenticated}
                            isEditable={true}
                            setSubcategoryId={this.setSubcategoryId}
                            startAddNewSubcategory={this.startAddNewSubcategory}
                            startEditSubcategory={this.startEditSubcategory}
                            lang={this.props.i18n.language}
                        />


                        { 
                            this.props.isAuthenticated === true ? 

                                <EventsTabsEditor 
                                    subcategories={this.state.subCategories} 
                                    category={this.state.category}
                                    lang={this.props.i18n.language} 
                                    onSubcategoryNameChange={this.onSubcategoryNameChange}
                                    onSubcategoryNameBlur={this.onSubcategoryNameBlur}
                                    onSubcategoryOrderChange={this.onSubcategoryOrderChange}
                                    onSubcategoryOrderKeyPress={this.onSubcategoryOrderKeyPress}
                                    onSubcategoryOrderBlur={this.onSubcategoryOrderBlur}
                                    toggleShowSubcategory={this.toggleShowSubcategory}
                                    toggleHookSubcategory={this.toggleHookSubcategory}
                                    hideSubcategoriesEditPanel={this.state.hideSubcategoriesEditPanel}
                                    updateSubcategories={this.updateSubcategories}
                                />

                            :
                                null
                        }
                        <EventsText 
                            subCategories={this.state.subCategories}
                            categoryTextOrigin={this.state.subcategoryId === '' ? this.state.categoryOrigin.text : this.state.subcategory.text}
                            showLinesOrigin={this.state.subcategoryId === '' ? this.state.categoryOrigin.showLines : this.state.subcategory.showLines}
                            categoryText={this.state.subcategoryId === '' ? this.state.category.text : this.state.subcategory.text}
                            categoryTextEng={this.state.subcategoryId === '' ? this.state.category.textEng : this.state.subcategory.textEng}
                            showLines={this.state.subcategoryId === '' ? this.state.category.showLines : this.state.subcategory.showLines}
                            categoryId={this.state.category.id}
                            isAuthenticated={this.props.isAuthenticated}
                            onChange={this.onCategoryTextChange}
                            onCategoryShowLinesChange={this.onCategoryShowLinesChange}
                            lang={this.props.i18n.language}
                        />
                        
                        <EventsEvents 
                            categoryName={this.state.category.name}
                            categoryText={this.state.category.text}
                            categoryNameEng={this.state.category.nameEng}
                            categoryTextEng={this.state.category.textEng}
                            categoryId={this.state.category.id}
                            subcategoryName={this.state.subcategoryName}
                            subcategoryNameEng={this.state.subcategoryNameEng}
                            subcategoryId={this.state.subcategoryId}
                            isAuthenticated={this.props.isAuthenticated}
                            itemsOrigin={this.state.itemsOrigin}
                            items={this.state.items}
                            itemsCurrentOrigin={this.state.itemsCurrentOrigin}
                            itemsCurrent={this.state.itemsCurrent}
                            itemsCurrentCheck={this.state.itemsCurrentCheck}
                            startAddNewItem={this.startAddNewItem}
                            ratioGreenArrow={this.state.ratioGreenArrow}
                            setIconRatioOn={this.setIconRatioOn}
                            setIconRatioOut={this.setIconRatioOut}
                            onRollOver={this.onEventRollOver}
                            uploadWidget={this.uploadWidget}
                            oneLine={false}
                            onItemOrderChange={this.onItemOrderChange}
                            onItemOrderKeyPress={this.onItemOrderKeyPress}
                            onItemOrderBlur={this.onItemOrderBlur}
                            toggleShowItem={this.toggleShowItem}
                            toggleHookEvent={this.toggleHookEvent}
                            updateItems={this.updateItems}
                            onInfoToggleOpen={this.onInfoToggleOpen}
                            lang={this.props.i18n.language}
                            backofficeSaveButtonClassName={this.state.backofficeSaveButtonClassName}
                        />
                    </div>
                </div>

                <div id="itemPage" />

                <div hidden={this.state.showItemModal === false} className="event__container">
                    <EventHeader
                        history={this.props.history}
                        eventName={this.state.eventName}
                        eventNameEng={this.state.eventNameEng}
                        eventText={this.state.eventText}
                        eventTextEng={this.state.eventTextEng}
                        eventImage={this.state.galleryImages[0]}
                        showLines={this.state.eventShowLines}
                        eventNameOrigin={this.state.eventNameOrigin}
                        eventTextOrigin={this.state.eventTextOrigin}
                        showLinesOrigin={this.state.eventShowLinesOrigin}
                        isAuthenticated={this.props.isAuthenticated}
                        onEventNameChange={this.onEventNameChange}
                        onEventTextChange={this.onEventTextChange}
                        onEventShowLinesChange={this.onEventShowLinesChange}
                        onUpdateEvent={this.onUpdateEvent}
                        currentURL={this.state.currentURL}
                        navtoCategoryPage={this.navtoCategoryPage}
                        gotoNextEvent={this.gotoNextEvent}
                        gotoPrevEvent={this.gotoPrevEvent}
                        currentItems={this.state.itemsCurrent}
                        closeEventModal={this.onInfoToggleClose}
                    />
                </div>
                
                <div hidden={this.state.pageupImageClassName === 'pageup__image'} className="pageup__image__fake desktop"> </div>
                <PageUpStrip
                    pageupImageClassName={this.state.pageupImageClassName}
                />
                <div id='fake_pageupstrip'> </div>

                <ContactStrip lang={this.props.i18n.language} />
                <Footer lang={this.props.i18n.language} />
            </div>
        );
    }
} 

EventsPage.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    eventsObject: state.eventspage,
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startAddCategory: (category) => dispatch(startAddCategory(category)),
    startSetSubcategories: (categoryId) => dispatch(startSetSubcategories(categoryId)),
    startAddSubcategory: (subcategory, order) => dispatch(startAddSubcategory(subcategory, order)),
    startSetItems: (categoryId) => dispatch(startSetItems(categoryId)),
    startAddItem: (item, categoryId, catOrder, subcategoryId, order) => dispatch(startAddItem(item, categoryId, catOrder, subcategoryId, order)),
    startUpdateEventImage: (eventId, image) => dispatch(startUpdateEventImage(eventId, image)),
    setCategoryId: (categoryId) => dispatch(setCategoryId(categoryId)),
    setSubcategoryId: (subcategoryId) => dispatch(setSubcategoryId(subcategoryId)),
    startEditCategory: (category) => dispatch(startEditCategory(category)),
    startEditSubCategories: (fbSubCategories, subcategories, categoryId) => dispatch(startEditSubCategories(fbSubCategories, subcategories, categoryId)),
    startHookSubcategory: (fbSubcategoriesToUpdate, fbEventsToUpdate) => dispatch(startHookSubcategory(fbSubcategoriesToUpdate, fbEventsToUpdate)),
    startHookEvent: (fbEventsToUpdate) => dispatch(startHookEvent(fbEventsToUpdate)),
    startToggleShowSubcategory: (categoryId, subcategoryId, visible) => dispatch(startToggleShowSubcategory(categoryId, subcategoryId, visible)),
    startToggleShowEvent: (categoryId, subcategoryId, eventId, visible) => dispatch(startToggleShowEvent(categoryId, subcategoryId, eventId, visible)),
    startEditEvents: (fbItems, items, categoryId, subcategoryId) => dispatch(startEditEvents(fbItems, items, categoryId, subcategoryId)),
    startEditEvent: (event, categoryId, subcategoryId) => dispatch(startEditEvent(event, categoryId, subcategoryId)),
    startSetImages: (eventId, categoryId, itemLocation) => dispatch(startSetImages(eventId, categoryId, itemLocation)),
    startSetAllSubcategories: () => dispatch(startSetAllSubcategories()),
    startSetAllEvents: () => dispatch(startSetAllEvents()),
    startEditSeo: (seo, categoryId, subcategoryId) => dispatch(startEditSeo(seo, categoryId, subcategoryId)),
    startEditSubSeo: (seo, categoryId, subcategoryId) => dispatch(startEditSubSeo(seo, categoryId, subcategoryId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(EventsPage));
