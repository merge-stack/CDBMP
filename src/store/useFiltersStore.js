import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const initialFiltersState = {
  layerType: 'default',
  area: [],
  intervention: [],
  budget: { min: 0, max: 0 },
  servizi_ecosistemici: [],
};

export const useFiltersStore = create(
  immer((set) => ({
    selectedFilters: initialFiltersState,

    setSelectedFilters: (filters) =>
      set((state) => ({
        selectedFilters: { ...state.selectedFilters, ...filters },
      })),

    // Handle multi-select filter updates
    updateMultiSelectFilter: (filterId, value, isSelected) =>
      set((state) => {
        const currentValues = state.selectedFilters[filterId] || [];
        let newValues;

        if (isSelected) {
          // Add value if not already present
          newValues = currentValues.includes(value)
            ? currentValues
            : [...currentValues, value];
        } else {
          // Remove value if present
          newValues = currentValues.filter((v) => v !== value);
        }

        return {
          selectedFilters: {
            ...state.selectedFilters,
            [filterId]: newValues,
          },
        };
      }),

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
