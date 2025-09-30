import React from 'react';
import { withTranslation } from 'react-i18next';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import isEqual from 'lodash.isequal';

var windowWidth   = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;

class AboutContentStrip extends React.Component {
    
    state = {
        height: 'auto',
        editorState: EditorState.createEmpty(),
        aboutpage: {content: ''},
        aboutpageOrigin: {content: ''}
    };
    
    componentDidMount = () => {
        console.log('here 0', this.props.aboutpage);
        let html = '';
        this.setState({ 
            aboutpage: this.props.aboutpage,
            aboutpageOrigin: this.props.aboutpageOrigin
        });
        if (this.props.i18n.language === 'en') {
            html = this.props.aboutpage && this.props.aboutpage.content;
        } else {
            html = (this.props.aboutpage && this.props.aboutpage.contentHebrew) || '';
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
        if (!isEqual(this.props.aboutpageOrigin, this.state.aboutpageOrigin)) {
            this.setState({ 
                aboutpage: this.props.aboutpage,
                aboutpageOrigin: this.props.aboutpageOrigin
            });
            console.log('here 0', this.props.aboutpage);
            let html = '';
            if (this.props.i18n.language === 'en') {
                html = this.props.aboutpage && this.props.aboutpage.content;
            } else {
                html = (this.props.aboutpage && this.props.aboutpage.contentHebrew) || '';
            }
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState });
            }
        }
        if (this.props.i18n.language !== prevProps.lang) {
            let html = '';
            if (this.props.i18n.language === 'en') {
                html = this.props.aboutpage && this.props.aboutpage.content;
            } else {
                html = (this.props.aboutpage && this.props.aboutpage.contentHebrew) || '';
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
        console.log('this.props.i18n.language- ', this.props.i18n.language);
        let currentValue = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({
            editorState
        });
        
        let e = {
            target: {
                value: currentValue,
                dataset: {
                    action: 'setString',
                    name: this.props.i18n.language === 'en' ? 'content' : 'contentHebrew'
                }
            }
        }
        this.props.setData(e);
    };
    
    render() {
        const dirLang = this.props.i18n.language === 'he' ? 'rtl' : 'ltr';
        console.log('aboutpage-', this.props.aboutpage);
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
                            <span dangerouslySetInnerHTML={{ __html: this.props.aboutpage && this.props.aboutpage.content }} />
                        </div>
                    }
                </div>
                
            </div>
            
        </div>
        );
    }
}

export default withTranslation()(AboutContentStrip);