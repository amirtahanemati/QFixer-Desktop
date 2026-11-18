import { describe, it, expect, beforeEach } from "vitest";
import { useBatchStore } from "../batchStore";

describe("useBatchStore", () => {
  beforeEach(() => {
    useBatchStore.getState().clearQueue();
    useBatchStore.getState().setIsProcessing(false);
  });

  it("should start with an empty queue after clearQueue", () => {
    expect(useBatchStore.getState().items.length).toBe(0);
  });

  it("should add and remove items reliably", () => {
    const { addItem } = useBatchStore.getState();
    addItem({
      fileName: "sheet-test.png",
      filePath: "C:/test.png",
      fileSize: "1 MB",
      dimensions: "1000x1000",
    });

    const items = useBatchStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].fileName).toBe("sheet-test.png");

    const itemId = items[0].id;
    useBatchStore.getState().removeItem(itemId);
    expect(useBatchStore.getState().items.length).toBe(0);
  });
});
