import { useCallback, useRef, useEffect, useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import {
  MAP_CONFIG,
  MOCK_WARNING_POINTS,
  MOCK_FOREST_AREAS,
} from '../constants/map';
import { flyTo } from '../helpers/map';

function MapView({
  selectedLayer,
  onLayerSelect,
  geoJsonData,
  setGeoJsonData,
}) {
  const mapRef = useRef(null);

  // Fetch GeoJSON data
  useEffect(() => {
    fetch('/src/assets/sisteco.geojson')
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => console.error('Error loading GeoJSON:', error));
  }, [setGeoJsonData]);

  const [viewState, setViewState] = useState({
    longitude: MAP_CONFIG.center[0],
    latitude: MAP_CONFIG.center[1],
    zoom: MAP_CONFIG.defaultZoom,
    maxZoom: MAP_CONFIG.maxZoom,
    padding: MAP_CONFIG.padding,
    pitch: 0,
    bearing: 0,
  });

  // Define deck.gl layers inside the component to access selectedLayer
  const layers = [
    new GeoJsonLayer({
      id: 'geojson-layer',
      data: geoJsonData,
      filled: true,
      stroked: true,
      getFillColor: (d) =>
        d.properties.id === selectedLayer?.id
          ? [255, 68, 68, 150]
          : [255, 68, 68, 75],
      getLineColor: (d) =>
        d.properties.id === selectedLayer?.id
          ? [255, 215, 0, 255]
          : [255, 68, 68, 0],
      getLineWidth: (d) => (d.properties.id === selectedLayer?.id ? 20 : 10),
      pickable: true,
      // autoHighlight: true,
      highlightColor: [255, 68, 68, 100],
      updateTriggers: {
        getFillColor: [selectedLayer?.id],
        getLineColor: [selectedLayer?.id],
        getLineWidth: [selectedLayer?.id],
      },
    }),
  ];

  const onClick = useCallback(
    (event) => {
      if (!event.object) return;

      const feature = event.object;

      // First call onLayerSelect with the feature data
      onLayerSelect({
        ...feature.properties,
      });

      // Fly to the layer
      flyTo({ feature, setViewState });
    },
    [onLayerSelect]
  );

  const onHover = useCallback((info) => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = info.object ? 'pointer' : '';
    }
  }, []);

  // Update bounds when selectedLayer changes
  useEffect(() => {
    if (mapRef.current && selectedLayer) {
      const feature = geoJsonData?.features?.find(
        (feature) => feature.properties.id === selectedLayer.id
      );
      flyTo({ feature, setViewState });
    }
  }, [selectedLayer, geoJsonData]);

  return (
    <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={({ viewState }) =>
          setViewState((prev) => ({ ...prev, ...viewState }))
        }
        onClick={onClick}
        onHover={onHover}
        getTooltip={({ object }) =>
          object && {
            html: `
            <div>
              <b>${object.properties?.code || 'Warning Point'}</b>
              ${
                object.properties?.area
                  ? `<br/>Area: ${object.properties.area}`
                  : ''
              }
            </div>
          `,
          }
        }
      >
        <Map
          ref={mapRef}
          {...viewState}
          mapStyle={MAP_CONFIG.style}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        >
          <NavigationControl position="top-right" />
        </Map>
      </DeckGL>
    </Box>
  );
}

export default MapView;
