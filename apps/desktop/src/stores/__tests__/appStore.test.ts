import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../appStore";

describe("useAppStore", () => {
  beforeEach(() => {
    // Reset to defaults
    useAppStore.setState({
      theme: "dark",
      lang: "fa-IR",
      currentPage: "home",
    });
  });

  it("should have correct initial state", () => {
    const state = useAppStore.getState();
    expect(state.theme).toBe("dark");
    expect(state.lang).toBe("fa-IR");
    expect(state.currentPage).toBe("home");
  });

  it("should change page correctly", () => {
    const { setCurrentPage } = useAppStore.getState();
    setCurrentPage("workspace");
    expect(useAppStore.getState().currentPage).toBe("workspace");
  });

  it("should toggle theme correctly", () => {
    // mock documentElement
    globalThis.document = {
      documentElement: {
        classList: {
          add: () => {},
          remove: () => {},
        },
        dir: "rtl",
        lang: "fa-IR",
      },
    } as any;

    const { toggleTheme } = useAppStore.getState();
    toggleTheme();
    expect(useAppStore.getState().theme).toBe("light");
    toggleTheme();
    expect(useAppStore.getState().theme).toBe("dark");
  });
});
