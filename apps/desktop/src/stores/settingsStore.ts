import { create } from "zustand";

export type HardwarePreference = "auto" | "cpu" | "gpu";

interface SettingsState {
  hardwarePreference: HardwarePreference;
  cacheDirectory: string;
  tilingThresholdMegapixels: number;
  setHardwarePreference: (pref: HardwarePreference) => void;
  setCacheDirectory: (dir: string) => void;
  setTilingThresholdMegapixels: (mp: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  hardwarePreference: "auto",
  cacheDirectory: "C:/Users/Amirtaha/AppData/Local/QFixer/cache",
  tilingThresholdMegapixels: 24,
  setHardwarePreference: (hardwarePreference) => set({ hardwarePreference }),
  setCacheDirectory: (cacheDirectory) => set({ cacheDirectory }),
  setTilingThresholdMegapixels: (tilingThresholdMegapixels) => set({ tilingThresholdMegapixels }),
}));
