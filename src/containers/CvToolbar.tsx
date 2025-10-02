import React, { useMemo } from 'react';
import BackofficeToolbar from '../shared/components/backoffice/BackofficeToolbar';

interface CvToolbarProps {
  isAuthenticated: boolean;
  isEnglish: boolean;
  needSave: boolean;
  onSave(): void;
  onSeo(): void;
  onExit(): void;
  translate(key: string, defaultValue: string): string;
}

const CvToolbar: React.FC<CvToolbarProps> = ({
  isAuthenticated,
  isEnglish,
  needSave,
  onSave,
  onSeo,
  onExit,
  translate
}) => {
  const actions = useMemo(() => (
    [
      {
        id: 'exit',
        label: translate('exit', 'Exit'),
        iconSrc: '/images/backoffice/exit.svg',
        onClick: onExit,
        leftHe: '10%',
        leftEn: '90%',
        alt: translate('exit', 'Exit')
      },
      {
        id: 'save-project',
        label: translate('save', 'Save'),
        iconSrc: '/images/backoffice/save.svg',
        onClick: onSave,
        leftHe: '15%',
        leftEn: '85%',
        dirty: needSave,
        alt: translate('save', 'Save')
      },
      {
        id: 'seo',
        label: 'SEO',
        iconSrc: '/images/backoffice/edit.svg',
        onClick: onSeo,
        leftHe: '20%',
        leftEn: '80%',
        dirty: needSave,
        alt: 'SEO'
      }
    ]
  ), [needSave, onExit, onSave, onSeo, translate]);

  if (!isAuthenticated) {
    return null;
  }

  return <BackofficeToolbar isEnglish={isEnglish} actions={actions} />;
};

export default CvToolbar;
