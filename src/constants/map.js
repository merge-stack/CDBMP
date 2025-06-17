/**
 * Map configuration constants
 */

// Base map configuration
export const MAP_CONFIG = {
  center: [10.4, 43.7], // Monte Pisano center coordinates
  defaultZoom: 12,
  maxZoom: 18,
  minZoom: 8,
  style: 'mapbox://styles/mapbox/outdoors-v12',
  padding: {
    top: 200,
    bottom: 200,
    left: 600,
    right: 1200,
  },
  bounds: {
    // Bounding box for Monte Pisano region
    southwest: [10.35, 43.67],
    northeast: [10.42, 43.72]
  }
};

// Animation and transition settings
export const ANIMATION_CONFIG = {
  duration: 1000,
  easing: 'cubic',
  padding: 0.1, // 10% padding for fly-to animations
};

// Layer configuration
export const LAYER_CONFIG = {
  areas: {
    id: 'geojson-layer',
    minZoom: 8,
    maxZoom: 18,
    pickable: true,
    styles: {
      default: {
        fillColor: [255, 68, 68, 75],
        lineColor: [255, 68, 68, 0],
        lineWidth: 10
      },
      selected: {
        fillColor: [255, 68, 68, 150],
        lineColor: [255, 215, 0, 255],
        lineWidth: 20
      },
      highlight: {
        color: [255, 68, 68, 100]
      }
    }
  },
  warnings: {
    id: 'warning-layer',
    minZoom: 10,
    maxZoom: 18,
    pickable: true,
    styles: {
      default: {
        fillColor: [255, 215, 0, 200],
        radius: 10
      },
      selected: {
        fillColor: [255, 140, 0, 255],
        radius: 15
      }
    }
  }
};

// Interaction settings
export const INTERACTION_CONFIG = {
  hover: {
    enabled: true,
    delayMs: 50
  },
  click: {
    enabled: true,
    radius: 5 // pixels
  },
  tooltip: {
    enabled: true,
    delayMs: 200
  }
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
        thumbnail: '/images/forest1.jpeg',
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
        thumbnail: '/images/forest2.jpeg',
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
