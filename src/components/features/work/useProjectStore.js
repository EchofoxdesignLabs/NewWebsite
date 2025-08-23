// useProjectStore.js
import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  projects: [], // { object, targetOffset, cameraPosition, ... }
  currentTargetIndex: 0,
  setProjects: (projects) => set({ projects }),
  setCurrentTargetIndex: (idx) => set({ currentTargetIndex: idx }),
}));
