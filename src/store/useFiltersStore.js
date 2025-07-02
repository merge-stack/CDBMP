import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const initialFiltersState = {
  layerType: 'default',
  area: '',
  intervention: '',
  budget: { min: 0, max: 0 },
  priority: '',
};

export const useFiltersStore = create(
  immer((set) => ({
    selectedFilters: initialFiltersState,

    setSelectedFilters: (filters) =>
      set((state) => ({
        selectedFilters: { ...state.selectedFilters, ...filters },
      })),
    resetFilters: () =>
      set(() => ({
        selectedFilters: initialFiltersState,
      })),
    setFilterToInitial: (filterKey) =>
      set((state) => ({
        selectedFilters: {
          ...state.selectedFilters,
          [filterKey]: initialFiltersState[filterKey],
        },
      })),
  }))
);

export default useFiltersStore;
