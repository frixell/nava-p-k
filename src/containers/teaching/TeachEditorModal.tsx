import React from 'react';
import Modal from 'react-responsive-modal';
import TeachEditor from './TeachEditor';
import type { TeachItem } from './types';

interface TeachEditorModalProps {
  open: boolean;
  language: string;
  teach: TeachItem | null;
  errorMessage?: string | null;
  onClose(): void;
  onChange(field: keyof TeachItem, value: unknown): void;
  onSave(): void;
  onUploadImage(): void;
}

const TeachEditorModal: React.FC<TeachEditorModalProps> = ({
  open,
  language,
  teach,
  errorMessage,
  onClose,
  onChange,
  onSave,
  onUploadImage
}) => {
  if (!open || !teach) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose} center>
      <TeachEditor
        language={language}
        teach={teach}
        errorMessage={errorMessage}
        onChange={onChange}
        onSave={onSave}
        onUploadImage={onUploadImage}
      />
    </Modal>
  );
};

export default TeachEditorModal;
