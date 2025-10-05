import React from 'react';
import styled from '@emotion/styled';

export interface StatCardProps {
  value: string;
  label: string;
  caption?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

const Card = styled('article', {
  shouldForwardProp: (prop) => prop !== 'variant'
})<Required<Pick<StatCardProps, 'variant'>>>(({ theme, variant }) => {
  const isDark = variant === 'dark';
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    color: isDark ? theme.app.colors.text.inverse : theme.app.colors.text.primary,
    textAlign: 'center'
  };
});

const Value = styled('span', {
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant: 'light' | 'dark' }>(({ theme, variant }) => ({
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.variants.statNumber.fontWeight,
  fontSize: theme.app.typography.variants.statNumber.fontSize,
  lineHeight: theme.app.typography.variants.statNumber.lineHeight,
  color: variant === 'dark' ? theme.app.colors.text.inverse : theme.app.colors.accent.primary
}));

const Label = styled('span')(({ theme }) => ({
  fontFamily: theme.app.typography.fontFamilyBase,
  fontWeight: theme.app.typography.weights.medium,
  fontSize: theme.app.typography.variants.body.fontSize,
  lineHeight: theme.app.typography.variants.body.lineHeight,
  letterSpacing: '0.02em',
  textTransform: 'uppercase'
}));

const Caption = styled('span')(({ theme }) => ({
  fontSize: '0.95rem',
  color: theme.app.colors.text.muted
}));

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  caption,
  variant = 'light',
  className
}) => (
  <Card className={className} variant={variant}>
    <Value variant={variant}>{value}</Value>
    <Label>{label}</Label>
    {caption ? <Caption>{caption}</Caption> : null}
  </Card>
);

export default StatCard;
