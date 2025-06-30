import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import ReactDOMServer from 'react-dom/server';

import 'mapbox-gl/dist/mapbox-gl.css';
import { DeckGL } from '@deck.gl/react';
import Map from 'react-map-gl/mapbox';

import MapLoader from './MapLoader';
import LayerCard from '../SidePanel/LayerCard';

import useApi from '../../hooks/useApi';
import apiService from '../../services/api';

import useUIStore from '../../store/useUIStore';
import useMapStore from '../../store/useMapStore';
import useFiltersStore from '../../store/useFiltersStore';

import {
  MAP_CONFIG,
  INTERACTION_CONFIG,
  MAP_LAYER_TYPES,
} from '../../constants/map';
import { flyTo, getDeckLayers } from '../../helpers/map';

// Custom hook for data fetching
const useMapData = () => {
  const { selectedFilters } = useFiltersStore();
  const { updateAttrazioniData, updateLayerData } = useMapStore();
  const { setIsLoading } = useUIStore();
  const { execute: getMapAreas } = useApi(apiService.getMapAreas);

  // Convert filters to query parameters - memoized for performance
  const buildQueryParams = useMemo(() => {
    return Object.entries(selectedFilters || {})
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
  }, [selectedFilters]);

  // Fetch only attrazioni data (with filters)
  const fetchAttrazioniData = useCallback(async () => {
    try {
      setIsLoading(true);

      const queryParams = {
        ...buildQueryParams,
        layerType: MAP_LAYER_TYPES.ATTRazioni,
      };

      const attrazioniData = await getMapAreas(queryParams);
      updateAttrazioniData(attrazioniData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error('Error loading attrazioni data: ' + errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryParams, getMapAreas, updateAttrazioniData, setIsLoading]);

  // Generic fetch for any layer (no filters except attrazioni)
  const fetchLayerData = useCallback(
    async (layerType) => {
      if (layerType === MAP_LAYER_TYPES.ATTRazioni) {
        // Use fetchAttrazioniData for attrazioni (with filters)
        return fetchAttrazioniData();
      }
      try {
        setIsLoading(true);
        const data = await getMapAreas({ layerType });
        updateLayerData(layerType, data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Error loading ${layerType} data: ` + errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [getMapAreas, updateLayerData, setIsLoading, fetchAttrazioniData]
  );

  return { fetchAttrazioniData, fetchLayerData };
};

// Custom hook for map interactions
const useMapInteractions = () => {
  const mapRef = useRef(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const { setSelectedLayer, setMapViewState } = useMapStore();
  const { setShowDetailPanel } = useUIStore();

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
      if (feature.properties.layerType === MAP_LAYER_TYPES.ATTRazioni) {
        setSelectedLayer({ ...feature.properties });
        setShowDetailPanel(true);
      }
    },
    [setSelectedLayer, setShowDetailPanel]
  );

  const debouncedViewStateUpdate = useMemo(
    () => debounce(setMapViewState, INTERACTION_CONFIG.hover.delayMs),
    [setMapViewState]
  );

  return {
    mapRef,
    hoveredObject,
    setHoveredObject,
    onHover,
    onClick,
    debouncedViewStateUpdate,
  };
};

// Custom hook for map tooltips
const useMapTooltips = () => {
  const getFontiTooltip = useCallback((object) => {
    if (
      object.properties.layerType !== MAP_LAYER_TYPES.FONTI ||
      !object.properties?.name
    ) {
      return null;
    }

    return {
      html: `
        <div role="tooltip" aria-live="polite" style="
          min-width:300px; max-width:400px; padding:16px 20px;
          background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb; font-family: Arial, sans-serif; word-break: break-word;
        ">
          <div style="font-weight:bold; font-size:1.1em; margin-bottom:8px; color:#000; line-height:1.3; word-break: break-word;">
            ${object.properties.name}
          </div>
          <div style="color:#222; white-space:pre-line; font-size:1em; line-height:1.5; margin-bottom:2px; word-break: break-word;">
            ${object.properties.description || ''}
          </div>
        </div>
      `,
      style: { background: 'none', pointerEvents: 'auto' },
    };
  }, []);

  const getAttrazioniTooltip = useCallback((object) => {
    if (object.properties.layerType !== MAP_LAYER_TYPES.ATTRazioni) {
      return null;
    }

    return {
      html: ReactDOMServer.renderToStaticMarkup(
        <LayerCard layer={object.properties} isMapTooltip={true} />
      ),
      style: { background: 'none' },
    };
  }, []);

  const getTooltip = useCallback(
    ({ object }) => {
      if (!object) return null;
      return getFontiTooltip(object) || getAttrazioniTooltip(object);
    },
    [getFontiTooltip, getAttrazioniTooltip]
  );

  return { getTooltip };
};

// Main MapView component
const MapView = () => {
  const [error, setError] = useState(null);

  // Store states
  const {
    selectedLayer,
    geoJsonData,
    mapViewState,
    displayLayers,
    setMapViewState,
  } = useMapStore();
  const { isLoading } = useUIStore();
  const { selectedFilters } = useFiltersStore();

  // Custom hooks
  const { fetchAttrazioniData, fetchLayerData } = useMapData();
  const {
    mapRef,
    hoveredObject,
    setHoveredObject,
    onHover,
    onClick,
    debouncedViewStateUpdate,
  } = useMapInteractions();
  const { getTooltip } = useMapTooltips();

  // Initial data fetch: only attrazioni
  useEffect(() => {
    fetchAttrazioniData().catch(setError);
  }, [fetchAttrazioniData]);

  // Re-fetch attrazioni data when filters change
  useEffect(() => {
    fetchAttrazioniData().catch(setError);
  }, [fetchAttrazioniData, selectedFilters]);

  // Fetch data for toggled-on layers if not already present
  useEffect(() => {
    const layersToFetch = Array.from(displayLayers).filter(
      (layerType) =>
        layerType !== MAP_LAYER_TYPES.ATTRazioni && !geoJsonData[layerType]
    );
    if (layersToFetch.length > 0) {
      layersToFetch.forEach((layerType) => {
        fetchLayerData(layerType).catch(setError);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayLayers]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => debouncedViewStateUpdate.cancel();
  }, [debouncedViewStateUpdate]);

  // Update bounds when selectedLayer changes
  useEffect(() => {
    if (mapRef.current && selectedLayer && geoJsonData?.attrazioni?.features) {
      const feature = geoJsonData.attrazioni.features.find(
        (feature) => feature.properties.id === selectedLayer.id
      );
      if (feature) {
        flyTo({ feature, setMapViewState });
      }
    }
  }, [selectedLayer, geoJsonData?.attrazioni?.features, setMapViewState]);

  // Clear hovered object when display layers change
  useEffect(() => {
    setHoveredObject(null);
  }, [displayLayers, setHoveredObject]);

  // Memoized DeckGL layers
  const layers = useMemo(
    () =>
      getDeckLayers({
        geoJsonData,
        selectedLayer,
        displayLayers,
        hoveredObject,
        onClick,
        onHover,
      }),
    [geoJsonData, selectedLayer, displayLayers, hoveredObject, onClick, onHover]
  );

  // Error boundary
  if (error) {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-red-500">
        Error loading map data: {error}
      </div>
    );
  }

  return (
    <div className="flex-1 h-full relative">
      {isLoading && <MapLoader />}

      <DeckGL
        initialViewState={mapViewState}
        controller={true}
        layers={layers}
        onViewStateChange={({ viewState }) =>
          debouncedViewStateUpdate(viewState)
        }
        getTooltip={INTERACTION_CONFIG.tooltip.enabled ? getTooltip : undefined}
      >
        <Map
          ref={mapRef}
          {...mapViewState}
          mapStyle={MAP_CONFIG.style}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </div>
  );
};

export default MapView;
