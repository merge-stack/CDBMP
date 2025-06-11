import { useCallback, useMemo, useRef, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import {
  MAP_CONFIG,
  LAYER_STYLES,
  MOCK_FOREST_AREAS,
  MOCK_WARNING_POINTS,
} from '../constants/map';

const forestAreaFillLayer = {
  id: 'forest-areas-fill',
  type: 'fill',
  paint: {
    'fill-color': LAYER_STYLES.areas.fill.color,
    'fill-opacity': LAYER_STYLES.areas.fill.opacity,
  },
};

const forestAreaOutlineLayer = {
  id: 'forest-areas-outline',
  type: 'line',
  paint: {
    'line-color': LAYER_STYLES.areas.outline.color,
    'line-width': LAYER_STYLES.areas.outline.width,
  },
};

const forestAreaSelectedLayer = {
  id: 'forest-areas-selected',
  type: 'fill',
  paint: {
    'fill-color': LAYER_STYLES.areas.selected.color,
    'fill-opacity': LAYER_STYLES.areas.selected.opacity,
  },
  filter: ['==', 'id', 0],
};

const warningPointsLayer = {
  id: 'warning-points',
  type: 'symbol',
  layout: {
    'icon-image': LAYER_STYLES.warnings.icon.image,
    'icon-size': LAYER_STYLES.warnings.icon.size,
  },
  paint: {
    'icon-color': LAYER_STYLES.warnings.icon.color,
  },
};

function MapView({ selectedLayer, onLayerSelect }) {
  const mapRef = useRef(null);

  const selectedFilter = useMemo(() => {
    return ['==', 'id', selectedLayer?.id || 0];
  }, [selectedLayer]);

  const onClick = useCallback(
    (event) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const [minLng, minLat, maxLng, maxLat] =
        feature.geometry.coordinates[0].reduce(
          ([minX, minY, maxX, maxY], [x, y]) => [
            Math.min(minX, x),
            Math.min(minY, y),
            Math.max(maxX, x),
            Math.max(maxY, y),
          ],
          [Infinity, Infinity, -Infinity, -Infinity]
        );

      const bounds = [
        [minLng, minLat],
        [maxLng, maxLat],
      ];

      // First call onLayerSelect with the feature data
      onLayerSelect({
        id: feature.properties.id,
        title: feature.properties.title,
        area: feature.properties.area,
        bounds: bounds,
      });

      // Then fit bounds with animation
      mapRef.current?.fitBounds(bounds, {
        padding: MAP_CONFIG.padding.default,
        duration: MAP_CONFIG.animation.duration,
      });
    },
    [onLayerSelect]
  );

  const onMouseEnter = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = 'pointer';
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = '';
    }
  }, []);

  // Update bounds when selectedLayer changes
  useEffect(() => {
    if (mapRef.current && selectedLayer?.bounds) {
      mapRef.current.fitBounds(selectedLayer.bounds, {
        padding: MAP_CONFIG.padding.default,
        duration: MAP_CONFIG.animation.duration,
      });
    }
  }, [selectedLayer]);

  return (
    <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: MAP_CONFIG.center[0],
          latitude: MAP_CONFIG.center[1],
          zoom: MAP_CONFIG.defaultZoom,
        }}
        mapStyle={MAP_CONFIG.style}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        interactiveLayerIds={['forest-areas-fill']}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <NavigationControl position="top-right" />

        <Source type="geojson" data={MOCK_FOREST_AREAS}>
          <Layer {...forestAreaFillLayer} />
          <Layer {...forestAreaOutlineLayer} />
          <Layer {...forestAreaSelectedLayer} filter={selectedFilter} />
        </Source>

        <Source type="geojson" data={MOCK_WARNING_POINTS}>
          <Layer {...warningPointsLayer} />
        </Source>
      </Map>
    </Box>
  );
}

export default MapView;
