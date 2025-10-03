import React from 'react';
import TeachItem from './TeachItem';
import type { TeachItem as TeachItemType } from './types';
import { TeachGrid } from './TeachingPage.styles';

interface TeachListProps {
  teachings: TeachItemType[];
  language: string;
  isAuthenticated: boolean;
  onEdit(teach: TeachItemType): void;
  onDelete(id: string): void;
  onToggleVisibility(id: string, visible: boolean): void;
  onOrderChange(id: string, order: number): void;
  onOrderCommit(id: string, order: number): Promise<void>;
}

const TeachList: React.FC<TeachListProps> = ({
  teachings,
  language,
  isAuthenticated,
  onEdit,
  onDelete,
  onToggleVisibility,
  onOrderChange,
  onOrderCommit
}) => (
  <TeachGrid>
    {teachings.map((teach) => (
      <TeachItem
        key={teach.id}
        teach={teach}
        language={language}
        isAuthenticated={isAuthenticated}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleVisibility={onToggleVisibility}
        onOrderChange={onOrderChange}
        onOrderCommit={onOrderCommit}
      />
    ))}
  </TeachGrid>
);

export default TeachList;
