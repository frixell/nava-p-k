import React, { useEffect, useMemo, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { ContentSection, ContentContainer, Viewer, Note } from './AboutContentStrip.styles';
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
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
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
  const sourceHtml = useMemo(() => (aboutpage?.[contentKey] as string) || '', [aboutpage, contentKey]);
  const [editorState, setEditorState] = useState(() => toEditorState(sourceHtml));

  useEffect(() => {
    setEditorState(toEditorState(sourceHtml));
  }, [sourceHtml, aboutpageOrigin]);

  const dir: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';

  return (
    <ContentSection dir={dir}>
      <ContentContainer>
        {isAuthenticated ? (
          <>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={(nextState: EditorState) => {
                setEditorState(nextState);
                const html = draftToHtml(convertToRaw(nextState.getCurrentContent()));
                onContentChange(contentKey, html);
              }}
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'list', 'colorPicker', 'link'],
                inline: { inDropdown: false },
                blockType: { inDropdown: true },
                fontSize: { options: ['12', '14', '16', '18', '20', '24', '32'] },
                list: { inDropdown: true },
                colorPicker: { colors: ['#000000', '#FFFFFF', '#fbc02d', '#53b0a1', '#666665'] },
                link: { inDropdown: true }
              }}
            />
            <Note>{language === 'he' ? 'הטקסט יישמר אוטומטית לאחר לחיצה על שמירה' : 'Remember to hit “Save” to publish your edits.'}</Note>
          </>
        ) : (
          <Viewer dir={dir} dangerouslySetInnerHTML={{ __html: sourceHtml }} />
        )}
      </ContentContainer>
    </ContentSection>
  );
};

export default AboutContentStrip;
