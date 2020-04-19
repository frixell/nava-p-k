import React from 'react';
import isEqual from 'lodash.isequal';
import { addQuarters } from 'date-fns';

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
                style={{
                    height: this.props.lang === 'en' ? $( window ).height() - 60 : $( window ).height() - 70
                }}
            >
                {
                    this.state.categories.map((category, index) => {
                        //console.log('this.props.categoryColors', this.props.categoryColors);
                        return (
                            <div hidden={!category.isVisible && !this.props.isAuthenticated} key={index}>
                                <div
                                    onClick={this.handleSideBarCategoryClick}
                                    data-id={category.id}
                                    className={`sidebar__listCategory${this.props.lang === 'en' ? ' sidebar__listCategory--en' : ' sidebar__listCategory--he'}`}
                                    style={{color: this.props.categoryColors[index].colorHex}}
                               >
                                    <div
                                        className={`sidebar__arrow${this.props.lang === 'en' ? ' sidebar__arrow--en' : ' sidebar__arrow--he'}${this.state.openCategories.includes(category.id) ? ' sidebar__arrow--open' : ''}`} 
                                    /> {this.props.lang === 'en' ? category.name : category.nameHebrew}
                                </div>
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
        );
    }
} 

export default SideBar;