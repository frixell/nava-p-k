/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { loadModules } from 'esri-loader';
import type { Category } from '../../store/slices/categoriesSlice';

const circleToPolygon: any = require('circle-to-polygon');

type NumericTuple = [number, number, number];

interface HeroArcgisPoint {
  id?: string | number;
  categories?: string[] | string | null;
  [key: string]: unknown;
}

export interface HeroArcgisMarker {
  id: string;
  longitude: number;
  latitude: number;
  point: HeroArcgisPoint;
}

interface HeroCategoryColor {
  id: string;
  color?: number[];
  colorHex?: string;
}

interface HeroArcgisMapProps {
  markers: HeroArcgisMarker[];
  categories: Category[];
  categoryColors: HeroCategoryColor[];
  selectedId?: string | null;
  onSelect?: (markerId: string) => void;
  isHebrew?: boolean;
  className?: string;
}

const MapSurface = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '640px',
  borderRadius: '24px',
  overflow: 'hidden',
  border: `1px solid ${theme.app.colors.border}`,
  backgroundColor: theme.app.colors.surfaceMuted
}));

const DEFAULT_COLOR: NumericTuple = [226, 119, 40];
const NUMBER_OF_EDGES = 240;
const DEFAULT_CENTER: [number, number] = [-20, 35];
const DEFAULT_ZOOM = 3;

const ZOOM_RADIUS: number[] = [
  1258291.2, 629145.6, 314572.8, 157286.4, 78643.2, 39321.6, 19660.8, 9830.4, 4915.2, 2457.6,
  1228.8, 614.4, 307.2, 153.6, 76.8, 38.4, 19.2, 9.6, 4.8, 2.4, 1.2, 0.6, 0.3, 0.15
];

const INDEX_Y: number[] = [10000000, 10000000, 50, 50, 12, 4.1, 3.3, 2.1, 1.5, 1.2, 1.1, 1.05];

const ZOOM_FACTORS_X: number[] = [
  8, 6, 4, 3, 1.5, 0.8, 0.5, 0.3, 0.2, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005, 0.003, 0.001, 0.0005,
  0.0002, 0.0001, 0.00005, 0.00002, 0.00001, 0.000005
];

const ZOOM_FACTORS_Y: number[] = [
  8, 6, 4, 3, 1.8, 1, 0.5, 0.3, 0.2, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005, 0.003, 0.001, 0.0005,
  0.0002, 0.0001, 0.00005, 0.00002, 0.00001, 0.000005
];

const ZOOM_FACTORS_Y_VAL: number[] = [
  1, 1.5, 2, 3.1, 5, 8, 16, 30, 40, 80, 160, 300, 450, 900, 1800, 3300, 9900, 20000, 50000, 100000,
  200000, 500000, 1000000, 2000000
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normaliseCoordinate = (value: number | string | undefined): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const getPointCategories = (categories: HeroArcgisPoint['categories']): string[] => {
  if (Array.isArray(categories)) {
    return categories
      .filter(Boolean)
      .map((category) => String(category).trim())
      .filter(Boolean);
  }
  if (typeof categories === 'string') {
    return categories
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }
  return [];
};

const hexToRgb = (value: string): NumericTuple | null => {
  const trimmed = value.startsWith('#') ? value.slice(1) : value;
  const normalized =
    trimmed.length === 3
      ? trimmed
          .split('')
          .map((char) => char + char)
          .join('')
      : trimmed.padEnd(6, '0');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return null;
  }
  return [r, g, b];
};

const resolvePointColor = (
  categoryId: string,
  categories: Category[],
  categoryColors: HeroCategoryColor[]
): NumericTuple => {
  const categoryIndex = categories.findIndex((category) => String(category.id) === categoryId);
  if (categoryIndex >= 0) {
    const paletteEntry =
      categoryColors[categoryIndex] ?? categoryColors.find((entry) => entry.id === categoryId);
    if (paletteEntry) {
      if (Array.isArray(paletteEntry.color) && paletteEntry.color.length >= 3) {
        const [r, g, b] = paletteEntry.color;
        return [r ?? DEFAULT_COLOR[0], g ?? DEFAULT_COLOR[1], b ?? DEFAULT_COLOR[2]];
      }
      if (typeof paletteEntry.colorHex === 'string') {
        const rgb = hexToRgb(paletteEntry.colorHex);
        if (rgb) {
          return rgb;
        }
      }
    }
  }
  return DEFAULT_COLOR;
};

const calculateYBand = (yValue: number): number => {
  const absValue = Math.abs(yValue);
  const thresholds = [10, 20, 30, 40, 50, 60, 70, 80, 85, 100];
  for (let index = 0; index < thresholds.length; index += 1) {
    if (absValue < thresholds[index]) {
      return index + 1;
    }
  }
  return 0;
};

const getViewportWidth = () => {
  if (typeof window === 'undefined') {
    return 1024;
  }
  return (
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 1024
  );
};

const ArcgisMap: React.FC<HeroArcgisMapProps> = ({
  markers,
  categories,
  categoryColors,
  selectedId,
  onSelect,
  isHebrew,
  className
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const graphicCtorRef = useRef<any>(null);
  const markerCountRef = useRef<number>(0);
  const markerSignatureRef = useRef<string>('');
  const hasFitRef = useRef<boolean>(false);
  const lastSelectedRef = useRef<string | null>(null);

  const drawGraphics = () => {
    const graphicsLayer = layerRef.current;
    const view = viewRef.current;
    const Graphic = graphicCtorRef.current;

    if (!graphicsLayer || !view || !Graphic) {
      return;
    }

    graphicsLayer.removeAll();

    if (!markers || markers.length === 0) {
      markerCountRef.current = 0;
      markerSignatureRef.current = '';
      hasFitRef.current = false;
      return;
    }

    const signature = markers
      .map((marker) => `${marker.id}:${marker.longitude.toFixed(4)}:${marker.latitude.toFixed(4)}`)
      .join('|');

    if (markerCountRef.current !== markers.length || markerSignatureRef.current !== signature) {
      markerCountRef.current = markers.length;
      markerSignatureRef.current = signature;
      hasFitRef.current = false;
    }

    const zoomValue = typeof view.zoom === 'number' ? view.zoom : DEFAULT_ZOOM;
    const clampedZoom = clamp(Math.round(zoomValue), 0, ZOOM_RADIUS.length - 1);
    const zoomFactorX = ZOOM_FACTORS_X[clampedZoom];
    const zoomFactorY = ZOOM_FACTORS_Y[clampedZoom];
    const zoomFactorYVal = ZOOM_FACTORS_Y_VAL[clampedZoom];
    const radiusBase = ZOOM_RADIUS[clampedZoom];

    markers.forEach((marker) => {
      const x = normaliseCoordinate(marker.longitude);
      const y = normaliseCoordinate(marker.latitude);

      if (x === null || y === null) {
        return;
      }

      const pointCategories = getPointCategories(marker.point?.categories);
      const yBand = calculateYBand(y);
      const yIndex = clamp(Math.round(yBand), 0, INDEX_Y.length - 1);
      const radius = radiusBase - radiusBase / INDEX_Y[yIndex];

      const coordinates: [number, number] = [x, y];
      const polygonOutline = circleToPolygon(coordinates, radius, NUMBER_OF_EDGES);

      const createRing = (startIndex: number, slices: number) => {
        const ring = polygonOutline.coordinates[0].slice(startIndex, startIndex + slices + 1);
        ring.push([x, y]);
        ring.unshift([x, y]);
        return ring;
      };

      if (pointCategories.length > 0) {
        const slices = NUMBER_OF_EDGES / pointCategories.length;

        pointCategories.forEach((category, index) => {
          const factorY =
            y > 0
              ? zoomFactorY - y / (zoomFactorYVal * 10)
              : -zoomFactorY - y / (zoomFactorYVal * 10);

          const startX = x + (index / pointCategories.length) * zoomFactorX;
          const stepX = zoomFactorX / pointCategories.length;

          const polygon = {
            type: 'polygon',
            rings: [
              [startX, y],
              [startX, y + factorY],
              [startX + stepX, y + factorY],
              [startX + stepX, y]
            ],
            center: [x, y]
          };

          const fillSymbol = {
            type: 'simple-fill',
            color: resolvePointColor(category, categories, categoryColors),
            outline: {
              color: [108, 118, 128],
              width: 0
            }
          };

          polygon.rings = createRing(index * slices, slices);

          const polygonGraphic = new Graphic({
            geometry: polygon,
            attributes: { id: marker.id, category },
            symbol: fillSymbol
          });

          graphicsLayer.add(polygonGraphic);
        });

        const markerGraphic = new Graphic({
          geometry: { type: 'point', x, y },
          attributes: { id: marker.id },
          symbol: {
            type: 'simple-marker',
            size: selectedId === marker.id ? 16 : 12,
            color: [255, 255, 255, 0],
            outline: {
              color: [255, 255, 255],
              width: selectedId === marker.id ? 3 : 2
            }
          }
        });

        graphicsLayer.add(markerGraphic);
      } else {
        const factorY =
          y > 0
            ? zoomFactorY - y / (zoomFactorYVal * 10)
            : -zoomFactorY - y / (zoomFactorYVal * 10);
        const startX = x;
        const stepX = zoomFactorX;

        const polygon = {
          type: 'polygon',
          rings: [
            [startX, y],
            [startX, y + factorY],
            [startX + stepX, y + factorY],
            [startX + stepX, y]
          ],
          center: [x, y]
        };

        const polygonGraphic = new Graphic({
          geometry: polygon,
          attributes: { id: marker.id },
          symbol: {
            type: 'simple-fill',
            color: [255, 255, 255, 0.85],
            outline: {
              color: [108, 118, 128],
              width: 0.5
            }
          }
        });

        graphicsLayer.add(polygonGraphic);
      }
    });

    if (!hasFitRef.current && graphicsLayer.fullExtent) {
      view
        .goTo(graphicsLayer.fullExtent.expand(1.4), { animate: true })
        .then(() => {
          hasFitRef.current = true;
        })
        .catch(() => undefined);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const container = containerRef.current;
    if (!container || !markers || markers.length === 0) {
      return () => undefined;
    }

    loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/GraphicsLayer', 'esri/Graphic'], {
      css: true
    })
      .then(([ArcGISMap, MapView, GraphicsLayer, Graphic]) => {
        if (cancelled || !container) {
          return;
        }

        const map = new ArcGISMap({ basemap: 'gray-vector' });
        const view = new MapView({
          container,
          map,
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          ui: { components: [] },
          constraints: {
            rotationEnabled: false,
            snapToZoom: true,
            minZoom: getViewportWidth() < 768 ? 1 : 2,
            maxZoom: 12
          }
        });

        view.popupEnabled = false;
        view.navigation.mouseWheelZoomEnabled = false;
        view.navigation.browserTouchPanEnabled = false;

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        layerRef.current = graphicsLayer;
        viewRef.current = view;
        graphicCtorRef.current = Graphic;
        markerCountRef.current = 0;
        markerSignatureRef.current = '';
        hasFitRef.current = false;

        drawGraphics();

        view.on('immediate-click', (event: any) => {
          if (!onSelect) {
            return;
          }

          view.hitTest(event).then((response: any) => {
            const graphic = response?.results?.find(
              (result: any) => result?.graphic?.attributes?.id
            );
            const markerId: string | undefined = graphic?.graphic?.attributes?.id;
            if (markerId) {
              onSelect(markerId);
            }
          });
        });

        const stopInteraction = (event: any) => event.stopPropagation();
        view.on('drag', stopInteraction);
        view.on('double-click', stopInteraction);
        view.on('mouse-wheel', stopInteraction);
        view.on('key-down', stopInteraction);
      })
      .catch((error) => {
        if (!cancelled && process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Failed to initialise hero ArcGIS map', error);
        }
      });

    return () => {
      cancelled = true;
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      layerRef.current = null;
      graphicCtorRef.current = null;
      markerCountRef.current = 0;
      markerSignatureRef.current = '';
      hasFitRef.current = false;
    };
  }, []);

  useEffect(() => {
    drawGraphics();
  }, [markers, categories, categoryColors, selectedId]);

  useEffect(() => {
    if (!selectedId || !viewRef.current || markers.length === 0) {
      lastSelectedRef.current = selectedId ?? null;
      return;
    }

    if (lastSelectedRef.current === selectedId) {
      return;
    }

    lastSelectedRef.current = selectedId;
    const target = markers.find((marker) => marker.id === selectedId);
    if (!target) {
      return;
    }

    viewRef.current
      .goTo(
        {
          center: [target.longitude, target.latitude],
          zoom: Math.max(viewRef.current.zoom ?? DEFAULT_ZOOM, 5)
        },
        { animate: true }
      )
      .catch(() => undefined);
  }, [selectedId, markers]);

  return <MapSurface className={className} ref={containerRef} dir={isHebrew ? 'rtl' : 'ltr'} />;
};

export default ArcgisMap;
