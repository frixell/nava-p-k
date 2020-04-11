import React from 'react';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false
        }
    }
    
    render() {
        return (
            <div style={{
                height: '100%',
                width: '100%'
            }}>
                {
                    this.props.points.map((point, index) => {
                        return (
                            <div
                                onClick={this.props.handleSideBarClick}
                                data-id={point.id}
                                className="sidebar__listItem" key={index}
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