import React from 'react';
import Modal from 'react-responsive-modal';
import Button from '@mui/material/Button';
import { SeoModalContainer, SeoColumn, SeoInput, SeoTextarea, SeoHeading } from './SeoModal.styles';

export interface SeoFormState {
  title: string;
  description: string;
  keyWords: string;
}

interface SeoModalProps {
  open: boolean;
  dir?: 'ltr' | 'rtl';
  formState: SeoFormState;
  onChange(field: keyof SeoFormState, value: string): void;
  onSubmit(): void;
  onClose(): void;
  labels?: {
    titlePlaceholder?: string;
    descriptionPlaceholder?: string;
    keywordsPlaceholder?: string;
    submit?: string;
    heading?: string;
  };
  readonlyPreview?: SeoFormState;
}

const defaultLabels = {
  titlePlaceholder: 'Page title',
  descriptionPlaceholder: 'Description',
  keywordsPlaceholder: 'Keywords',
  submit: 'Update',
  heading: 'SEO'
};

const SeoModal: React.FC<SeoModalProps> = ({
  open,
  dir = 'rtl',
  formState,
  onChange,
  onSubmit,
  onClose,
  labels = defaultLabels,
  readonlyPreview
}) => {
  const mergedLabels = { ...defaultLabels, ...labels };

  const handleInputChange =
    (field: keyof SeoFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <Modal open={open} onClose={onClose} center>
      <SeoModalContainer dir={dir}>
        <SeoHeading>{mergedLabels.heading}</SeoHeading>
        <SeoColumn aria-label="SEO Form">
          <SeoInput
            placeholder={mergedLabels.titlePlaceholder}
            value={formState.title}
            onChange={handleInputChange('title')}
          />
          <SeoTextarea
            placeholder={mergedLabels.descriptionPlaceholder}
            value={formState.description}
            onChange={handleInputChange('description')}
          />
          <SeoTextarea
            placeholder={mergedLabels.keywordsPlaceholder}
            value={formState.keyWords}
            onChange={handleInputChange('keyWords')}
          />
          <Button variant="contained" onClick={onSubmit}>
            {mergedLabels.submit}
          </Button>
        </SeoColumn>
        <SeoColumn aria-label="SEO Preview" data-readonly>
          <SeoInput value={readonlyPreview?.title ?? ''} readOnly />
          <SeoTextarea value={readonlyPreview?.description ?? ''} readOnly />
          <SeoTextarea value={readonlyPreview?.keyWords ?? ''} readOnly />
        </SeoColumn>
      </SeoModalContainer>
    </Modal>
  );
};

export default SeoModal;
