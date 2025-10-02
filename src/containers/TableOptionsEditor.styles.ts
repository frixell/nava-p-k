import styled from '@emotion/styled';

export const Container = styled('div', {
    shouldForwardProp: (prop) => prop !== 'isVisible' && prop !== 'isEnglish'
})<{ isVisible: boolean; isEnglish: boolean }>`
    position: absolute;
    z-index: 602;
    top: 0;
    left: ${({ isEnglish }) => (isEnglish ? '640px' : '230px')};
    color: var(--color-text-secondary, #6c7680);
    font-size: 11px;
    width: 400px;
    border-top: 1px solid rgba(0, 0, 0, 0.9);
    border-left: 1px solid rgba(0, 0, 0, 0.9);
    border-right: 1px solid rgba(0, 0, 0, 0.9);
    display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
    flex-direction: column;
    background: var(--color-surface, #ffffff);
    box-shadow: 0 14px 30px -12px rgba(31, 41, 55, 0.2);
    border-radius: 8px;
    overflow: hidden;
`;

export const Wrapper = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const SubcategoryBlock = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const DismissButton = styled('button', {
    shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    background: var(--color-panel-accent, #6c7680);
    color: var(--color-surface, #ffffff);
    cursor: pointer;
    text-align: ${({ isEnglish }) => (isEnglish ? 'left' : 'right')};
    border: none;
`;

export const OptionRow = styled('label', {
    shouldForwardProp: (prop) => prop !== 'isEnglish'
})<{ isEnglish: boolean }>`
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: ${({ isEnglish }) => (isEnglish ? 'row' : 'row-reverse')};
    justify-content: ${({ isEnglish }) => (isEnglish ? 'flex-start' : 'flex-end')};
    text-align: ${({ isEnglish }) => (isEnglish ? 'left' : 'right')};
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.9);
    font-size: 12px;
`;

export const OptionCheckbox = styled('input')`
    width: 16px;
    height: 16px;
`;

export const OptionName = styled('span')`
    flex: 1;
    line-height: 1.1;
`;
