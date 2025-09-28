import React from 'react';
import Modal from 'react-responsive-modal';
import {Helmet} from 'react-helmet';
import AutosizeInput from 'react-input-autosize';
import Button from 'react-bootstrap/lib/Button';
import PointTest from './PointTest';
import DomPopup from './DomPopup';
//online version
import MapViewTest from './MapViewTest';
//offline version
//import LayerSaveTest from './LayerSaveTest';

import SideBar from './SideBar';
//import BuildingTest from './BuildingTest';
import Footer from '../components/common/Footer';
import Navigation from '../components/common/Navigation';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { startAddPoint, startEditProject } from '../actions/points';
import isEqual from 'lodash.isequal';
import { setLanguage } from "redux-i18n";
import ProjectDetailsPage from './ProjectDetailsPage';
import {
    startAddCategory,
    startEditCategories,
    startToggleShowCategory,
} from '../actions/categories';

// import ReactGA from 'react-ga';
// function initializeReactGA(url) {
//     ReactGA.initialize('UA-128960221-1');
//     ReactGA.pageview(url);
// }
// initializeReactGA();


let categoryColorsHEX = ['#409191', '#c1617e', '#5eae88', '#a6c98d', '#db8976', '#e8e2a4', '#e5b682']
let categoryColorsRGBOpacity = 1;
let categoryColorsRGB = [[64,145,145,categoryColorsRGBOpacity], [193,97,126,categoryColorsRGBOpacity], [94,174,136,categoryColorsRGBOpacity], [166,201,141,categoryColorsRGBOpacity], [219,137,118,categoryColorsRGBOpacity], [232,226,164,categoryColorsRGBOpacity], [229,182,130,categoryColorsRGBOpacity]];

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
            table: [],
            needSave: false,
            hideCategoriesEditPanel: true,
            editCategoriesModalIsOpen: false,
            newCategoryNameModalIsOpen: false,
            newCategoryName: '',
            newCategoryNameHebrew: '',
            categories: this.props.categories,
            cursor: 'default',
            lang: 'en',
            categoryColors: [],
            openCategories: []
        }
    }

    setData = (e) => {
		const { value, dataset } = e.target;
		const { name, index, action } = dataset;
		const selectedProject = JSON.parse(JSON.stringify(this.state.selectedProject));
        switch (action) {
			case "setString":
                if(name === 'categories') {
                    selectedProject[name] = value;
                    break;
                }
                
                if(name === 'tableOptions') {
                    selectedProject.extendedContent[name] = value;
                    break;
                }
                
                if(name === 'image') {
                    selectedProject.extendedContent[name] = value;
                    selectedProject.content = `<img src='${value}' />${selectedProject.extendedContent.content}`;
                    selectedProject.contentHebrew = `<img src='${value}' />${selectedProject.extendedContent.contentHebrew}`;
                    break;
                }
                
                if(name === 'title') {
                    if (this.props.lang === 'en') {
                        selectedProject[name] = value;
                        selectedProject.extendedContent[name] = value;
                    } else {
                        selectedProject[name+'Hebrew'] = value;
                        selectedProject.extendedContent[name+'Hebrew'] = value;
                    }
                    break;
                }
                
                if(name === 'content') {
                    if (this.props.lang === 'en') {
                        selectedProject[name] = `<img src='${selectedProject.extendedContent.image}' />${value}`;
                        selectedProject.extendedContent[name] = value;
                    } else {
                        selectedProject[name+'Hebrew'] = `<img src='${selectedProject.extendedContent.image}' />${value}`;
                        selectedProject.extendedContent[name+'Hebrew'] = value;
                    }
                    break;
                }
                
                if (this.props.lang === 'en') {
                    selectedProject.extendedContent[name] = value;
                } else {
                    selectedProject.extendedContent[name+'Hebrew'] = value;
                }
                
                break;
			default:
				break;
        };

        this.setState({
            selectedProject,
            needSave: true
        });
    }

    unloadFunc = (e) => {
        var confirmationMessage = "o/";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }

    // update database

    onUpdateProject = () => {
        const project = JSON.parse(JSON.stringify(this.state.selectedProject));
        this.props.startEditProject({
            project: project
        });
        
        this.setState(() => ({ projectOrigin: project, needSave: false }));
        // if (typeof(window) !== "undefined") {
        //     window.removeEventListener("beforeunload", this.unloadFunc);
        // }
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
                    };
                        
                    let e = {
                        target: {
                            value: image.src,
                            dataset: {
                                action: 'setString',
                                name: 'image'
                            }
                        }
                    }
                    this.setData(e);
                    myUploadWidget.close();
                }
            }
        );
        myUploadWidget.open();
    }

    setUrlLang = () => {
        if (this.props.urlLang !== undefined && this.props.lang !== this.props.urlLang) {
            this.props.setLanguage(this.props.urlLang);
        }
    }

    componentDidMount = () => {
        //console.log('categories', this.props.categories);
        if(this.props.categories) {
            let categoryColors = [];
            this.props.categories.map((category, index) => {
                categoryColors.push({
                    color: categoryColorsRGB[index],
                    colorHex: categoryColorsHEX[index],
                    id: category.id
                });
            })
            this.setState({categoryColors})
        }
        this.setUrlLang();
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.lang !== prevProps.lang) {
            this.setState({lang: this.props.lang});
        }
        if (!isEqual(this.props.categories, prevProps.categories)) {
            this.setState({categories: this.props.categories});
        }
        if (this.state.selectedProject && !isEqual(this.state.selectedProject, prevState.selectedProject) && this.state.selectedProject.extendedContent && this.state.selectedProject.extendedContent.table) {
            let tableArray = [];
            for (var key in this.state.selectedProject.extendedContent.table) {
                
                let categoryObject = this.state.selectedProject.extendedContent.table[key];
                let category = {
                    color: categoryObject.color,
                    name: categoryObject.name,
                    subcategories: []
                };
                let subcategories = categoryObject.categories;
                for (var key1 in subcategories) {
                    let subcategoryObject = subcategories[key1];
                    let subcategory = {
                        name: subcategoryObject.name,
                        options: []
                    };
                    let options = subcategoryObject.options;
                    for (var key2 in options) {
                        let optionObject = options[key2];
                        subcategory.options.push(optionObject);
                    }
                    category.subcategories.push(subcategory);
                }
                tableArray.push(category);
            }
            if ( !isEqual(tableArray, this.state.table)) {
                this.setState({table: tableArray});
            }
        }
    }
    
    addPoint = (point) => {
        this.setState({
            allowAddPoint: false,
            cursor: 'default'
        });
        return this.props.startAddPoint(point).then(res => {
            return res;
        });
        
    }
    
    allowAddPoint = () => {
        this.setState({
            allowAddPoint: !this.state.allowAddPoint,
            cursor: this.state.cursor === 'crosshair' ? 'default' : 'crosshair'
        });
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
        //console.log('in selectedProject', selectedProject);
        // this.setState({
        //     selectedProject: selectedProject
        // })
    }
        
    // handle category functions
    
    startEditCategory = () => {
        if (this.state.hideCategoriesEditPanel) {
            this.hideProject();
        }
        // this.setState({
        //     hideCategoriesEditPanel: !this.state.hideCategoriesEditPanel
        // });
        this.setState({
            editCategoriesModalIsOpen: !this.state.editCategoriesModalIsOpen,
            newCategoryNameModalIsOpen: false
        });
    }
    
    toggleShowCategory = (e) => {
        const categoryId = e.target.dataset.id;
        let visible = null;
        if (e.target.dataset.visible === "true") {
            visible = false;
        } else {
            visible = true;
        }
        this.props.startToggleShowCategory(categoryId, visible).then((res) => {
            this.setState({
                categories: this.props.categories
            });
        });
    }
    
    onCategoryOrderChange = (e) => {
        const categories = this.state.categories;
        const categoryId = e.target.dataset.id;
        let categoryIndex = null;
        categories.map((category, index) => {
            if (category.id === categoryId) categoryIndex = index;
        })
        let newOrder = e.target.value;
        if (newOrder > categories.length) newOrder = categories.length;
        if (newOrder < 1) newOrder = 1;
        categories[categoryIndex].order = Number(newOrder);
        this.setState({
            categories
        });
    }
    
    onCategoryOrderBlur = (e) => {
        const categories = this.state.categories;
        //const categoryId = e.target.dataset.id;
        let newOrder = e.target.value;
        if (newOrder > categories.length) {
            newOrder = categories.length;
        }
        if (newOrder < 1) {
            newOrder = 1;
        }
        const oldOrder = Number(e.target.dataset.index)+1;
        const id = e.target.dataset.id;
        if ( Number(newOrder) > Number(oldOrder) ) {
            for (let i = 0; i < categories.length; i++) {
                if (id !== categories[i].id) {
                    if (categories[i].order <= newOrder && categories[i].order > oldOrder) {
                        categories[i].order = categories[i].order-1;
                    }
                }
            }
        } else if ( Number(newOrder) < Number(oldOrder) ) {
            for (let i = 0; i < categories.length; i++) {
                
                if (id !== categories[i].id) {
                    if (categories[i].order < oldOrder && categories[i].order >= newOrder) {
                        categories[i].order = Number(categories[i].order)+1;
                    }
                }
            }
        }
        categories.sort((a, b) => {
            return a.order > b.order ? 1 : -1;
        });
        this.setState({
            categories
        });
    }
    
    onCategoryOrderKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onCategoryOrderBlur(e);
        }
    }
    
    onCategoryNameChange = (e) => {
        const index = e.target.dataset.index;
        const lang = e.target.dataset.lang;
        const categoryNewName = e.target.value;
        const categories = this.state.categories;
        if (lang === 'en') {
            categories[index].name = categoryNewName;
        } else {
            categories[index].nameHebrew = categoryNewName;
        }
        
        this.setState({
            categories
        });
    }

    onCategoryNameBlur = (e) => {
        let nameFlag = false;
        let oldName = '';
        const categories = this.state.categories;
        const categoryNewName = e.target.value;
        const categoryId = e.target.dataset.id;
        const lang = e.target.dataset.lang;
        categories.map((category, index) => {
            if (category.id === categoryId) {
                if (lang === 'en') {
                    oldName = category.name;
                } else {
                    oldName = category.nameHebrew;
                }
                
            }
        })
        categories.map((category, index) => {
            if (lang === 'en') {
                if (category.name === categoryNewName && category.id !== categoryId) {
                    nameFlag = true;
                }
            } else {
                if (category.nameHebrew === categoryNewName && category.id !== categoryId) {
                    nameFlag = true;
                }
            }
        })
        if (nameFlag === true) {
            alert("שם קטגוריה קיים במערכת");
            e.target.value = oldName;
            categories.map((category, index) => {
                if (category.id === categoryId) {
                    if (lang === 'en') {
                        categories[index].name = oldName;
                    } else {
                        categories[index].nameHebrew = oldName;
                    }
                    
                    this.setState({
                        categories
                    });
                }
            })
        }
    }
    
    updateCategories = () => {
        const categories = this.state.categories;
        const fbCategories = {};
        categories.map((category, index) => {
            fbCategories[category.id] = category;
        })
        this.props.startEditCategories(fbCategories, categories);

        this.setState({
            categoriesOrigin: categories
        });
        // if (typeof(window) !== "undefined") {
        //     if(isEqual(this.state.categoryOrigin, this.state.category) && isEqual(this.state.itemsCurrentCheck, this.state.itemsCurrentOrigin)){ 
        //         window.removeEventListener("beforeunload", this.unloadFunc);
        //     } else {
        //         window.addEventListener("beforeunload", this.unloadFunc);
        //     }
        // }
    }
    
    addNewCategory = () => {
        let nameFlag = false;
        this.props.categories && this.props.categories.map((category, index) => {
            if(category.name === this.state.newCategoryName) {
                nameFlag = true;
            }
        })

        if(nameFlag === true) {
            this.setState({
                newCategoryNameModalAlert: 'שם קטגוריה קיים במערכת'
            });
        } else if (this.state.newCategoryName === '') {
            this.setState({
                newCategoryNameModalAlert: 'שם קטגוריה חייב לכלול אות אחת לפחות'
            });
        } else {
            const name = this.state.newCategoryName;
            const nameHebrew = this.state.newCategoryName;
            const order = this.props.categories ? this.props.categories.length+1 : 1;
            const category = {
                name,
                nameHebrew,
                order,
                isVisible: false,
                type: 'category'
            };
            this.props.startAddCategory(category, order).then((categories)=> {
                //this.getAllData(categoryId, categoryId);
                //console.log('categories', categories);
                this.setState({
                    newCategoryNameModalIsOpen: false,
                    newCategoryName: '',
                    newCategoryNameHebrew: ''
                });
            });
        }
        
    }

    onNewCategoryNameChange = (e) => {
        const newCategoryName = e.target.value;
        this.setState({
            newCategoryName
        });
    }

    onToggleNewCategoryName = () => {
        if (this.state.hideCategoriesEditPanel) {
            this.hideProject();
        }
        this.setState({
            newCategoryNameModalIsOpen: !this.state.newCategoryNameModalIsOpen,
            editCategoriesModalIsOpen: false
        });
    }
    
    onToggleEditCategories = () => {
        if (this.state.hideCategoriesEditPanel) {
            this.hideProject();
        }
        this.setState({
            editCategoriesModalIsOpen: !this.state.editCategoriesModalIsOpen,
            newCategoryNameModalIsOpen: false
        });
    }
    
    setOpenCategories = (openCategories) => {
        //console.log('openCategories - homepage', openCategories);
        this.setState({
            openCategories: openCategories
        });
    }
    

    render() {
        console.log('change 3');
        return (
            <div className="container-fluid" style={{cursor: this.state.cursor, textAlign: this.props.lang === 'en' ? 'left' : 'right'}}>
                
                <Modal
                    open={this.state.editCategoriesModalIsOpen}
                    onClose={this.onToggleEditCategories}
                    center
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal',
                        closeButton: 'custom-close-button'                     
                    }}
                >
                    <div className="backoffice__edit__navigation__box">
                            {
                                this.state.categories && this.state.categories.length > 0 ?
                                    this.state.categories.map((category, index) => {
                                        return  <div className="backoffice__edit__events__tabs__in__box" key={index + category.id} dir="rtl">
                                                    <Button
                                                        id="btn-show"
                                                        data-id={category.id}
                                                        data-visible={category.isVisible}
                                                        className={`backoffice__events__tabs__remove${category.isVisible === true ? ' btn-success' : ' btn-danger'}`}
                                                        onClick={this.toggleShowCategory}
                                                    >
                                                        <img
                                                            data-id={category.id}
                                                            data-visible={category.isVisible}
                                                            className="backoffice__show__icon"
                                                            src={`/images/backoffice/${category.isVisible === true ? 'show' : 'hide'}.svg`}
                                                            alt={category.isVisible === true ? 'הצג' : 'הסתר'}
                                                        />
                                                    </Button>
                                                    <div className="backoffice__events__tabs__order__box">
                                                        <input
                                                            id="number"
                                                            data-id={category.id}
                                                            type="number"
                                                            value={category.order || 0}
                                                            data-index={index}
                                                            onChange={this.onCategoryOrderChange}
                                                            onKeyPress={this.onCategoryOrderKeyPress}
                                                            onBlur={this.onCategoryOrderBlur}
                                                        />
                                                    </div>
                                                    <div className="backoffice__category__name__box">
                                                        <input
                                                            data-id={category.id}
                                                            data-index={index}
                                                            data-lang={'he'}
                                                            className="backoffice__category__name"
                                                            type="text"
                                                            placeholder="שם הקטגוריה"
                                                            value={category.nameHebrew}
                                                            onChange={this.onCategoryNameChange}
                                                            onBlur={this.onCategoryNameBlur}
                                                        />
                                                    </div>
                                                    <div className="backoffice__category__name__box">
                                                        <input
                                                            data-id={category.id}
                                                            data-index={index}
                                                            data-lang={'en'}
                                                            className="backoffice__category__name"
                                                            type="text"
                                                            placeholder="Category Name"
                                                            value={category.name}
                                                            onChange={this.onCategoryNameChange}
                                                            onBlur={this.onCategoryNameBlur}
                                                            dir='ltr'
                                                        />
                                                    </div>
                                                </div>
                                    })
                                    
                                :
                                    null
                            }
                            <div className="backoffice__events__tabs__update__box">
                                <Button className="backoffice__events__tabs__update btn-success" onClick={this.updateCategories}>עדכון</Button>
                            </div>
                        </div>
                </Modal>
                
                <Modal
                    open={this.state.newCategoryNameModalIsOpen}
                    onClose={this.onToggleNewCategoryName}
                    center
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal',
                        closeButton: 'custom-close-button'                     
                    }}
                >
                    <h2 className="Heebo-Medium">הוספת קטגוריה חדשה</h2>
                    <h4 className="Heebo-Regular">נא למלא שם לקטגוריה החדשה</h4>
                    <h4 className="Heebo-Regular">{this.state.newCategoryNameModalAlert}</h4>
                    <div dir="rtl" style={{marginTop: '2rem', paddingBottom: '2rem'}}>
                        
                        <input
                            width={'120px'}
                            className="backoffice__category__name"
                            type="text"
                            placeholder="שם הקטגוריה"
                            value={this.state.newCategoryName}
                            onChange={this.onNewCategoryNameChange}
                        />
                        <Button bsStyle="success" onClick={this.addNewCategory}>המשך</Button>
                    </div>
                </Modal>

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
                    categories={null}
                />
                {
                    this.props.isAuthenticated ?
                    
                        <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--exit" style={this.props.lang === 'en' ? {textAlign: 'center', left: '90%'} : {textAlign: 'center', left: '10%'}}>{/* $( window ).width() / 2 - 85 */}
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
                    this.props.isAuthenticated && this.state.selectedProject ?
                        <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--save-project" style={this.props.lang === 'en' ? {textAlign: 'center', left: '83%'} : {textAlign: 'center', left: '17%'}}>{/* $( window ).width() / 2 - 85 */}
                            <div className="backoffice__toolbar__label" style={{textAlign: 'center', color: this.state.needSave ? 'red' : 'aqua'}}>
                                {`${this.props.lang === 'en' ? 'Save' : 'שמירה'}`}
                            </div>
                            <button className="backoffice_button" onClick={this.onUpdateProject}>
                                <img className="backoffice_icon" src="/images/backoffice/save.svg" alt="שמירה" />
                            </button>
                        </div>
                    :
                        null
                }
                
                {
                    this.props.isAuthenticated && !this.state.selectedProject ?
                        <div className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--add-project" style={this.props.lang === 'en' ? {textAlign: 'center', left: '83%'} : {textAlign: 'center', left: '17%'}}>{/* $( window ).width() / 2 - 85 */}
                            <div className="backoffice__toolbar__label" style={{width: '7rem', textAlign: 'center', color: this.state.allowAddPoint ? 'red' : 'aqua'}}>
                                {`${this.props.lang === 'en' ? 'Add project' : 'הוספת פרוייקט'}`}
                            </div>
                            <button className="backoffice_button" onClick={this.allowAddPoint}>
                                <img className="backoffice_icon" src="/images/eventspage/add-eventSubcategory-icon.svg" alt="הוספת פרוייקט" />
                            </button>
                        </div>
                    :
                        null
                }
                
                
                {this.props.isAuthenticated ? 
                (
                    <div className="backoffice__nav__toolbar__buttons" style={this.props.lang === 'en' ? {textAlign: 'center', left: '76%'} : {textAlign: 'center', left: '24%'}}>
                        <div className="backoffice__toolbar__label" style={this.props.lang === 'en' ? {paddingLeft: '6px', textAlign: 'center'} : {textAlign: 'center'}}>
                            {`${this.props.lang === 'en' ? 'Manage categories' : 'ניהול קטגוריות'}`}
                        </div>
                        <div style={{
                            position: 'relative',
                            width: '7rem',
                            height: '3rem',
                            display: 'inline-block'
                        }}>
                            <button
                                className="backoffice__add__button"
                                onClick={
                                    this.onToggleNewCategoryName
                                }
                            >
                                <img
                                    className="backoffice__add__icon"
                                    src="/images/eventspage/add-eventSubcategory-icon.svg"
                                    alt="הוספת קטגוריה"
                                />
                            </button>
                            <button
                                className="backoffice__edit__button"
                                onClick={
                                    this.startEditCategory
                                }
                            >
                                <img
                                    className="backoffice__edit__icon"
                                    src="/images/backoffice/edit.svg"
                                    alt="עריכה"
                                />
                            </button>
                        </div>
                    </div>
                ) : null}
                
                
                
                <div style={ $( window ).width() < 768 ? 
                                {
                                    display: 'flex',
                                    flexDirection: 'column-reverse'
                                }
                            :
                                {
                                    display: 'flex',
                                    flexDirection: this.props.lang === 'en' ? 'row' : 'row-reverse'
                                }
                            }
                >
                
                    <SideBar
                        sidebarClickedItemId={this.state.sidebarClickedItemId}
                        handleSideBarClick={this.handleSideBarClick}
                        categories={this.state.categories}
                        points={this.props.points}
                        isAuthenticated={this.props.isAuthenticated}
                        lang={this.props.lang}
                        categoryColors={this.state.categoryColors}
                        setOpenCategories={this.setOpenCategories}
                    />
                    
                    {
                        this.state.selectedProject ?
                            <div
                                className={`homepage__project__details__container${this.props.lang === 'en' ? ' homepage__project__details__container--en' : ' homepage__project__details__container--he'}`}
                                style={ 
                                    $( window ).width() < 768 ? 
                                    {
                                        height: 'auto',
                                        width: '100%',
                                        
                                    }
                                    :
                                    { 
                                        height: this.props.lang === 'en' ? $( window ).height() - 60 : $( window ).height() - 65,
                                        width: $( window ).width() - 170
                                    }
                                }
                            >
                                <ProjectDetailsPage
                                    hideProject={this.hideProject}
                                    categories={this.state.categories}
                                    table={this.state.table}
                                    tableTemplate={this.props.tableTemplate}
                                    selectedProject={this.state.selectedProject}
                                    isAuthenticated={this.props.isAuthenticated}
                                    onChange={this.setData}
                                    uploadWidget={this.uploadWidget}
                                    lang={this.props.lang}
                                    categoryColors={this.state.categoryColors}
                                />
                            </div>
                        :
                            null
                    }
                    
                    <div
                        dir={this.state.lang === 'en' ? 'ltr' : 'rtl'}
                        style={
                            $( window ).width() < 768 ? 
                            { 
                                height: 'auto',
                                width: '100%'
                            }
                            :
                            { 
                                float: this.props.lang === 'en' ? 'right' : 'left',
                                display: 'inline-block',
                                height: this.props.lang === 'en' ? 
                                            $( window ).height() - 60 
                                        : 
                                            $( window ).height() - 60, 
                                width: $( window ).width() - 170 
                            }
                        }
                    >
                        <MapViewTest
                            categories={this.props.categories}
                            sidebarClickedItemId={this.state.sidebarClickedItemId}
                            points={this.state.points}
                            addPoint={this.addPoint}
                            allowAddPoint={this.state.allowAddPoint}
                            selectedProject={this.state.selectedProject}
                            setSelectedProject={this.setSelectedProject}
                            handleExpandProject={this.handleExpandProject}
                            lang={this.props.lang}
                            categoryColors={this.state.categoryColors}
                            openCategories={this.state.openCategories}
                        />
                    </div>
                </div>
                
                <Footer lang={this.props.lang} position="absolute" />
            </div>
        );
    }
} 


const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    categories: state.categories,
    points: state.points,
    tableTemplate: state.tableTemplate,
    homepage: state.homepage,
    navigation: state.navigation,
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    setLanguage: (lang) => dispatch(setLanguage(lang)),
    startAddPoint: (point) => dispatch(startAddPoint(point)),
    startEditProject: (project) => dispatch(startEditProject(project)),
    startToggleShowCategory: (categoryId, visible) => dispatch(startToggleShowCategory(categoryId, visible)),
    startEditCategories: (fbCategories, categories) => dispatch(startEditCategories(fbCategories, categories)),
    startAddCategory: (category) => dispatch(startAddCategory(category))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);




// <AutosizeInput
//                             width={'120px'}
//                             className="backoffice__category__name"
//                             type="text"
//                             placeholder="שם הקטגוריה"
//                             value={this.state.newCategoryName}
//                             onChange={this.onNewCategoryNameChange}
//                         />






// <AutosizeInput
//                                                         data-id={category.id}
//                                                         data-index={index}
//                                                         className="events__tabs__button"
//                                                         type="text"
//                                                         placeholder="שם תת קטגוריה"
//                                                         value={category.name}
//                                                         onChange={this.onCategoryNameChange}
//                                                         onBlur={this.onCategoryNameBlur}
//                                                     />