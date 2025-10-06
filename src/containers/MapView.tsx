import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import { withTranslation, WithTranslation } from 'react-i18next';

const circleToPolygon: any = require('circle-to-polygon');

type NumericTuple = [number, number, number];

interface MapPoint {
  id?: string;
  title?: string;
  titleHebrew?: string;
  content?: string;
  contentHebrew?: string;
  categories?: string | string[] | null;
  x: number | string;
  y: number | string;
  z?: number | string;
  project?: Record<string, unknown>;
  [key: string]: unknown;
}

interface Category {
  id: string;
  [key: string]: unknown;
}

interface CategoryColor {
  id?: string;
  color?: number[];
  colorHex?: string;
  [key: string]: unknown;
}

interface MapViewProps extends WithTranslation {
  points: MapPoint[];
  categories: Category[];
  categoryColors: CategoryColor[];
  openCategories: string[];
  sidebarClickedItemId?: string | null;
  allowAddPoint: boolean;
  addPoint(point: MapPoint): Promise<MapPoint>;
  handleExpandProject(point: MapPoint | null): void;
  selectedProject?: MapPoint | null;
  setSelectedProject?: (point: MapPoint | null) => void;
  lang?: string;
}

const DEFAULT_COLOR: NumericTuple = [226, 119, 40];
const GOTO_ZOOM = 10;

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

const NUMBER_OF_EDGES = 240;

const getViewportWidth = () => {
  if (typeof window === 'undefined') {
    return 1024;
  }
  return (
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 1024
  );
};

const START_ZOOM = getViewportWidth() < 768 ? 1 : 3;
const START_CENTER: [number, number] = [-20, 35];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normaliseCoordinate = (value: number | string | undefined): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getPointCategories = (categories: MapPoint['categories']): string[] => {
  if (Array.isArray(categories)) {
    return categories.filter(Boolean).map(String);
  }
  if (typeof categories === 'string') {
    return categories
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }
  return [];
};

const resolvePointColor = (
  pointCategories: string[],
  categories: Category[],
  categoryColors: CategoryColor[]
): NumericTuple => {
  if (pointCategories.length === 0) {
    return DEFAULT_COLOR;
  }

  const primaryCategory = pointCategories[0];
  const categoryIndex = categories.findIndex((category) => category.id === primaryCategory);
  if (categoryIndex >= 0) {
    const paletteEntry = categoryColors[categoryIndex];
    if (Array.isArray(paletteEntry?.color) && paletteEntry.color.length >= 3) {
      const [r, g, b] = paletteEntry.color as number[];
      return [r, g, b];
    }
  }
  return DEFAULT_COLOR;
};

const calculateYBand = (yValue: number): number => {
  const value = Math.abs(yValue);
  const thresholds = [10, 20, 30, 40, 50, 60, 70, 80, 85, 100];
  for (let index = 0; index < thresholds.length; index += 1) {
    if (value < thresholds[index]) {
      return index + 1;
    }
  }
  return 0;
};

const updateUILanguage = (view: any, searchWidget: any, language: string) => {
  if (!view) {
    return;
  }

  const position = language === 'he' ? 'top-left' : 'top-right';
  try {
    view.ui.move('zoom', position);
  } catch (error) {
    // ignore move errors
  }

  if (searchWidget) {
    const searchPosition = language === 'he' ? 'bottom-right' : 'bottom-left';
    try {
      view.ui.move(searchWidget, searchPosition);
    } catch (error) {
      // ignore move errors
    }
  }

  if (view.popup) {
    view.popup.lang = language;
  }
};

const MapView: React.FC<MapViewProps> = ({
  points,
  categories,
  categoryColors,
  openCategories,
  sidebarClickedItemId,
  allowAddPoint,
  addPoint,
  handleExpandProject,
  i18n
}) => {
  const [localPoints, setLocalPoints] = useState<MapPoint[]>(points);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const language = i18n.language;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<any>(null);
  const graphicsLayerRef = useRef<any>(null);
  const searchWidgetRef = useRef<any>(null);
  const handlesRef = useRef<{ zoom?: any; click?: any; popup?: any }>({});
  const selectedPointRef = useRef<MapPoint | null>(null);
  const expandActionRef = useRef({
    title: i18n.language === 'en' ? 'Expand' : 'הרחבה',
    id: 'expand-this',
    className: 'esri-icon-zoom-out-fixed'
  });
  const drawPointsRef = useRef<() => void>(() => undefined);
  const latestStateRef = useRef({
    points: localPoints,
    allowAddPoint,
    addPoint,
    handleExpandProject,
    language
  });

  const normalisedOpenCategories = useMemo(
    () => (openCategories ?? []).map((category) => category.trim()).filter(Boolean),
    [openCategories]
  );

  useEffect(() => {
    setLocalPoints(points);
  }, [points]);

  useEffect(() => {
    selectedPointRef.current = selectedPoint;
  }, [selectedPoint]);

  const drawPoints = useCallback(() => {
    const graphicsLayer = graphicsLayerRef.current;
    const view = viewRef.current;

    if (!graphicsLayer || !view) {
      return;
    }

    graphicsLayer.removeAll();

    const zoomValue = typeof view.zoom === 'number' ? view.zoom : START_ZOOM;
    const zoomIndex = clamp(Math.round(zoomValue), 0, ZOOM_RADIUS.length - 1);

    const zoomFactorX = ZOOM_FACTORS_X[clamp(Math.round(zoomValue), 0, ZOOM_FACTORS_X.length - 1)];
    const zoomFactorY = ZOOM_FACTORS_Y[clamp(Math.round(zoomValue), 0, ZOOM_FACTORS_Y.length - 1)];
    const zoomFactorYVal =
      ZOOM_FACTORS_Y_VAL[clamp(Math.round(zoomValue), 0, ZOOM_FACTORS_Y_VAL.length - 1)];

    localPoints.forEach((point) => {
      const x = normaliseCoordinate(point.x);
      const y = normaliseCoordinate(point.y);

      if (x === null || y === null) {
        return;
      }

      const pointCategories = getPointCategories(point.categories);
      const shouldDisplay =
        normalisedOpenCategories.length === 0 ||
        pointCategories.some((category) => normalisedOpenCategories.includes(category));

      if (!shouldDisplay) {
        return;
      }

      const yBand = calculateYBand(y);
      const radiusBase = ZOOM_RADIUS[zoomIndex];
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

          const colorForCategory = resolvePointColor([category], categories, categoryColors);

          const fillSymbol = {
            type: 'simple-fill',
            color: colorForCategory,
            outline: {
              color: [108, 118, 128],
              width: 0
            }
          };

          polygon.rings = createRing(index * slices, slices);

          const polygonGraphic = {
            point,
            geometry: polygon,
            symbol: fillSymbol
          };

          graphicsLayer.add(polygonGraphic);
        });

        const markerSymbol = {
          type: 'simple-marker',
          color: [255, 255, 255, 0],
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        };

        const markerGraphic = {
          point,
          geometry: { type: 'point', x, y },
          symbol: markerSymbol
        };

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

        const fillSymbol = {
          type: 'simple-fill',
          color: [255, 255, 255, 0.85],
          outline: {
            color: [108, 118, 128],
            width: 0.5
          }
        };

        const polygonGraphic = {
          point,
          geometry: polygon,
          symbol: fillSymbol
        };

        graphicsLayer.add(polygonGraphic);
      }
    });
  }, [localPoints, categories, categoryColors, normalisedOpenCategories]);

  useEffect(() => {
    drawPointsRef.current = drawPoints;
  }, [drawPoints]);

  useEffect(() => {
    latestStateRef.current = {
      points: localPoints,
      allowAddPoint,
      addPoint,
      handleExpandProject,
      language
    };
  }, [localPoints, allowAddPoint, addPoint, handleExpandProject, language]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;

    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/GraphicsLayer',
      'esri/widgets/Search'
    ]).then(([Map, MapView, GraphicsLayer, Search]) => {
      if (cancelled) {
        return;
      }

      const map = new Map({ basemap: 'gray-vector' });
      const view = new MapView({
        popup: {
          lang: language,
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false,
            position: 'top-left'
          }
        },
        container,
        map,
        zoom: START_ZOOM,
        center: START_CENTER
      });

      view.constraints = {
        minZoom: getViewportWidth() < 768 ? 1 : 3
      };

      const graphicsLayer = new GraphicsLayer({ id: 'map-graphics' });
      map.add(graphicsLayer);

      viewRef.current = view;
      graphicsLayerRef.current = graphicsLayer;

      if (getViewportWidth() > 767) {
        const searchWidget = new Search({ view });
        view.ui.add(searchWidget, { position: 'bottom-left', index: 2 });
        searchWidgetRef.current = searchWidget;
      }

      updateUILanguage(view, searchWidgetRef.current, language);

      view.popup.autoOpenEnabled = false;
      view.popup.actions = [expandActionRef.current];

      handlesRef.current.popup = view.popup.on('trigger-action', (event: any) => {
        if (event?.action?.id === 'expand-this') {
          const latest = latestStateRef.current;
          latest.handleExpandProject(selectedPointRef.current ?? null);
          view.popup.close();
        }
      });

      handlesRef.current.zoom = view.watch('zoom', () => {
        window.requestAnimationFrame(() => drawPointsRef.current());
      });

      handlesRef.current.click = view.on('click', (event: any) => {
        const latest = latestStateRef.current;
        if (latest.allowAddPoint && event?.mapPoint) {
          const newPoint: MapPoint = {
            project: {},
            title: `point ${latest.points.length + 1}`,
            type: 'point',
            x: event.mapPoint.longitude,
            y: event.mapPoint.latitude,
            z: 500
          };

          latest
            .addPoint(newPoint)
            .then((createdPoint) => {
              if (createdPoint) {
                setLocalPoints((prev) => [...prev, createdPoint]);
              }
            })
            .catch(() => {
              // swallow add point errors for now
            });
        }

        view.hitTest(event).then((response: any) => {
          const result = response?.results?.find((item: any) => item?.graphic?.point);
          const point: MapPoint | undefined = result?.graphic?.point;
          if (!point) {
            return;
          }

          setSelectedPoint(point);

          const popupLanguage = latestStateRef.current.language;
          const popupTitle =
            popupLanguage === 'en' ? point.title : (point.titleHebrew ?? point.title);
          const popupContent =
            popupLanguage === 'en' ? point.content : (point.contentHebrew ?? point.content);

          view.popup.open({
            project: point,
            title: popupTitle,
            location: event.mapPoint,
            content: popupContent,
            actions: [expandActionRef.current]
          });
        });
      });

      drawPointsRef.current();
    });

    return () => {
      cancelled = true;

      const handles = handlesRef.current;
      if (handles) {
        if (handles.zoom?.remove) handles.zoom.remove();
        if (handles.click?.remove) handles.click.remove();
        if (handles.popup?.remove) handles.popup.remove();
      }
      handlesRef.current = {};

      if (searchWidgetRef.current && viewRef.current) {
        try {
          viewRef.current.ui.remove(searchWidgetRef.current);
        } catch (error) {
          // ignore
        }
        searchWidgetRef.current = null;
      }

      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      graphicsLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || !sidebarClickedItemId) {
      return;
    }

    const targetPoint = localPoints.find((point) => point.id === sidebarClickedItemId);
    if (!targetPoint) {
      return;
    }

    const x = normaliseCoordinate(targetPoint.x);
    const y = normaliseCoordinate(targetPoint.y);
    if (x === null || y === null) {
      return;
    }

    view.popup?.close();
    view.goTo({ center: [x, y], zoom: GOTO_ZOOM }).catch(() => undefined);
  }, [sidebarClickedItemId, localPoints]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }

    expandActionRef.current = {
      title: language === 'en' ? 'Expand' : 'הרחבה',
      id: 'expand-this',
      className: 'esri-icon-zoom-out-fixed'
    };

    updateUILanguage(view, searchWidgetRef.current, language);
    view.popup.actions = [expandActionRef.current];

    const point = selectedPointRef.current;
    if (point) {
      view.popup.title = language === 'en' ? point.title : (point.titleHebrew ?? point.title);
      view.popup.content =
        language === 'en' ? point.content : (point.contentHebrew ?? point.content);
    }
  }, [language]);

  useEffect(() => {
    const graphicsLayer = graphicsLayerRef.current;
    if (graphicsLayer) {
      drawPointsRef.current();
    }
  }, [localPoints, normalisedOpenCategories, categories, categoryColors]);

  return (
    <div style={{ height: '100%', color: 'var(--color-text-main, #000)' }}>
      <div
        ref={containerRef}
        id="pointTestViewDiv"
        style={{
          height: getViewportWidth() < 768 ? getViewportWidth() * 0.6 : '100%',
          width: '100%'
        }}
      />
    </div>
  );
};

export default withTranslation()(MapView);
