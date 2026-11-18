import { describe, it, expect } from "vitest";
import { useSettingsStore } from "../settingsStore";

describe("useSettingsStore", () => {
  it("should update hardware preference and cache directory", () => {
    const { setHardwarePreference, setCacheDirectory } = useSettingsStore.getState();
    setHardwarePreference("gpu");
    expect(useSettingsStore.getState().hardwarePreference).toBe("gpu");

    setCacheDirectory("D:/CustomCache");
    expect(useSettingsStore.getState().cacheDirectory).toBe("D:/CustomCache");
  });
});
