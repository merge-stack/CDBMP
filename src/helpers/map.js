import bbox from '@turf/bbox';
import { WebMercatorViewport } from '@deck.gl/core';

import { FlyToInterpolator } from '@deck.gl/core';
import { easeCubic } from 'd3-ease';
import { toast } from 'react-toastify';

import { GeoJsonLayer } from '@deck.gl/layers';
import { LAYER_CONFIG, INTERACTION_CONFIG } from '../constants/map';

const DEFAULT_TRANSITION_PROPS = {
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: easeCubic,
};

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
  hoveredObject,
  onClick,
  onHover,
}) => {
  return [
    // Layer for the fill (with dynamic highlight)
    new GeoJsonLayer({
      id: LAYER_CONFIG.areas.id + '-fill',
      data: geoJsonData,
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
    }),
    // Layer for the border (always red)
    new GeoJsonLayer({
      id: LAYER_CONFIG.areas.id + '-border',
      data: geoJsonData,
      filled: false, // This layer only handles the border
      stroked: true,
      getLineColor: [255, 0, 0, 255], // Always red border
      getLineWidth: 10,
      pickable: false, // Border layer should not be pickable for hover/click
      autoHighlight: false, // Disable autoHighlight for this layer
      parameters: {
        depthTest: false,
      },
    }),
  ];
};
