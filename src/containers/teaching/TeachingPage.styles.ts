import styled from '@emotion/styled';

export const PageWrapper = styled('div')`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--color-surface, #ffffff);
`;

export const ContentSection = styled('main')`
    display: flex;
    justify-content: center;
    padding: 3rem 0 6rem;
`;

export const ContentInner = styled('div')`
    width: min(90rem, 100%);
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const HeaderContainer = styled('div')`
    text-align: center;
`;

export const HeaderTitle = styled('h1')`
    margin: 0;
    font-size: 3.4rem;
    color: var(--color-text-primary, #1f2937);
    font-family: 'Heebo', 'Rubik', 'Segoe UI', sans-serif;
`;

export const TeachGrid = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
`;
