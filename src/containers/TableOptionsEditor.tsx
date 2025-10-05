import React, { useCallback, useMemo } from 'react';

import {
  Container,
  Wrapper,
  SubcategoryBlock,
  DismissButton,
  OptionRow,
  OptionCheckbox,
  OptionName
} from './TableOptionsEditor.styles';
import type { I18nLike, ProjectCategory, ProjectEntity } from './projectTypes';

interface TableOptionsEditorProps {
  selectedSubcategoryName: string | null;
  selectedSubcategoryY: number;
  selectedProject: ProjectEntity | null;
  tableTemplate?: ProjectCategory[] | null;
  setTableOptions: (value: string) => void;
  hideTableOptions: () => void;
  i18n: I18nLike;
}

const TableOptionsEditor: React.FC<TableOptionsEditorProps> = ({
  selectedSubcategoryName,
  selectedSubcategoryY,
  selectedProject,
  tableTemplate,
  setTableOptions,
  hideTableOptions,
  i18n
}) => {
  const lang = i18n?.language ?? 'en';
  const isEnglish = lang === 'en';

  const selectedOptions = useMemo(() => {
    const raw = selectedProject?.extendedContent?.tableOptions;
    return raw
      ? raw
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
      : [];
  }, [selectedProject]);

  const selectedSet = useMemo(() => new Set(selectedOptions), [selectedOptions]);

  const handleOptionStatus = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const optionId = event.target.dataset.id;
      if (!optionId) {
        return;
      }

      const nextSet = new Set(selectedSet);
      if (nextSet.has(optionId)) {
        nextSet.delete(optionId);
      } else {
        nextSet.add(optionId);
      }

      setTableOptions(Array.from(nextSet).join(','));
    },
    [selectedSet, setTableOptions]
  );

  const panelTop = Math.max(selectedSubcategoryY - 80, 0);
  const isVisible = Boolean(selectedSubcategoryName);

  return (
    <Container isVisible={isVisible} isEnglish={isEnglish} style={{ top: panelTop }}>
      <Wrapper>
        {tableTemplate?.map((category) => (
          <SubcategoryBlock key={String(category.id ?? category.name)}>
            {category.categories?.map((subcategory) => {
              if (subcategory.name !== selectedSubcategoryName) {
                return null;
              }

              return (
                <React.Fragment key={String(subcategory.id ?? subcategory.name)}>
                  <DismissButton type="button" isEnglish={isEnglish} onClick={hideTableOptions}>
                    X
                  </DismissButton>
                  {subcategory.options.map((option) => {
                    const optionId = String(option.id ?? option.name);

                    return (
                      <OptionRow key={optionId} isEnglish={isEnglish}>
                        <OptionCheckbox
                          data-id={optionId}
                          type="checkbox"
                          checked={selectedSet.has(optionId)}
                          onChange={handleOptionStatus}
                        />
                        <OptionName>
                          {isEnglish ? option.name : option.nameHebrew || option.name}
                        </OptionName>
                      </OptionRow>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </SubcategoryBlock>
        ))}
      </Wrapper>
    </Container>
  );
};

export default TableOptionsEditor;
