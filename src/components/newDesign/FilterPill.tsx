import React, { forwardRef } from 'react';
import styled from '@emotion/styled';

export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  hasDropdown?: boolean;
}

const PillButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'hasDropdown'
})<FilterPillProps>(({ theme, active = false, hasDropdown = false }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
  borderRadius: '999px',
  border: `1px solid ${active ? theme.app.colors.accent.primary : theme.app.colors.border}`,
  backgroundColor: active ? theme.app.colors.accent.primary : theme.app.colors.surface,
  color: active ? theme.app.colors.text.inverse : theme.app.colors.text.primary,
  fontFamily: theme.app.typography.fontFamilyBase,
  fontSize: theme.app.typography.variants.body.fontSize,
  fontWeight: active ? theme.app.typography.weights.medium : theme.app.typography.weights.regular,
  lineHeight: theme.app.typography.variants.body.lineHeight,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    backgroundColor: active ? theme.app.colors.accent.secondary : theme.app.colors.surfaceMuted,
    color: active ? theme.app.colors.text.inverse : theme.app.colors.text.primary,
    borderColor: theme.app.colors.accent.secondary
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.app.colors.accent.tertiary}`,
    outlineOffset: '2px'
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.6
  },
  '&::after': hasDropdown
    ? {
        content: '""',
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        borderTop: `6px solid ${active ? theme.app.colors.text.inverse : theme.app.colors.text.primary}`,
        marginLeft: theme.spacing(0.5),
        transform: active ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.2s ease'
      }
    : undefined
}));

const FilterPill = forwardRef<HTMLButtonElement, FilterPillProps>(
  ({ active, hasDropdown, children, ...rest }, ref) => (
    <PillButton ref={ref} active={active} hasDropdown={hasDropdown} {...rest}>
      {children}
    </PillButton>
  )
);

FilterPill.displayName = 'FilterPill';

export default FilterPill;
