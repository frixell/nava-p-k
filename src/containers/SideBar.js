import React from 'react';
import isEqual from 'lodash.isequal';
import { addQuarters } from 'date-fns';

var windowWidth   = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;
var windowHeight   = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight;
class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false,
            openCategories: [],
            categories: [],
            points: [],
            lang: 'en'
        }
    }
    
    componentDidMount = () => {
        this.setState({
            categories: this.props.categories,
            points: this.props.points,
            lang: this.props.lang
        });
    }
    
    componentDidUpdate = (prevProps) => {
        if (!isEqual(this.props.points, prevProps.points) || !isEqual(this.props.categories, prevProps.categories || this.props.lang !== prevProps.lang)) {
            this.setState({
                categories: this.props.categories,
                points: this.props.points,
                lang: this.props.lang
            });
        }
    }
    
    handleSideBarCategoryClick = (e) => {
        let id = e.target.dataset.id;
        //console.log('id', id);
        const openCategories = this.state.openCategories;
        if ( openCategories.includes(id) ) {
            openCategories.splice(openCategories.indexOf(id), 1);
        } else {
            openCategories.push(id);
        }
        this.setState({openCategories});
        //console.log('openCategories - sidebar', openCategories);
        this.props.setOpenCategories(openCategories);
    }
    
    render() {
        let hasUnconectedProjects = false;
        this.props.points.map((point, index) => {
            if( !point.categories || point.categories.length === 0) {
                hasUnconectedProjects = true;
            }
        })
        return (
            <div
                className="homepage__sidebar__container"
                style={ windowWidth < 768 ? 
                    {
                        height: 'auto',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column-reverse'
                    }
                    :
                    {
                        height: this.props.lang === 'en' ? windowHeight - 60 : windowHeight - 70,
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }
            >
                <div
                    style={ windowWidth < 768 ? 
                        {
                            display: 'flex',
                            flexDirection: this.props.lang === 'en' ? 'row' : 'row-reverse',
                            paddingTop: '20px'
                        }
                        :
                        {
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }
                >
                    <div className="sidebar__image__box">
                        <img className={this.props.lang === 'en' ? " sidebar__image--en" : " sidebar__image--he"} src="https://res.cloudinary.com/dewafmxth/image/upload/v1587375229/nava_ky02kt.jpg" />
                    </div>
                    <div>
                        <div className={`sidebar__text__box${this.props.lang === 'en' ? " sidebar__text__box--en" : " sidebar__text__box--he"}`}>
                            {this.props.lang === 'en' ?
                                    'Urban regeneration comparative global case studies' 
                                : 
                                    'התחדשות ערונית מקרי מחקר השוואתי גלובלי'
                                
                            }
                        </div>
                        <div
                            className={`mobile sidebar__text__box${this.props.lang === 'en' ? " sidebar__text__box--en" : " sidebar__text__box--he"}`}
                            style={{paddingTop: '3rem'}}
                        >
                            {this.props.lang === 'en' ?
                                    'New tool for comparative research' 
                                : 
                                    'כלי חדש למחקר השוואתי'
                                
                            }
                        </div>
                    </div>
                </div>
                <div
                    className="sidebar__categories__box"
                    style = {
                        windowWidth < 768 ? 
                        {
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: this.props.lang === 'en' ? 'row' : 'row-reverse',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: '7px',
                            marginBottom: '7px',
                            paddingRight: '1rem',
                            paddingLeft: '1rem'                        }
                        :
                        {
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }
                >
                    {
                        this.state.categories.map((category, index) => {
                            //console.log('this.props.categoryColors', this.props.categoryColors);
                            return (
                                <div
                                    hidden={!category.isVisible && !this.props.isAuthenticated}
                                    key={index}
                                    style={
                                        windowWidth < 768 ? 
                                        {
                                            margin: 3,
                                            padding: 2,
                                            width: this.state.openCategories.includes(category.id) ? '100%' : 'auto'
                                        }
                                        :
                                        {
                                            color: this.props.categoryColors[index].colorHex
                                        }
                                    }
                                >
                                    <div
                                        onClick={this.handleSideBarCategoryClick}
                                        data-id={category.id}
                                        className={`sidebar__listCategory${this.props.lang === 'en' ? ' sidebar__listCategory--en' : ' sidebar__listCategory--he'}`}
                                        style={
                                            windowWidth < 768 ? 
                                            {
                                                color: this.props.categoryColors[index].colorHex,
                                                border: `1px dotted ${this.props.categoryColors[index].colorHex}`,
                                                padding: 2,
                                                paddingRight: this.props.lang === 'en' ? '6px': '2px',
                                                paddingLeft: this.props.lang === 'en' ? '2px': '6px'
                                            }
                                            :
                                            {
                                                color: this.props.categoryColors[index].colorHex
                                            }
                                        }
                                >
                                        <div
                                            className={`sidebar__arrow${this.props.lang === 'en' ? ' sidebar__arrow--en' : ' sidebar__arrow--he'}${this.state.openCategories.includes(category.id) ? ' sidebar__arrow--open' : ''}`} 
                                        /> {this.props.lang === 'en' ? category.name : category.nameHebrew}
                                    </div>
                                    {
                                        this.state.openCategories.includes(category.id) ?
                                        <div>
                                        {
                                            this.state.openCategories.includes(category.id) && this.state.points.map((point, index) => {
                                                if ( point.categories && point.categories.includes(category.id) ) {
                                                    return (
                                                        <div
                                                            onClick={this.props.handleSideBarClick}
                                                            data-id={point.id}
                                                            className={`sidebar__listItem${this.props.lang === 'en' ? ' sidebar__listItem--en' : ' sidebar__listItem--he'}${this.props.sidebarClickedItemId === point.id ? ' sidebar__listCategory--selected' : ''}`}
                                                            key={index}
                                                            dir={this.props.lang === 'en' ? ' ltr' : 'rtl'}
                                                        >
                                                            - {this.props.lang === 'en' ? point.title : point.titleHebrew || point.title}
                                                        </div>
                                                    );
                                                }
                                                
                                            })
                                        }
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            );
                        })
                    }
                    {
                        this.props.isAuthenticated && hasUnconectedProjects ? 
                            <hr style={{width: '100%', marginTop: '30px', background: 'aqua'}} />
                        :
                            null
                    }
                    {
                        this.props.isAuthenticated && hasUnconectedProjects ? 
                            <div
                                className={`sidebar__listCategory${this.props.lang === 'en' ? ' sidebar__listCategory--en' : ' sidebar__listCategory--he'}`}
                                style={{marginTop: '10px'}}
                                onClick={this.handleSideBarCategoryClick}
                                data-id={'notConnectedProjects'}
                            >
                                <div
                                    className={`sidebar__arrow${this.props.lang === 'en' ? ' sidebar__arrow--en' : ' sidebar__arrow--he'}${this.state.openCategories.includes('notConnectedProjects') ? ' sidebar__arrow--open' : ''}`} 
                                /> {this.props.lang === 'en' ? ' Not Connected' : 'לא מחובר'}
                            </div>
                        :
                        null
                        
                    }
                    {
                        this.props.isAuthenticated && this.state.openCategories.includes('notConnectedProjects') &&  this.props.points.map((point, index) => {
                            if( !point.categories || point.categories.length === 0) {
                                return (
                                    <div
                                        onClick={this.props.handleSideBarClick}
                                        data-id={point.id}
                                        className={`sidebar__listItem${this.props.lang === 'en' ? ' sidebar__listItem--en' : ' sidebar__listItem--he'}${this.props.sidebarClickedItemId === point.id ? ' sidebar__listItem--selected' : ''}`}
                                        style={{color: 'aqua'}}
                                        key={index}
                                        dir={this.props.lang === 'en' ? ' ltr' : 'rtl'}
                                    >
                                        - {point.title}
                                    </div>
                                );
                            }
                            
                        })
                    }
                </div>
                <div className={`desktop sidebar__text__box${this.props.lang === 'en' ? " sidebar__text__box--en" : " sidebar__text__box--he"}`}>
                    {this.props.lang === 'en' ?
                            'New tool for comparative research' 
                        : 
                            'כלי חדש למחקר השוואתי'
                        
                    }
                </div>
            </div>
        );
    }
} 

export default SideBar;