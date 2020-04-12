import React from 'react';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import AutosizeInput from 'react-input-autosize';
import TableOptionsEditor from './TableOptionsEditor';

class ProjectDetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            isEditable: false,
            selectedSubcategoryName: null,
            selectedSubcategoryY: -1000
        }
    }
    
    componentDidMount = () => {
        //console.log('here 0', this.props.selectedProject.extendedContent.content);
        const html = this.props.selectedProject.extendedContent && this.props.selectedProject.extendedContent.content || '';
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ editorState });
        }            
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

    onEditorStateChange = (editorState) => {
        //console.log('editorState', editorState);
        //console.log('editorState', draftToHtml(convertToRaw(editorState.getCurrentContent())));
        let currentValue = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({
            editorState
        });
        let e = {
            target: {
                value: currentValue,
                dataset: {
                    action: 'setString',
                    name: 'content'
                }
            }
        }
        this.props.onChange(e);
    };
    
    setProjectTitle = (event) => {
        let e = {
            target: {
                value: event.target.value,
                dataset: {
                    action: 'setString',
                    name: 'title'
                }
            }
        }
        this.props.onChange(e);
    }
    
    setTableOptions = (tableOptions) => {
        let e = {
            target: {
                value: tableOptions,
                dataset: {
                    action: 'setString',
                    name: 'tableOptions'
                }
            }
        }
        this.props.onChange(e);
    }
    
    setSelectedSubcategoryName = (e) => {
        const selectedSubcategoryName = e.target.dataset.name;
        const selectedSubcategoryY = e.pageY;
        this.setState({
            selectedSubcategoryName,
            selectedSubcategoryY
        });
    }
    
    hideTableOptions = () => {
        const selectedSubcategoryName = null;
        const selectedSubcategoryY = 0;
        this.setState({
            selectedSubcategoryName,
            selectedSubcategoryY
        });
    }
    
    render() {
        const colorIconData = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQ5NS41NzggNDk1LjU3OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk1LjU3OCA0OTUuNTc4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0U2QkU5NDsiIGQ9Ik00MzkuMjA4LDIxNS41NzhjLTQ2Ljk3NS01My41MjktOTYtNjUuOTczLTk2LTEyNWMwLTY0LjMzMy01NC4zMzMtMTEzLjY2Ny0xNDkuNDI5LTc5LjMyMQoJCQlDOTEuODE2LDQ4LjA4MywyMS4yMDgsMTM2LjkxMSwyMS4yMDgsMjQ3LjU3OGMwLDEzNi45NjYsMTExLjAzMywyNDgsMjQ4LDI0OGMyMi41MjcsMCw0NC4zNTQtMy4wMDQsNjUuMDk5LTguNjMybC0wLjAwNi0wLjAyNgoJCQlDNDM5LjIwOCw0NTYuNTc4LDUyNS4yMDgsMzEzLjU3OCw0MzkuMjA4LDIxNS41Nzh6IE0zMzMuNzA5LDE4OS42OWMtMTQuNTAxLDE4LjU1NS01NC42NjgsNy43MDctNzAuMTctMTguNTQ3CgkJCWMtMTMuNjY0LTIzLjE0LTguNjY0LTU2LjIzMiwxNC45ODgtNzAuODIyYzEzLjcxLTguNDU3LDMxLjc5MS0wLjEzNSwzNS4yMzEsMTUuNjAyYzIuOCwxMi44MDYsOC41NDMsMjguNjcxLDIwLjIzOSw0My4xODcKCQkJQzM0MS4xMjUsMTY3Ljk2LDM0MC43MDcsMTgwLjczNiwzMzMuNzA5LDE4OS42OXoiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGNEYxOTsiIGN4PSIxNjUuMDk4IiBjeT0iMTM1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGOEM2MjsiIGN4PSIxNzYuOTQiIGN5PSIxMjMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGQ0QwMDsiIGN4PSIxMTcuMDk4IiBjeT0iMjU1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRTY3MTsiIGN4PSIxMjguOTQiIGN5PSIyNDMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzAwQzM3QTsiIGN4PSIxNzIuODc5IiBjeT0iMzY3LjQ2OSIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzYwREM0RDsiIGN4PSIxODQuNzIiIGN5PSIzNTUuNDk2IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzRDRDdGRjsiIGN4PSIyOTMuMDk4IiBjeT0iNDA3LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0FFRUZGRjsiIGN4PSIzMDQuOTM5IiBjeT0iMzk1LjcxNSIgcj0iMTYuNzYyIi8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiMwMDlCQ0E7IiBjeD0iMzgxLjA5OCIgY3k9IjMxOS40NjkiIHI9IjQ3Ljg5Ii8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiM0Q0Q3RkY7IiBjeD0iMzkyLjkzOSIgY3k9IjMwNy40OTYiIHI9IjE2Ljc2MiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';
        return (
            <div style={{
                height: '100%',
                width: '100%'
            }}>
                {
                    this.props.isAuthenticated ? 
                        <TableOptionsEditor 
                            selectedSubcategoryName={this.state.selectedSubcategoryName}
                            selectedSubcategoryY={this.state.selectedSubcategoryY}
                            selectedProject={this.props.selectedProject}
                            tableTemplate={this.props.tableTemplate}
                            setTableOptions={this.setTableOptions}
                            hideTableOptions={this.hideTableOptions}
                        />
                    :
                        null
                }
                
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
                    {/*<div style={{
                        color: '#fff',
                        fontWheight: 'bold',
                        fontSize: 20,
                        textAlign: 'center',
                        background: '#6c7680',
                        width: '100%',
                        height: '3rem',
                        float: 'left'
                    }}>
                        {this.props.selectedProject.extendedContent && this.props.selectedProject.extendedContent.title}
                        
                </div>*/}
                    {
                        this.props.isAuthenticated === true ?
                            <div style={{
                                    color: '#fff',
                                    fontWheight: 'bold',
                                    fontSize: 20,
                                    textAlign: 'center',
                                    background: '#6c7680',
                                    width: '100%',
                                    height: '3rem',
                                    float: 'left'
                                }}
                            >
                                <AutosizeInput
                                    className="event__header__input Heebo-Regular"
                                    name="title"
                                    data-name="title"
                                    data-index={this.props.categoryId}
                                    data-field='title'
                                    data-action={'setString'}
                                    placeholder="Project Title"
                                    value={this.props.selectedProject.extendedContent && this.props.selectedProject.extendedContent.title}
                                    onChange={this.setProjectTitle}
                                    dir={'ltr'}
                                />
                            </div>
                        :
                            <h2 className=" event__headerHeebo-Regular">{this.props.selectedProject.extendedContent && this.props.selectedProject.extendedContent.title}</h2>
                    }
                    <div style={{
                        color: '#6c7680',
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
                            this.props.tableTemplate && this.props.tableTemplate.map((category, index) => {
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
                                                category.categories.map((subcategory, index) => {
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
                                                            <div
                                                                onClick={this.props.isAuthenticated ? this.setSelectedSubcategoryName : null}
                                                                data-name={subcategory.name}
                                                                style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                width: '60%',
                                                                cursor: this.props.isAuthenticated ? 'pointer' : 'normal'
                                                            }}>
                                                                {
                                                                    subcategory.options.map((option, index) => {
                                                                        if (this.props.selectedProject.extendedContent && this.props.selectedProject.extendedContent.tableOptions.includes(option.id)) {
                                                                            return (
                                                                                <div data-name={subcategory.name} key={`c${index}`} style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    padding: 5,
                                                                                    lineHeight: '12px',
                                                                                    cursor: this.props.isAuthenticated ? 'pointer' : 'normal'
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
                        paddingTop: 10,
                        position: 'relative'
                    }}>
                        { 
                            this.props.isAuthenticated === true ? 
                                <div className="backoffice__about__images__buttons">
                                    <button className="backoffice__events__events__add__button" onClick={this.props.uploadWidget}>
                                        <img className="backoffice__events__events__add__icon" src="/images/eventspage/add-eventSubcategory-icon.svg" alt="הוספת תת קטגוריה" /> Image
                                    </button>
                                </div>
                            :
                                null
                        }
                        <img width="100%" src={this.props.selectedProject.extendedContent && this.props.selectedProject.extendedContent.image} />
                    </div>
                </div>
                <div style={{
                    display: 'inline-block',
                    color: '#6c7680',
                    fontSize: 14,
                    lineHeight: '17px',
                    width: '48%',
                    float: 'right',
                    paddingTop: '2px'
                }}>
                    {
                        this.props.isAuthenticated === true ?
                        <div>
                            <Editor
                                editorState={this.state.editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={this.onEditorStateChange}
                                toolbarOnFocus
                                toolbar={{
                                    options: ['blockType', 'fontFamily', 'fontSize', 'colorPicker', 'link'],
                                    textAlign: { inDropdown: true },
                                    link: { inDropdown: true },
                                    blockType: {
                                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                                        className: "blockTypeClassName",
                                    },
                                    fontSize: {
                                        options: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '48', '60', '72'],
                                        className: "fontSizeClassName",
                                    },
                                    fontFamily: {
                                        options: ['Heebo-Regular', 'Heebo-Medium','Heebo-Bold'],
                                        className: "fontFamilyClassName",
                                        component: undefined,
                                        dropdownClassName: "fontFamilyClassName",
                                    },
                                    colorPicker: {
                                        icon: colorIconData,
                                        className: 'demo-icon',
                                        component: undefined,
                                        popupClassName: undefined,
                                        colors: ['rgb(255,255,255)', 'rgb(252,193,48)', 'rgb(83,176,161)', 'rgba(102,102,101)', 'rgb(0,0,0)', 'rgba(0,0,0,0)'],
                                    }
                                }}
                            />
                        </div>
                        :
                        <div>
                            <span dangerouslySetInnerHTML={{ __html: this.props.selectedProject.extendedContent && this.props.selectedProject.extendedContent.content }} />
                        </div>
                    }
                </div>
            </div>
        );
    }
} 

export default ProjectDetailsPage;