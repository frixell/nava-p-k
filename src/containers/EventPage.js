import React from 'react';
import {Helmet} from 'react-helmet';
import AutosizeInput from 'react-input-autosize';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Modal from 'react-responsive-modal';
import ContactStrip from '../components/contactpage/ContactStrip';
import CustomersStrip from '../components/common/CustomersStrip';
import Footer from '../components/common/Footer';
import EventsHeader from '../components/eventspage/EventsHeader';
import EventHeader from '../components/eventpage/EventHeader';
import EventImages from '../components/eventpage/EventImages';
import EventShareStrip from '../components/eventpage/EventShareStrip';
import EventsTabs from '../components/eventspage/EventsTabs';
import EventsText from '../components/eventspage/EventsText';
import EventsEvents from '../components/eventspage/EventsEvents';
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
    startAddImage,
    startSetImages,
    setSubcategoryId,
    startEditEvent,
    startEditImages,
    startDeleteImage,
    startEditEventSeo,
    startSetAllSubcategories,
    startSetAllEvents
} from '../actions/eventspage';
import $ from 'jquery';
import UncontrolledCarousel from '../components/UncontrolledCarouselSlide';
import { iconRatioOn } from '../reusableFunctions/iconRatioOn';
import { iconRatioOut } from '../reusableFunctions/iconRatioOut';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import isEqual from 'lodash.isequal';
import { stringReplace } from '../reusableFunctions/stringReplace';


class EventPage extends React.Component {
    constructor(props) {
        super(props);
        this.animating = false;
        this.state = {
            ratio: 1,
            ratioFacebook: 1,
            ratioInstagram: 1,
            ratioMail: 1,
            ratioPhone: 1,
            ratioGreenArrow: 1,
            categoryId: '',
            subCategories: [],
            items: [],
            currentItems: [],
            stripItems: [],
            eventName: '',
            eventText: '',
            eventShowLines: 1,
            eventNameOrigin: '',
            eventTextOrigin: '',
            eventShowLinesOrigin: 1,
            eventId: '',
            itemLocation: 0,
            slideGalleryModalIsOpen: false,
            itemNameModalAlert: '',
            itemNameModalIsOpen: false,
            subcategoryId: '',
            subcategoryName: '',
            imagesOrigin: [],
            images: [],
            galleryImages: [],
            slideGalleryImages: [],
            currentImage: '',
            nextImage: '',
            prevImage: '',
            nextItem: '',
            prevItem: '',
            crouselControlsRight: {marginLeft: '0px'},
            pageupImageClassName: 'pageup__image__absolute',
            seoEventModalIsOpen: false,
            seo: {
                title: '',
                description: '',
                keyWords: '',
            },
            currentURL: '',
            windowWidth: 0
        }
    }

    setIconRatioOn = (e) => {
        this.setState(iconRatioOn(e));
    }

    setIconRatioOut = (e) => {
        this.setState(iconRatioOut(e));
    }

    getSubcategorytId = (subcategoryName, subcategories) => {
        let subcategoryId = '';
        let subcategoryText = '';
        let subcategoryShowLines = 1;
        let seo = {};
        subcategories.map((subcategory) => {
            if (subcategoryName === subcategory.name) {
                subcategoryId = subcategory.id;
                subcategoryText = subcategory.text;
                subcategoryShowLines = subcategory.showLines;
                if (!subcategory.seo) {
                    subcategory.seo = {
                        title: '',
                        description: '',
                        keyWords: ''
                    }
                }
                // this.setState({
                //     seo: subcategory.seo
                // });
            }
        });
        this.setState({
            subcategoryId
        });
    }

    getEventId = (eventName) => {
        let eventId = '';
        let eventText = '';
        let eventShowLines = 1;
        let seo = {};
        const items = this.props.showCurrentItems;
        items.map((item) => {
            if (eventName === item.name) {
                eventId = item.id;
                eventText = item.text;
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
        //console.log(this.state.subcategoryId);
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
            eventText,
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
            
        console.log(this.props.showImage);
            if (windowWidth !== 0) {
                if (windowWidth > 767) {
                    console.log(windowWidth);
                    const galleryImages = [this.props.showImage.replace('image/upload', 'image/upload/t_shopBig')];
                } else {
                    console.log(windowWidth);
                    const galleryImages = [this.props.showImage.replace('image/upload', 'image/upload/t_shopSmall')];
                }
            }
            
            this.setState({
                imagesOrigin: JSON.parse(JSON.stringify(images)),
                images,
                galleryImages,
                //slideGalleryImages
            });
         });
        
        
    }

    handleScroll = () => {
        this.setState(handlePageScroll(this.state.pageupImageClassName));
    }

    setData = () => {
        console.log(this.props.showSubcategoryId);
        let subcategoryId = '';
        if (this.props.eventsObject.subcategoryId) {
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
                const subcategoryName = 'הכל';
                if (this.props.eventsObject.subcategoryId === undefined || this.props.eventsObject.subcategoryId === '') {
                    this.setState({
                        subcategoryName: 'הכל'
                    });
                } else {
                    this.props.eventsObject.allSubCategories.map((subcategory, index) => {
                        if(subcategory.id === this.props.showSubcategoryId) {
                            this.subcategoryName = subcategory.name;
                            this.setState({
                                subcategoryName
                            });
                        }
                    });
                }
                

                
                this.setState({
                    subcategoryName
                });

                //console.log(subcategoryName);
                

                //const eventName = stringReplace(this.props.match.params.event, '_', ' ');
                const eventName = this.props.showItem;
                console.log(eventName);
                this.setState({
                    eventName,
                    eventNameOrigin: eventName
                });
                const categoryId = this.props.categoryId;
                if (!this.props.eventsObject[this.props.categoryId]) {
                    console.log('1');
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
                            this.setState({
                                items
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
                            this.setState({
                                items
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
                            this.setState({
                                items
                            });
                            this.getEventId(eventName, this.props.items);
                        });
                    });
                }
            });
        });
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
        if (typeof(window) !== "undefined") {
            window.addEventListener('scroll', this.handleScroll);
        }
        this.setData();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props !== prevProps) {
            this.setData();
        }
    }


    componentWillUnmount = () => {
        if (typeof(window) !== "undefined") {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }


    uploadWidget = (e) => {
        const { dataset } = e.target;
        const { id } = dataset;
        const eventId = this.state.eventId;
        var myUploadWidget;
        myUploadWidget = cloudinary.openUploadWidget({ 
            cloud_name: 'mik-clothing', 
            upload_preset: 'defaultUploadPreset',
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
                    const categoryId = this.props.categoryId;
                    const order = Number(this.state.images.length)+1;
                    const image = {
                        publicId: result.info.public_id,
                        imageUrl: result.info.secure_url,
                        imageWidth: result.info.width,
                        imageHeight: result.info.height,
                        altText: '',
                        events: {
                            [id]: true,
                            [id+'order']: order
                        }
                    };
                        
                    this.props.startAddImage(image, categoryId, order).then((images)=> {
                        images.sort((a, b) => {
                            return a.eventsIds[id+'order'] > b.eventsIds[id+'order'] ? 1 : -1;
                        });
                        const galleryImages = [];
                        images.map((image) => {
                            return galleryImages.push({
                                publicId: image.public_id,
                                image: image,
                                id: image.id,
                                order: image.eventsIds[id+'order'],
                                src: image.imageUrl,
                                alt: image.imageText,
                                width: image.imageWidth,
                                height: image.imageHeight
                            });
                        });
                        const slideGalleryImages = [];
                        images.map((image) => {
                            let imageWidth = image.imageWidth;
                            let imageHeight = image.imageHeight;
                            const ratio = 600/imageHeight;
                            imageWidth = ratio*imageWidth;
                            imageHeight = ratio*imageHeight;
                            return slideGalleryImages.push({
                                publicId: image.public_id,
                                image: image,
                                id: image.id,
                                order: image.eventsIds[eventId+'order'],
                                src: image.imageUrl,
                                altText: image.imageText,
                                width: imageWidth,
                                height: imageHeight,
                                caption: '',
                                header: ''
                            });
                        });
                        this.setState({
                            imagesOrigin: JSON.parse(JSON.stringify(images)),
                            images,
                            galleryImages,
                            slideGalleryImages
                        });
                    });
                    myUploadWidget.close();
                }
            }
        );
        myUploadWidget.open();
    }

    setSubcategoryId = (e) => {
        //console.log(this.state.items);
        //console.log(this.state.currentItems);
        const subcategoryId = e.target.dataset.id;
        const subcategoryName = e.target.dataset.name;
        this.setState({
            subcategoryId
        });
        this.props.setSubcategoryId(subcategoryId);
        this.navtoCategoryPage(subcategoryName);
    }

    navtoCategoryPage = (subcategoryName) => {
        if (subcategoryName !== '' && subcategoryName !== undefined) {
            this.props.history.push(`/${stringReplace(subcategoryName, ' ', '_')}/${stringReplace(this.props.categoryName, ' ', '_')}`);
        } else {
            this.props.history.push(`/${stringReplace(this.props.categoryName, ' ', '_')}`);
        }
        
    }

    gotoNextEvent = () => {
        console.log('gotoNextEvent evebtpage');
        //this.props.history.push(`/${this.state.nextItem}/${stringReplace(this.state.subcategoryName, ' ', '_')}/${stringReplace(this.props.categoryName, ' ', '_')}`);
    }
    
    gotoPrevEvent = () => {
        console.log('gotoPrevEvent evebtpage');
        //this.props.history.push(`/${this.state.prevItem}/${stringReplace(this.state.subcategoryName, ' ', '_')}/${stringReplace(this.props.categoryName, ' ', '_')}`);
    }

    // update database . ---   event data ( name, text, showlines - number of lines to show on load)

    onUpdateEvent = () => {
        let nameFlag = false;
        this.props.eventsObject.allEvents.map((event, index) => {
            if(event.name === this.state.eventName && this.state.eventName !== this.state.eventNameOrigin) {
                nameFlag = true;
            }
        })

        if(nameFlag === true) {
            this.setState({
                itemNameModalAlert: 'שם אירוע קיים במערכת',
                itemNameModalIsOpen: true
            });
        } else if (this.state.eventName === '') {
            this.setState({
                itemNameModalAlert: 'שם אירוע חייב לכלול אות אחת לפחות',
                itemNameModalIsOpen: true
            });
        } else {
            const eventName = JSON.parse(JSON.stringify(this.state.eventName));
            const eventText = JSON.parse(JSON.stringify(this.state.eventText));
            const eventShowLines = JSON.parse(JSON.stringify(this.state.eventShowLines));
            const eventId = JSON.parse(JSON.stringify(this.state.eventId));
            this.props.startEditEvent(eventName, eventText, eventShowLines, eventId).then(() => {
                let gotoNewLocation = false;
                if(eventName !== this.state.eventNameOrigin) {
                    gotoNewLocation = true;
                }
                this.setState(() => ({
                    eventName,
                    eventText,
                    eventShowLines,
                    eventNameOrigin: eventName,
                    eventTextOrigin: eventText,
                    eventShowLinesOrigin: eventShowLines
                }));
                if (typeof(window) !== "undefined") {
                    window.removeEventListener("beforeunload", this.unloadFunc);
                }
                if(gotoNewLocation === true) {
                    
                    this.props.history.push(`/${stringReplace(eventName, ' ', '_')}/${stringReplace(this.state.subcategoryName, ' ', '_')}/${stringReplace(this.props.categoryName, ' ', '_')}`);
                    this.setData();
                }
            });
        }
    }

    unloadFunc = (e) => {
        var confirmationMessage = "o/";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }

    onEventNameChange = (e) => {
        const eventName = e.target.value;
        this.setState({
            eventName
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.eventNameOrigin, eventName) && isEqual(this.state.eventTextOrigin, this.state.eventText) && isEqual(this.state.eventShowLinesOrigin, this.state.eventShowLines)){ 
                window.removeEventListener("beforeunload", this.unloadFunc);
            } else {
                window.addEventListener("beforeunload", this.unloadFunc);
            }
        }
    }

    onEventTextChange = (e) => {
        const eventText = e.target.value;
        this.setState({
            eventText
        });
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

    onImageOrderBlur = (e) => {
        const images = [];
        const galleryImages = this.state.galleryImages;
        const eventId = this.state.eventId;
        const imageId = e.target.dataset.id;
        const index = e.target.dataset.index;
        const order = e.target.dataset.order;

        let newOrder = e.target.value;
        if (newOrder > galleryImages.length) {
            newOrder = galleryImages.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        const id = e.target.dataset.id;

        if ( Number(newOrder) > Number(oldOrder) ) {
            for (let i = 0; i < galleryImages.length; i++) {
                if (id !== galleryImages[i].id) {
                    if (galleryImages[i].order <= newOrder && galleryImages[i].order > oldOrder) {
                        galleryImages[i].order = galleryImages[i].order-1;
                    }
                }
            }
        } else if ( Number(newOrder) < Number(oldOrder) ) {
            for (let i = 0; i < galleryImages.length; i++) {
                
                if (id !== galleryImages[i].id) {
                    if (galleryImages[i].order < oldOrder && galleryImages[i].order >= newOrder) {
                        galleryImages[i].order = Number(galleryImages[i].order)+1;
                    }
                }
            }
        }


        galleryImages.sort((a, b) => {
            return a.order > b.order ? 1 : -1;
        });

        galleryImages.map((image, index) => {
            image.image.eventsIds[eventId+'order'] = Number(index)+1;
            images.push(image.image);
        });

        this.setState({
            images,
            galleryImages
        });
    }

    onImageOrderChange = (e) => {
        const galleryImages = this.state.galleryImages;
        const eventId = this.state.eventId;
        const imageId = e.target.dataset.id;
        const index = e.target.dataset.index;
        const order = e.target.dataset.order;
        
        let newOrder = e.target.value;
        if (newOrder > galleryImages.length) {
            newOrder = galleryImages.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
       
        galleryImages[index].order = Number(newOrder);
        
        this.setState({
            galleryImages
        });
    }

    onImageOrderKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onImageOrderBlur(e);
        }
    }

    updateImages = () => {
        const categoryId = this.props.categoryId;
        const eventId = this.state.eventId;
        const galleryImages = this.state.galleryImages;
        const images = this.state.images;
        
        const fbImages = {};
        images.map((image, index) => {
            fbImages[image.id] = image;
        })
        this.props.startEditImages( fbImages, images, eventId, categoryId );
    }


    onDeleteImage = (e) => {
        const id = e.target.dataset.id;
        const order = e.target.dataset.order;
        const publicid = e.target.dataset.publicid;
        const categoryId = this.props.categoryId;
        const eventId = this.state.eventId;
        const galleryImages = [];
        const galleryImagesOld = this.state.galleryImages;
        const images = [];

        for (let i = 0; i < galleryImagesOld.length; i++) {
            if (id !== galleryImagesOld[i].id) {
                if (galleryImagesOld[i].order > order) {
                    galleryImagesOld[i].order = galleryImagesOld[i].order-1;
                }
                galleryImages.push(galleryImagesOld[i]);
            }
        }

        galleryImages.map((image, index) => {
            image.image.eventsIds[eventId+'order'] = Number(index)+1;
            images.push(image.image);
        });

        const fbImages = {};
        images.map((image, index) => {
            fbImages[image.id] = image;
        })
        fbImages[id] = null;

        this.props.startDeleteImage( fbImages, images, eventId, categoryId, publicid );

        const slideGalleryImages = [];
        images.map((image) => {
            let imageWidth = image.imageWidth;
            let imageHeight = image.imageHeight;
            let ratioWidth = 1;
            let ratioHeight = 1;
            
            if (imageHeight < 800 && imageWidth < 1000) {
                ratioHeight = 800/imageHeight;
                ratioWidth = 1000/imageWidth;
                if (ratioHeight > ratioWidth) {
                    imageHeight = ratioHeight*imageHeight;
                    imageWidth = ratioHeight*imageWidth;
                } else {
                    imageHeight = ratioWidth*imageHeight;
                    imageWidth = ratioWidth*imageWidth;
                }
            }

            return slideGalleryImages.push({
                publicId: image.public_id,
                image: image,
                id: image.id,
                order: image.eventsIds[eventId+'order'],
                src: image.imageUrl,
                altText: image.imageText,
                width: imageWidth,
                height: imageHeight,
                caption: '',
                header: ''
            });
        });
        this.setState({
            imagesOrigin: JSON.parse(JSON.stringify(images)),
            images,
            galleryImages,
            slideGalleryImages
        });
    }



    onOpenSlideGallery = (e) => {
        const currentImage = e.target.dataset.order-1;
        this.onToggleSlideGallery(e, currentImage);
    }


    onToggleSlideGallery = (e, currentImage = this.state.currentImage) => {
        const crouselControlsWidth = 140;
        const width = this.state.slideGalleryImages[currentImage].width/2-crouselControlsWidth/2-23;
        const crouselControlsRight = {marginLeft: `${width}px`, opacity: 1};
        this.setState({
            crouselControlsRight,
            currentImage,
            slideGalleryModalIsOpen: !this.state.slideGalleryModalIsOpen
        });
    }

    onCurrentImageChange = (currentImage) => {
        this.setState({
            currentImage
        });
    }

    onNext = () => {
        if (this.animating) return;
        const nextIndex = this.state.currentImage === this.state.slideGalleryImages.length - 1 ? 0 : this.state.currentImage + 1;
        const crouselControlsWidth = $('#crouselControlsRight').width();
        const width = this.state.slideGalleryImages[nextIndex].width/2-crouselControlsWidth/2-23;
        const crouselControlsRight = {marginLeft: `${width}px`, opacity: 1};
        this.setState({
            crouselControlsRight
        });
        if (this.onCurrentImageChange) {
        this.onCurrentImageChange(nextIndex);
        }
    }

    previous = () => {
        if (this.animating) return;
        const nextIndex = this.state.currentImage === 0 ? this.state.slideGalleryImages.length - 1 : this.state.currentImage - 1;
        const crouselControlsWidth = $('#crouselControlsRight').width();
        const width = this.state.slideGalleryImages[nextIndex].width/2-crouselControlsWidth/2-23;
        const crouselControlsRight = {marginLeft: `${width}px`, opacity: 1};
        this.setState({
            crouselControlsRight
        });
        this.onCurrentImageChange(nextIndex);
    }

    onExiting = () => {
        this.animating = true;
    }

    onExited = () => {
        const crouselControlsWidth = $('#crouselControlsRight').width();
        const width = this.state.slideGalleryImages[this.state.currentImage].width/2-crouselControlsWidth/2-23;
        const crouselControlsRight = {marginLeft: `${width}px`, opacity: 1};
        this.setState({
            crouselControlsRight
        });
        this.animating = false;
    }

    onToggleEventSeo = () => {
        this.setState({
            seoEventModalIsOpen: !this.state.seoEventModalIsOpen
        });
    }

    onToggleItemNameModal = () => {
        this.setState({
            itemNameModalIsOpen: !this.state.itemNameModalIsOpen
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

    updateEventSeo = () => {
        const seo = this.state.seo;
        const categoryId = this.props.categoryId;
        const eventId = this.state.eventId;
        //const link = this.props.location.pathname;
        const link = 'events/' + this.props.match.params.event
        this.props.startEditEventSeo(seo, categoryId, eventId, link);
        this.onToggleEventSeo();
    }

    render() {
        return (
            <div className="container-fluid">


                <Helmet>
                    <title>{`mik ein hod - ${this.props.categoryName} - ${this.state.subcategoryName} - ${this.state.eventName} - ${this.state.seo.title}`}</title>
                </Helmet>

                <Modal open={this.state.seoEventModalIsOpen} onClose={this.onToggleEventSeo} center dir="rtl">
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
                        <Button bsStyle="success" onClick={this.updateEventSeo}>עדכון</Button>
                    </div>
                </Modal>

                <Modal open={this.state.itemNameModalIsOpen} onClose={this.onToggleItemNameModal} center dir="rtl">
                    <div className="backoffice__seo__modal">
                        <h4 className="Heebo-Regular">{this.state.itemNameModalAlert}</h4>
                        <Button bsStyle="success" onClick={this.onToggleItemNameModal}>הבנתי</Button>
                    </div>
                </Modal>

                <ModalRB show={this.state.slideGalleryModalIsOpen} onHide={this.onToggleSlideGallery} dir="rtl">
                    
                    <ModalRB.Body bsClass="modalBody carousel__fade">
                        <div id="crouselControlsRight" className="events__event__carousel__controls">
                            <div className="events__eventshare__button__box">
                                <button 
                                    type='button'
                                    className="events__event__carousel__button"
                                    data-name="greenArrow"
                                    onMouseEnter={this.setIconRatioOn}
                                    onMouseLeave={this.setIconRatioOut}
                                    onClick={this.onToggleSlideGallery}
                                >
                                    <img className="events__event__carousel__button__image__x" src="/images/eventspage/carousel-x.svg" alt="יציאה" />
                                </button> 
                            </div>
                            
                            <div hidden={this.state.slideGalleryImages.length<2} className="events__eventshare__button__box">
                                <button 
                                    type='button'
                                    className="events__event__carousel__button"
                                    data-name="greenArrow"
                                    onMouseEnter={this.setIconRatioOn}
                                    onMouseLeave={this.setIconRatioOut}
                                    onClick={this.previous}
                                >
                                    <img className="events__event__carousel__button__image" src="/images/eventspage/carousel-arrow-right.svg" alt="הקודם" />
                                </button> 
                            </div>

                            <div hidden={this.state.slideGalleryImages.length<2} className="events__eventshare__button__box">
                                <button 
                                    type='button'
                                    className="events__event__carousel__button"
                                    data-name="greenArrow"
                                    onMouseEnter={this.setIconRatioOn}
                                    onMouseLeave={this.setIconRatioOut}
                                    onClick={this.onNext}
                                >
                                    <img className="events__event__carousel__button__image" src="/images/eventspage/carousel-arrow-left.svg" alt="הבא" />
                                    
                                </button> 
                            </div>

                            <div hidden={this.state.slideGalleryImages.length>1} className="events__eventshare__button__box">
                                <div 
                                    className="events__event__carousel__button"
                                >
                                    <img className="events__event__carousel__button__image events__event__carousel__button__image__fake" src="/images/eventspage/carousel-arrow-right.svg" alt="הקודם" />
                                </div> 
                            </div>

                            <div hidden={this.state.slideGalleryImages.length>1} className="events__eventshare__button__box">
                                <div 
                                    className="events__event__carousel__button"
                                >
                                    <img className="events__event__carousel__button__image events__event__carousel__button__image__fake" src="/images/eventspage/carousel-arrow-left.svg" alt="הבא" />
                                    
                                </div> 
                            </div>




                        </div>
                        <UncontrolledCarousel
                            slide={false}
                            activeIndex={Number(this.state.currentImage)}
                            pause="hover"
                            controls={true}
                            keyboard={false}
                            ride='carousel'
                            interval='150000000'
                            items={this.state.slideGalleryImages}
                            onCurrentImageChange={this.onCurrentImageChange}
                            onExiting={this.onExiting}
                            onExited={this.onExited}
                        />
                    </ModalRB.Body>
                    
                </ModalRB>


                

                
                

                    <div className="event__left">
                        
                        { 
                            this.props.isAuthenticated === true ? 
                                <div className="about__edit__panel__box">
                                    <div className="about__edit__panel">
                                        <button className="backoffice_button" onClick={this.props.startLogout}>
                                            <img className="backoffice_icon" src="/images/backoffice/exit.svg" alt="יציאה" />
                                        </button>
                                        <button className="backoffice_button" onClick={this.onToggleEventSeo}>
                                            seo
                                        </button>
                                    </div>
                                </div>
                            :
                                null
                        }

                        <EventHeader
                            eventName={this.state.eventName}
                            eventText={this.state.eventText}
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
                            currentItems={this.state.currentItems}
                        />
                        <div className="events__eventshare__share mobile">
                            <p className="events__eventshare__text Heebo-Regular" dir="rtl">אני חייב לשתף את זה!</p>
                            <div className="events__eventshare__phone__mobile" />
                            <div className="events__eventshare__mail__mobile" />
                            <div className="events__eventshare__facebook__mobile" />
                        </div>
                        
                    </div>
                    
                
                
            </div>
        );
    }
} 

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    eventsObject: state.eventspage
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startAddCategory: (category) => dispatch(startAddCategory(category)),
    startAddSubcategory: (subcategory) => dispatch(startAddSubcategory(subcategory)),
    startSetSubcategories: (categoryId) => dispatch(startSetSubcategories(categoryId)),
    startAddItem: (item) => dispatch(startAddItem(item)),
    startSetItems: (categoryId) => dispatch(startSetItems(categoryId)),
    startUpdateEventImage: (id, image) => dispatch(startUpdateEventImage(id, image)),
    startAddImage: (image, categoryId, order) => dispatch(startAddImage(image, categoryId, order)),
    startSetImages: (eventId, categoryId, itemLocation) => dispatch(startSetImages(eventId, categoryId, itemLocation)),
    setSubcategoryId: (id) => dispatch(setSubcategoryId(id)),
    startEditEvent: (eventName, eventText, eventShowLines, eventId) => dispatch(startEditEvent(eventName, eventText, eventShowLines, eventId)),
    startEditImages: (fbImages, images, eventId, categoryId) => dispatch(startEditImages(fbImages, images, eventId, categoryId)),
    startDeleteImage: (fbImages, images, eventId, categoryId, publicid) => dispatch(startDeleteImage(fbImages, images, eventId, categoryId, publicid)),
    startSetAllSubcategories: () => dispatch(startSetAllSubcategories()),
    startSetAllEvents: () => dispatch(startSetAllEvents()),
    startEditEventSeo: (seo, categoryId, eventId, link) => dispatch(startEditEventSeo(seo, categoryId, eventId, link))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EventPage));









//this.state.category.showLines



//activeIndex={Number(this.state.currentImage)}