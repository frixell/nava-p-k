import React from 'react';
import isEqual from 'lodash.isequal';
import { addQuarters } from 'date-fns';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false,
            openCategories: []
        }
    }
    
    componentDidUpdate = (prevProps) => {
        if (!isEqual(this.props.points, prevProps.points)) {
            //.log('change');
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
                    height: $( window ).height() - 60
                }}
            >
                {
                    this.props.categories.map((category, index) => {
                        return (
                            <div key={index}>
                                <div
                                    onClick={this.handleSideBarCategoryClick}
                                    data-id={category.id}
                                    className={`sidebar__listCategory${this.props.sidebarClickedCategoryId === category.id ? ' sidebar__listItem--selected' : ''}`}
                                    
                                >
                                    <div
                                        className={`sidebar__arrow${this.state.openCategories.includes(category.id) ? ' sidebar__arrow--open' : ''}`} 
                                    /> {category.name}
                                </div>
                                {
                                    this.state.openCategories.includes(category.id) && this.props.points.map((point, index) => {
                                        if ( point.categories && point.categories.includes(category.id) ) {
                                            return (
                                                <div
                                                    onClick={this.props.handleSideBarClick}
                                                    data-id={point.id}
                                                    className={`sidebar__listItem${this.props.sidebarClickedItemId === point.id ? ' sidebar__listCategory--selected' : ''}`}
                                                    key={index}
                                                >
                                                    - {point.title}
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
                        <div
                            className='sidebar__listCategory'
                            style={{color: 'aqua', paddingLeft: '0px', marginTop: '20px'}}
                        >
                            Unconnected Projects
                        </div>
                    :
                    null
                    
                }
                {
                    this.props.isAuthenticated && this.props.points.map((point, index) => {
                        if( !point.categories || point.categories.length === 0) {
                            return (
                                <div
                                    onClick={this.props.handleSideBarClick}
                                    data-id={point.id}
                                    className={`sidebar__listItem${this.props.sidebarClickedItemId === point.id ? ' sidebar__listItem--selected' : ''}`}
                                    style={{color: 'aqua', paddingLeft: '0px', paddingTop: index === 0 ? '20px' : 0}}
                                    key={index}
                                >
                                    {point.title}
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