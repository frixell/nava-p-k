import React from 'react';
import {Helmet} from 'react-helmet';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import AboutTopStrip from '../components/aboutpage/AboutTopStrip';
import AboutContentStrip from '../components/aboutpage/AboutContentStrip';
import ContactStrip from '../components/contactpage/ContactStrip';
import CustomersStrip from '../components/common/CustomersStrip';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import PageUpStrip from '../components/common/PageUpStrip';
import SocialMedia from '../components/common/SocialMedia';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { startSetAboutPage, startEditAboutPage, startEditAboutPageSeo, startSaveAboutImage, startDeleteAboutImage } from '../actions/aboutpage';
import { iconRatioOn } from '../reusableFunctions/iconRatioOn';
import { iconRatioOut } from '../reusableFunctions/iconRatioOut';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import TileGallery from '../components/common/TileGallery';
import isEqual from 'lodash.isequal';
import { setLanguage } from "react-i18next";
import { withTranslation } from 'react-i18next';

// import ReactGA from 'react-ga';

// function initializeReactGA(url) {
//     ReactGA.initialize('UA-128960221-1');
//     ReactGA.pageview(url);
// }
//initializeReactGA();


class AboutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aboutpageOrigin: [],
            aboutpage: { content: '', image: '' },
            pageupImageClassName: 'pageup__image__absolute',
            seoAboutpageModalIsOpen: false,
            seo: {
                title: '',
                description: '',
                keyWords: '',
            },
            langLink: '/אודות',
            langLinkEng: '/about'
        }
    }

    setData = (e) => {
        console.log(e);
		const { value, dataset } = e.target;
		const { name, action } = dataset;
		const aboutpage = JSON.parse(JSON.stringify(this.state.aboutpage));

        switch (action) {
			case "setString":
                aboutpage[name] = value;
                break;
            case "setNumber":
                aboutpage[name] = value;
                break;
			default:
				break;
        };
        this.setState({
            aboutpage: aboutpage
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.aboutpageOrigin, aboutpage)){ 
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

    onUpdateAboutPage = () => {
        const aboutpage = JSON.parse(JSON.stringify(this.state.aboutpage));
        const fbAboutpage = JSON.parse(JSON.stringify(this.state.aboutpage));
        
        this.props.startEditAboutPage(fbAboutpage, aboutpage);
        this.setState(() => ({ aboutpageOrigin: aboutpage }));
        if (typeof(window) !== "undefined") {
            window.removeEventListener("beforeunload", this.unloadFunc);
        }
    }

    handleScroll = () => {
        this.setState(handlePageScroll(this.state.pageupImageClassName));
    }

    setUrlLang = () => {
        if (this.props.urlLang !== undefined && this.props.i18n.language !== this.props.urlLang) {
            this.props.i18n.changeLanguage(this.props.urlLang);
        }
    }

    // setGoogleAnalytics = () => {
    //     initializeReactGA(`/${this.props.location.pathname}`)
    // }

    componentDidMount = () => {

        this.setUrlLang();

        //this.setGoogleAnalytics();

        if (typeof(window) !== "undefined") {
            window.addEventListener('scroll', this.handleScroll);
        }
        this.props.startSetAboutPage().then(aboutpage => {
            console.log('aboutpage', aboutpage);
            this.setState({
                seo: aboutpage.seo,
                aboutpage: aboutpage,
                aboutpageOrigin: aboutpage
            });
        });
    }

    componentWillUnmount = () => {
        if (typeof(window) !== "undefined") {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }

    onToggleAboutpageSeo = () => {
        this.setState({
            seoAboutpageModalIsOpen: !this.state.seoAboutpageModalIsOpen
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

    updateAboutpageSeo = () => {
        const seo = this.state.seo;
        this.props.startEditAboutPageSeo(seo);
        this.onToggleAboutpageSeo();
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
                        order: 0
                    };
                    
                    let publicId = null;
                    if(this.state.aboutpage.image && this.state.aboutpage.image.publicId) publicId = this.state.aboutpage.image.publicId;
                        
                    this.props.startSaveAboutImage(image, publicId).then((image)=> {
                        const aboutpage = this.state.aboutpage;
                        aboutpage.image = image;
                        this.setState({
                            aboutpage
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
        const aboutpage = this.state.aboutpage;
        const galleryImages = this.state.galleryImages;
        const images = this.state.images;
        const fbImages = {};
        galleryImages.map((image, index) => {
            fbImages[image.id] = image;
        })
        aboutpage.aboutimages = fbImages;
        this.setState({
            aboutpage
        });
        this.onUpdateAboutPage();
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
        this.props.startDeleteAboutImage( fbImages, images, publicid );
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



                <Helmet>
                    <title>{this.state.seo && this.state.seo.title}</title>
                </Helmet>
                
                { 
                    this.props.isAuthenticated === true ? 
                        <Modal open={this.state.seoAboutpageModalIsOpen} onClose={this.onToggleAboutpageSeo}>
                            <div className="backoffice__seo__modal">
                                <h4 className="Heebo-Regular">seo</h4>
                                <div className="backoffice__seo__modal__left">
                                    <input
                                        className="events__tabs__button"
                                        type="text"
                                        placeholder="כותרת לדף (title)"
                                        value={this.state.seo && this.state.seo.title}
                                        onChange={this.onSeoTitleChange}
                                    />
                                    <br />
                                    <textarea
                                        type="text"
                                        placeholder="תאור"
                                        value={this.state.seo && this.state.seo.description}
                                        onChange={this.onSeoDescriptionChange}
                                    />
                                    <br />
                                    <textarea
                                        type="text"
                                        placeholder="מילות מפתח"
                                        value={this.state.seo && this.state.seo.keyWords}
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
                                <Button variant="contained" color="primary" onClick={this.updateAboutpageSeo}>עדכון</Button>
                            </div>
                        </Modal>
                    :
                        null
                }
  
                <Navigation 
                    {...this.props}
                    langLink={this.state.langLink}
                    langLinkEng={this.state.langLinkEng}
                />
                
                
                <div className="about__structure">
                    <div className="about__left">
                        
                        {
                            this.props.isAuthenticated ?
                            
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--exit" style={this.props.i18n.language === 'en' ? {textAlign: 'center', left: '90%'} : {textAlign: 'center', left: '10%'}}>
                                    <div className="backoffice__toolbar__label">
                                        {`${this.props.i18n.language === 'en' ? 'Exit' : 'יציאה'}`}
                                    </div>
                                    <button className="backoffice_button" onClick={this.props.startLogout}>
                                        <img className="backoffice_icon" src="/images/backoffice/exit.svg" alt="יציאה" />
                                    </button>
                                </div>
                            :
                                null
                        }
                        
                        {
                            this.props.isAuthenticated ?
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--save-project" style={this.props.i18n.language === 'en' ? {textAlign: 'center', left: '85%'} : {textAlign: 'center', left: '15%'}}>
                                    <div className="backoffice__toolbar__label" style={{color: this.state.needSave ? 'red' : 'aqua'}}>
                                        {`${this.props.i18n.language === 'en' ? 'Save' : 'שמירה'}`}
                                    </div>
                                    <button className="backoffice_button" onClick={this.onUpdateAboutPage}>
                                        <img className="backoffice_icon" src="/images/backoffice/save.svg" alt="שמירת אודות" />
                                    </button>
                                </div>
                            :
                                null
                        }
                        
                        {
                            this.props.isAuthenticated ?
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--save-project" style={this.props.i18n.language === 'en' ? {textAlign: 'center', left: '80%'} : {textAlign: 'center', left: '20%'}}>
                                    <div className="backoffice__toolbar__label" style={{color: this.state.needSave ? 'red' : 'aqua'}}>
                                        {`${this.props.i18n.language === 'en' ? 'SEO' : 'קידום'}`}
                                    </div>
                                    <button className="backoffice_button" onClick={this.onToggleAboutpageSeo}>
                                    <img
                                        className="backoffice__edit__icon"
                                        src="/images/backoffice/edit.svg"
                                        alt="SEO"
                                    />
                                    </button>
                                </div>
                            :
                                null
                        }
                        
                        
                        <div className="page__header__container">
                            <h1 className="page__header">{this.props.i18n.language === 'en' ? 'About' : 'אודות'}</h1>
                        </div>
                            
                            
                        <AboutTopStrip
                            slogen={this.state.aboutpage.slogen}
                            action='setString'
                            name="slogen"
                            index="slogen"
                            image={this.state.aboutpage.image}
                            isAuthenticated={this.props.isAuthenticated}
                            uploadWidget={this.uploadWidget}
                            key={`homepage-events-item-slogen`}
                            setData={this.setData}
                            lang={this.props.i18n.language}
                        />
                            
                        <AboutContentStrip
                            isAuthenticated={this.props.isAuthenticated}
                            action='setString'
                            name="about"
                            index="about"
                            key={`homepage-events-item-about`}
                            item={this.state.aboutpage.about}
                            aboutpageOrigin={this.state.aboutpageOrigin}
                            aboutpage={this.state.aboutpage}
                            setData={this.setData}
                            lang={this.props.i18n.language}
                        />            
                    </div>
                </div>

                <div hidden={this.state.pageupImageClassName === 'pageup__image'} className="pageup__image__fake desktop"> </div>
                <PageUpStrip
                    pageupImageClassName={this.state.pageupImageClassName}
                />
                <div id='fake_pageupstrip'> </div>
                <Footer lang={this.props.i18n.language} position="relative" />
            </div>
        );
    }
} 

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    aboutpage: state.aboutpage
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startSetAboutPage: () => dispatch(startSetAboutPage()),
    startEditAboutPage: (fbAboutpage, aboutpage) => dispatch(startEditAboutPage(fbAboutpage, aboutpage)),
    startEditAboutPageSeo: (seo) => dispatch(startEditAboutPageSeo(seo)),
    startSaveAboutImage: (image, publicId) => dispatch(startSaveAboutImage(image, publicId)),
    startDeleteAboutImage: (fbImages, images, publicid) => dispatch(startDeleteAboutImage(fbImages, images, publicid))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AboutPage));  