import React, { Component } from 'react';
import UncontrolledCarousel from '../UncontrolledCarousel';
//import { Button } from "react-bootstrap";
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import {
    startAddDesktopGallery,
    startSetDesktopGallery,
    startEditDesktopGallery,
    startDeleteDesktopGallery
} from '../../actions/desktopGallery';
import {
    startAddMobileGallery,
    startSetMobileGallery,
    startEditMobileGallery,
    startDeleteMobileGallery
} from '../../actions/mobileGallery';


(function () {
    if (typeof(window) !== "undefined") {
        if ( typeof window.CustomEvent === "function" ) return false;

        function CustomEvent ( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    }
})();



class HomePageCarousel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            desktopGalleryModalIsOpen: false,
            mobileGalleryModalIsOpen: false,
            desktopImages: this.props.desktopGallery,
            mobileImages: this.props.mobileGallery
        }
    }

    onToggleDesktopGallery = () => {
        this.setState({
            desktopGalleryModalIsOpen: !this.state.desktopGalleryModalIsOpen
        });
    }

    onToggleMobileGallery = () => {
        this.setState({
            mobileGalleryModalIsOpen: !this.state.mobileGalleryModalIsOpen
        });
    }


    uploadWidget = (e) => {
        const screen = e.target.dataset.screen;
        console.log(screen);
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
                    let order = 1;
                    if(screen === "desktop") {
                        if (this.state.desktopImages){
                          order = Number(this.state.desktopImages.length)+1;
                        }
                    } else {
                        if (this.state.mobileImages){
                            order = Number(this.state.mobileImages.length)+1;
                        }
                    }
                    const image = result.info.secure_url;
                    const publicId = result.info.public_id;
                    const newImage = {
                      src: image,
                      altText: 'Homepage Galley Image',
                      caption: '',
                      header: '',
                      publicId,
                      order
                    }
                    if(screen === "desktop") {
                        this.props.startAddDesktopGallery( newImage ).then(() => {
                          this.props.startSetDesktopGallery().then((desktopImages) => {
                            console.log(desktopImages);
                            this.setState({
                                desktopImages
                            });
                          });
                          myUploadWidget.close();
                        });
                    } else {
                        this.props.startAddMobileGallery( newImage ).then(() => {
                          this.props.startSetMobileGallery().then((mobileImages) => {
                            console.log(mobileImages);
                            this.setState({
                                mobileImages
                            });
                          });
                          myUploadWidget.close();
                        });
                    }
                    
                }
            }
        );
        myUploadWidget.open();
    }


    onDeleteDesktopImage = (e) => {
        const id = e.target.dataset.id;
        const order = e.target.dataset.order;
        const publicId = e.target.dataset.publicid;
        const desktopImages = [];
        const desktopImagesOld = this.state.desktopImages;

        for (let i = 0; i < desktopImagesOld.length; i++) {
            if (id !== desktopImagesOld[i].id) {
                if (desktopImagesOld[i].order > order) {
                    desktopImagesOld[i].order = desktopImagesOld[i].order-1;
                }
                desktopImages.push(desktopImagesOld[i]);
            }
        }

        const fbDesktopImages = {};
        desktopImages.map((desktopImage, index) => {
            fbDesktopImages[desktopImage.id] = desktopImage;
        })
        fbDesktopImages[id] = null;
        this.props.startDeleteDesktopGallery( fbDesktopImages, desktopImages, publicId );
        this.setState({
            desktopImages
        });
    }



    onDesktopImageOrderBlur = (e) => {
        const desktopImages = this.state.desktopImages;
        let newOrder = e.target.value;
        if (newOrder > desktopImages.length) {
            newOrder = desktopImages.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        const id = e.target.dataset.id;
        if ( Number(newOrder) > Number(oldOrder) ) {
            for (let i = 0; i < desktopImages.length; i++) {
                if (id !== desktopImages[i].id) {
                    if (desktopImages[i].order <= newOrder && desktopImages[i].order > oldOrder) {
                        desktopImages[i].order = desktopImages[i].order-1;
                    }
                }
            }
        } else if ( Number(newOrder) < Number(oldOrder) ) {
            for (let i = 0; i < desktopImages.length; i++) {
                
                if (id !== desktopImages[i].id) {
                    if (desktopImages[i].order < oldOrder && desktopImages[i].order >= newOrder) {
                        desktopImages[i].order = Number(desktopImages[i].order)+1;
                    }
                }
            }
        }
        desktopImages.sort((a, b) => {
            return a.order > b.order ? 1 : -1;
        });
        this.setState({
            desktopImages
        });
    }

    onDesktopImageOrderChange = (e) => {
        const desktopImages = this.state.desktopImages;
        let newOrder = e.target.value;
        if (newOrder > desktopImages.length) {
            newOrder = desktopImages.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        desktopImages[e.target.dataset.index].order = Number(newOrder);
        this.setState({
            desktopImages
        });
    }

    onDesktopImageOrderKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onDesktopImageOrderBlur(e);
        }
    }


    updateDesktopGallery = () => {
        const desktopImages = this.state.desktopImages;
        const fbDesktopImages = {};
        desktopImages.map((desktopImage, index) => {
            fbDesktopImages[desktopImage.id] = desktopImage;
        })
        this.props.startEditDesktopGallery(desktopImages, fbDesktopImages);
    }


    onDeleteMobileImage = (e) => {
        const id = e.target.dataset.id;
        const order = e.target.dataset.order;
        const publicId = e.target.dataset.publicid;
        const mobileImages = [];
        const mobileImagesOld = this.state.mobileImages;

        for (let i = 0; i < mobileImagesOld.length; i++) {
            if (id !== mobileImagesOld[i].id) {
                if (mobileImagesOld[i].order > order) {
                    mobileImagesOld[i].order = mobileImagesOld[i].order-1;
                }
                mobileImages.push(mobileImagesOld[i]);
            }
        }

        const fbMobileImages = {};
        mobileImages.map((mobileImage, index) => {
            fbMobileImages[mobileImage.id] = mobileImage;
        })
        fbMobileImages[id] = null;
        this.props.startDeleteMobileGallery( fbMobileImages, mobileImages, publicId );
        this.setState({
            mobileImages
        });
    }



    onMobileImageOrderBlur = (e) => {
        const mobileImages = this.state.mobileImages;
        let newOrder = e.target.value;
        if (newOrder > mobileImages.length) {
            newOrder = mobileImages.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        const id = e.target.dataset.id;
        if ( Number(newOrder) > Number(oldOrder) ) {
            for (let i = 0; i < mobileImages.length; i++) {
                if (id !== mobileImages[i].id) {
                    if (mobileImages[i].order <= newOrder && mobileImages[i].order > oldOrder) {
                        mobileImages[i].order = mobileImages[i].order-1;
                    }
                }
            }
        } else if ( Number(newOrder) < Number(oldOrder) ) {
            for (let i = 0; i < mobileImages.length; i++) {
                
                if (id !== mobileImages[i].id) {
                    if (mobileImages[i].order < oldOrder && mobileImages[i].order >= newOrder) {
                        mobileImages[i].order = Number(mobileImages[i].order)+1;
                    }
                }
            }
        }
        mobileImages.sort((a, b) => {
            return a.order > b.order ? 1 : -1;
        });
        this.setState({
            mobileImages
        });
    }

    onMobileImageOrderChange = (e) => {
        const mobileImages = this.state.mobileImages;
        let newOrder = e.target.value;
        if (newOrder > mobileImages.length) {
            newOrder = mobileImages.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        mobileImages[e.target.dataset.index].order = Number(newOrder);
        this.setState({
            mobileImages
        });
    }

    onMobileImageOrderKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onMobileImageOrderBlur(e);
        }
    }


    updateMobileGallery = () => {
        const mobileImages = this.state.mobileImages;
        const fbMobileImages = {};
        mobileImages.map((mobileImage, index) => {
            fbMobileImages[mobileImage.id] = mobileImage;
        })
        this.props.startEditMobileGallery(mobileImages, fbMobileImages);
    }

    render() {
        // console.log(this.props.media);
        // console.log(this.state.mobileImages);
        // console.log(this.state.desktopImages);
        return (
          <div>
            
            <Modal open={this.state.desktopGalleryModalIsOpen} onClose={this.onToggleDesktopGallery} dir="rtl">
                <div className="backoffice__gallery__modal">
                    <h4 className="Heebo-Regular">desktop gallery</h4>
                    {
                        this.state.desktopImages ?
                        this.state.desktopImages.length > 0 ?
                            
                            this.state.desktopImages.map((image, index) => {
                                return  <div className="backoffice__gallery__modal__in__box" key={"in"+image.id} dir="rtl">
                                            <Button
                                                id="btn-x"
                                                data-id={image.id}
                                                data-order={image.order}
                                                data-publicid={image.publicId}
                                                data-index={image.order}
                                                data-showstatus={false}
                                                className="backoffice__events__tabs__remove btn-danger"
                                                onClick={this.onDeleteDesktopImage}
                                            >
                                                X
                                            </Button>
                                            
                                            <div className="backoffice__events__tabs__order__box">
                                                <input
                                                    id="number"
                                                    data-id={image.id}
                                                    type="number"
                                                    value={image.order}
                                                    data-index={index}
                                                    onChange={this.onDesktopImageOrderChange}
                                                    onKeyPress={this.onDesktopImageOrderKeyPress}
                                                    onBlur={this.onDesktopImageOrderBlur}
                                                />
                                            </div>
                                            <div className="backoffice__gallery__image__container">
                                              <img width="100%" height="100%" src={image.src} alt="אורן ורינת הפקות - דף הבית" />
                                            </div>
                                        </div>
                            })
                            
                        :
                            null
                        :
                            null
                    }
                    <br />
                    <Button bsStyle="success" onClick={this.updateDesktopGallery}>עדכון</Button>
                </div>
            </Modal>



            <Modal open={this.state.mobileGalleryModalIsOpen} onClose={this.onToggleMobileGallery} dir="rtl">
                <div className="backoffice__gallery__modal">
                    <h4 className="Heebo-Regular">mobile gallery</h4>
                    {
                        this.state.mobileImages ?
                        this.state.mobileImages.length > 0 ?
                            
                            this.state.mobileImages.map((image, index) => {
                                return  <div className="backoffice__gallery__modal__in__box" key={"in"+image.id} dir="rtl">
                                            <Button
                                                id="btn-x"
                                                data-id={image.id}
                                                data-order={image.order}
                                                data-publicid={image.publicId}
                                                data-index={image.order}
                                                data-showstatus={false}
                                                className="backoffice__events__tabs__remove btn-danger"
                                                onClick={this.onDeleteMobileImage}
                                            >
                                                X
                                            </Button>
                                            
                                            <div className="backoffice__events__tabs__order__box">
                                                <input
                                                    id="number"
                                                    data-id={image.id}
                                                    type="number"
                                                    value={image.order}
                                                    data-index={index}
                                                    onChange={this.onMobileImageOrderChange}
                                                    onKeyPress={this.onMobileImageOrderKeyPress}
                                                    onBlur={this.onMobileImageOrderBlur}
                                                />
                                            </div>
                                            <div className="backoffice__gallery__image__container">
                                              <img width="100%" height="100%" src={image.src} alt="אורן ורינת הפקות - דף הבית" />
                                            </div>
                                        </div>
                            })
                            
                        :
                            null
                        :
                            null
                    }
                    <br />
                    <Button bsStyle="success" onClick={this.updateMobileGallery}>עדכון</Button>
                </div>
            </Modal>


            { 
                this.props.isAuthenticated === true ? 

                    
                    <div className="backoffice__desktop__gallery__buttons">
                      <p className="homepage__tell__details">desktop gallery</p>
                      <button className="homepage__tell__edit__button" onClick={this.onToggleDesktopGallery}>
                          <img className="homepage__tell__add" src="/images/backoffice/edit_white.svg" alt="עריכה" />
                      </button>
                      <button className="homepage__tell__add__button" onClick={this.uploadWidget}>
                          <img data-screen="desktop" className="homepage__tell__add" src="/images/homepage/tell/add-circle-twotone-white-icon.svg" alt="הוספה" />
                      </button>
                    </div>
                :
                    null
            }

            { 
                this.props.isAuthenticated === true ? 

                    
                    <div className="backoffice__mobile__gallery__buttons">
                      <p className="homepage__tell__details">mobile gallery</p>
                      <button className="homepage__tell__edit__button" onClick={this.onToggleMobileGallery}>
                          <img className="homepage__tell__add" src="/images/backoffice/edit_white.svg" alt="עריכה" />
                      </button>
                      <button className="homepage__tell__add__button" onClick={this.uploadWidget}>
                          <img data-screen="mobile" className="homepage__tell__add" src="/images/homepage/tell/add-circle-twotone-white-icon.svg" alt="הוספה" />
                      </button>
                    </div>
                :
                    null
            }




            {
              this.props.desktopGallery && this.props.mobileGallery ?
                <UncontrolledCarousel className="carousel__fade"
                  slide={false}
                  pause={false}
                  controls={false}
                  keyboard={false}
                  ride='carousel'
                  interval='5000'
                  media={this.props.media}
                  items={this.props.media === 'desktop' ? this.state.desktopImages : this.state.mobileImages}
                />
              :
              null
            }

            

          </div>
        )
    }

}

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    desktopGallery: state.desktopGallery.desktopGallery,
    mobileGallery: state.mobileGallery.mobileGallery
});

const mapDispatchToProps = (dispatch) => ({
    startAddDesktopGallery: (desktopImage) => dispatch(startAddDesktopGallery(desktopImage)),
    startSetDesktopGallery: (desktopImages) => dispatch(startSetDesktopGallery(desktopImages)),
    startEditDesktopGallery: (desktopImages, fbDesktopImages) => dispatch(startEditDesktopGallery(desktopImages, fbDesktopImages)),
    startDeleteDesktopGallery: (fbDesktopImages, desktopImages, publicId) => dispatch(startDeleteDesktopGallery(fbDesktopImages, desktopImages, publicId)),
    startAddMobileGallery: (mobileImage) => dispatch(startAddMobileGallery(mobileImage)),
    startSetMobileGallery: (mobileImages) => dispatch(startSetMobileGallery(mobileImages)),
    startEditMobileGallery: (mobileImages, fbMobileImages) => dispatch(startEditMobileGallery(mobileImages, fbMobileImages)),
    startDeleteMobileGallery: (fbMobileImages, mobileImages, publicId) => dispatch(startDeleteMobileGallery(fbMobileImages, mobileImages, publicId))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageCarousel); 




