import React, { useEffect, useMemo, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import Button from '@mui/material/Button';
import { EditorLayout, EditorActions, EditorBlock, FieldLabel } from './TeachEditor.styles';
import type { TeachItem } from './types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface TeachEditorProps {
    language: string;
    teach: TeachItem;
    errorMessage?: string | null;
    onChange(field: keyof TeachItem, value: unknown): void;
    onSave(): void;
    onUploadImage(): void;
}

const buildEditorState = (html?: string): EditorState => {
    if (!html) {
        return EditorState.createEmpty();
    }
    const content = htmlToDraft(html);
    if (!content) {
        return EditorState.createEmpty();
    }
    const contentState = ContentState.createFromBlockArray(content.contentBlocks, content.entityMap);
    return EditorState.createWithContent(contentState);
};

const TeachEditor: React.FC<TeachEditorProps> = ({
    language,
    teach,
    errorMessage,
    onChange,
    onSave,
    onUploadImage
}) => {
    const detailField = language === 'he' ? 'detailsHebrew' : 'details';
    const descriptionField = language === 'he' ? 'descriptionHebrew' : 'description';

    const [detailsState, setDetailsState] = useState<EditorState>(() => buildEditorState(teach[detailField] as string));
    const [descriptionState, setDescriptionState] = useState<EditorState>(() => buildEditorState(teach[descriptionField] as string));

    useEffect(() => {
        setDetailsState(buildEditorState(teach[detailField] as string));
        setDescriptionState(buildEditorState(teach[descriptionField] as string));
    }, [teach.id, teach[detailField], teach[descriptionField], detailField, descriptionField]);

    const handleDetailsChange = (state: EditorState) => {
        setDetailsState(state);
        onChange(detailField as keyof TeachItem, draftToHtml(convertToRaw(state.getCurrentContent())));
    };

    const handleDescriptionChange = (state: EditorState) => {
        setDescriptionState(state);
        onChange(descriptionField as keyof TeachItem, draftToHtml(convertToRaw(state.getCurrentContent())));
    };

    const primaryLabel = useMemo(() => (language === 'he' ? 'תיאור' : 'Description'), [language]);
    const secondaryLabel = useMemo(() => (language === 'he' ? 'פרטים נוספים' : 'Additional details'), [language]);

    return (
        <EditorLayout>
            {errorMessage ? (
                <p role="alert" className="teach-editor__error">
                    {errorMessage}
                </p>
            ) : null}
            <EditorActions>
                <Button variant="outlined" onClick={onUploadImage}>
                    {language === 'he' ? 'העלאת תמונה' : 'Upload image'}
                </Button>
                <Button variant="contained" onClick={onSave}>
                    {language === 'he' ? 'שמירה' : 'Save'}
                </Button>
            </EditorActions>

            <EditorBlock>
                <FieldLabel>{primaryLabel}</FieldLabel>
                <Editor
                    editorState={detailsState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={handleDetailsChange}
                    toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'colorPicker', 'link'],
                        inline: { inDropdown: true },
                        blockType: { inDropdown: true },
                        fontSize: { options: ['12', '14', '16', '18', '24', '32', '48'] }
                    }}
                />
            </EditorBlock>

            <EditorBlock>
                <FieldLabel>{secondaryLabel}</FieldLabel>
                <Editor
                    editorState={descriptionState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={handleDescriptionChange}
                    toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'colorPicker', 'link'],
                        inline: { inDropdown: true },
                        blockType: { inDropdown: true },
                        fontSize: { options: ['12', '14', '16', '18', '24', '32', '48'] }
                    }}
                />
            </EditorBlock>
        </EditorLayout>
    );
};

export default TeachEditor;
