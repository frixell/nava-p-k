import React from 'react';
import {
  ToolbarRoot,
  ToolbarButton,
  ToolbarLabel,
  ToolbarActionButton,
  ToolbarActionIcon
} from './BackofficeToolbar.styles';

interface ToolbarAction {
  id: string;
  label: string;
  iconSrc: string;
  onClick: () => void;
  leftHe: string;
  leftEn: string;
  dirty?: boolean;
  alt: string;
}

interface BackofficeToolbarProps {
  isEnglish: boolean;
  actions: ToolbarAction[];
}

const BackofficeToolbar: React.FC<BackofficeToolbarProps> = ({ isEnglish, actions }) => {
  return (
    <ToolbarRoot aria-label="Backoffice actions">
      {actions.map(({ id, label, iconSrc, onClick, leftHe, leftEn, dirty, alt }) => (
        <ToolbarButton key={id} left={isEnglish ? leftEn : leftHe}>
          <ToolbarLabel isDirty={dirty}>{label}</ToolbarLabel>
          <ToolbarActionButton onClick={onClick} type="button">
            <ToolbarActionIcon src={iconSrc} alt={alt} />
          </ToolbarActionButton>
        </ToolbarButton>
      ))}
    </ToolbarRoot>
  );
};

export default BackofficeToolbar;
