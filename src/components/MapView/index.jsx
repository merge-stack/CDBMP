import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import ReactDOMServer from 'react-dom/server';

import 'mapbox-gl/dist/mapbox-gl.css';
import { DeckGL } from '@deck.gl/react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';

import MapLoader from './MapLoader';
import LayerCard from '../SidePanel/LayerCard';

import { useApi } from '../../hooks/useApi';
import apiService from '../../services/api';

import useUIStore from '../../store/useUIStore';
import useMapStore from '../../store/useMapStore';
import useFiltersStore from '../../store/useFiltersStore';

import {
  MAP_CONFIG,
  ANIMATION_CONFIG,
  INTERACTION_CONFIG,
} from '../../constants/map';

import { flyTo } from '../../helpers/map';
import { getDeckLayers } from '../../helpers/map';

const MapView = () => {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);

  // Store Sates
  const { selectedFilters } = useFiltersStore();
  const {
    selectedLayer,
    setSelectedLayer,
    geoJsonData,
    setGeoJsonData,
    mapViewState,
    setMapViewState,
  } = useMapStore();
  const { setShowDetailPanel, isLoading } = useUIStore();

  // Fetch GeoJSON data from API
  const { execute: getMapAreas } = useApi(apiService.getMapAreas);

  // Fetch GeoJSON data when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        // Convert filters to query parameters
        const queryParams = Object.entries(selectedFilters || {})
          .filter(
            ([, value]) => value !== null && value !== undefined && value !== ''
          )
          .reduce((acc, [key, value]) => {
            if (typeof value === 'object') {
              // Handle range filters (budget)
              if (value.min) acc[`${key}_min`] = value.min;
              if (value.max) acc[`${key}_max`] = value.max;
            } else {
              acc[key] = value;
            }
            return acc;
          }, {});

        const data = await getMapAreas(queryParams);

        if (!data || !data.features) {
          throw new Error('Invalid GeoJSON data format');
        }

        setGeoJsonData(data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error('Error loading map data: ' + errorMessage);
        setError(errorMessage);
      }
    };

    fetchData();
  }, [selectedFilters, getMapAreas, setGeoJsonData]);

  const onHover = useCallback((info) => {
    if (mapRef.current && INTERACTION_CONFIG.hover.enabled) {
      mapRef.current.getCanvas().style.cursor = info.object ? 'pointer' : '';
    }
    setHoveredObject(info.object);
  }, []);

  const onClick = useCallback(
    (event) => {
      if (!event.object) return;

      const feature = event.object;

      // First call setSelectedLayer with the feature data
      setSelectedLayer({ ...feature.properties });
      //Open detail panel
      setShowDetailPanel(true);
    },
    [setShowDetailPanel, setSelectedLayer]
  );

  // Use getDeckLayers for DeckGL layers
  const layers = useMemo(
    () =>
      getDeckLayers({
        geoJsonData,
        selectedLayer,
        hoveredObject,
        onClick,
        onHover,
      }),
    [geoJsonData, selectedLayer, hoveredObject, onClick, onHover]
  );

  const debouncedViewStateUpdate = useMemo(
    () =>
      debounce((newViewState) => {
        setMapViewState(newViewState);
      }, INTERACTION_CONFIG.hover.delayMs),
    [setMapViewState]
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
          setMapViewState,
          options: {
            transitionDuration: ANIMATION_CONFIG.duration,
          },
        });
      }
    }
  }, [selectedLayer, geoJsonData, setMapViewState]);

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
      {isLoading && <MapLoader />}

      <DeckGL
        initialViewState={mapViewState}
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
          {...mapViewState}
          mapStyle={MAP_CONFIG.style}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        >
          <NavigationControl position="top-right" />
        </Map>
      </DeckGL>
    </div>
  );
};

export default MapView;
