import React from 'react';
import { Prompt } from "react-router-dom";
import {Helmet} from 'react-helmet';
//import { Button, Modal as ModalRB } from "react-bootstrap";
import Button from 'react-bootstrap/lib/Button';
import ModalRB from 'react-bootstrap/lib/Modal';
import Modal from 'react-responsive-modal';
import WorkshopTopStrip from '../components/workshoppage/WorkshopTopStrip';
import WorkshopContentStrip from '../components/workshoppage/WorkshopContentStrip';
import ContactStrip from '../components/contactpage/ContactStrip';
//import CustomersStrip from '../components/common/CustomersStrip';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import PageUpStrip from '../components/common/PageUpStrip';
import SocialMedia from '../components/common/SocialMedia';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { startSetWorkshopPage, startEditWorkshopPage, startEditWorkshopPageSeo, startAddWorkshopImage, startDeleteWorkshopImage } from '../actions/workshoppage';
import { iconRatioOn } from '../reusableFunctions/iconRatioOn';
import { iconRatioOut } from '../reusableFunctions/iconRatioOut';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import TileGallery from '../components/common/TileGallery';
import UncontrolledCarousel from '../components/UncontrolledCarouselSlide';
import isEqual from 'lodash.isequal';
import { setLanguage } from "redux-i18n";

import ReactGA from 'react-ga';

function initializeReactGA(url) {
    ReactGA.initialize('UA-128960221-1');
    ReactGA.pageview(url);
}
//initializeReactGA();


class WorkshopPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workshoppageOrigin: [],
            workshoppage: [],
            ratio: 1,
            ratioFacebook: 1,
            ratioInstagram: 1,
            ratioMail: 1,
            ratioPhone: 1,
            ratioGreenArrow: 1,
            pageupImageClassName: 'pageup__image__absolute',
            slideGalleryModalIsOpen: false,
            seoWorkshoppageModalIsOpen: false,
            seo: {
                title: '',
                description: '',
                keyWords: '',
            },
            images: [],
            galleryImages: [],
            slideGalleryImages: [],
            langLink: '/סדנאות',
            langLinkEng: '/workshops'
        }
    }



    setData = (e) => {
		const { value, dataset } = e.target;
		const { index, field, action } = dataset;
		const workshoppage = JSON.parse(JSON.stringify(this.state.workshoppage));

        switch (action) {
			case "setString":
                workshoppage[index][field] = value;
                break;
            case "setNumber":
                workshoppage[index][field] = value;
                break;
			default:
				break;
        };
        this.setState({
            workshoppage: workshoppage
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.workshoppageOrigin, workshoppage)){ 
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

    onUpdateWorkshopPage = () => {
        const workshoppage = JSON.parse(JSON.stringify(this.state.workshoppage));
        const fbWorkshoppage = JSON.parse(JSON.stringify(this.state.workshoppage));
        // workshoppage.map((item, index) => {
        //     if(item.index) {
        //         fbWorkshoppage[item.index] = item;
        //     } else {
        //         fbWorkshoppage.workshopimages = item;
        //     }
        // });
        this.props.startEditWorkshopPage(fbWorkshoppage, workshoppage);
        this.setState(() => ({ workshoppageOrigin: workshoppage }));
        if (typeof(window) !== "undefined") {
            window.removeEventListener("beforeunload", this.unloadFunc);
        }
    }



    handleScroll = () => {
        this.setState(handlePageScroll(this.state.pageupImageClassName));
    }

    setUrlLang = () => {
        if (this.props.urlLang !== undefined && this.props.lang !== this.props.urlLang) {
            this.props.setLanguage(this.props.urlLang);
        }
    }

    setGoogleAnalytics = () => {
        initializeReactGA(`/${this.props.location.pathname}`)
    }

    componentDidMount = () => {

        this.setUrlLang();

        this.setGoogleAnalytics();

        if (typeof(window) !== "undefined") {
            window.addEventListener('scroll', this.handleScroll);
        }
        this.props.startSetWorkshopPage().then(()=> {
            let workshoppage= [];
            
            if ( this.props.workshoppage ){
                
                workshoppage = this.props.workshoppage;
                const workshopimages = [];
                const img = workshoppage.workshopimages;
                Object.keys(img).map((key) => {
                    const keyedImg = {id: String(key), ...img[key]};
                    workshopimages.push(keyedImg);
                });
            
                workshopimages.sort((a, b) => {
                    return a.order > b.order ? 1 : -1;
                });
                const galleryImages = [];
                workshopimages.map((image) => {
                    return galleryImages.push({
                        publicId: image.publicId,
                        id: image.id,
                        order: image.order,
                        src: image.src,
                        alt: image.alt,
                        width: image.width,
                        height: image.height
                    });
                });
                const slideGalleryImages = [];
                workshopimages.map((image) => {
                    let imageWidth = image.width;
                    let imageHeight = image.height;
                    const ratio = 600/imageHeight;
                    imageWidth = ratio*imageWidth;
                    imageHeight = ratio*imageHeight;
                    if (imageWidth > 960) {
                        const widthRatio = 960/imageWidth;
                        imageWidth = widthRatio*imageWidth;
                        imageHeight = widthRatio*imageHeight;
                    }
                    return slideGalleryImages.push({
                        publicId: image.publicId,
                        id: image.id,
                        order: image.order,
                        src: image.src,
                        altText: image.alt,
                        width: imageWidth,
                        height: imageHeight,
                        caption: '',
                        header: ''
                    });
                });
                this.setState({
                    images: workshopimages,
                    galleryImages,
                    slideGalleryImages
                });

                this.setState({
                    seo: workshoppage.seo,
                    workshoppage: workshoppage,
                    workshoppageOrigin: workshoppage
                });
            }
        });
    }


    componentWillUnmount = () => {
        if (typeof(window) !== "undefined") {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }



    onToggleWorkshoppageSeo = () => {
        this.setState({
            seoWorkshoppageModalIsOpen: !this.state.seoWorkshoppageModalIsOpen
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

    updateWorkshoppageSeo = () => {
        const seo = this.state.seo;
        this.props.startEditWorkshopPageSeo(seo);
        this.onToggleWorkshoppageSeo();
    }


    uploadWidget = (e) => {
        const { dataset } = e.target;
        const { id } = dataset;
        const eventId = this.state.eventId;
        var myUploadWidget;
        myUploadWidget = cloudinary.openUploadWidget({ 
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
                    const order = Number(this.state.images.length)+1;
                    const image = {
                        publicId: result.info.public_id,
                        src: result.info.secure_url,
                        width: result.info.width,
                        height: result.info.height,
                        alt: '',
                        order: order
                    };
                        
                    this.props.startAddWorkshopImage(image, order).then((images)=> {
                        images.sort((a, b) => {
                            return a.order > b.order ? 1 : -1;
                        });
                        const galleryImages = [];
                        images.map((image) => {
                            return galleryImages.push({
                                publicId: image.publicId,
                                id: image.id,
                                order: image.order,
                                src: image.src,
                                alt: image.alt,
                                width: image.width,
                                height: image.height
                            });
                        });
                        const slideGalleryImages = [];
                        images.map((image) => {
                            let imageWidth = image.width;
                            let imageHeight = image.height;
                            const ratio = 600/imageHeight;
                            imageWidth = ratio*imageWidth;
                            imageHeight = ratio*imageHeight;
                            if (imageWidth > 800) {
                                const widthRatio = 800/imageWidth;
                                imageWidth = widthRatio*imageWidth;
                                imageHeight = widthRatio*imageHeight;
                            }
                            return slideGalleryImages.push({
                                publicId: image.publicId,
                                id: image.id,
                                order: image.order,
                                src: image.src,
                                altText: image.alt,
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




    onImageOrderBlur = (e) => {
        const images = [];
        const galleryImages = this.state.galleryImages;
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
            image.order = Number(index)+1;
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
        const workshoppage = this.state.workshoppage;
        const galleryImages = this.state.galleryImages;
        const images = this.state.images;
        const fbImages = {};
        galleryImages.map((image, index) => {
            fbImages[image.id] = image;
        })
        workshoppage.workshopimages = fbImages;
        this.setState({
            workshoppage
        });
        this.onUpdateWorkshopPage();
    }

    onDeleteImage = (e) => {
        const id = e.target.dataset.id;
        const order = e.target.dataset.order;
        const publicid = e.target.dataset.publicid;
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
            image.order = Number(index)+1;
            images.push(image);
        });
        const fbImages = {};
        images.map((image, index) => {
            fbImages[image.id] = image;
        })
        fbImages[id] = null;
        this.props.startDeleteWorkshopImage( fbImages, images, publicid );
        const slideGalleryImages = [];
        images.map((image) => {
            let imageWidth = image.width;
            let imageHeight = image.height;
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
                publicId: image.publicId,
                id: image.id,
                order: image.order,
                src: image.src,
                altText: image.alt,
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
        this.setState({
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
        if (this.onCurrentImageChange) {
        this.onCurrentImageChange(nextIndex);
        }
    }

    previous = () => {
        if (this.animating) return;
        const nextIndex = this.state.currentImage === 0 ? this.state.slideGalleryImages.length - 1 : this.state.currentImage - 1;
        this.onCurrentImageChange(nextIndex);
    }

    onExiting = () => {
        this.animating = true;
    }

    onExited = () => {
        this.animating = false;
    }


    render() {
        return (
            <div className="container-fluid">

                { 
                    this.props.isAuthenticated === true ? 
                        <Prompt
                            style={{background: "red"}}
                            when={!isEqual(this.state.workshoppageOrigin, this.state.workshoppage)}
                            message="Changes you made may not be saved."
                        />
                    :
                        null
                }

                <Helmet>
                    <title>{this.state.seo.title}</title>
                </Helmet>
                
                { 
                    this.props.isAuthenticated === true ? 
                        <Modal open={this.state.seoWorkshoppageModalIsOpen} onClose={this.onToggleWorkshoppageSeo} center dir="rtl">
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
                                <Button bsStyle="success" onClick={this.updateWorkshoppageSeo}>עדכון</Button>
                            </div>
                        </Modal>
                    :
                        null
                }

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
                                    <img className="events__event__carousel__button__image__x" src="/images/eventspage/carousel-x.svg" alt="סגירה" />
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
                
                <Navigation 
                    {...this.props}
                    langLink={this.state.langLink}
                    langLinkEng={this.state.langLinkEng}
                />
                <div className="workshop__structure">
                    <div className="workshop__left">
                        { 
                            this.props.isAuthenticated === true ? 
                                <div className="workshop__edit__panel__box">
                                    <div className="workshop__edit__panel">
                                        <button className="backoffice_button" onClick={this.onUpdateWorkshopPage}>
                                            <img className="backoffice_icon" src="/images/backoffice/save.svg" alt="שמירה" />
                                        </button>
                                        <button className="backoffice_button" onClick={this.props.startLogout}>
                                            <img className="backoffice_icon" src="/images/backoffice/exit.svg" alt="יציאה" />
                                        </button>
                                        <button className="backoffice_button" onClick={this.onToggleWorkshoppageSeo}>
                                            seo
                                        </button>
                                    </div>
                                </div>
                            :
                                null
                        }
                        {
                            this.state.workshoppage && this.state.workshoppage.slogen ?
                                <WorkshopTopStrip
                                    slogen={this.state.workshoppage.slogen}
                                    action='setString'
                                    name="slogen"
                                    index="slogen"
                                    key={`homepage-events-item-slogen`}
                                    setData={this.setData}
                                    lang={this.props.lang}
                                />
                            :
                                null
                        }
                        {
                            this.state.workshoppage && this.state.workshoppage.workshop ? 
                                <WorkshopContentStrip
                                    isAuthenticated={this.props.isAuthenticated}
                                    action='setString'
                                    name="workshop"
                                    index="workshop"
                                    key={`homepage-events-item-workshop`}
                                    item={this.state.workshoppage.workshop}
                                    workshoppageOrigin={this.state.workshoppageOrigin}
                                    workshoppage={this.state.workshoppage}
                                    setData={this.setData}
                                    lang={this.props.lang}
                                />           
                            :
                                null
                        }

                        {
                            this.state.workshoppage && this.state.workshoppage.solo ? 
                                <WorkshopContentStrip
                                    isAuthenticated={this.props.isAuthenticated}
                                    action='setString'
                                    name="solo"
                                    index="solo"
                                    key={`homepage-events-item-solo`}
                                    item={this.state.workshoppage.solo}
                                    workshoppageOrigin={this.state.workshoppageOrigin}
                                    workshoppage={this.state.workshoppage}
                                    setData={this.setData}
                                    lang={this.props.lang}
                                />           
                            :
                                null
                        }
                        
                        {
                            this.state.workshoppage && this.state.workshoppage.group ? 
                                <WorkshopContentStrip
                                    isAuthenticated={this.props.isAuthenticated}
                                    action='setString'
                                    name="group"
                                    index="group"
                                    key={`homepage-events-item-group`}
                                    item={this.state.workshoppage.group}
                                    workshoppageOrigin={this.state.workshoppageOrigin}
                                    workshoppage={this.state.workshoppage}
                                    setData={this.setData}
                                    lang={this.props.lang}
                                />           
                            :
                                null
                        }

                        <div className="workshop__gallery desktop">
                            { 
                                this.props.isAuthenticated === true ? 
                                    <div className="backoffice__about__images__buttons">
                                        <h3
                                            className={`backoffice__about__images__text${this.props.lang === 'he' ? '' : ' backoffice__about__images__text__eng'} Heebo-Regular`}
                                        >
                                            עריכת תמונות
                                        </h3>
                                        <button className="backoffice__events__events__add__button" onClick={this.uploadWidget}>
                                            <img className="backoffice__events__events__add__icon" src="/images/eventspage/add-eventSubcategory-icon.svg" alt="הוספת תת קטגוריה" />
                                        </button>
                                        <button className="backoffice__events__events__save__button" onClick={this.updateImages}>
                                            <img className="backoffice__events__events__save__icon" src="/images/backoffice/save.svg" alt="שמירה" />
                                        </button>
                                        
                                    </div>
                                :
                                    null
                            }
                            {
                                this.state.galleryImages && this.state.galleryImages[0] ?

                                    <TileGallery
                                        photos={this.state.galleryImages}
                                        columns={2}
                                        margin={3}
                                        style="react-photo-gallery--workshop"
                                        isAuthenticated={this.props.isAuthenticated}
                                        onImageOrderBlur={this.onImageOrderBlur}
                                        onImageOrderChange={this.onImageOrderChange}
                                        onImageOrderKeyPress={this.onImageOrderKeyPress}
                                        onDeleteImage={this.onDeleteImage}
                                        onOpenSlideGallery={this.onOpenSlideGallery}
                                    />

                                :
                                    null
                            }
                        </div>
                        <div className="workshop__gallery mobile">
                            { 
                                this.props.isAuthenticated === true ? 
                                    <div className="backoffice__events__events__buttons">
                                        <button className="backoffice__events__events__add__button" onClick={this.uploadWidget}>
                                            <img className="backoffice__events__events__add__icon" src="/images/eventspage/add-eventSubcategory-icon.svg" alt="הוספת תת קטגוריה" />
                                        </button>
                                        <button className="backoffice__events__events__save__button" onClick={this.updateImages}>
                                            <img className="backoffice__events__events__save__icon" src="/images/backoffice/save.svg" alt="שמירה" />
                                        </button>
                                        
                                    </div>
                                :
                                    null
                            }
                            {
                                this.state.galleryImages ?

                                    <TileGallery
                                        photos={this.state.galleryImages}
                                        columns={1}
                                        margin={3}
                                        isAuthenticated={this.props.isAuthenticated}
                                        onImageOrderBlur={this.onImageOrderBlur}
                                        onImageOrderChange={this.onImageOrderChange}
                                        onImageOrderKeyPress={this.onImageOrderKeyPress}
                                        onDeleteImage={this.onDeleteImage}
                                        onOpenSlideGallery={this.onOpenSlideGallery}
                                    />

                                :
                                    null
                            }
                        </div>
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
    workshoppage: state.workshoppage,
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startSetWorkshopPage: () => dispatch(startSetWorkshopPage()),
    startEditWorkshopPage: (fbWorkshoppage, workshoppage) => dispatch(startEditWorkshopPage(fbWorkshoppage, workshoppage)),
    startEditWorkshopPageSeo: (seo) => dispatch(startEditWorkshopPageSeo(seo)),
    startAddWorkshopImage: (image, order) => dispatch(startAddWorkshopImage(image, order)),
    startDeleteWorkshopImage: (fbImages, images, publicid) => dispatch(startDeleteWorkshopImage(fbImages, images, publicid)),
    setLanguage: (lang) => dispatch(setLanguage(lang))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkshopPage);  