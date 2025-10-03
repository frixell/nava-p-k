import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { ContentState, EditorState, convertToRaw } from 'draft-js';

import {
    Container,
    HeaderBox,
    ContentWrapper,
    EditorShell,
    ReadOnlyContent
} from './CvContentStrip.styles';
import type { CvPageState } from '../../store/slices/cvSlice';

export interface SyntheticSetDataEvent {
    target: {
        value: string;
        dataset: {
            action: string;
            name: string;
        };
    };
}

interface CvContentStripProps {
    cvpage?: CvPageState | null;
    cvpageOrigin?: CvPageState | null;
    setData: (event: SyntheticSetDataEvent) => void;
    isAuthenticated?: boolean;
}

const createEditorState = (html?: string | null) => {
    if (!html) {
        return EditorState.createEmpty();
    }

    const contentBlock = htmlToDraft(html);
    if (!contentBlock) {
        return EditorState.createEmpty();
    }

    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    return EditorState.createWithContent(contentState);
};

const CvContentStrip: React.FC<CvContentStripProps> = ({
    cvpage,
    cvpageOrigin,
    setData,
    isAuthenticated = false
}) => {
    const { i18n } = useTranslation();
    const language = i18n.language;
    const direction: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';

    const editorHtml = useMemo(() => {
        if (language === 'en') {
            return cvpage?.content ?? '';
        }

        return cvpage?.contentHebrew ?? cvpage?.content ?? '';
    }, [cvpage?.content, cvpage?.contentHebrew, language]);

    const [editorState, setEditorState] = useState(() => createEditorState(editorHtml));
    const isLocalChangeRef = React.useRef(false);

    useEffect(() => {
        if (isLocalChangeRef.current) {
            isLocalChangeRef.current = false;
            return;
        }
        setEditorState(createEditorState(editorHtml));
    }, [editorHtml, cvpageOrigin]);

    const handleEditorStateChange = useCallback((nextState: EditorState) => {
        setEditorState(nextState);
        isLocalChangeRef.current = true;
        const currentValue = draftToHtml(convertToRaw(nextState.getCurrentContent())) || '';
        const name = language === 'en' ? 'content' : 'contentHebrew';

        setData({
            target: {
                value: currentValue,
                dataset: {
                    action: 'setString',
                    name
                }
            }
        });
    }, [language, setData]);

    return (
        <Container direction={direction}>
            <HeaderBox>
                <ContentWrapper>
                    {isAuthenticated ? (
                        <EditorShell>
                            <Editor
                                editorState={editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={handleEditorStateChange}
                                toolbar={{
                                    options: ['blockType', 'fontFamily', 'fontSize', 'colorPicker', 'link'],
                                    textAlign: { inDropdown: true },
                                    link: { inDropdown: true },
                                    blockType: {
                                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                                        className: 'blockTypeClassName'
                                    },
                                    fontSize: {
                                        options: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '48', '60', '72'],
                                        className: 'fontSizeClassName'
                                    },
                                    fontFamily: {
                                        options: ['Heebo-Regular', 'Heebo-Medium', 'Heebo-Bold'],
                                        className: 'fontFamilyClassName',
                                        component: undefined,
                                        dropdownClassName: 'fontFamilyClassName'
                                    },
                                    colorPicker: {
                                        className: 'demo-icon',
                                        component: undefined,
                                        popupClassName: undefined,
                                        colors: ['rgb(255,255,255)', 'rgb(252,193,48)', 'rgb(83,176,161)', 'rgba(102,102,101)', 'rgb(0,0,0)', 'rgba(0,0,0,0)']
                                    }
                                }}
                            />
                        </EditorShell>
                    ) : (
                        <ReadOnlyContent
                            dangerouslySetInnerHTML={{ __html: editorHtml }}
                        />
                    )}
                </ContentWrapper>
            </HeaderBox>
        </Container>
    );
};

export default CvContentStrip;
