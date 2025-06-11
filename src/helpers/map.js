import * as turf from '@turf/turf';
import { FlyToInterpolator } from '@deck.gl/core';

export const flyTo = ({ feature, setViewState }) => {
  let coordinates;

  // Handle different geometry types
  if (feature.geometry.type === 'Polygon') {
    coordinates = feature.geometry.coordinates[0];
  } else if (feature.geometry.type === 'MultiPolygon') {
    // For MultiPolygon, we need to get all points from all polygons
    coordinates = feature.geometry.coordinates.reduce((acc, polygon) => {
      // Each polygon's first element is the outer ring
      return acc.concat(polygon[0]);
    }, []);
  } else {
    return;
  }

  // Calculate center point of the coordinates
  const features = turf.points(coordinates);
  const center = turf.center(features);

  // Calculate the area and extent of the feature
  const bbox = turf.bbox(feature);

  // Calculate the extent in degrees
  const width = Math.abs(bbox[2] - bbox[0]);
  const height = Math.abs(bbox[3] - bbox[1]);
  const maxExtent = Math.max(width, height);

  // Calculate zoom based on the feature's extent
  // Smaller extent = higher zoom level
  let zoom;
  if (maxExtent < 0.01) {
    // Very small feature
    zoom = 16;
  } else if (maxExtent < 0.05) {
    zoom = 14;
  } else if (maxExtent < 0.1) {
    zoom = 13;
  } else if (maxExtent < 0.5) {
    zoom = 12;
  } else {
    zoom = 11;
  }

  setViewState((prev) => {
    return {
      ...prev,
      longitude: center.geometry.coordinates[0],
      latitude: center.geometry.coordinates[1],
      zoom,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    };
  });
};
