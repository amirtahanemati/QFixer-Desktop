import { describe, it, expect, beforeEach } from "vitest";
import { useWorkspaceStore } from "../workspaceStore";

describe("useWorkspaceStore", () => {
  beforeEach(() => {
    useWorkspaceStore.getState().resetParams();
    useWorkspaceStore.getState().resetZoom();
    useWorkspaceStore.getState().setCurrentImage(null);
  });

  it("should initialize with default parameters and no active image", () => {
    const state = useWorkspaceStore.getState();
    expect(state.currentImage).toBeNull();
    expect(state.zoomLevel).toBe(100);
    expect(state.viewMode).toBe("slider");
    expect(state.params.autoEnhance).toBe(true);
    expect(state.params.protectText).toBe(true);
    expect(state.params.protectFormulas).toBe(true);
  });

  it("should update zoom within safe bounds (10% to 500%)", () => {
    const { zoomIn, zoomOut, setZoomLevel } = useWorkspaceStore.getState();
    zoomIn();
    expect(useWorkspaceStore.getState().zoomLevel).toBe(125);
    zoomOut();
    expect(useWorkspaceStore.getState().zoomLevel).toBe(100);

    setZoomLevel(600);
    expect(useWorkspaceStore.getState().zoomLevel).toBe(500);

    setZoomLevel(5);
    expect(useWorkspaceStore.getState().zoomLevel).toBe(10);
  });

  it("should update viewMode and tool types correctly", () => {
    const { setViewMode, setActiveTool, setSliderPosition } = useWorkspaceStore.getState();
    setViewMode("side_by_side");
    expect(useWorkspaceStore.getState().viewMode).toBe("side_by_side");

    setActiveTool("pan");
    expect(useWorkspaceStore.getState().activeTool).toBe("pan");

    setSliderPosition(75);
    expect(useWorkspaceStore.getState().sliderPosition).toBe(75);
  });

  it("should modify parameters individually", () => {
    const { setParam } = useWorkspaceStore.getState();
    setParam("shadowRemoval", 85);
    setParam("protectColors", false);
    expect(useWorkspaceStore.getState().params.shadowRemoval).toBe(85);
    expect(useWorkspaceStore.getState().params.protectColors).toBe(false);
  });
});
