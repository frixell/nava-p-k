import React from 'react';
import SeoModal, { SeoFormState } from '../shared/components/backoffice/SeoModal';

interface CvSeoModalProps {
  open: boolean;
  language: string;
  seo: SeoFormState;
  onChange(field: keyof SeoFormState, value: string): void;
  onSubmit(): void;
  onClose(): void;
}

const labels = {
  he: {
    titlePlaceholder: 'כותרת לדף (title)',
    descriptionPlaceholder: 'תיאור',
    keywordsPlaceholder: 'מילות מפתח',
    submit: 'עדכון',
    heading: 'SEO'
  },
  en: {
    titlePlaceholder: 'Page title',
    descriptionPlaceholder: 'Description',
    keywordsPlaceholder: 'Keywords',
    submit: 'Update',
    heading: 'SEO'
  }
};

const CvSeoModal: React.FC<CvSeoModalProps> = ({
  open,
  language,
  seo,
  onChange,
  onSubmit,
  onClose
}) => {
  const dir = language === 'he' ? 'rtl' : 'ltr';
  const localizedLabels = language === 'he' ? labels.he : labels.en;

  return (
    <SeoModal
      open={open}
      dir={dir}
      formState={seo}
      onChange={onChange}
      onSubmit={onSubmit}
      onClose={onClose}
      labels={localizedLabels}
      readonlyPreview={seo}
    />
  );
};

export default CvSeoModal;
