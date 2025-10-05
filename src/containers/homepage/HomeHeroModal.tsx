import React, { useMemo } from 'react';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styled from '@emotion/styled';
import { AvatarFrame } from '../../components/newDesign';
import { HERO_METRIC_DEFINITIONS } from '../../constants/homeHeroMetrics';
import type { HeroDraft } from './heroTypes';

interface HomeHeroModalProps {
  isOpen: boolean;
  isSaving: boolean;
  heroDraft: HeroDraft;
  onClose: () => void;
  onSave: () => void;
  onUploadPortrait: () => void;
  onClearPortrait: () => void;
  onMetricChange: (
    metricId: string,
    field: 'value' | 'label' | 'valueHe' | 'labelHe',
    nextValue: string
  ) => void;
}

const ModalLayout = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(200px, 240px) 1fr',
  gap: theme.app.spacing.xl,
  width: 'min(960px, 90vw)',
  alignItems: 'flex-start',
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr',
    textAlign: 'center'
  }
}));

const ControlsColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.md,
  alignItems: 'center'
}));

const ButtonGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.sm,
  width: '100%'
}));

const ActionButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant?: 'primary' | 'ghost' }>(({ theme, variant = 'primary' }) => ({
  padding: `${theme.app.spacing.sm} ${theme.app.spacing.md}`,
  borderRadius: '999px',
  border: variant === 'primary' ? 'none' : `1px solid ${theme.app.colors.border}`,
  backgroundColor: variant === 'primary' ? theme.app.colors.accent.primary : 'transparent',
  color: variant === 'primary' ? theme.app.colors.text.inverse : theme.app.colors.text.primary,
  cursor: 'pointer',
  fontFamily: theme.app.typography.fontFamilyBase,
  fontWeight: theme.app.typography.weights.medium,
  transition: 'background 0.2s ease, color 0.2s ease, border 0.2s ease',
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  '&:hover:enabled': {
    backgroundColor:
      variant === 'primary' ? theme.app.colors.accent.secondary : theme.app.colors.surfaceMuted
  }
}));

const MetricsColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing.lg
}));

const MetricCard = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.app.colors.border}`,
  borderRadius: '16px',
  padding: theme.app.spacing.lg,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: theme.app.spacing.md
}));

const MetricHeading = styled('h3')(({ theme }) => ({
  gridColumn: '1 / -1',
  margin: `0 0 ${theme.app.spacing.sm}`,
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontSize: '1.1rem',
  fontWeight: theme.app.typography.weights.medium,
  color: theme.app.colors.text.primary
}));

const FieldLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.app.spacing['2xs'],
  fontFamily: theme.app.typography.fontFamilyBase,
  fontSize: '0.9rem',
  color: theme.app.colors.text.secondary
}));

const TextInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: `${theme.app.spacing['2xs']} ${theme.app.spacing.sm}`,
  borderRadius: '8px',
  border: `1px solid ${theme.app.colors.border}`,
  fontFamily: theme.app.typography.fontFamilyBase,
  fontSize: '1rem'
}));

const FooterBar = styled('div')(({ theme }) => ({
  marginTop: theme.app.spacing.xl,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.app.spacing.sm
}));

const HomeHeroModal: React.FC<HomeHeroModalProps> = ({
  isOpen,
  isSaving,
  heroDraft,
  onClose,
  onSave,
  onUploadPortrait,
  onClearPortrait,
  onMetricChange
}) => {
  const definitionMap = useMemo(() => {
    const map = new Map<string, (typeof HERO_METRIC_DEFINITIONS)[number]>();
    HERO_METRIC_DEFINITIONS.forEach((definition) => map.set(definition.id, definition));
    return map;
  }, []);

  const modalStyles = {
    modal: {
      background: 'var(--color-surface, #ffffff)',
      maxWidth: '960px',
      width: '90vw',
      borderRadius: '24px',
      padding: '32px'
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} center styles={modalStyles}>
      <ModalLayout>
        <ControlsColumn>
          <AvatarFrame src={heroDraft.portraitUrl} alt="" size={180} />
          <ButtonGroup>
            <ActionButton type="button" onClick={onUploadPortrait}>
              Upload portrait
            </ActionButton>
            {heroDraft.portraitUrl ? (
              <ActionButton type="button" variant="ghost" onClick={onClearPortrait}>
                Remove portrait
              </ActionButton>
            ) : null}
          </ButtonGroup>
        </ControlsColumn>
        <MetricsColumn>
          {heroDraft.metrics.map((metric) => {
            const definition = definitionMap.get(metric.id);
            return (
              <MetricCard key={metric.id}>
                <MetricHeading>{definition?.fallbackLabelEn ?? metric.id}</MetricHeading>
                <FieldLabel>
                  English value
                  <TextInput
                    value={metric.value}
                    onChange={(event) => onMetricChange(metric.id, 'value', event.target.value)}
                  />
                </FieldLabel>
                <FieldLabel>
                  English label
                  <TextInput
                    value={metric.label}
                    onChange={(event) => onMetricChange(metric.id, 'label', event.target.value)}
                  />
                </FieldLabel>
                <FieldLabel>
                  Hebrew value
                  <TextInput
                    dir="rtl"
                    value={metric.valueHe}
                    onChange={(event) => onMetricChange(metric.id, 'valueHe', event.target.value)}
                  />
                </FieldLabel>
                <FieldLabel>
                  Hebrew label
                  <TextInput
                    dir="rtl"
                    value={metric.labelHe}
                    onChange={(event) => onMetricChange(metric.id, 'labelHe', event.target.value)}
                  />
                </FieldLabel>
              </MetricCard>
            );
          })}
          <FooterBar>
            <ActionButton type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancel
            </ActionButton>
            <ActionButton type="button" onClick={onSave} disabled={isSaving}>
              Save hero
            </ActionButton>
          </FooterBar>
        </MetricsColumn>
      </ModalLayout>
    </Modal>
  );
};

export default HomeHeroModal;
