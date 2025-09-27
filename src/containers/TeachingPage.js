import React from 'react';
import {Helmet} from 'react-helmet';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-responsive-modal';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import PageUpStrip from '../components/common/PageUpStrip';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { startEditTeachingPageSeo, startSetTeachingPage, startAddTeach, startShowTeach, startUpdateTeach, startUpdateTeachImage, startUpdateTeachings, startDeleteTeach } from '../actions/teachingpage';
import Teach from './Teach';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import isEqual from 'lodash.isequal';
import { setLanguage } from "redux-i18n";



class TeachingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teachingpageOrigin: [],
            teachingpage: [],
            teachings: [],
            
            pageupImageClassName: 'pageup__image__absolute',
            
            seoModalIsOpen: false,
            seo: {
                title: '',
                description: '',
                keyWords: '',
            },
            
            langLink: '/הוראה',
            langLinkEng: '/teaching',
            selectedTeach: {
                details: '',
                description: ''
            },
            isEdit: false,
            editTeachModalIsOpen: false
        }
    }
    
    deleteTeach = e => {
        const id = e.target.dataset.id;
        const teachings = JSON.parse(JSON.stringify(this.state.teachings));
        const teachIndex = teachings.findIndex(t => t.id === id);
        const deletedTeach = teachings[teachIndex];
        this.props.startDeleteTeach(deletedTeach).then(res => {
            const updatedTeachings = teachings.filter(t => t.id !== id);
            this.setState({
                teachings: updatedTeachings
            });
        });
    }
    
    saveTeach = e => {
        console.log(e);
        const id = e.target.dataset.id;
        if (id) {
            const teachings = JSON.parse(JSON.stringify(this.state.teachings));
            const selectedTeach = JSON.parse(JSON.stringify(this.state.selectedTeach));
            this.props.startUpdateTeach(selectedTeach).then(res => {
                const teachIndex = teachings.findIndex(t => t.id === id);
                teachings[teachIndex] = selectedTeach;
                this.setState({
                    teachings
                });
            });
        } else {
            this.props.startAddTeach(this.state.selectedTeach, this.state.teachings.length + 1).then(res => {
                const teachings = res.sort((a, b) => {
                    return a.order > b.order ? -1 : 1;
                });
                this.setState({
                    teachings,
                    selectedTeach: teachings[0]
                })
            });
        }
    }
    
    saveTeachImage = (e, publicId) => {
        console.log(e);
        const id = e.target.dataset.id;
        const teachings = JSON.parse(JSON.stringify(this.state.teachings));
        const selectedTeach = JSON.parse(JSON.stringify(this.state.selectedTeach));
        this.props.startUpdateTeachImage(selectedTeach, publicId).then(res => {
            const teachIndex = teachings.findIndex(t => t.id === id);
            teachings[teachIndex] = selectedTeach;
            this.setState({
                teachings
            });
        });
    }

    setData = (e) => {
		const { value, dataset } = e.target;
		const { name } = dataset;
        const selectedTeach = this.state.selectedTeach;
        selectedTeach[name] = value;
        this.setState({
            selectedTeach
        });
	}

    unloadFunc = (e) => {
        var confirmationMessage = "o/";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
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

        //this.setGoogleAnalytics();

        if (typeof(window) !== "undefined") {
            window.addEventListener('scroll', this.handleScroll);
        }
        this.props.startSetTeachingPage().then(()=> {
            let teachingpage= [];
            if ( this.props.teachingpage && this.props.teachingpage.teachings ){
                
                teachingpage = this.props.teachingpage.teachings;
                const teachings = [];
                Object.keys(teachingpage).map((key) => {
                    const keyedTeach = {id: String(key), ...teachingpage[key]};
                    teachings.push(keyedTeach);
                });
            
                teachings.sort((a, b) => {
                    return a.order > b.order ? -1 : 1;
                });
                
                let seo = {
                    title: '',
                    description: '',
                    keyWords: '',
                };
                
                if (this.props.teachingpage.seo) seo = this.props.teachingpage.seo;

                this.setState({
                    seo,
                    teachings,
                    teachingpage,
                    teachingpageOrigin: teachingpage
                });
            }
        });
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.lang !== prevProps.lang) {
            this.setState({lang: this.props.lang});
        }
        if (!isEqual(this.props.teachingpage.teachings, prevProps.teachingpage.teachings)) {
            teachingpage = this.props.teachingpage.teachings;
                const teachings = [];
                Object.keys(teachingpage).map((key) => {
                    const keyedTeach = {id: String(key), ...teachingpage[key]};
                    teachings.push(keyedTeach);
                });
            
                teachings.sort((a, b) => {
                    return a.order > b.order ? -1 : 1;
                });

                this.setState({
                    teachings,
                    teachingpage,
                    teachingpageOrigin: teachingpage
                });
        }
    }

    componentWillUnmount = () => {
        if (typeof(window) !== "undefined") {
            window.removeEventListener('scroll', this.handleScroll);
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
        this.props.startEditTeachingPageSeo(seo);
        this.onToggleSeo();
    }
    
    
    
    setIsVisibleTeach = (e) => {
        const id = e.target.dataset.id;
        const isVisible = e.target.dataset.visible;
        const teachings = this.state.teachings;
        const teachIndex = teachings.findIndex(t => t.id === id);
        const updatedTeach = teachings[teachIndex];
        teachings[teachIndex].visible = isVisible;
        this.setState({
            teachings
        });
        updatedTeach.visible = isVisible;
        this.props.startShowTeach(updatedTeach);
    }
    
    setIsEditTeach = (e) => {
        const id = e.target.dataset.id;
        const teachings = this.state.teachings;
        const teachIndex = teachings.findIndex(t => t.id === id);
        const selectedTeach = JSON.parse(JSON.stringify(teachings[teachIndex]));
        this.setState({
            selectedTeach
        });
        this.onToggleEditTeach();
    }
    
    onToggleEditTeach = () => {
        
        if (this.state.editTeachModalIsOpen) {
            this.setState({
                selectedTeach: {
                    details: '',
                    description: ''
                }
            });
        }
        
        this.setState({
            editTeachModalIsOpen: !this.state.editTeachModalIsOpen
        });
    }

    uploadWidget = (event) => {
        
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
                // console.log(event);
                if (error) {
                    // console.log(error);
                }
                if (result.event === "success") {
                    const image = {
                        publicId: result.info.public_id,
                        src: result.info.secure_url,
                        width: result.info.width,
                        height: result.info.height
                    };
                    
                    const selectedTeach = this.state.selectedTeach;
                    const currentTeachImage = selectedTeach.image;
                    selectedTeach.image = image;
                        
                    this.setState({
                        selectedTeach
                    });
                    
                    const event = {
                        target: {
                            dataset: {
                                id: selectedTeach.id
                            }
                        }
                    }
                    
                    if (currentTeachImage && currentTeachImage.publicId) {
                        this.saveTeachImage(event, currentTeachImage.publicId);
                    } else {
                        this.saveTeach(event);
                    }
                    
                    myUploadWidget.close();
                }
            }
        );
        myUploadWidget.open();
    }

    onItemOrderBlur = (e) => {
        const teachings = this.state.teachings;
        let newOrder = e.target.value;
        
        if (newOrder > teachings.length) {
            newOrder = teachings.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        
        const oldOrder = teachings.length - Number(e.target.dataset.index);
        
        console.log('newOrder', newOrder);
        console.log('oldOrder', oldOrder);
        const id = e.target.dataset.id;
        
        console.log('id -', id);
        
        if ( Number(newOrder) > Number(oldOrder) ) {
            for (let i = 0; i < teachings.length; i++) {
                if (id !== teachings[i].id) {
                    console.log('1teachings[i].id -', teachings[i].id);
                    if (teachings[i].order <= newOrder && teachings[i].order > oldOrder) {
                        teachings[i].order = teachings[i].order-1;
                    }
                }
            }
        } else if ( Number(newOrder) < Number(oldOrder) ) {
            for (let i = 0; i < teachings.length; i++) {
                if (id !== teachings[i].id) {
                    console.log('2teachings[i].id -', teachings[i].id);
                    if (teachings[i].order < oldOrder && teachings[i].order >= newOrder) {
                        teachings[i].order = Number(teachings[i].order)+1;
                    }
                }
            }
        }
        teachings.sort((a, b) => {
            return a.order > b.order ? -1 : 1;
        });
        
        const fbTeachings = {};
        
        teachings.map(teach => {
            console.log(teach.id);
            fbTeachings[teach.id] = teach;
        });
        console.log(fbTeachings);
        this.props.startUpdateTeachings(fbTeachings, teachings).then(res => {
            this.setState({
                teachings
            });
        })

        
        // if (typeof(window) !== "undefined") {
        //     if(isEqual(this.state.categoryOrigin, this.state.category) && isEqual(this.state.subCategoriesOrigin, this.state.subCategories) && isEqual(itemsCurrent, this.state.itemsCurrentOrigin)){ 
        //         window.removeEventListener("beforeunload", this.unloadFunc);
        //     } else {
        //         window.addEventListener("beforeunload", this.unloadFunc);
        //     }
        // }
    }

    onItemOrderChange = (e) => {
        
        const teachings = this.state.teachings;
        const index = e.target.dataset.index;
        console.log('index', index);
        let newOrder = e.target.value;
        if (newOrder > teachings.length) {
            newOrder = teachings.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        console.log('teachings', teachings);
        teachings[index].order = Number(newOrder);
        
        this.setState({
            teachings
        });
    }

    onItemOrderKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onItemOrderBlur(e);
        }
    }

    render() {
        return (
            <div className="container-fluid">


                <Helmet>
                    <title>{this.state.seo && this.state.seo.title}</title>
                </Helmet>
                
                { 
                    this.props.isAuthenticated === true ? 
                        <Modal open={this.state.seoModalIsOpen} onClose={this.onToggleSeo} center dir="rtl">
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
                                <Button bsStyle="success" onClick={this.updateSeo}>עדכון</Button>
                            </div>
                        </Modal>
                    :
                        null
                }
                
                
                { 
                    this.props.isAuthenticated === true ? 
                        <Modal
                            open={this.state.editTeachModalIsOpen}
                            onClose={this.onToggleEditTeach}
                            center
                            classNames={{modal: 'backoffice__modal'}}
                        >
                            <div className="backoffice__seo__modal">
                                <Teach
                                    lang={this.props.lang}
                                    isEdit={true}
                                    isAuthenticated={this.props.isAuthenticated}
                                    teach={this.state.selectedTeach}
                                    saveTeach={this.saveTeach}
                                    setData={this.setData}
                                    uploadWidget={this.uploadWidget}
                                />
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
                            
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--exit" style={this.props.lang === 'en' ? {textAlign: 'center', left: '90%'} : {textAlign: 'center', left: '10%'}}>
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
                            this.props.isAuthenticated && !this.state.editTeachModalIsOpen && !this.state.isEdit ?
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--save-project" style={this.props.lang === 'en' ? {textAlign: 'center', left: '85%'} : {textAlign: 'center', left: '15%'}}>
                                    <div className="backoffice__toolbar__label" style={{color: this.state.needSave ? 'red' : 'aqua'}}>
                                        {`${this.props.lang === 'en' ? 'Add' : 'הוספה'}`}
                                    </div>
                                    <button className="backoffice_button" onClick={this.onToggleEditTeach}>
                                        <img
                                            className="backoffice__events__events__add__icon"
                                            src="/images/eventspage/add-eventSubcategory-icon.svg"
                                            alt="תמונה"
                                        />
                                    </button>
                                </div>
                            :
                                null
                        }
                        
                        {
                            this.props.isAuthenticated ?
                                <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--save-project" style={this.props.lang === 'en' ? {textAlign: 'center', left: '80%'} : {textAlign: 'center', left: '20%'}}>
                                    <div className="backoffice__toolbar__label" style={{color: this.state.needSave ? 'red' : 'aqua'}}>
                                        {`${this.props.lang === 'en' ? 'SEO' : 'קידום'}`}
                                    </div>
                                    <button className="backoffice_button" onClick={this.onToggleSeo}>
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
                            <h1 className="page__header">{this.props.lang === 'en' ? 'Teaching' : 'הוראה'}</h1>
                        </div>
            
                            
                        {
                            this.state.teachings &&
                            this.state.teachings.map((teach, index) => {
                                return (
                                    <Teach
                                        lang={this.props.lang}
                                        index={index}
                                        key={index}
                                        onItemOrderChange={this.onItemOrderChange}
                                        onItemOrderKeyPress={this.onItemOrderKeyPress}
                                        onItemOrderBlur={this.onItemOrderBlur}
                                        setIsEditTeach={this.setIsEditTeach}
                                        setIsVisibleTeach={this.setIsVisibleTeach}
                                        deleteTeach={this.deleteTeach}
                                        isAuthenticated={this.props.isAuthenticated}
                                        teach={teach} 
                                    />
                                )
                            })
                        }
                        
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
    teachingpage: state.teachingpage,
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startSetTeachingPage: () => dispatch(startSetTeachingPage()),
    startEditTeachingPageSeo: (seo) => dispatch(startEditTeachingPageSeo(seo)),
    startAddTeach: (teach, order) => dispatch(startAddTeach(teach, order)),
    startUpdateTeach: (teach) => dispatch(startUpdateTeach(teach)),
    startUpdateTeachImage: (teach, publicid) => dispatch(startUpdateTeachImage(teach, publicid)),
    startUpdateTeachings: (fbTeachings, teachings) => dispatch(startUpdateTeachings(fbTeachings, teachings)),
    startShowTeach: (teach) => dispatch(startShowTeach(teach)),
    startDeleteTeach: (teach) => dispatch(startDeleteTeach(teach)),
    setLanguage: (lang) => dispatch(setLanguage(lang))
});

export default connect(mapStateToProps, mapDispatchToProps)(TeachingPage);  