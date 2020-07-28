import React from 'react';
import { Prompt } from "react-router-dom";
import {Helmet} from 'react-helmet';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-responsive-modal';
import CvContentStrip from '../components/cvpage/CvContentStrip';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import PageUpStrip from '../components/common/PageUpStrip';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { startSetCvPage, startEditCvPage, startEditCvPageSeo, startAddCvImage, startDeleteCvImage } from '../actions/cvpage';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import isEqual from 'lodash.isequal';
import { setLanguage } from "redux-i18n";


class CvPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cvpageOrigin: [],
            cvpage: { content: '' },
            ratio: 1,
            ratioFacebook: 1,
            ratioInstagram: 1,
            ratioMail: 1,
            ratioPhone: 1,
            ratioGreenArrow: 1,
            pageupImageClassName: 'pageup__image__absolute',
            slideGalleryModalIsOpen: false,
            seoAboutpageModalIsOpen: false,
            seo: {
                title: '',
                description: '',
                keyWords: '',
            },
            images: [],
            galleryImages: [],
            slideGalleryImages: [],
            langLink: '/קורות_חיים',
            langLinkEng: '/CV'
        }
    }

    setData = (e) => {
        console.log(e);
		const { value, dataset } = e.target;
		const { name, action } = dataset;
		const cvpage = JSON.parse(JSON.stringify(this.state.cvpage));

        switch (action) {
			case "setString":
                cvpage[name] = value;
                break;
            case "setNumber":
                cvpage[name] = value;
                break;
			default:
				break;
        };
        this.setState({
            cvpage: cvpage
        });
        if (typeof(window) !== "undefined") {
            if(isEqual(this.state.cvpageOrigin, cvpage)){ 
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
        const cvpage = JSON.parse(JSON.stringify(this.state.cvpage));
        const fbCvpage = JSON.parse(JSON.stringify(this.state.cvpage));
        
        this.props.startEditCvPage(fbCvpage, cvpage);
        this.setState(() => ({ cvpageOrigin: cvpage }));
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

    componentDidMount = () => {

        this.setUrlLang();

        if (typeof(window) !== "undefined") {
            window.addEventListener('scroll', this.handleScroll);
        }
        this.props.startSetCvPage().then(res => {
            console.log('res', res);
            let cvpage= [];
            
            if ( this.props.cvpage ){
                
                cvpage = this.props.cvpage;
                console.log('this.props.cvpage', this.props.cvpage);

                this.setState({
                    seo: cvpage.seo,
                    cvpage: cvpage,
                    cvpageOrigin: cvpage
                });
            }
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
                        
                    this.props.startAddAboutImage(image, order).then((images)=> {
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

                { 
                    this.props.isAuthenticated === true ? 
                        <Prompt
                            style={{background: "red"}}
                            when={!isEqual(this.state.aboutpageOrigin, this.state.aboutpage)}
                            message="Changes you made may not be saved."
                        />
                    :
                        null
                }

                <Helmet>
                    <title>{this.state.seo && this.state.seo.title}</title>
                </Helmet>
                
                { 
                    this.props.isAuthenticated === true ? 
                        <Modal open={this.state.seoAboutpageModalIsOpen} onClose={this.onToggleAboutpageSeo} center dir="rtl">
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
                                <Button bsStyle="success" onClick={this.updateAboutpageSeo}>עדכון</Button>
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
                            
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--exit" style={this.props.lang === 'en' ? {left: '90%'} : {left: '10%'}}>
                                    <div className="backoffice__toolbar__label">
                                        {`${this.props.lang === 'en' ? 'Exit' : 'יציאה'}`}
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
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--save-project" style={this.props.lang === 'en' ? {left: '85%'} : {left: '15%'}}>{/* $( window ).width() / 2 - 85 */}
                                    <div className="backoffice__toolbar__label" style={{color: this.state.needSave ? 'red' : 'aqua'}}>
                                        {`${this.props.lang === 'en' ? 'Save' : 'שמירה'}`}
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
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--save-project" style={this.props.lang === 'en' ? {left: '80%'} : {left: '20%'}}>{/* $( window ).width() / 2 - 85 */}
                                    <div className="backoffice__toolbar__label" style={{color: this.state.needSave ? 'red' : 'aqua'}}>
                                        {`${this.props.lang === 'en' ? 'SEO' : 'קידום'}`}
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
                            <h1 className="page__header">{this.props.lang === 'en' ? 'CV' : 'קורות חיים'}</h1>
                        </div>
                            
                        <CvContentStrip
                            isAuthenticated={this.props.isAuthenticated}
                            action='setString'
                            name="cv"
                            index="cv"
                            key={`homepage-events-item-cv`}
                            item={this.state.cvpage.about}
                            cvpageOrigin={this.state.cvpageOrigin}
                            cvpage={this.state.cvpage}
                            setData={this.setData}
                            lang={this.props.lang}
                        />            
                    </div>
                </div>

                <div hidden={this.state.pageupImageClassName === 'pageup__image'} className="pageup__image__fake desktop"> </div>
                <PageUpStrip
                    pageupImageClassName={this.state.pageupImageClassName}
                />
                <div id='fake_pageupstrip'> </div>
                <Footer lang={this.props.lang} position="relative" />
            </div>
        );
    }
} 

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    cvpage: state.cvpage,
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startSetCvPage: () => dispatch(startSetCvPage()),
    startEditCvPage: (fbCvpage, cvpage) => dispatch(startEditCvPage(fbCvpage, cvpage)),
    startEditCvPageSeo: (seo) => dispatch(startEditCvPageSeo(seo)),
    startAddCvImage: (image, order) => dispatch(startAddCvImage(image, order)),
    startDeleteCvImage: (fbImages, images, publicid) => dispatch(startDeleteCvImage(fbImages, images, publicid)),
    setLanguage: (lang) => dispatch(setLanguage(lang))
});

export default connect(mapStateToProps, mapDispatchToProps)(CvPage);
