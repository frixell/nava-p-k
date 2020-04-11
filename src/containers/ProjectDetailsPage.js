import React from 'react';

class ProjectDetailsPage extends React.Component {
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
                <div style={{
                        display: 'inline-block',
                        width: '50%'
                    }}>
                    <div
                        className='customers__next__arrow'
                        onClick={this.props.hideProject}
                        style={{
                            position: 'absolute',
                            top: '0.5rem',
                            left: '20px',
                            zIndex: 5897
                        }} 
                    />
                    <div style={{
                        color: '#fff',
                        fontWheight: 'bold',
                        fontSize: 20,
                        textAlign: 'center',
                        background: '#6c7680',
                        width: '100%',
                        height: '3rem',
                        float: 'left'
                    }}>
                        {this.props.selectedProject.extendedContent.title}
                    </div>
                    <div style={{
                        color: '#000',
                        fontSize: 11,
                        width: '100%',
                        float: 'left',
                        borderTop: '1px solid black',
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {
                            this.props.table && this.props.table.map((category, index) => {
                                return (
                                    <div key={`a${index}`} style={{
                                        display: 'flex',
                                        flexDirection: 'row'
                                    }}>
                                        <div style={{
                                            background: category.color,
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            width: '20%',
                                            minHeight: '50px',
                                            padding: 5,
                                            borderRight: '1px solid black',
                                            borderBottom: '1px solid black'
                                        }}>
                                            {category.name}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '80%'
                                        }}>
                                            {
                                                category.subcategories.map((subcategory, index) => {
                                                    return (
                                                        <div key={`b${index}`} style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            borderBottom: '1px solid black',
                                                        }}>
                                                            <div style={{
                                                                fontWeight: 'bold',
                                                                width: '40%',
                                                                height: '100%',
                                                                padding: 5,
                                                                borderRight: '1px solid black',
                                                                lineHeight: '12px'
                                                            }}>
                                                                {subcategory.name}
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                width: '60%'
                                                            }}>
                                                                {
                                                                    subcategory.options.map((option, index) => {
                                                                        if (option.show) {
                                                                            return (
                                                                                <div key={`c${index}`} style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    padding: 5,
                                                                                    lineHeight: '12px'
                                                                                }}>
                                                                                    {option.name}
                                                                                </div>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10
                    }}>
                        <img width="100%" src={this.props.selectedProject.extendedContent.image} />
                    </div>
                </div>
                <div style={{
                    display: 'inline-block',
                    color: '#000',
                    fontSize: 14,
                    width: '48%',
                    float: 'right'
                }}>
                    {this.props.selectedProject.extendedContent.content}
                </div>
            </div>
        );
    }
} 

export default ProjectDetailsPage;