import bbox from '@turf/bbox';
import { WebMercatorViewport } from '@deck.gl/core';

import { FlyToInterpolator } from '@deck.gl/core';
import { easeCubic } from 'd3-ease';
import { toast } from 'react-toastify';

import { GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import {
  LAYER_CONFIG,
  INTERACTION_CONFIG,
  MAP_LAYER_TYPES,
} from '../constants/map';

const DEFAULT_TRANSITION_PROPS = {
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: easeCubic,
};

const DEFAULT_GEOJSON = { type: 'FeatureCollection', features: [] };

export const flyTo = ({ feature, setMapViewState, options = {} }) => {
  if (!feature || !feature.geometry) {
    toast.error('Invalid feature provided to flyTo');
    return;
  }

  try {
    const bounds = bbox(feature); // [minX, minY, maxX, maxY]

    const padding = options.padding || 40; // in pixels
    const width = options.width || window.innerWidth;
    const height = options.height || 300; // Adjust for bottom bar if needed

    const viewport = new WebMercatorViewport({
      width,
      height,
    });

    const { longitude, latitude, zoom } = viewport.fitBounds(
      [
        [bounds[0], bounds[1]], // SW
        [bounds[2], bounds[3]], // NE
      ],
      { padding }
    );

    setMapViewState({
      longitude,
      latitude,
      zoom,
      ...DEFAULT_TRANSITION_PROPS,
      ...options,
    });
  } catch (err) {
    toast.error('flyTo error: ' + err.message);
  }
};

export const getDeckLayers = ({
  geoJsonData,
  selectedLayer,
  displayLayers,
  hoveredObject,
  onClick,
  onHover,
}) => {
  if (!geoJsonData) return [];

  const layers = [];

  const isFonti = displayLayers.has(MAP_LAYER_TYPES.FONTI);
  const isIncendio = displayLayers.has(MAP_LAYER_TYPES.INCENDIO);
  const isSentieri = displayLayers.has(MAP_LAYER_TYPES.SENTIERI);

  // Get data for each layer type directly from geoJsonData
  const attrazioniData =
    geoJsonData[MAP_LAYER_TYPES.ATTRazioni] || DEFAULT_GEOJSON;
  const fontiData = geoJsonData[MAP_LAYER_TYPES.FONTI] || DEFAULT_GEOJSON;
  const incendioData = geoJsonData[MAP_LAYER_TYPES.INCENDIO] || DEFAULT_GEOJSON;
  const sentieriData = geoJsonData[MAP_LAYER_TYPES.SENTIERI] || DEFAULT_GEOJSON;

  if (sentieriData.features.length > 0) {
    layers.push(
      new GeoJsonLayer({
        id: 'sentieri-line',
        data: sentieriData,
        visible: isSentieri, // Only visible when toggled on
        filled: false,
        stroked: true,
        getLineColor: [30, 30, 30, 200],
        getLineWidth: 20,
        pickable: true,
      })
    );
  }

  // Incendio layer (GeoJsonLayer with different styling) - visibility controlled by displayLayers
  if (incendioData.features.length > 0) {
    layers.push(
      new GeoJsonLayer({
        id: 'incendio-fill',
        data: incendioData,
        visible: isIncendio, // Only visible when toggled on
        filled: true,
        stroked: false,
        getFillColor: () => {
          return [255, 140, 0, 100]; // Incendio fill color (orange)
        },
        pickable: LAYER_CONFIG.areas.pickable,
        autoHighlight: false,
        updateTriggers: {
          getFillColor: [selectedLayer?.id, hoveredObject?.properties?.id],
        },
        parameters: {
          depthTest: false,
        },
      })
    );

    layers.push(
      new GeoJsonLayer({
        id: 'incendio-border',
        data: incendioData,
        visible: isIncendio, // Only visible when toggled on
        filled: false,
        stroked: true,
        getLineColor: [255, 140, 0, 255], // Incendio border color (orange)
        getLineWidth: 10,
        pickable: false,
        autoHighlight: false,
        parameters: {
          depthTest: false,
        },
      })
    );
  }

  // Attrazioni layer (GeoJsonLayer with fill and border) - always visible
  if (attrazioniData.features.length > 0) {
    layers.push(
      new GeoJsonLayer({
        id: 'attrazioni-fill',
        data: attrazioniData,
        visible: true,
        filled: true,
        stroked: false, // This layer only handles the fill
        getFillColor: (d) => {
          if (
            d.properties.id === selectedLayer?.id ||
            d.properties.id === hoveredObject?.properties?.id
          ) {
            return [0, 200, 0, 150]; // Highlight fill color for selected or hovered
          }
          return [0, 0, 0, 0]; // Default transparent fill
        },
        pickable: LAYER_CONFIG.areas.pickable, // Still pickable for click/hover events
        autoHighlight: false, // Disable autoHighlight for this layer
        updateTriggers: {
          getFillColor: [selectedLayer?.id, hoveredObject?.properties?.id],
        },
        parameters: {
          depthTest: false,
        },
        onClick: INTERACTION_CONFIG.click.enabled ? onClick : undefined,
        onHover: INTERACTION_CONFIG.hover.enabled ? onHover : undefined,
      })
    );

    layers.push(
      new GeoJsonLayer({
        id: 'attrazioni-border',
        data: attrazioniData,
        visible: true,
        filled: false, // This layer only handles the border
        stroked: true,
        getLineColor: [255, 0, 0, 255], // Always red border
        getLineWidth: 10,
        pickable: false, // Border layer should not be pickable for hover/click
        autoHighlight: false, // Disable autoHighlight for this layer
        parameters: {
          depthTest: false,
        },
      })
    );
  }

  // Fonti layer (IconLayer) - visibility controlled by displayLayers
  if (fontiData.features.length > 0) {
    layers.push(
      new IconLayer({
        id: 'fonti-icons',
        data: fontiData.features,
        visible: isFonti, // Only visible when toggled on
        pickable: true,
        getIcon: (d) => ({
          url: d.properties.icon,
          width: 64,
          height: 64,
          anchorY: 64,
        }),
        getPosition: (d) => [
          d.geometry.coordinates[0],
          d.geometry.coordinates[1],
        ],
        getSize: (d) => (d.properties['icon-scale'] || 1) * 32,
        sizeUnits: 'pixels',
      })
    );
  }

  return layers;
};
