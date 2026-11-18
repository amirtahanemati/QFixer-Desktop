import { create } from "zustand";

export type ViewMode = "single" | "slider" | "side_by_side" | "overlay";
export type ToolType = "select" | "pan" | "zoom" | "mask_brush" | "mask_eraser";
export type ActiveToolGroup = "basic" | "cleanup" | "restoration" | "protection" | "advanced";

export interface WorkspaceParams {
  autoEnhance: boolean;
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  exposure: number; // -100 to 100
  shadowRemoval: number; // 0 to 100
  noiseRemoval: number; // 0 to 100
  backgroundCleaning: number; // 0 to 100
  protectText: boolean;
  protectFormulas: boolean;
  protectDiagrams: boolean;
  protectColors: boolean;
  sharpening: number; // 0 to 100
}

interface WorkspaceState {
  currentImage: string | null;
  imageDimensions: { width: number; height: number } | null;
  viewMode: ViewMode;
  sliderPosition: number; // 0 to 100%
  zoomLevel: number; // 10 to 500%
  panOffset: { x: number; y: number };
  activeTool: ToolType;
  activeGroup: ActiveToolGroup;
  params: WorkspaceParams;
  setCurrentImage: (url: string | null, dimensions?: { width: number; height: number }) => void;
  setViewMode: (mode: ViewMode) => void;
  setSliderPosition: (pos: number) => void;
  setZoomLevel: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setActiveTool: (tool: ToolType) => void;
  setActiveGroup: (group: ActiveToolGroup) => void;
  setParam: <K extends keyof WorkspaceParams>(key: K, value: WorkspaceParams[K]) => void;
  resetParams: () => void;
}

const defaultParams: WorkspaceParams = {
  autoEnhance: true,
  brightness: 0,
  contrast: 50,
  exposure: 0,
  shadowRemoval: 80,
  noiseRemoval: 60,
  backgroundCleaning: 85,
  protectText: true,
  protectFormulas: true,
  protectDiagrams: true,
  protectColors: true,
  sharpening: 30,
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentImage: null,
  imageDimensions: null,
  viewMode: "slider",
  sliderPosition: 50,
  zoomLevel: 100,
  panOffset: { x: 0, y: 0 },
  activeTool: "select",
  activeGroup: "cleanup",
  params: { ...defaultParams },

  setCurrentImage: (url, dimensions) =>
    set({
      currentImage: url,
      imageDimensions: dimensions || (url ? { width: 1920, height: 1080 } : null),
      zoomLevel: 100,
      panOffset: { x: 0, y: 0 },
    }),

  setViewMode: (viewMode) => set({ viewMode }),
  setSliderPosition: (sliderPosition) => set({ sliderPosition }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel: Math.max(10, Math.min(500, zoomLevel)) }),

  zoomIn: () =>
    set((state) => ({
      zoomLevel: Math.min(500, state.zoomLevel + 25),
    })),

  zoomOut: () =>
    set((state) => ({
      zoomLevel: Math.max(10, state.zoomLevel - 25),
    })),

  resetZoom: () => set({ zoomLevel: 100, panOffset: { x: 0, y: 0 } }),

  setPanOffset: (panOffset) => set({ panOffset }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setActiveGroup: (activeGroup) => set({ activeGroup }),

  setParam: (key, value) =>
    set((state) => ({
      params: { ...state.params, [key]: value },
    })),

  resetParams: () => set({ params: { ...defaultParams } }),
}));
