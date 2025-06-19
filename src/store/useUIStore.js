import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useUIStore = create(
  immer((set) => ({
    showDetailPanel: false,
    isLoading: false,
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
    resetUI: () =>
      set(() => ({
        showDetailPanel: false,
        isLoading: false,
      })),
  }))
);

export default useUIStore;
