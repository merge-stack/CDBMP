import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import debounce from 'lodash/debounce';
import {
  MAP_CONFIG,
  LAYER_CONFIG,
  ANIMATION_CONFIG,
  INTERACTION_CONFIG,
} from '../constants/map';
import { flyTo } from '../helpers/map';
import { toast } from 'react-toastify';
import { LayerCard } from './SidePanel';
import ReactDOMServer from 'react-dom/server';

function MapView({
  selectedLayer,
  onLayerSelect,
  geoJsonData,
  setGeoJsonData,
}) {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);

  // Fetch GeoJSON data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch('assets/sisteco.geojson')
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
        toast.error('Error loading GeoJSON: ' + error.message);
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

  const onHover = useCallback((info) => {;
    if (mapRef.current && INTERACTION_CONFIG.hover.enabled) {
      mapRef.current.getCanvas().style.cursor = info.object ? 'pointer' : '';
    }
    setHoveredObject(info.object);
  }, []);

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

  // Define deck.gl layers inside the component to access selectedLayer
  const layers = useMemo(
    () => [
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
        getLineWidth: 20,
        pickable: false, // Border layer should not be pickable for hover/click
        autoHighlight: false, // Disable autoHighlight for this layer
        parameters: {
          depthTest: false,
        },
      }),
    ],
    [geoJsonData, selectedLayer, hoveredObject, onClick, onHover]
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
      <div className="flex-1 h-full flex items-center justify-center text-red-500">
        Error loading map data: {error}
      </div>
    );
  }

  return (
    <div className="flex-1 h-[calc(100vh-163px)] mt-[163px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-1000">
          Loading map data...
        </div>
      )}
      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={({ viewState }) =>
          debouncedViewStateUpdate(viewState)
        }
        getTooltip={
          INTERACTION_CONFIG.tooltip.enabled
            ? ({ object }) => {
                if (!object) return null;

                const layer = object.properties;
                const htmlString = ReactDOMServer.renderToStaticMarkup(
                  <LayerCard layer={layer} isMapTooltip={true} />
                );

                return {
                  html: htmlString,
                  style: { background: 'none' },
                };
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
    </div>
  );
}

export default MapView;
