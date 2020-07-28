import React from 'react';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import isEqual from 'lodash.isequal';


var windowWidth   = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;

export default class CvContentStrip extends React.Component {
    
    state = {
        height: 'auto',
        editorState: EditorState.createEmpty(),
        cvpage: {content: ''},
        cvpageOrigin: {content: ''},
    };
    
    componentDidMount = () => {
        console.log('componentDidMount', this.props.cvpage);
        let html = '';
        this.setState({ 
            cvpage: this.props.cvpage,
            cvpageOrigin: this.props.cvpageOrigin,
        });
        if (this.props.lang === 'en') {
            html = this.props.cvpage && this.props.cvpage.content || '';
        } else {
            html = (this.props.cvpage && this.props.cvpage.contentHebrew) || '';
        }
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ 
                editorState
            });
        }            
    }
    componentDidUpdate = (prevProps) => {
        if (!isEqual(this.props.cvpageOrigin, this.state.cvpageOrigin)) {
            this.setState({ 
                cvpage: this.props.cvpage,
                cvpageOrigin: this.props.cvpageOrigin,
            });
            console.log('componentDidUpdate', this.props.cvpage);
            let html = '';
            if (this.props.lang === 'en') {
                html = this.props.cvpage && this.props.cvpage.content || '';
            } else {
                html = (this.props.cvpage && this.props.cvpage.contentHebrew) || '';
            }
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState });
            }
        }
        if (this.props.lang !== prevProps.lang) {
            let html = '';
            if (this.props.lang === 'en') {
                html = this.props.cvpage && this.props.cvpage.content || '';
            } else {
                html = (this.props.cvpage && this.props.cvpage.contentHebrew) || '';
            }
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState });
            }            
        }
    }
    
    onEditorStateChange = (editorState) => {
        
        let currentValue = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({
            editorState
        });
        
        let e = {
            target: {
                value: currentValue,
                dataset: {
                    action: 'setString',
                    name: this.props.lang === 'en' ? 'content' : 'contentHebrew'
                }
            }
        }
        this.props.setData(e);
    };
    
    render() {
        const colorIconData = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQ5NS41NzggNDk1LjU3OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk1LjU3OCA0OTUuNTc4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0U2QkU5NDsiIGQ9Ik00MzkuMjA4LDIxNS41NzhjLTQ2Ljk3NS01My41MjktOTYtNjUuOTczLTk2LTEyNWMwLTY0LjMzMy01NC4zMzMtMTEzLjY2Ny0xNDkuNDI5LTc5LjMyMQoJCQlDOTEuODE2LDQ4LjA4MywyMS4yMDgsMTM2LjkxMSwyMS4yMDgsMjQ3LjU3OGMwLDEzNi45NjYsMTExLjAzMywyNDgsMjQ4LDI0OGMyMi41MjcsMCw0NC4zNTQtMy4wMDQsNjUuMDk5LTguNjMybC0wLjAwNi0wLjAyNgoJCQlDNDM5LjIwOCw0NTYuNTc4LDUyNS4yMDgsMzEzLjU3OCw0MzkuMjA4LDIxNS41Nzh6IE0zMzMuNzA5LDE4OS42OWMtMTQuNTAxLDE4LjU1NS01NC42NjgsNy43MDctNzAuMTctMTguNTQ3CgkJCWMtMTMuNjY0LTIzLjE0LTguNjY0LTU2LjIzMiwxNC45ODgtNzAuODIyYzEzLjcxLTguNDU3LDMxLjc5MS0wLjEzNSwzNS4yMzEsMTUuNjAyYzIuOCwxMi44MDYsOC41NDMsMjguNjcxLDIwLjIzOSw0My4xODcKCQkJQzM0MS4xMjUsMTY3Ljk2LDM0MC43MDcsMTgwLjczNiwzMzMuNzA5LDE4OS42OXoiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGNEYxOTsiIGN4PSIxNjUuMDk4IiBjeT0iMTM1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGOEM2MjsiIGN4PSIxNzYuOTQiIGN5PSIxMjMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGQ0QwMDsiIGN4PSIxMTcuMDk4IiBjeT0iMjU1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRTY3MTsiIGN4PSIxMjguOTQiIGN5PSIyNDMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzAwQzM3QTsiIGN4PSIxNzIuODc5IiBjeT0iMzY3LjQ2OSIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzYwREM0RDsiIGN4PSIxODQuNzIiIGN5PSIzNTUuNDk2IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzRDRDdGRjsiIGN4PSIyOTMuMDk4IiBjeT0iNDA3LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0FFRUZGRjsiIGN4PSIzMDQuOTM5IiBjeT0iMzk1LjcxNSIgcj0iMTYuNzYyIi8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiMwMDlCQ0E7IiBjeD0iMzgxLjA5OCIgY3k9IjMxOS40NjkiIHI9IjQ3Ljg5Ii8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiM0Q0Q3RkY7IiBjeD0iMzkyLjkzOSIgY3k9IjMwNy40OTYiIHI9IjE2Ljc2MiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        console.log('cvpage-', this.props.cvpage);
        console.log('this.props.lang- ', this.props.lang);
        return (
        <div className="about__content__box" dir={dirLang}>
        
            <div className="about__content__header__box">
                
                
                
            <div style={{
                    display: 'inline-block',
                    color: '#6c7680',
                    fontSize: 14,
                    lineHeight: '17px',
                    width: windowWidth < 768 ? '100%' : '60%',
                    margin: '0 auto',
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
                            <span dangerouslySetInnerHTML={{ __html: this.props.cvpage && this.props.cvpage.content }} />
                        </div>
                    }
                </div>
                
            </div>
            
        </div>
        );
    }
}