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
    selectedMobileMenu: initialSelectedMobileMenu,
    setShowDetailPanel: (show) =>
      set((state) => {
        state.showDetailPanel = show;
      }),
    toggleDetailPanel: () =>
      set((state) => {
        state.showDetailPanel = !state.showDetailPanel;
      }),
    setIsLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),
    setSelectedMobileMenu: (menu) =>
      set((state) => {
        state.selectedMobileMenu = menu;
      }),
    resetUI: () =>
      set(() => ({
        showDetailPanel: false,
        isLoading: false,
        selectedMobileMenu: initialSelectedMobileMenu,
      })),
  }))
);

export default useUIStore;
