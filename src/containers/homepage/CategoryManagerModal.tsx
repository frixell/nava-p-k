// @ts-nocheck
import React, { useMemo } from 'react';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '../../styles/theme';

const ModalContent = styled.div({
  width: 'min(75vw, 960px)',
  margin: '3rem auto',
  textAlign: 'right',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem'
});

const CategoryRow = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '0.8rem'
});

const ToggleButton = styled.button<{ $isVisible: boolean }>(({ $isVisible }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.8rem',
  height: '2.8rem',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  background: $isVisible ? 'rgba(2, 136, 209, 0.12)' : 'rgba(220, 53, 69, 0.12)',
  transition: 'background 0.2s ease'
}));

const ToggleIcon = styled.img({
  width: '1.6rem',
  pointerEvents: 'none'
});

const OrderInput = styled.input({
  width: '4rem',
  height: '2.4rem',
  borderRadius: '4px',
  border: '1px solid rgba(0,0,0,0.2)',
  textAlign: 'center',
  fontSize: '1.4rem'
});

const NameInputWrapper = styled.div({
  width: '200px'
});

const NameInput = styled.input({
  width: '100%',
  height: '3rem',
  borderRadius: '6px',
  border: '1px solid rgba(0,0,0,0.2)',
  padding: '0 0.6rem',
  fontSize: '1.6rem'
});

const ActionsRow = styled.div({
  textAlign: 'center'
});

const UpdateButton = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.8rem 1.8rem',
  borderRadius: '999px',
  border: 'none',
  background: 'var(--color-accent-alt, #2e7d32)',
  color: 'var(--color-surface, #fff)',
  fontSize: '1.4rem',
  cursor: 'pointer'
});

interface CategoryManagerModalProps {
  isOpen: boolean;
  categories: any[];
  onClose: () => void;
  toggleShowCategory: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onOrderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOrderBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onOrderKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNameBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onUpdateCategories: () => void;
}

const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  categories,
  onClose,
  toggleShowCategory,
  onOrderChange,
  onOrderBlur,
  onOrderKeyPress,
  onNameChange,
  onNameBlur,
  onUpdateCategories
}) => {
  const theme = useTheme() as AppTheme;

  const modalStyles = useMemo(
    () => ({
      overlay: {
        backgroundColor: `var(--color-accent-secondary, ${theme.app.colors.accent.secondary})`
      },
      modal: {
        background: `var(--color-surface, ${theme.app.colors.surface})`,
        maxWidth: '90vw',
        maxHeight: '80vh',
        width: '90vw',
        height: '80vh',
        textAlign: 'right'
      },
      closeButton: {
        position: 'absolute',
        top: theme.app.spacing.sm,
        left: theme.app.spacing.sm,
        border: 'none',
        padding: 0,
        backgroundColor: 'transparent',
        display: 'flex'
      }
    }),
    [theme]
  );

  return (
    <Modal open={isOpen} onClose={onClose} center styles={modalStyles}>
      <ModalContent>
        {categories &&
          categories.length > 0 &&
          categories.map((category, index) => (
            <CategoryRow key={`${category.id}-${index}`} dir="rtl">
              <ToggleButton
                type="button"
                data-id={category.id}
                data-visible={category.isVisible}
                onClick={toggleShowCategory}
                $isVisible={!!category.isVisible}
              >
                <ToggleIcon
                  data-id={category.id}
                  data-visible={category.isVisible}
                  src={`/images/backoffice/${category.isVisible === true ? 'show' : 'hide'}.svg`}
                  alt={category.isVisible === true ? 'הצג' : 'הסתר'}
                />
              </ToggleButton>
              <OrderInput
                id="number"
                data-id={category.id}
                type="number"
                value={category.order || 0}
                data-index={index}
                onChange={onOrderChange}
                onKeyPress={onOrderKeyPress}
                onBlur={onOrderBlur}
              />
              <NameInputWrapper>
                <NameInput
                  data-id={category.id}
                  data-index={index}
                  data-lang="he"
                  type="text"
                  placeholder="שם הקטגוריה"
                  value={category.nameHebrew}
                  onChange={onNameChange}
                  onBlur={onNameBlur}
                  dir="rtl"
                />
              </NameInputWrapper>
              <NameInputWrapper>
                <NameInput
                  data-id={category.id}
                  data-index={index}
                  data-lang="en"
                  type="text"
                  placeholder="Category Name"
                  value={category.name}
                  onChange={onNameChange}
                  onBlur={onNameBlur}
                  dir="ltr"
                />
              </NameInputWrapper>
            </CategoryRow>
          ))}
        <ActionsRow>
          <UpdateButton type="button" onClick={onUpdateCategories}>
            עדכון
          </UpdateButton>
        </ActionsRow>
      </ModalContent>
    </Modal>
  );
};

export default CategoryManagerModal;
