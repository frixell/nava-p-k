import styled from '@emotion/styled';

export const Container = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isHidden'
})<{ isHidden: boolean }>`
  position: absolute;
  z-index: 1602;
  top: 10px;
  left: 200px;
  color: var(--color-text-secondary, #6c7680);
  font-size: 11px;
  width: 400px;
  min-height: 300px;
  border-top: 1px solid rgba(0, 0, 0, 0.9);
  border-left: 1px solid rgba(0, 0, 0, 0.9);
  border-right: 1px solid rgba(0, 0, 0, 0.9);
  display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
  flex-direction: column;
  background: var(--color-surface, #ffffff);
  box-shadow: 0 14px 30px -12px rgba(31, 41, 55, 0.18);
  border-radius: 8px;
  overflow: hidden;
`;

export const Header = styled('button')`
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  background: var(--color-panel-accent, #6c7680);
  color: var(--color-surface, #ffffff);
  cursor: pointer;
  border: none;
  text-align: left;
`;

export const List = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const Row = styled('label')`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.9);
  font-size: 12px;
`;

export const Checkbox = styled('input')`
  width: 16px;
  height: 16px;
`;

export const Name = styled('span')`
  flex: 1;
  line-height: 1.1;
`;
