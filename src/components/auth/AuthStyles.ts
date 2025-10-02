import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Button from '../../shared/components/Button';

const PAGE_BACKGROUND = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const CARD_BACKGROUND = 'var(--color-surface, #ffffff)';
const TEXT_PRIMARY = 'var(--color-text-primary, #1f2937)';
const TEXT_MUTED = 'var(--color-text-muted, #6b7280)';
const ACCENT_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const ACCENT_COLOR = 'var(--color-accent-tertiary, #3f67a7)';
const BREAKPOINT_MOBILE = 480;

export const AuthPage = styled('div')`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${PAGE_BACKGROUND};
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

    @media (max-width: ${BREAKPOINT_MOBILE}px) {
        padding: 1rem;
    }
`;

export const AuthCard = styled('section')`
    width: 100%;
    max-width: 420px;
    background: ${CARD_BACKGROUND};
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (max-width: ${BREAKPOINT_MOBILE}px) {
        padding: 2rem;
    }
`;

export const AuthHeader = styled('header')`
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const AuthTitle = styled('h1')`
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: ${TEXT_PRIMARY};

    @media (max-width: ${BREAKPOINT_MOBILE}px) {
        font-size: 1.75rem;
    }
`;

export const AuthSubtitle = styled('p')`
    margin: 0;
    font-size: 1rem;
    color: ${TEXT_MUTED};
`;

export const AuthForm = styled('form')`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const SpinnerWrapper = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem 0;
    text-align: center;
    color: ${TEXT_MUTED};
`;

export const Spinner = styled('div')`
    width: 48px;
    height: 48px;
    border: 4px solid rgba(229, 231, 235, 1);
    border-top: 4px solid rgba(102, 126, 234, 1);
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;

export const ErrorBanner = styled('div')`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    font-size: 0.95rem;
`;

export const ErrorIcon = styled('span')`
    font-size: 1.1rem;
`;

export const SubmitButton = styled(Button)`
    && {
        width: 100%;
        margin-top: 0.75rem;
        padding: 0.875rem 1rem;
        font-size: 1rem;
        font-weight: 600;
        background: ${ACCENT_GRADIENT};
        color: #ffffff;
        border-radius: 8px;
        text-transform: none;
        box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);

        &:hover {
            background: ${ACCENT_GRADIENT};
            box-shadow: 0 12px 30px -5px rgba(102, 126, 234, 0.45);
        }

        &:disabled {
            background: rgba(102, 126, 234, 0.4);
            box-shadow: none;
        }
    }
`;

export const SecondaryAction = styled('p')`
    margin: 0;
    font-size: 0.95rem;
    text-align: center;
    color: ${TEXT_MUTED};
`;

export const SecondaryLink = styled('button')`
    background: none;
    border: none;
    color: ${ACCENT_COLOR};
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    margin-left: 0.35rem;
    text-decoration: underline;

    &:hover {
        text-decoration: none;
    }
`;
