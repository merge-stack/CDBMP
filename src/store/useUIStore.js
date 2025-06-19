import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useUIStore = create(
  immer((set) => ({
    showDetailPanel: false,
    setShowDetailPanel: (show) =>
      set((state) => {
        state.showDetailPanel = show;
      }),
    toggleDetailPanel: () =>
      set((state) => {
        state.showDetailPanel = !state.showDetailPanel;
      }),

    resetUI: () =>
      set(() => ({
        showDetailPanel: false,
      })),
  }))
);

export default useUIStore;
