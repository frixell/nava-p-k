import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import FilterPill from './FilterPill';

export interface FilterDropdownOption {
  id: string;
  label: string;
  description?: string;
}

export interface FilterDropdownProps {
  label: string;
  options: FilterDropdownOption[];
  selectedId?: string | null;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
  className?: string;
}

const Wrapper = styled('div')({
  position: 'relative',
  display: 'inline-flex'
});

const DropdownPanel = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  right: 0,
  minWidth: '240px',
  backgroundColor: theme.app.colors.surface,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.app.colors.border}`,
  boxShadow: theme.app.shadows.card,
  zIndex: theme.zIndex.modal,
  maxHeight: '280px',
  overflowY: 'auto'
}));

const OptionButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active: boolean }>(({ theme, active }) => ({
  width: '100%',
  padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
  border: 0,
  backgroundColor: active ? theme.app.colors.surfaceMuted : 'transparent',
  color: theme.app.colors.text.primary,
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  fontFamily: theme.app.typography.fontFamilyBase,
  fontSize: theme.app.typography.variants.body.fontSize,
  lineHeight: theme.app.typography.variants.body.lineHeight,
  '&:hover': {
    backgroundColor: theme.app.colors.surfaceMuted
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.app.colors.accent.tertiary}`,
    outlineOffset: '-2px'
  }
}));

const OptionDescription = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.app.colors.text.muted
}));

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedId,
  onSelect,
  disabled,
  className
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedId) ?? null,
    [options, selectedId]
  );

  const closeDropdown = useCallback(() => setOpen(false), []);

  const handleDocumentClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        listRef.current &&
        buttonRef.current &&
        !listRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [open, handleDocumentClick]);

  const handleToggle = useCallback(() => {
    if (disabled) {
      return;
    }
    setOpen((prev) => !prev);
  }, [disabled]);

  const handleSelect = useCallback(
    (optionId: string) => () => {
      onSelect(optionId);
      closeDropdown();
    },
    [onSelect, closeDropdown]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setOpen(true);
        const firstOption = listRef.current?.querySelector<HTMLButtonElement>('button');
        firstOption?.focus();
      }
    },
    [disabled]
  );

  return (
    <Wrapper className={className}>
      <FilterPill
        ref={buttonRef}
        type="button"
        active={open || Boolean(selectedOption)}
        hasDropdown
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="homepage-filter-dropdown"
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {selectedOption?.label ?? label}
      </FilterPill>
      {open ? (
        <DropdownPanel
          ref={listRef}
          role="listbox"
          id="homepage-filter-dropdown"
          aria-activedescendant={selectedOption?.id}
        >
          {options.map((option) => (
            <OptionButton
              key={option.id}
              type="button"
              role="option"
              aria-selected={selectedId === option.id}
              active={selectedId === option.id}
              onClick={handleSelect(option.id)}
            >
              <span>{option.label}</span>
              {option.description ? (
                <OptionDescription>{option.description}</OptionDescription>
              ) : null}
            </OptionButton>
          ))}
        </DropdownPanel>
      ) : null}
    </Wrapper>
  );
};

export default FilterDropdown;
