import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import debounce from 'lodash/debounce';
import {
  MAP_CONFIG,
  LAYER_CONFIG,
  ANIMATION_CONFIG,
  INTERACTION_CONFIG,
} from '../constants/map';
import { flyTo } from '../helpers/map';

function MapView({
  selectedLayer,
  onLayerSelect,
  geoJsonData,
  setGeoJsonData,
}) {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch GeoJSON data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch('/src/assets/sisteco.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !data.features) {
          throw new Error('Invalid GeoJSON data format');
        }
        setGeoJsonData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [setGeoJsonData]);

  const [viewState, setViewState] = useState({
    longitude: MAP_CONFIG.center[0],
    latitude: MAP_CONFIG.center[1],
    zoom: MAP_CONFIG.defaultZoom,
    maxZoom: MAP_CONFIG.maxZoom,
    minZoom: MAP_CONFIG.minZoom,
    padding: MAP_CONFIG.padding,
    pitch: 0,
    bearing: 0,
  });

  // Define deck.gl layers inside the component to access selectedLayer
  const layers = useMemo(
    () => [
      new GeoJsonLayer({
        id: LAYER_CONFIG.areas.id,
        data: geoJsonData,
        filled: true,
        stroked: true,
        getFillColor: (d) =>
          d.properties.id === selectedLayer?.id
            ? LAYER_CONFIG.areas.styles.selected.fillColor
            : LAYER_CONFIG.areas.styles.default.fillColor,
        getLineColor: (d) =>
          d.properties.id === selectedLayer?.id
            ? LAYER_CONFIG.areas.styles.selected.lineColor
            : LAYER_CONFIG.areas.styles.default.lineColor,
        getLineWidth: (d) =>
          d.properties.id === selectedLayer?.id
            ? LAYER_CONFIG.areas.styles.selected.lineWidth
            : LAYER_CONFIG.areas.styles.default.lineWidth,
        pickable: LAYER_CONFIG.areas.pickable,
        highlightColor: LAYER_CONFIG.areas.styles.highlight.color,
        updateTriggers: {
          getFillColor: [selectedLayer?.id],
          getLineColor: [selectedLayer?.id],
          getLineWidth: [selectedLayer?.id],
        },
      }),
    ],
    [geoJsonData, selectedLayer]
  );

  const debouncedViewStateUpdate = useMemo(
    () =>
      debounce((newViewState) => {
        setViewState((prev) => ({ ...prev, ...newViewState }));
      }, INTERACTION_CONFIG.hover.delayMs),
    []
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedViewStateUpdate.cancel();
    };
  }, [debouncedViewStateUpdate]);

  const onClick = useCallback(
    (event) => {
      if (!event.object) return;

      const feature = event.object;

      // First call onLayerSelect with the feature data
      onLayerSelect({
        ...feature.properties,
      });
    },
    [onLayerSelect]
  );

  const onHover = useCallback((info) => {
    if (mapRef.current && INTERACTION_CONFIG.hover.enabled) {
      mapRef.current.getCanvas().style.cursor = info.object ? 'pointer' : '';
    }
  }, []);

  // Update bounds when selectedLayer changes
  useEffect(() => {
    if (mapRef.current && selectedLayer) {
      const feature = geoJsonData?.features?.find(
        (feature) => feature.properties.id === selectedLayer.id
      );
      if (feature) {
        flyTo({
          feature,
          setViewState,
          options: {
            padding: ANIMATION_CONFIG.padding,
            transitionDuration: ANIMATION_CONFIG.duration,
          },
        });
      }
    }
  }, [selectedLayer, geoJsonData]);

  // Add error boundary for map rendering
  if (error) {
    return (
      <Box
        sx={{
          flex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'error.main',
        }}
      >
        Error loading map data: {error}
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1000,
          }}
        >
          Loading map data...
        </Box>
      )}
      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={({ viewState }) =>
          debouncedViewStateUpdate(viewState)
        }
        onClick={INTERACTION_CONFIG.click.enabled ? onClick : undefined}
        onHover={INTERACTION_CONFIG.hover.enabled ? onHover : undefined}
        getTooltip={
          INTERACTION_CONFIG.tooltip.enabled
            ? ({ object }) =>
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
            : undefined
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
