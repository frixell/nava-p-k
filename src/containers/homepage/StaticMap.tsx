import React from 'react';
import styled from '@emotion/styled';

interface StaticMarker {
  id: string;
  left: number;
  top: number;
  color: string;
  label?: string;
}

interface StaticMapProps {
  markers: StaticMarker[];
  selectedId?: string | null;
  onMarkerClick?: (markerId: string) => void;
  isHebrew?: boolean;
  className?: string;
}

const MapWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '320px',
  borderRadius: '24px',
  overflow: 'hidden',
  backgroundImage: 'url(/images/new-design/hero-map.svg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: `1px solid ${theme.app.colors.border}`
}));

const MarkerButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'selected'
})<{ selected: boolean }>(({ theme, selected }) => ({
  position: 'absolute',
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
  border: selected
    ? `2px solid ${theme.app.colors.accent.tertiary}`
    : `2px solid ${theme.app.colors.surface}`,
  boxShadow: '0 4px 12px rgba(10, 31, 51, 0.25)',
  cursor: 'pointer',
  outline: 'none',
  '&:focus-visible': {
    outline: `2px solid ${theme.app.colors.accent.tertiary}`
  }
}));

const StaticMap: React.FC<StaticMapProps> = ({
  markers,
  selectedId,
  onMarkerClick,
  isHebrew,
  className
}) => (
  <MapWrapper className={className} dir={isHebrew ? 'rtl' : 'ltr'}>
    {markers.map((marker) =>
      onMarkerClick ? (
        <MarkerButton
          key={marker.id}
          type="button"
          selected={selectedId === marker.id}
          style={{
            left: `${marker.left}%`,
            top: `${marker.top}%`,
            backgroundColor: marker.color
          }}
          aria-label={marker.label ?? ''}
          onClick={() => onMarkerClick(marker.id)}
        />
      ) : (
        <MarkerButton
          as="span"
          key={marker.id}
          selected={selectedId === marker.id}
          style={{
            left: `${marker.left}%`,
            top: `${marker.top}%`,
            backgroundColor: marker.color
          }}
          aria-hidden
        />
      )
    )}
  </MapWrapper>
);

export default StaticMap;
