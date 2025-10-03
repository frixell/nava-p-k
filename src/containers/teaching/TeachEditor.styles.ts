import styled from '@emotion/styled';

export const EditorLayout = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: min(640px, 90vw);
`;

export const EditorActions = styled('div')`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const EditorBlock = styled('div')`
  background: var(--color-surface-subtle, #f6f7fb);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: inset 0 0 0 1px rgba(31, 41, 55, 0.08);

  .rdw-editor-toolbar {
    border-radius: 8px 8px 0 0;
    border: 1px solid rgba(31, 41, 55, 0.12);
  }

  .rdw-editor-main {
    min-height: 160px;
    border-radius: 0 0 8px 8px;
    padding: 1rem;
    background: #ffffff;
    border: 1px solid rgba(31, 41, 55, 0.12);
  }
`;

export const FieldLabel = styled('h3')`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: var(--color-text-primary, #1f2937);
`;
