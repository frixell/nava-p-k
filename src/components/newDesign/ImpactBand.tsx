import React from 'react';
import styled from '@emotion/styled';
import StatCard, { StatCardProps } from './StatCard';

export interface ImpactItem extends Omit<StatCardProps, 'variant'> {
  id: string;
}

export interface ImpactBandProps {
  items: ImpactItem[];
  className?: string;
}

const Band = styled('section')(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.app.colors.accent.primary,
  color: theme.app.colors.text.inverse,
  padding: `${theme.app.spacing['2xl']} ${theme.app.spacing.md}`,
  display: 'flex',
  justifyContent: 'center'
}));

const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: theme.app.spacing.xl,
  width: 'min(960px, 100%)'
}));

const ImpactBand: React.FC<ImpactBandProps> = ({ items, className }) => (
  <Band className={className}>
    <Grid>
      {items.map(({ id, value, label, caption }) => (
        <StatCard key={id} value={value} label={label} caption={caption} variant="dark" />
      ))}
    </Grid>
  </Band>
);

export default ImpactBand;
