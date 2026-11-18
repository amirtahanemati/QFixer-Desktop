import { create } from "zustand";

export interface BatchItem {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: string;
  dimensions: string;
  status: "waiting" | "processing" | "completed" | "error";
  progress: number;
}

interface BatchState {
  items: BatchItem[];
  outputDirectory: string;
  concurrency: number;
  isProcessing: boolean;
  addItem: (item: Omit<BatchItem, "id" | "status" | "progress">) => void;
  removeItem: (id: string) => void;
  clearQueue: () => void;
  setOutputDirectory: (dir: string) => void;
  setConcurrency: (threads: number) => void;
  setIsProcessing: (val: boolean) => void;
}

export const useBatchStore = create<BatchState>((set) => ({
  items: [
    {
      id: "b-1",
      fileName: "konkur-math-1402-p1.png",
      filePath: "C:/Exams/konkur-math-1402-p1.png",
      fileSize: "3.4 MB",
      dimensions: "2480 × 3508",
      status: "waiting",
      progress: 0,
    },
    {
      id: "b-2",
      fileName: "physics-circuit-diagram.jpg",
      filePath: "C:/Exams/physics-circuit-diagram.jpg",
      fileSize: "1.8 MB",
      dimensions: "1800 × 2400",
      status: "waiting",
      progress: 0,
    },
  ],
  outputDirectory: "C:/QFixer_Output",
  concurrency: 4,
  isProcessing: false,

  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          status: "waiting",
          progress: 0,
        },
      ],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearQueue: () => set({ items: [] }),
  setOutputDirectory: (outputDirectory) => set({ outputDirectory }),
  setConcurrency: (concurrency) => set({ concurrency }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
}));
