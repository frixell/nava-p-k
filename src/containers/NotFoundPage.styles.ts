import styled from '@emotion/styled';

const ACCENT_COLOR = 'var(--color-accent-primary, #3f67a7)';
const MOBILE_BREAKPOINT = 767;

export const PageWrapper = styled('div')`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

export const HeroSection = styled('main')`
    display: flex;
    justify-content: center;
    padding: 3.4rem 0 0;
    background: rgba(66, 66, 66, 0.09);
`;

export const Panel = styled('section')`
    position: relative;
    width: 90rem;
    text-align: center;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        width: 100vw;
    }
`;

export const Title = styled('h1')`
    margin: 6rem 0 0;
    font-size: 18rem;
    color: ${ACCENT_COLOR};
    font-family: 'Heebo', 'Rubik', 'Segoe UI', sans-serif;
    font-weight: 500;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 12rem;
        margin-top: 4rem;
    }
`;

export const Subtitle = styled('h2')`
    margin: 0.8rem 0 3rem;
    font-size: 5rem;
    color: ${ACCENT_COLOR};
    font-family: 'Heebo', 'Rubik', 'Segoe UI', sans-serif;
    font-weight: 500;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 3rem;
    }
`;

export const ActionBar = styled('div')<{ dir: 'ltr' | 'rtl' }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 29.6rem;
    height: 3rem;
    margin: 0 auto 4rem;
    direction: ${(props) => props.dir};

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        width: auto;
    }
`;

export const ActionButton = styled('button')`
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    transition: transform 120ms ease-in;
    transform: scale(1);
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
    }
`;

export const ActionText = styled('span')`
    margin: 1rem 0 3rem 0.3rem;
    font-size: 1.75rem;
    color: ${ACCENT_COLOR};
    font-family: 'Heebo', 'Rubik', 'Segoe UI', sans-serif;
    font-weight: 500;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 2.5rem;
    }
`;
