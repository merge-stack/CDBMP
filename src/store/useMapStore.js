import { create } from 'zustand';
import { MAP_CONFIG } from '../constants/map';

const initialMapViewState = {
  longitude: MAP_CONFIG.center[0],
  latitude: MAP_CONFIG.center[1],
  zoom: MAP_CONFIG.defaultZoom,
  maxZoom: MAP_CONFIG.maxZoom,
  minZoom: MAP_CONFIG.minZoom,
  padding: MAP_CONFIG.padding,
  pitch: 0,
  bearing: 0,
};

const useMapStore = create((set, get) => ({
  geoJsonData: {
    default: null,
    fonti: null,
    incendio_2018: null,
    sentieri: null,
  },
  selectedLayer: null,
  mapViewState: initialMapViewState,
  // Track display layers that can be toggled (fonti and incendio)
  displayLayers: new Set([]),

  // Improved state setters with better immutability
  setGeoJsonData: (data) => set(() => ({ geoJsonData: data })),

  // Update specific layer data without affecting other layers
  updateLayerData: (layerType, layerData) =>
    set((state) => ({
      geoJsonData: {
        ...state.geoJsonData,
        [layerType]: layerData,
      },
    })),

  // Update only default data while preserving other layers
  updateDefaultLayerData: (defaultLayerData) =>
    set((state) => ({
      geoJsonData: {
        ...state.geoJsonData,
        default: defaultLayerData,
      },
    })),

  setSelectedLayer: (layer) => set(() => ({ selectedLayer: layer })),

  setMapViewState: (viewState) =>
    set((state) => ({
      mapViewState: { ...state.mapViewState, ...viewState },
    })),

  // Toggle map layer on/off (for display purposes only)
  toggleMapLayer: (layerId) =>
    set((state) => {
      const newDisplayLayers = new Set(state.displayLayers);
      if (newDisplayLayers.has(layerId)) {
        newDisplayLayers.delete(layerId);
      } else {
        newDisplayLayers.add(layerId);
      }
      return { displayLayers: newDisplayLayers };
    }),

  // Check if a layer is active for display
  isMapLayerActive: (layerId) => {
    const state = get();
    // Default layer is always active for data, others are in displayLayers
    if (layerId === 'default') return true;
    return state.displayLayers.has(layerId);
  },

  // Set specific layers as active for display
  setDisplayLayers: (layerIds) =>
    set(() => ({ displayLayers: new Set(layerIds) })),

  resetMapViewState: () => set(() => ({ mapViewState: initialMapViewState })),
  resetMap: () =>
    set({
      geoJsonData: {
        default: null,
        fonti: null,
        incendio_2018: null,
        sentieri: null,
      },
      selectedLayer: null,
      mapViewState: initialMapViewState,
      displayLayers: new Set([]),
    }),

  // Getters for better data access
  getDefaultLayerData: () => {
    const state = get();
    return state.geoJsonData?.default || null;
  },

  getLayerData: (layerType) => {
    const state = get();
    return state.geoJsonData?.[layerType] || null;
  },
}));

export default useMapStore;
