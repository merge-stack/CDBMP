import * as turf from '@turf/turf';
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

  let coordinates;

  try {
    // Handle different geometry types
    switch (feature.geometry.type) {
      case 'Polygon':
        coordinates = feature.geometry.coordinates[0];
        break;
      case 'MultiPolygon':
        coordinates = feature.geometry.coordinates.reduce((acc, polygon) => {
          return acc.concat(polygon[0]);
        }, []);
        break;
      case 'Point':
        coordinates = [feature.geometry.coordinates];
        break;
      case 'LineString':
        coordinates = feature.geometry.coordinates;
        break;
      case 'MultiLineString':
        coordinates = feature.geometry.coordinates.flat();
        break;
      default:
        toast.error(`Unsupported geometry type: ${feature.geometry.type}`);
        return;
    }

    if (!coordinates || coordinates.length === 0) {
      toast.error('No valid coordinates found in feature');
      return;
    }

    // Calculate center point of the coordinates
    const features = turf.points(coordinates);
    const center = turf.center(features);

    // Calculate the area and extent of the feature
    const bbox = turf.bbox(feature);

    // Add padding to the bbox
    const padding = options.padding || 0.1; // 10% padding by default
    const width = Math.abs(bbox[2] - bbox[0]);
    const height = Math.abs(bbox[3] - bbox[1]);
    const paddedBbox = [
      bbox[0] - width * padding,
      bbox[1] - height * padding,
      bbox[2] + width * padding,
      bbox[3] + height * padding,
    ];

    // Calculate the extent in degrees
    const maxExtent = Math.max(
      Math.abs(paddedBbox[2] - paddedBbox[0]),
      Math.abs(paddedBbox[3] - paddedBbox[1])
    );

    // Dynamic zoom calculation based on extent
    const zoom = Math.min(
      16, // max zoom
      Math.max(
        11, // min zoom
        Math.floor(14 - Math.log2(maxExtent * 100))
      )
    );

    setMapViewState({
      longitude: center.geometry.coordinates[0],
      latitude: center.geometry.coordinates[1],
      zoom,
      ...DEFAULT_TRANSITION_PROPS,
      ...options,
    });
  } catch (error) {
    toast.error('Error in flyTo: ' + error.message);
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
