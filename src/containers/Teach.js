import React from 'react';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import isEqual from 'lodash.isequal';
import AnimateHeight from 'react-animate-height';
import Textarea from 'react-expanding-textarea';
import $ from 'jquery';

const shouldHighLight = (org, update, eng) => {
    if ( org === update ) {
        return `about__content__text${eng} Heebo-Regular edit__bg`;
    } else {
        return `about__content__text${eng} Heebo-Regular edit__changed__bg`;
    }
};

var windowWidth   = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;
var windowHeight   = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight;

export default class Teach extends React.Component {
    
    state = {
        height: 'auto',
        editorStateDetails: EditorState.createEmpty(),
        editorStateDescription: EditorState.createEmpty(),
        teach: {
            img: '',
            details: '',
            description: '',
            detailsHebrew: '',
            descriptionHebrew: '',
            showButtons: false,
            isEdit: false
        }
    };
    
    onMouseEnter = () => {
        this.setState({ 
            showButtons: true
        });
    }
    
    onMouseLeave = () => {
        this.setState({ 
            showButtons: false
        });
    }
    
    componentDidMount = () => {
        let htmlDetails = '';
        let htmlDescription = '';
        this.setState({ 
            teach: this.props.teach
        });
        if (this.props.lang === 'en') {
            htmlDetails = this.props.teach && this.props.teach.details;
            htmlDescription = this.props.teach && this.props.teach.description;
        } else {
            htmlDetails = this.props.teach && (this.props.teach.detailsHebrew || this.props.teach.details || '');
            htmlDescription = this.props.teach && (this.props.teach.descriptionHebrew || this.props.teach.description || '');
        }
        const contentBlockDetails = htmlToDraft(htmlDetails);
        if (contentBlockDetails) {
            const contentStateDetails = ContentState.createFromBlockArray(contentBlockDetails.contentBlocks);
            const editorStateDetails = EditorState.createWithContent(contentStateDetails);
            this.setState({ editorStateDetails });
        }
        const contentBlockDescription = htmlToDraft(htmlDescription);
        if (contentBlockDescription) {
            const contentStateDescription = ContentState.createFromBlockArray(contentBlockDescription.contentBlocks);
            const editorStateDescription = EditorState.createWithContent(contentStateDescription);
            this.setState({ editorStateDescription });
        }         
    }
    
    componentDidUpdate = (prevProps) => {
        if (!isEqual(this.props.teach, this.state.teach)) {
            this.setState({ 
                teach: this.props.teach
            });
            let htmlDetails = '';
            let htmlDescription = '';
            if (this.props.lang === 'en') {
                htmlDetails = this.props.teach && this.props.teach.details;
                htmlDescription = this.props.teach && this.props.teach.description;
            } else {
                htmlDetails = this.props.teach && (this.props.teach.detailsHebrew || this.props.teach.details || '');
                htmlDescription = this.props.teach && (this.props.teach.descriptionHebrew || this.props.teach.description || '');
            }
            const contentBlockDetails = htmlToDraft(htmlDetails);
            if (contentBlockDetails) {
                const contentStateDetails = ContentState.createFromBlockArray(contentBlockDetails.contentBlocks);
                const editorStateDetails = EditorState.createWithContent(contentStateDetails);
                this.setState({ editorStateDetails });
            }
            const contentBlockDescription = htmlToDraft(htmlDescription);
            if (contentBlockDescription) {
                const contentStateDescription = ContentState.createFromBlockArray(contentBlockDescription.contentBlocks);
                const editorStateDescription = EditorState.createWithContent(contentStateDescription);
                this.setState({ editorStateDescription });
            }
        }
        if (this.props.lang !== prevProps.lang) {
            let htmlDetails = '';
            let htmlDescription = '';
            if (this.props.lang === 'en') {
                htmlDetails = this.props.teach && this.props.teach.details;
                htmlDescription = this.props.teach && this.props.teach.description;
            } else {
                htmlDetails = this.props.teach && (this.props.teach.detailsHebrew || this.props.teach.details || '');
                htmlDescription = this.props.teach && (this.props.teach.descriptionHebrew || this.props.teach.description || '');
            }
            const contentBlockDetails = htmlToDraft(htmlDetails);
            if (contentBlockDetails) {
                const contentStateDetails = ContentState.createFromBlockArray(contentBlockDetails.contentBlocks);
                const editorStateDetails = EditorState.createWithContent(contentStateDetails);
                this.setState({ editorStateDetails });
            }
            const contentBlockDescription = htmlToDraft(htmlDescription);
            if (contentBlockDescription) {
                const contentStateDescription = ContentState.createFromBlockArray(contentBlockDescription.contentBlocks);
                const editorStateDescription = EditorState.createWithContent(contentStateDescription);
                this.setState({ editorStateDescription });
            }         
        }
    }
    
    onEditorStateDetailsChange = (editorStateDetails) => {
        let currentValue = draftToHtml(convertToRaw(editorStateDetails.getCurrentContent()));
        this.setState({
            editorStateDetails
        });
        
        let e = {
            target: {
                value: currentValue,
                dataset: {
                    action: 'setString',
                    id: this.props.teach.id,
                    name: this.props.lang === 'en' ? 'details' : 'detailsHebrew'
                }
            }
        }
        this.props.setData(e);
    };
    
    onEditorStateDescriptionChange = (editorStateDescription) => {
        let currentValue = draftToHtml(convertToRaw(editorStateDescription.getCurrentContent()));
        this.setState({
            editorStateDescription
        });
        
        let e = {
            target: {
                value: currentValue,
                dataset: {
                    action: 'setString',
                    id: this.props.teach.id,
                    name: this.props.lang === 'en' ? 'description' : 'descriptionHebrew'
                }
            }
        }
        this.props.setData(e);
    };
    
    render() {
        const colorIconData = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQ5NS41NzggNDk1LjU3OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk1LjU3OCA0OTUuNTc4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0U2QkU5NDsiIGQ9Ik00MzkuMjA4LDIxNS41NzhjLTQ2Ljk3NS01My41MjktOTYtNjUuOTczLTk2LTEyNWMwLTY0LjMzMy01NC4zMzMtMTEzLjY2Ny0xNDkuNDI5LTc5LjMyMQoJCQlDOTEuODE2LDQ4LjA4MywyMS4yMDgsMTM2LjkxMSwyMS4yMDgsMjQ3LjU3OGMwLDEzNi45NjYsMTExLjAzMywyNDgsMjQ4LDI0OGMyMi41MjcsMCw0NC4zNTQtMy4wMDQsNjUuMDk5LTguNjMybC0wLjAwNi0wLjAyNgoJCQlDNDM5LjIwOCw0NTYuNTc4LDUyNS4yMDgsMzEzLjU3OCw0MzkuMjA4LDIxNS41Nzh6IE0zMzMuNzA5LDE4OS42OWMtMTQuNTAxLDE4LjU1NS01NC42NjgsNy43MDctNzAuMTctMTguNTQ3CgkJCWMtMTMuNjY0LTIzLjE0LTguNjY0LTU2LjIzMiwxNC45ODgtNzAuODIyYzEzLjcxLTguNDU3LDMxLjc5MS0wLjEzNSwzNS4yMzEsMTUuNjAyYzIuOCwxMi44MDYsOC41NDMsMjguNjcxLDIwLjIzOSw0My4xODcKCQkJQzM0MS4xMjUsMTY3Ljk2LDM0MC43MDcsMTgwLjczNiwzMzMuNzA5LDE4OS42OXoiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGNEYxOTsiIGN4PSIxNjUuMDk4IiBjeT0iMTM1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGOEM2MjsiIGN4PSIxNzYuOTQiIGN5PSIxMjMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGQ0QwMDsiIGN4PSIxMTcuMDk4IiBjeT0iMjU1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRTY3MTsiIGN4PSIxMjguOTQiIGN5PSIyNDMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzAwQzM3QTsiIGN4PSIxNzIuODc5IiBjeT0iMzY3LjQ2OSIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzYwREM0RDsiIGN4PSIxODQuNzIiIGN5PSIzNTUuNDk2IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzRDRDdGRjsiIGN4PSIyOTMuMDk4IiBjeT0iNDA3LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0FFRUZGRjsiIGN4PSIzMDQuOTM5IiBjeT0iMzk1LjcxNSIgcj0iMTYuNzYyIi8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiMwMDlCQ0E7IiBjeD0iMzgxLjA5OCIgY3k9IjMxOS40NjkiIHI9IjQ3Ljg5Ii8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiM0Q0Q3RkY7IiBjeD0iMzkyLjkzOSIgY3k9IjMwNy40OTYiIHI9IjE2Ljc2MiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        console.log(this.props.teach);
        return (
        <div
            className="teach__box"
            dir={dirLang}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
        >
        
            <div className="teach__header__box">
                
                {
                    this.props.isAuthenticated && !this.props.isEdit && this.state.showButtons ?
                        <div
                            className="backoffice__toolbar__buttons backoffice__toolbar__buttons--save-project"
                            style={
                                this.props.lang === 'en' ? 
                                    {
                                        width: '5rem',
                                        left: '88%',
                                        position: 'absolute',
                                        background: 'black'
                                    } 
                                : 
                                    {
                                        width: '5rem',
                                        left: '12%',
                                        position: 'absolute',
                                        background: 'black'
                                    }
                                }
                        >
                            <div className="backoffice__toolbar__label" style={{width: '5rem', color: this.state.needSave ? 'red' : 'aqua'}}>
                                {`${this.props.lang === 'en' ? 'Edit' : 'עריכה'}`}
                            </div>
                            <button
                                data-id={this.props.teach.id}
                                className="backoffice_button"
                                onClick={this.props.setIsEditTeach}
                            >
                                <img
                                    data-id={this.props.teach.id}
                                    className="backoffice__edit__icon"
                                    src="/images/backoffice/edit.svg"
                                    alt="Edit"
                                />
                            </button>
                        </div>
                    :
                        null
                }
                
                {
                    this.props.isAuthenticated && !this.props.isEdit && this.state.showButtons ?
                        <div
                            className="backoffice__toolbar__buttons backoffice__toolbar__buttons--save-project"
                            style={
                                this.props.lang === 'en' ? 
                                    {
                                        width: '5rem',
                                        height: '5rem',
                                        left: '88%',
                                        top: '7.2rem',
                                        position: 'absolute',
                                        background: 'black'
                                    } 
                                : 
                                    {
                                        width: '5rem',
                                        height: '5rem',
                                        left: '12%',
                                        top: '7.2rem',
                                        position: 'absolute',
                                        background: 'black'
                                    }
                                }
                        >
                            <div className="backoffice__toolbar__label" style={{width: '5rem', color: this.state.needSave ? 'red' : 'aqua'}}>
                                {`${this.props.lang === 'en' ? 'Visible' : 'צפייה'}`}
                            </div>
                            <button
                                data-id={this.props.teach.id}
                                data-visible={this.props.teach.visible === "true" ? "false" : "true"}
                                className="backoffice_button"
                                style={{
                                    height: '3rem'
                                }}
                                onClick={this.props.setIsVisibleTeach}
                            >
                                <img
                                    data-id={this.props.teach.id}
                                    data-visible={this.props.teach.visible === "true" ? "false" : "true"}
                                    className="backoffice__show__icon"
                                    src={`/images/backoffice/${this.props.teach.visible === "true" ? 'show' : 'hide'}.svg`}
                                    alt={this.props.visible === true ? 'הצג' : 'הסתר'} 
                                />
                            </button>
                        </div>
                    :
                        null
                }
                
                {
                    this.props.isAuthenticated && !this.props.isEdit && this.state.showButtons ?
                        <div
                            className="backoffice__toolbar__buttons backoffice__toolbar__buttons--save-project"
                            style={
                                this.props.lang === 'en' ? 
                                    {
                                        width: '5rem',
                                        height: '5rem',
                                        left: '88%',
                                        top: '14rem',
                                        position: 'absolute',
                                        background: 'black'
                                    } 
                                : 
                                    {
                                        width: '5rem',
                                        height: '5rem',
                                        left: '12%',
                                        top: '14rem',
                                        position: 'absolute',
                                        background: 'black'
                                    }
                                }
                        >
                            <div className="backoffice__toolbar__label" style={{width: '5rem', color: this.state.needSave ? 'red' : 'aqua'}}>
                                {`${this.props.lang === 'en' ? 'Order' : 'מיקום'}`}
                            </div>
                            <div className="backoffice__item__order__box">
                                <input
                                    data-id={this.props.teach.id}
                                    type="number"
                                    value={this.props.teach.order}
                                    onChange={this.props.onItemOrderChange}
                                    data-index={this.props.index}
                                    onKeyPress={this.props.onItemOrderKeyPress}
                                    onBlur={this.props.onItemOrderBlur}
                                />
                            </div>
                        </div>
                    :
                        null
                }
                
                {
                    this.props.isAuthenticated && !this.props.isEdit && this.state.showButtons ?
                        <div
                            className="backoffice__toolbar__buttons backoffice__toolbar__buttons--save-project"
                            style={
                                this.props.lang === 'en' ? 
                                    {
                                        width: '5rem',
                                        height: '5rem',
                                        left: '88%',
                                        top: '20.8rem',
                                        position: 'absolute',
                                        background: 'black'
                                    } 
                                : 
                                    {
                                        width: '5rem',
                                        height: '5rem',
                                        left: '12%',
                                        top: '20.8rem',
                                        position: 'absolute',
                                        background: 'black'
                                    }
                                }
                        >
                            <div className="backoffice__toolbar__label" style={{width: '5rem', color: this.state.needSave ? 'red' : 'aqua'}}>
                                {`${this.props.lang === 'en' ? 'Delete' : 'מחיקה'}`}
                            </div>
                            <button
                                data-id={this.props.teach.id}
                                className="backoffice_button"
                                style={{
                                    height: '3rem'
                                }}
                                onClick={this.props.deleteTeach}
                            >
                                X
                            </button>
                        </div>
                    :
                        null
                }
                
                
                
                
                
                
                { 
                    this.props.isAuthenticated === true && this.props.isEdit  ? 
                        <div
                            className="backoffice__toolbar__buttons backoffice__toolbar__buttons--save-project"
                            style={
                                this.props.lang === 'en' ? 
                                    {
                                        width: '5rem',
                                        position: 'absolute',
                                        top: '0px',
                                        left: '88%',
                                        background: 'black'
                                    } 
                                : 
                                    {
                                        width: '5rem',
                                        position: 'absolute',
                                        top: '0px',
                                        left: '12%',
                                        background: 'black'
                                    }
                                }
                        >
                            <div className="backoffice__toolbar__label" style={{width: '5rem', color: this.state.needSave ? 'red' : 'aqua'}}>
                                {this.props.lang === 'en' ? 'Image' : 'תמונה'}
                            </div>
                            <button
                                data-id={this.props.teach.id}
                                className="backoffice_button"
                                onClick={this.props.uploadWidget}
                            >
                                <img
                                    data-id={this.props.teach.id}
                                    className="backoffice__events__events__add__icon"
                                    src="/images/eventspage/add-eventSubcategory-icon.svg"
                                    alt="תמונה"
                                />
                            </button>
                        </div>
                    :
                        null
                }
                
                
                
                {
                    this.props.isAuthenticated && this.props.isEdit ?
                        <div
                            className="backoffice__toolbar__buttons backoffice__toolbar__buttons--save-project"
                            style={
                                this.props.lang === 'en' ? 
                                    {
                                        width: '5rem',
                                        position: 'absolute',
                                        left: '88%',
                                        top: '89%',
                                        background: 'black'
                                    } 
                                : 
                                    {
                                        width: '5rem',
                                        position: 'absolute',
                                        left: '12%',
                                        top: '89%',
                                        background: 'black'
                                    }
                                }
                        >
                            <div className="backoffice__toolbar__label" style={{width: '5rem', color: this.state.needSave ? 'red' : 'aqua'}}>
                                {`${this.props.lang === 'en' ? 'Save' : 'שמירה'}`}
                            </div>
                            <button
                                data-id={this.props.teach.id}
                                className="backoffice_button"
                                onClick={this.props.saveTeach}
                            >
                                <img
                                    data-id={this.props.teach.id}
                                    className="backoffice_icon"
                                    src="/images/backoffice/save.svg"
                                    alt="שמירת הוראה" 
                                />
                            </button>
                        </div>
                    :
                        null
                }
                
                
                
                
                
                <div className="teach__image__box">
                    { 
                        this.props.teach && 
                        this.props.teach.image && 
                        <img
                            width={this.props.teach.image.width}
                            style={{maxWidth: '100%'}}
                            src={this.props.teach.image.src}
                        /> 
                    }
                </div>
                
                <div 
                    style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        width: '60%',
                        margin: '0 auto'
                    }}
                >
                    
                    
                
                
                    <div className={`teach__details__box${this.props.lang === 'en' ? ' teach__details__box--eng' : ''}`}>
                        {
                            this.props.isAuthenticated === true && this.props.isEdit ?
                            <div>
                                <Editor
                                    editorState={this.state.editorStateDetails || ''}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={this.onEditorStateDetailsChange}
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
                            <div
                                style={{
                                    width: '100%'
                                }}
                            >
                                <Editor
                                    ReadOnly
                                    toolbarClassName="toolbarClassName"
                                    toolbar={{options: []}}
                                    editorState={this.state.editorStateDetails || ''}
                                    editorClassName="editorReadOnlyClassName"
                                />
                            </div>
                        }
                    </div>
                    
                    
                    <div className={`teach__description__box${this.props.lang === 'en' ? ' teach__description__box--eng' : ''}`}>
                        {
                            this.props.isAuthenticated === true && this.props.isEdit ?
                            <div>
                                <Editor
                                    editorState={this.state.editorStateDescription || ''}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={this.onEditorStateDescriptionChange}
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
                            <div
                                style={{
                                    width: '100%'
                                }}
                            >
                                <Editor
                                    ReadOnly
                                    toolbarClassName="toolbarClassName"
                                    toolbar={{options: []}}
                                    editorState={this.state.editorStateDescription || ''}
                                    editorClassName="editorReadOnlyClassName"
                                />
                            </div>
                        }
                    </div>
                </div>
                
            </div>
            
        </div>
        );
    }
}