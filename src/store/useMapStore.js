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

const initialSelectedMapLayerState = {
  id: 'attractions',
  name: 'Attrazioni',
  icon: '/svg/attrazioni.svg',
};

const useMapStore = create((set) => ({
  geoJsonData: null,
  selectedLayer: null,
  mapViewState: initialMapViewState,
  selectedMapLayer: initialSelectedMapLayerState,

  setGeoJsonData: (data) => set((state) => ({ ...state, geoJsonData: data })),

  setSelectedLayer: (layer) =>
    set((state) => ({ ...state, selectedLayer: layer })),

  setMapViewState: (viewState) =>
    set((state) => ({
      ...state,
      mapViewState: { ...state.mapViewState, ...viewState },
    })),

  setSelectedMapLayer: (mapLayer) =>
    set((state) => ({ ...state, selectedMapLayer: mapLayer })),

  resetMapViewState: () =>
    set((state) => ({ ...state, mapViewState: initialMapViewState })),

  resetMap: () =>
    set({
      geoJsonData: null,
      selectedLayer: null,
      mapViewState: initialMapViewState,
      selectedMapLayer: initialSelectedMapLayerState,
    }),
}));

export default useMapStore;
