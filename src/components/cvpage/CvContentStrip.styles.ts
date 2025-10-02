import styled from '@emotion/styled';

export const Container = styled('div', {
    shouldForwardProp: (prop) => prop !== 'direction'
})<{ direction: 'ltr' | 'rtl' }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    direction: ${({ direction }) => direction};
`;

export const HeaderBox = styled('div')`
    width: 100%;
`;

export const ContentWrapper = styled('div')`
    color: var(--color-text-secondary, #6c7680);
    font-size: 14px;
    line-height: 17px;
    width: 100%;
    margin: 0 auto;
    padding-top: 2px;

    @media (min-width: 768px) {
        width: 60%;
    }
`;

export const EditorShell = styled('div')`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const ReadOnlyContent = styled('div')`
    width: 100%;
    font-size: inherit;
    line-height: inherit;

    & p {
        margin-bottom: 0.75rem;
    }
`;
