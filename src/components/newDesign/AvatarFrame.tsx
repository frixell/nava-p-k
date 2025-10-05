import React from 'react';
import styled from '@emotion/styled';

interface AvatarFrameProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

const Frame = styled('div', {
  shouldForwardProp: (prop) => prop !== 'size'
})<{ size: number }>(({ theme, size }) => ({
  width: size,
  height: size,
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.app.colors.surface,
  border: `1px solid ${theme.app.colors.border}`,
  boxShadow: theme.app.shadows.card,
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  }
}));

const Initials = styled('span')(({ theme }) => ({
  fontFamily: theme.app.typography.fontFamilyHeading,
  fontWeight: theme.app.typography.weights.medium,
  fontSize: theme.app.typography.variants.displayMd.fontSize,
  lineHeight: theme.app.typography.variants.displayMd.lineHeight,
  color: theme.app.colors.accent.primary
}));

const AvatarFrame: React.FC<AvatarFrameProps> = ({ src, alt, size = 160, className, fallback }) => {
  const renderFallback = () => {
    if (fallback) {
      return fallback;
    }

    const initials =
      alt
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('') || 'N';

    return <Initials aria-hidden>{initials}</Initials>;
  };

  return (
    <Frame size={size} className={className} aria-live="polite">
      {src ? <img src={src} alt={alt} /> : renderFallback()}
    </Frame>
  );
};

export default AvatarFrame;
