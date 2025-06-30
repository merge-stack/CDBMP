import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const initialSelectedMobileMenu = {
  id: 'home',
  label: 'Home',
  src: '/svg/homeIcon.svg',
};

export const useUIStore = create(
  immer((set) => ({
    showDetailPanel: false,
    isLoading: false,
    isFiltersBarVisible: true,
    selectedMobileMenu: initialSelectedMobileMenu,

    setShowDetailPanel: (show) =>
      set(() => ({
        showDetailPanel: show,
      })),
    toggleDetailPanel: () =>
      set((state) => ({
        showDetailPanel: !state.showDetailPanel,
      })),
    setIsLoading: (loading) =>
      set(() => ({
        isLoading: loading,
      })),
    setFiltersBarVisible: (visible) =>
      set(() => ({
        isFiltersBarVisible: visible,
      })),
    toggleFiltersBar: () =>
      set((state) => ({
        isFiltersBarVisible: !state.isFiltersBarVisible,
      })),
    setSelectedMobileMenu: (menu) =>
      set(() => ({
        selectedMobileMenu: menu,
      })),
    resetUI: () =>
      set(() => ({
        showDetailPanel: false,
        isLoading: false,
        isFiltersBarVisible: true,
        selectedMobileMenu: initialSelectedMobileMenu,
      })),
  }))
);

export default useUIStore;
