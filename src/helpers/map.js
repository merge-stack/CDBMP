import * as turf from '@turf/turf';
import { FlyToInterpolator } from '@deck.gl/core';

export const flyTo = ({ feature, setViewState, zoom = 13 }) => {
  let coordinates;

  // Handle different geometry types
  if (feature.geometry.type === 'Polygon') {
    coordinates = feature.geometry.coordinates[0];
  } else if (feature.geometry.type === 'MultiPolygon') {
    coordinates = feature.geometry.coordinates.flat(1);
  } else {
    return;
  }

  // Calculate center point of the coordinates
  const features = turf.points(coordinates);
  const center = turf.center(features);

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
