import bbox from '@turf/bbox';
import { WebMercatorViewport } from '@deck.gl/core';

import { FlyToInterpolator } from '@deck.gl/core';
import { easeCubic } from 'd3-ease';
import { toast } from 'react-toastify';

import {
  GeoJsonLayer,
  IconLayer,
  ScatterplotLayer,
  TextLayer,
} from '@deck.gl/layers';
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
  selectedMapLayer,
  hoveredObject,
  onClick,
  onHover,
}) => {
  if (
    !geoJsonData ||
    !geoJsonData.features ||
    geoJsonData.features.length === 0
  )
    return [];

  const layers = [];
  if (!selectedMapLayer) return;

  const isFonti = selectedMapLayer.id === 'fonti';
  const isAttrazioni = selectedMapLayer.id === 'attrazioni';
  const isIncendio = selectedMapLayer.id === 'incendio_2018';

  layers.push(
    // IconLayer for custom icons
    new IconLayer({
      id: 'fonti-icons',
      data: isFonti ? geoJsonData.features : [],
      visible: isFonti,
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

  layers.push(
    new GeoJsonLayer({
      id: `${LAYER_CONFIG.areas.id}-fill`,
      data: geoJsonData,
      visible: isAttrazioni || isIncendio,
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
      id: `${LAYER_CONFIG.areas.id}-border`,
      data: geoJsonData,
      visible: isAttrazioni || isIncendio,
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

  return layers;
};
