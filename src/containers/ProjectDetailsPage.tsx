import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import AutosizeInput from 'react-input-autosize';

import {
  RichTextEditorStyles,
  useRichTextEditorClassNames
} from '../components/common/RichTextEditorStyles';
import ProjectCategoriesEditor from './ProjectCategoriesEditor';
import TableOptionsEditor from './TableOptionsEditor';
import {
  BackButton,
  CategoryName,
  CategoryPanel,
  CategoryRow,
  Container,
  EditorWrapper,
  Heading,
  ImagePreview,
  ImageWrapper,
  OptionList,
  OptionName,
  PrimaryColumn,
  ReadOnlyContent,
  SecondaryColumn,
  SubcategoryColumn,
  SubcategoryName,
  SubcategoryRow,
  TitleBar
} from './ProjectDetailsPage.styles';
import type {
  ChangeEventPayload,
  I18nLike,
  ProjectCategory,
  ProjectEntity,
  ProjectSubcategory
} from './projectTypes';

const COLOR_ICON_DATA =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQ5NS41NzggNDk1LjU3OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk1LjU3OCA0OTUuNTc4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0U2QkU5NDsiIGQ9Ik00MzkuMjA4LDIxNS41NzhjLTQ2Ljk3NS01My41MjktOTYtNjUuOTczLTk2LTEyNWMwLTY0LjMzMy01NC4zMzMtMTEzLjY2Ny0xNDkuNDI5LTc5LjMyMQoJCQlDOTEuODE2LDQ4LjA4MywyMS4yMDgsMTM2LjkxMSwyMS4yMDgsMjQ3LjU3OGMwLDEzNi45NjYsMTExLjAzMywyNDgsMjQ4LDI0OGMyMi41MjcsMCw0NC4zNTQtMy4wMDQsNjUuMDk5LTguNjMybC0wLjAwNi0wLjAyNgoJCQlDNDM5LjIwOCw0NTYuNTc4LDUyNS4yMDgsMzEzLjU3OCw0MzkuMjA4LDIxNS41Nzh6IE0zMzMuNzA5LDE4OS42OWMtMTQuNTAxLDE4LjU1NS01NC42NjgsNy43MDctNzAuMTctMTguNTQ3CgkJCWMtMTMuNjY0LTIzLjE0LTguNjY0LTU2LjIzMiwxNC45ODgtNzAuODIyYzEzLjcxLTguNDU3LDMxLjc5MS0wLjEzNSwzNS4yMzEsMTUuNjAyYzIuOCwxMi44MDYsOC41NDMsMjguNjcxLDIwLjIzOSw0My4xODcKCQkJQzM0MS4xMjUsMTY3Ljk2LDM0MC43MDcsMTgwLjczNiwzMzMuNzA5LDE4OS42OXoiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGNEYxOTsiIGN4PSIxNjUuMDk4IiBjeT0iMTM1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGOEM2MjsiIGN4PSIxNzYuOTQiIGN5PSIxMjMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGQ0QwMDsiIGN4PSIxMTcuMDk4IiBjeT0iMjU1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRTY3MTsiIGN4PSIxMjguOTQiIGN5PSIyNDMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzAwQzM3QTsiIGN4PSIxNzIuODc5IiBjeT0iMzY3LjQ2OSIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzYwREM0RDsiIGN4PSIxODQuNzIiIGN5PSIzNTUuNDk2IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzRDRDdGRjsiIGN4PSIyOTMuMDk4IiBjeT0iNDA3LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0FFRUZGRjsiIGN4PSIzMDQuOTM5IiBjeT0iMzk1LjcxNSIgcj0iMTYuNzYyIi8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiMwMDlCQ0E7IiBjeD0iMzgxLjA5OCIgY3k9IjMxOS40NjkiIHI9IjQ3Ljg5Ii8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiM0Q0Q3RkY7IiBjeD0iMzkyLjkzOSIgY3k9IjMwNy40OTYiIHI9IjE2Ljc2MiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';

const createEditorState = (html?: string | null): EditorState => {
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

interface CategoryItem {
  id?: string | number;
  name: string;
  nameHebrew?: string;
}

interface ProjectDetailsPageProps {
  selectedProject: ProjectEntity | null;
  isAuthenticated: boolean;
  tableTemplate?: ProjectCategory[] | null;
  categories?: CategoryItem[] | null;
  i18n: I18nLike;
  onChange: (event: ChangeEventPayload) => void;
  hideProject: () => void;
  uploadWidget: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

type AutosizeInputFieldProps = React.ComponentProps<typeof AutosizeInput> & {
  className?: string;
};

const AutosizeInputField: React.FC<AutosizeInputFieldProps> = ({
  className,
  inputClassName,
  ...rest
}) => <AutosizeInput {...rest} inputClassName={className ?? inputClassName} />;

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({
  selectedProject,
  isAuthenticated,
  tableTemplate,
  categories,
  i18n,
  onChange,
  hideProject,
  uploadWidget
}) => {
  const language = i18n?.language ?? 'en';
  const isEnglish = language === 'en';

  const extendedContent = selectedProject?.extendedContent ?? {};

  const contentHtml = useMemo(
    () =>
      isEnglish
        ? extendedContent.content
        : extendedContent.contentHebrew || extendedContent.content || '',
    [extendedContent.content, extendedContent.contentHebrew, isEnglish]
  );

  const [editorState, setEditorState] = useState<EditorState>(() => createEditorState(contentHtml));
  const { toolbar, editor, blockType, fontSize, fontFamily } = useRichTextEditorClassNames();
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string | null>(null);
  const [selectedSubcategoryY, setSelectedSubcategoryY] = useState(0);
  const [hideCategoryEditor, setHideCategoryEditor] = useState(true);

  useEffect(() => {
    setEditorState(createEditorState(contentHtml));
  }, [contentHtml]);

  const forwardChange = useCallback(
    (name: string, value: string) => {
      const payload: ChangeEventPayload = {
        target: {
          value,
          dataset: {
            action: 'setString',
            name
          }
        }
      };

      onChange(payload);
    },
    [onChange]
  );

  const handleEditorStateChange = useCallback(
    (nextState: EditorState) => {
      setEditorState(nextState);
      const currentValue = draftToHtml(convertToRaw(nextState.getCurrentContent()));
      forwardChange('content', currentValue);
    },
    [forwardChange]
  );

  const handleProjectTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      forwardChange('title', event.target.value);
    },
    [forwardChange]
  );

  const handleTableOptionsChange = useCallback(
    (tableOptions: string) => {
      forwardChange('tableOptions', tableOptions);
    },
    [forwardChange]
  );

  const handleProjectCategoriesChange = useCallback(
    (categoriesValue: string) => {
      forwardChange('categories', categoriesValue);
    },
    [forwardChange]
  );

  const handleSubcategorySelect = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const dataTarget = event.target as HTMLElement;
    const subcategoryName =
      dataTarget.dataset?.name || (event.currentTarget as HTMLElement).dataset?.name;
    if (!subcategoryName) {
      return;
    }

    setSelectedSubcategoryName(subcategoryName);
    setSelectedSubcategoryY(event.pageY);
  }, []);

  const hideTableOptions = useCallback(() => {
    setSelectedSubcategoryName(null);
    setSelectedSubcategoryY(0);
  }, []);

  const toggleCategoryEditor = useCallback(() => {
    setHideCategoryEditor((previous) => !previous);
  }, []);

  const selectedOptionIds = useMemo(() => {
    const raw = extendedContent.tableOptions;
    return raw
      ? raw
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
      : [];
  }, [extendedContent.tableOptions]);

  const localizedTitle = isEnglish
    ? extendedContent.title
    : extendedContent.titleHebrew || extendedContent.title;

  if (!selectedProject) {
    return null;
  }

  return (
    <RichTextEditorStyles>
      <Container isEnglish={isEnglish}>
        {isAuthenticated && (
          <TableOptionsEditor
            selectedSubcategoryName={selectedSubcategoryName}
            selectedSubcategoryY={selectedSubcategoryY}
            selectedProject={selectedProject}
            tableTemplate={tableTemplate}
            setTableOptions={handleTableOptionsChange}
            hideTableOptions={hideTableOptions}
            i18n={i18n}
          />
        )}

        {isAuthenticated && (
          <ProjectCategoriesEditor
            hideCategoryEditor={hideCategoryEditor}
            toggleCategoryEditor={toggleCategoryEditor}
            categories={categories}
            selectedProject={selectedProject}
            setProjectCategories={handleProjectCategoriesChange}
          />
        )}

        <PrimaryColumn>
          <BackButton type="button" onClick={hideProject} isEnglish={isEnglish}>
            {isEnglish ? 'Back' : 'חזרה'}
          </BackButton>

          {isAuthenticated ? (
            <TitleBar>
              <AutosizeInputField
                className="event__header__input Heebo-Regular"
                placeholder="Project Title"
                value={localizedTitle || ''}
                onChange={handleProjectTitle}
                inputStyle={{ direction: 'ltr' }}
              />
            </TitleBar>
          ) : (
            <Heading isEnglish={isEnglish}>{localizedTitle}</Heading>
          )}

          <CategoryPanel isEnglish={isEnglish}>
            {tableTemplate?.map((category: ProjectCategory) => (
              <CategoryRow key={String(category.id ?? category.name)}>
                <CategoryName isEnglish={isEnglish} backgroundColor={category.color}>
                  {isEnglish ? category.name : category.nameHebrew || category.name}
                </CategoryName>
                <SubcategoryColumn>
                  {(category.categories ?? []).map((subcategory: ProjectSubcategory) => (
                    <SubcategoryRow key={String(subcategory.id ?? subcategory.name)}>
                      <SubcategoryName isEnglish={isEnglish}>
                        {isEnglish ? subcategory.name : subcategory.nameHebrew || subcategory.name}
                      </SubcategoryName>
                      <OptionList
                        isInteractive={isAuthenticated}
                        data-name={subcategory.name}
                        onClick={isAuthenticated ? handleSubcategorySelect : undefined}
                      >
                        {(subcategory.options ?? []).map((option) => {
                          const optionId = String(option.id ?? option.name);
                          if (!selectedOptionIds.includes(optionId)) {
                            return null;
                          }

                          return (
                            <OptionName
                              key={optionId}
                              isEnglish={isEnglish}
                              data-name={subcategory.name}
                            >
                              {isEnglish ? option.name : option.nameHebrew || option.name}
                            </OptionName>
                          );
                        })}
                      </OptionList>
                    </SubcategoryRow>
                  ))}
                </SubcategoryColumn>
              </CategoryRow>
            ))}
          </CategoryPanel>

          <ImageWrapper>
            {isAuthenticated && (
              <div
                className={`backoffice__about__images__buttons${isEnglish ? ' backoffice__about__images__buttons--en' : ' backoffice__about__images__buttons--he'}`}
              >
                <div className="backoffice__toolbar__label--black">
                  {isEnglish ? 'Image' : 'ניהול תמונה'}
                </div>
                <button
                  className="backoffice__events__events__add__button"
                  onClick={uploadWidget}
                  type="button"
                >
                  <img
                    className="backoffice__events__events__add__icon"
                    src="/images/eventspage/add-eventSubcategory-icon.svg"
                    alt={isEnglish ? 'Add image' : 'הוספת תמונה'}
                  />
                </button>
              </div>
            )}
            {extendedContent.image && (
              <ImagePreview
                src={extendedContent.image}
                alt={isEnglish ? 'Project image' : 'תמונת פרויקט'}
              />
            )}
          </ImageWrapper>
        </PrimaryColumn>

        <SecondaryColumn>
          <EditorWrapper>
            {isAuthenticated ? (
              <Editor
                editorState={editorState}
                toolbarClassName={toolbar}
                wrapperClassName="wrapperClassName"
                editorClassName={editor}
                onEditorStateChange={handleEditorStateChange}
                toolbar={{
                  options: ['blockType', 'fontFamily', 'fontSize', 'colorPicker', 'link'],
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  blockType: {
                    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                    className: blockType
                  },
                  fontSize: {
                    options: [
                      '6',
                      '7',
                      '8',
                      '9',
                      '10',
                      '11',
                      '12',
                      '13',
                      '14',
                      '15',
                      '16',
                      '17',
                      '18',
                      '19',
                      '20',
                      '21',
                      '22',
                      '23',
                      '24',
                      '25',
                      '26',
                      '27',
                      '28',
                      '29',
                      '30',
                      '31',
                      '32',
                      '33',
                      '34',
                      '35',
                      '36',
                      '37',
                      '38',
                      '39',
                      '40',
                      '48',
                      '60',
                      '72'
                    ],
                    className: fontSize
                  },
                  fontFamily: {
                    options: ['Heebo-Regular', 'Heebo-Medium', 'Heebo-Bold'],
                    className: fontFamily,
                    component: undefined,
                    dropdownClassName: fontFamily
                  },
                  colorPicker: {
                    icon: COLOR_ICON_DATA,
                    className: 'demo-icon',
                    component: undefined,
                    popupClassName: undefined,
                    colors: [
                      'rgb(255,255,255)',
                      'rgb(252,193,48)',
                      'rgb(83,176,161)',
                      'rgba(102,102,101)',
                      'rgb(0,0,0)',
                      'rgba(0,0,0,0)'
                    ]
                  }
                }}
              />
            ) : (
              <ReadOnlyContent
                isEnglish={isEnglish}
                dangerouslySetInnerHTML={{ __html: contentHtml || '' }}
              />
            )}
          </EditorWrapper>
        </SecondaryColumn>
      </Container>
    </RichTextEditorStyles>
  );
};

export default ProjectDetailsPage;
