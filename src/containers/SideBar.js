import React from 'react';
import isEqual from 'lodash.isequal';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false
        }
    }
    
    componentDidUpdate = (prevProps) => {
        if (!isEqual(this.props.points, prevProps.points)) {
            console.log('change');
        }
    }
    
    render() {
        console.log('sidebar', this.props.points);
        console.log('sidebar', this.props.points.length);
        return (
            <div
                className="homepage__sidebar__container"
                style={{
                    height: $( window ).height() - 60
                }}
            >
                {
                    this.props.points.map((point, index) => {
                        return (
                            <div
                                onClick={this.props.handleSideBarClick}
                                data-id={point.id}
                                className={`sidebar__listItem${this.props.sidebarClickedItemId === point.id ? ' sidebar__listItem--selected' : ''}`}
                                key={index}
                            >
                                {point.title}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
} 

export default SideBar;