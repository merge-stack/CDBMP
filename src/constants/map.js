/**
 * Map configuration constants
 */

// Base map configuration
export const MAP_CONFIG = {
  center: [10.529699204798701, 43.7430042609697], // Monte Pisano center coordinates
  defaultZoom: 12,
  maxZoom: 16,
  minZoom: 8,
  style: 'mapbox://styles/ciaomapbox/cmbt35xtc012q01sm1kvrg58s',
  bounds: {
    // Bounding box for Monte Pisano region
    southwest: [10.35, 43.67],
    northeast: [10.42, 43.72],
  },
};

// Animation and transition settings
export const ANIMATION_CONFIG = {
  duration: 1000,
  easing: 'cubic',
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
        lineWidth: 10,
      },
      selected: {
        fillColor: [255, 68, 68, 150],
        lineColor: [255, 215, 0, 255],
        lineWidth: 20,
      },
      highlight: {
        color: [255, 68, 68, 100],
      },
    },
  },
  warnings: {
    id: 'warning-layer',
    minZoom: 10,
    maxZoom: 18,
    pickable: true,
    styles: {
      default: {
        fillColor: [255, 215, 0, 200],
        radius: 10,
      },
      selected: {
        fillColor: [255, 140, 0, 255],
        radius: 15,
      },
    },
  },
};

// Interaction settings
export const INTERACTION_CONFIG = {
  hover: {
    enabled: true,
    delayMs: 50,
  },
  click: {
    enabled: true,
    radius: 5, // pixels
  },
  tooltip: {
    enabled: true,
    delayMs: 200,
  },
};

export const MAP_LAYER_TYPES = {
  ATTRazioni: 'attrazioni',
  FONTI: 'fonti',
  INCENDIO: 'incendio_2018',
  SENTIERI: 'sentieri',
};

export const MAP_LAYERS = [
  {
    id: MAP_LAYER_TYPES.INCENDIO,
    name: 'Incendio 2018',
    icon: '/svg/incendio.svg',
  },
  {
    id: MAP_LAYER_TYPES.SENTIERI,
    name: 'Sentieri',
    icon: '/svg/sentieri.svg',
  },
  {
    id: MAP_LAYER_TYPES.FONTI,
    name: 'Fonti',
    icon: '/svg/fonti.svg',
  },
];
