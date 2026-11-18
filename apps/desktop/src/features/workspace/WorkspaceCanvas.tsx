import React, { useState, useRef, useEffect, useCallback } from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { processImageRealtime, EnhancementOptions } from "@/utils/imageProcessingEngine";
import { SplitSquareVertical } from "lucide-react";

interface WorkspaceCanvasProps {
  onProcessedReady?: (dataUrl: string) => void;
}

export const WorkspaceCanvas: React.FC<WorkspaceCanvasProps> = ({ onProcessedReady }) => {
  const {
    currentImage,
    viewMode,
    sliderPosition,
    setSliderPosition,
    zoomLevel,
    setZoomLevel,
    panOffset,
    setPanOffset,
    activeTool,
    params,
  } = useWorkspaceStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);

  // Run real-time image enhancement when parameters or image change
  useEffect(() => {
    if (!currentImage) {
      setProcessedImageUrl(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImage;
    sourceImageRef.current = img;

    img.onload = () => {
      setIsProcessing(true);

      // Create temporary offscreen source canvas
      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = img.naturalWidth || img.width;
      srcCanvas.height = img.naturalHeight || img.height;
      const ctx = srcCanvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const options: EnhancementOptions = {
        shadowRemoval: params.shadowRemoval,
        backgroundCleaning: params.backgroundCleaning,
        inkContrast: params.contrast,
        noiseRemoval: params.noiseRemoval,
        sharpening: params.sharpening,
        protectColors: params.protectColors,
      };

      // Run real in-browser scientific processing engine
      try {
        const enhancedCanvas = processImageRealtime(srcCanvas, options);
        const dataUrl = enhancedCanvas.toDataURL("image/png");
        setProcessedImageUrl(dataUrl);
        if (onProcessedReady) onProcessedReady(dataUrl);
      } catch (err) {
        console.error("Enhancement failed:", err);
      } finally {
        setIsProcessing(false);
      }
    };
  }, [
    currentImage,
    params.shadowRemoval,
    params.backgroundCleaning,
    params.contrast,
    params.noiseRemoval,
    params.sharpening,
    params.protectColors,
  ]);

  // Wheel Zoom support
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 15 : -15;
      setZoomLevel(zoomLevel + delta);
    },
    [zoomLevel, setZoomLevel]
  );

  // Pan and Slider Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "pan" || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (isDraggingSlider && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pos);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsDraggingSlider(false);
  };

  if (!currentImage) return null;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`flex-1 relative overflow-hidden bg-neutral-950 flex items-center justify-center p-4 select-none ${
        activeTool === "pan" || isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      }`}
    >
      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute top-4 start-4 z-40 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent/40 text-xs text-accent flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>در حال اعمال فیلترهای هوشمند...</span>
        </div>
      )}

      {/* Main Scaled & Panned Viewport */}
      <div
        className="relative transition-transform duration-75 select-none shadow-2xl rounded-lg overflow-hidden border border-border/40"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`,
          maxWidth: "90vw",
          maxHeight: "85vh",
        }}
      >
        {/* VIEW MODE 1: Split Slider (Before / After) */}
        {viewMode === "slider" && (
          <div className="relative inline-block overflow-hidden leading-none">
            {/* 1. Underlying: Original Image (Before) */}
            <img
              src={currentImage}
              alt="Original Before"
              className="block max-h-[80vh] w-auto max-w-none object-contain pointer-events-none select-none"
            />

            {/* 2. Top Clamped Layer: Enhanced Cleaned Image (After) */}
            {processedImageUrl && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
              >
                <img
                  src={processedImageUrl}
                  alt="Enhanced Cleaned After"
                  className="block max-h-[80vh] w-auto max-w-none object-contain pointer-events-none select-none"
                />
              </div>
            )}

            {/* 3. Interactive Split Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-30 w-1 bg-accent shadow-xl cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-accent text-background-primary shadow-2xl flex items-center justify-center cursor-ew-resize border-2 border-white select-none">
                <SplitSquareVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Badges: Before & After */}
            <div className="absolute top-3 start-3 z-20 pointer-events-none bg-black/70 backdrop-blur-md text-accent text-[11px] font-semibold px-2.5 py-1 rounded-md border border-accent/30 shadow">
              بهبودیافته (بدون سایه)
            </div>
            <div className="absolute top-3 end-3 z-20 pointer-events-none bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-500/30 shadow">
              اصلی (دارای سایه)
            </div>
          </div>
        )}

        {/* VIEW MODE 2: Side-by-Side Comparison */}
        {viewMode === "side_by_side" && (
          <div className="flex items-center gap-4 p-2 bg-neutral-900 rounded-lg">
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-amber-300 mb-1 font-semibold">تصویر اصلی</span>
              <img
                src={currentImage}
                alt="Original"
                className="max-h-[75vh] w-auto object-contain rounded border border-border/50"
              />
            </div>
            {processedImageUrl && (
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-accent mb-1 font-semibold">تصویر پاک‌سازی‌شده</span>
                <img
                  src={processedImageUrl}
                  alt="Cleaned"
                  className="max-h-[75vh] w-auto object-contain rounded border border-accent/40"
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 3: Processed Only */}
        {viewMode === "overlay" && (
          <div className="relative">
            <img
              src={processedImageUrl || currentImage}
              alt="Enhanced Result"
              className="block max-h-[80vh] w-auto object-contain rounded shadow"
            />
            <div className="absolute top-3 start-3 z-20 pointer-events-none bg-black/70 backdrop-blur-md text-accent text-[11px] font-semibold px-2.5 py-1 rounded-md border border-accent/30">
              نتیجه نهایی
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
