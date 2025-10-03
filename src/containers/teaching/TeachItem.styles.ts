import styled from '@emotion/styled';

interface ContentRowProps {
  isHebrew: boolean;
}

export const Card = styled('article')`
  position: relative;
  background: var(--color-surface, #ffffff);
  border-radius: 16px;
  box-shadow: 0 25px 45px -20px rgba(31, 41, 55, 0.25);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CardHeader = styled('header')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const Actions = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ContentRow = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isHebrew'
})<ContentRowProps>`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: ${({ isHebrew }) => (isHebrew ? 'row-reverse' : 'row')};
    gap: 2rem;
    align-items: flex-start;
  }
`;

export const Image = styled('img')`
  align-self: center;
  max-width: 100%;
  max-height: 450px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 18px 30px -12px rgba(31, 41, 55, 0.35);
`;

export const TextColumn = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 240px;
`;

export const HtmlBlock = styled('div')`
  font-family: 'Heebo', 'Rubik', 'Segoe UI', sans-serif;
  font-size: 1.05rem;
  color: var(--color-text-primary, #1f2937);

  p {
    margin: 0 0 0.75rem;
  }
`;

export const OrderField = styled('input')`
  width: 64px;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid rgba(31, 41, 55, 0.15);
  font-size: 0.95rem;
`;
