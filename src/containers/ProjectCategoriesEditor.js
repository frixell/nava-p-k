import React from 'react';


class ProjectCategoriesEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false
        }
    }
    
    componentDidMount = () => {
        //console.log('here 0', this.props);        
    }
    
    handleCategoryStatus = (e) => {
        //console.log(e.target.dataset.id);
        let categoryId = e.target.dataset.id;
        // console.log('this.props.categories', this.props.categories);
        // console.log('this.props.selectedProject.categories', this.props.selectedProject.categories);
        let categoriesArray = this.props.selectedProject.categories ? this.props.selectedProject.categories.split(',') : [];
        // console.log('categoriesArray', categoriesArray);
        // console.log('categoryId', categoryId);
        if (this.props.selectedProject.categories &&  this.props.selectedProject.categories.includes(categoryId)) {
            let result = categoriesArray.filter(category => category !== categoryId);
            categoriesArray = result;
        } else {
            categoriesArray.push(categoryId);
        }
        let categories = categoriesArray.join(',');
        
        this.props.setProjectCategories(categories);
    }
    
    
    render() {
        return (
            <div hidden={this.props.hideCategoryEditor} style={{
                position: 'absolute',
                zIndex: 1602,
                top: 10,
                left: 200,
                color: '#6c7680',
                fontSize: 11,
                width: '400px',
                minHeight: '300px',
                float: 'left',
                borderTop: '1px solid black',
                borderLeft: '1px solid black',
                borderRight: '1px solid black',
                display: 'flex',
                flexDirection: 'column',
                background: "#fff"
            }}>
                
                <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    
                        <div
                            style={{
                                padding: '10px',
                                fontSize: '14px',
                                fonWeight: 'bold',
                                background: '#6c7680',
                                color: '#fff',
                                cursor: 'pointer'
                            }} 
                            onClick={this.props.toggleCategoryEditor}
                        >
                            X
                        </div>
                        
                    {
                        this.props.categories && this.props.categories.map((category, index) => {
                            
                                return (
                                    <div key={`c${index}`} style={{
                                        width: '100%',
                                        height: '100%',
                                        padding: '10px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        borderBottom: '1px solid black'
                                    }}>
                                        <div style={{
                                            width: '30px',
                                            height: '100%'
                                        }}>
                                        
                                            <input
                                                data-id={category.id}
                                                type="checkbox"
                                                checked={this.props.selectedProject.categories &&  this.props.selectedProject.categories.includes(category.id)}
                                                onChange={this.handleCategoryStatus}
                                            />
                                                
                                        </div>
                                        <div style={{
                                            padding: 5,
                                            lineHeight: '12px',
                                            width: '370px',
                                        }}>
                                            {category.name}
                                        </div>
                                    </div>
                                )
                            
                        })
                    }
                </div>
            </div>
        );
    }
} 

export default ProjectCategoriesEditor;