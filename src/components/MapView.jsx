import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your actual Mapbox token
mapboxgl.accessToken =
  'pk.eyJ1IjoibTFuZXJhbCIsImEiOiJja2V6MHd2bnQwYzRqMnlwaTV6ejU2cTMyIn0.ghyrh-G8uQtyg4N4VcfTOw';

const MONTE_PISANO_CENTER = [10.4, 43.7];

// Mock GeoJSON data for forest areas
const mockForestAreas = {
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

// Mock warning points
const mockWarningPoints = {
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

function MapView({ selectedLayer, onLayerSelect }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: MONTE_PISANO_CENTER,
      zoom: 12,
    });

    map.current.on('load', () => {
      // Add forest areas source
      map.current.addSource('forest-areas', {
        type: 'geojson',
        data: mockForestAreas,
      });

      // Add forest areas fill layer
      map.current.addLayer({
        id: 'forest-areas-fill',
        type: 'fill',
        source: 'forest-areas',
        paint: {
          'fill-color': 'transparent',
          'fill-opacity': 0.1,
        },
      });

      // Add forest areas outline layer
      map.current.addLayer({
        id: 'forest-areas-outline',
        type: 'line',
        source: 'forest-areas',
        paint: {
          'line-color': '#FF4444',
          'line-width': 2,
        },
      });

      // Add selected area highlight
      map.current.addLayer({
        id: 'forest-areas-selected',
        type: 'fill',
        source: 'forest-areas',
        paint: {
          'fill-color': '#FF4444',
          'fill-opacity': 0.2,
        },
        filter: ['==', 'id', 0],
      });

      // Add warning points source
      map.current.addSource('warning-points', {
        type: 'geojson',
        data: mockWarningPoints,
      });

      // Add warning triangles
      map.current.addLayer({
        id: 'warning-points',
        type: 'symbol',
        source: 'warning-points',
        layout: {
          'icon-image': 'triangle-15',
          'icon-size': 1.5,
          'icon-color': '#FFD700',
        },
      });

      // Add hover effect
      map.current.on('mousemove', 'forest-areas-fill', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'forest-areas-fill', () => {
        map.current.getCanvas().style.cursor = '';
      });

      // Handle click events
      map.current.on('click', 'forest-areas-fill', (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const bounds = new mapboxgl.LngLatBounds();
          feature.geometry.coordinates[0].forEach((coord) => {
            bounds.extend(coord);
          });

          onLayerSelect({
            id: feature.properties.id,
            title: feature.properties.title,
            area: feature.properties.area,
            bounds: bounds,
          });

          map.current.fitBounds(bounds, {
            padding: 100,
            duration: 1000,
          });
        }
      });
    });
  }, [onLayerSelect]);

  // Update selected area highlight and zoom to bounds when selectedLayer changes
  useEffect(() => {
    if (!map.current || !selectedLayer) return;

    map.current.setFilter('forest-areas-selected', [
      '==',
      'id',
      selectedLayer.id || 0,
    ]);

    // If bounds are provided, zoom to them
    if (selectedLayer.bounds) {
      map.current.fitBounds(selectedLayer.bounds, {
        padding: 100,
        duration: 1000,
      });
    }
  }, [selectedLayer]);

  return (
    <Box
      ref={mapContainer}
      sx={{
        flex: 1,
        height: '100%',
        '& .mapboxgl-ctrl-bottom-left, & .mapboxgl-ctrl-bottom-right': {
          display: 'none',
        },
      }}
    />
  );
}

export default MapView;
