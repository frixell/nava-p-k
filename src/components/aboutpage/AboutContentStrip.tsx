import React, { useEffect, useMemo, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { ContentSection, ContentContainer, Viewer, Note } from './AboutContentStrip.styles';
import { appTokens } from '../../styles/theme';
import { RichTextEditorStyles, useRichTextEditorClassNames } from '../common/RichTextEditorStyles';
import type { AboutPageData } from '../../containers/useAboutPageState';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface AboutContentStripProps {
  isAuthenticated: boolean;
  language: string;
  aboutpage: AboutPageData;
  aboutpageOrigin: AboutPageData | null;
  onContentChange(name: string, value: string): void;
}

const toEditorState = (html?: string) => {
  if (!html) {
    return EditorState.createEmpty();
  }
  const contentBlock = htmlToDraft(html);
  if (!contentBlock) {
    return EditorState.createEmpty();
  }
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks,
    contentBlock.entityMap
  );
  return EditorState.createWithContent(contentState);
};

const AboutContentStrip: React.FC<AboutContentStripProps> = ({
  isAuthenticated,
  language,
  aboutpage,
  aboutpageOrigin,
  onContentChange
}) => {
  const contentKey = language === 'en' ? 'content' : 'contentHebrew';
  const sourceHtml = useMemo(() => {
    const raw = aboutpage?.[contentKey];
    return typeof raw === 'string' ? raw : '';
  }, [aboutpage, contentKey]);
  const [editorState, setEditorState] = useState(() => toEditorState(sourceHtml));
  const { toolbar, editor, fontSize } = useRichTextEditorClassNames();

  useEffect(() => {
    setEditorState(toEditorState(sourceHtml));
  }, [sourceHtml, aboutpageOrigin]);

  const dir: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';

  return (
    <RichTextEditorStyles>
      <ContentSection dir={dir}>
        <ContentContainer>
          {isAuthenticated ? (
            <>
              <Editor
                editorState={editorState}
                toolbarClassName={toolbar}
                wrapperClassName="wrapperClassName"
                editorClassName={editor}
                onEditorStateChange={(nextState: EditorState) => {
                  setEditorState(nextState);
                  const html = draftToHtml(convertToRaw(nextState.getCurrentContent()));
                  onContentChange(contentKey, html);
                }}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'list', 'colorPicker', 'link'],
                  inline: { inDropdown: false },
                  blockType: { inDropdown: true },
                  fontSize: {
                    options: ['12', '14', '16', '18', '20', '24', '32'],
                    className: fontSize
                  },
                  list: { inDropdown: true },
                  colorPicker: { colors: appTokens.colorPickerPalette },
                  link: { inDropdown: true }
                }}
              />
              <Note>
                {language === 'he'
                  ? 'הטקסט יישמר אוטומטית לאחר לחיצה על שמירה'
                  : 'Remember to hit “Save” to publish your edits.'}
              </Note>
            </>
          ) : (
            <Viewer dir={dir} dangerouslySetInnerHTML={{ __html: sourceHtml }} />
          )}
        </ContentContainer>
      </ContentSection>
    </RichTextEditorStyles>
  );
};

export default AboutContentStrip;
