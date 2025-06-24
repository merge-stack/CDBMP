import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const initialFiltersState = {
  area: '',
  intervention: '',
  budget: { min: 0, max: 0 },
  priority: '',
  participation: '',
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
  }))
);

export default useFiltersStore;
