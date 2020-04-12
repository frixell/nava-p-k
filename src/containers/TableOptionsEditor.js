import React from 'react';


class TableOptionsEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false
        }
    }
    
    componentDidMount = () => {
        console.log('here 0', this.props);        
    }
    // componentDidUpdate = (prevProps) => {
    //     if (this.props.selectedProject.extendedContent.content !== prevProps.selectedProject.extendedContent.content) {
    //         console.log('here', this.props.selectedProject.extendedContent.content);
    //         //const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
    //         const html = this.props.selectedProject.extendedContent.content || '';
    //         const contentBlock = htmlToDraft(html);
    //         if (contentBlock) {
    //             const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    //             const editorState = EditorState.createWithContent(contentState);
    //             this.setState({ editorState });
    //         }            
    //     }
    // }

    handleOptionStatus = (e) => {
        console.log(e.target.dataset.id);
        let optionId = e.target.dataset.id;
        console.log('tableOptions 0', this.props.selectedProject.extendedContent.tableOptions);
        let projectOptionsArray = this.props.selectedProject.extendedContent.tableOptions.split(',');
        if (this.props.selectedProject.extendedContent.tableOptions.includes(optionId)) {
            let result = projectOptionsArray.filter(option => option !== optionId);
            projectOptionsArray = result;
        } else {
            projectOptionsArray.push(optionId);
        }
        let tableOptions = projectOptionsArray.join(',');
        console.log('tableOptions', tableOptions);
        this.props.setTableOptions(tableOptions);
    }
    
    
    render() {
        return (
            <div hidden={this.props.selectedSubcategory} style={{
                position: 'absolute',
                zIndex: 602,
                top: this.props.selectedSubcategoryY - 80,
                left: 640,
                color: '#6c7680',
                fontSize: 11,
                width: '400px',
                float: 'left',
                borderTop: '1px solid black',
                borderLeft: '1px solid black',
                borderRight: '1px solid black',
                display: 'flex',
                flexDirection: 'column',
                background: "#fff"
            }}>
                {
                    this.props.tableTemplate && this.props.tableTemplate.map((category, index) => {
                        return (
                            <div key={`a${index}`} style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {
                                    category.categories.map((subcategory, index) => {
                                        return (
                                            <div key={`b${index}`}>
                                            {
                                                this.props.selectedSubcategoryName === subcategory.name ?
                                                <div
                                                    style={{
                                                        padding: '10px',
                                                        fontSize: '14px',
                                                        fonWeight: 'bold',
                                                        background: '#6c7680',
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }} 
                                                    onClick={this.props.hideTableOptions}
                                                >
                                                    X
                                                </div>
                                                :
                                                null
                                            }
                                            {
                                                this.props.selectedSubcategoryName === subcategory.name && subcategory.options.map((option, index) => {
                                                    
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
                                                                        data-id={option.id}
                                                                        type="checkbox"
                                                                        checked={this.props.selectedProject.extendedContent.tableOptions.includes(option.id)}
                                                                        onChange={this.handleOptionStatus}
                                                                    />
                                                                        
                                                                </div>
                                                                <div style={{
                                                                    padding: 5,
                                                                    lineHeight: '12px',
                                                                    width: '370px',
                                                                }}>
                                                                    {option.name}
                                                                </div>
                                                            </div>
                                                        )
                                                    
                                                })
                                            }
                                            </div>    
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        );
    }
} 

export default TableOptionsEditor;