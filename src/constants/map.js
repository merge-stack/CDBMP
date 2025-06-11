/**
 * Mapbox configuration
 */

export const MAP_CONFIG = {
  center: [10.4, 43.7], // Monte Pisano center coordinates
  defaultZoom: 12,
  style: 'mapbox://styles/mapbox/outdoors-v12',
  padding: {
    default: 100,
  },
  animation: {
    duration: 1000,
  },
};

/**
 * Layer style configuration
 */
export const LAYER_STYLES = {
  areas: {
    fill: {
      color: 'transparent',
      opacity: 0.1,
    },
    outline: {
      color: '#FF4444',
      width: 2,
    },
    selected: {
      color: '#FF4444',
      opacity: 0.2,
    },
  },
  warnings: {
    icon: {
      image: 'triangle-15',
      size: 1.5,
      color: '#FFD700',
    },
  },
};

/**
 * Mock GeoJSON data for forest areas
 */
export const MOCK_FOREST_AREAS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 1,
      properties: {
        id: 1,
        title: 'Layer Title #1',
        area: 462,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.38, 43.72],
            [10.42, 43.72],
            [10.42, 43.68],
            [10.38, 43.68],
            [10.38, 43.72],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 2,
      properties: {
        id: 2,
        title: 'Layer Title #2',
        area: 350,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.35, 43.7],
            [10.38, 43.7],
            [10.38, 43.67],
            [10.35, 43.67],
            [10.35, 43.7],
          ],
        ],
      },
    },
  ],
};

/**
 * Mock warning points data
 */
export const MOCK_WARNING_POINTS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        type: 'warning',
      },
      geometry: {
        type: 'Point',
        coordinates: [10.4, 43.7],
      },
    },
  ],
};
