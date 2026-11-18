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

  // Run real-time image enhancement when parameters or image change
  useEffect(() => {
    if (!currentImage) {
      setProcessedImageUrl(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImage;

    img.onload = () => {
      setIsProcessing(true);

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

  // Mouse Down: Start Pan or Slider Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "pan" || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    } else {
      // Direct slider drag anywhere on the comparison canvas
      updateSliderFromMouseEvent(e);
      setIsDraggingSlider(true);
    }
  };

  const updateSliderFromMouseEvent = (e: React.MouseEvent) => {
    const wrapper = document.getElementById("comparison-image-wrapper");
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pos);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (isDraggingSlider) {
      updateSliderFromMouseEvent(e);
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
        activeTool === "pan" || isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-ew-resize"
      }`}
    >
      {/* Live Processing Indicator */}
      {isProcessing && (
        <div className="absolute top-4 start-4 z-40 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-accent/40 text-xs text-accent flex items-center gap-2 shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <span>در حال اعمال فیلترهای پیشرفته...</span>
        </div>
      )}

      {/* Main Scaled & Panned Viewport */}
      <div
        id="comparison-image-wrapper"
        dir="ltr"
        className="relative transition-transform duration-75 select-none shadow-2xl rounded-xl overflow-hidden border border-border/40"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`,
          maxWidth: "88vw",
          maxHeight: "82vh",
        }}
      >
        {/* VIEW MODE 1: Split Slider (Before on Left / Cleaned on Right) */}
        {viewMode === "slider" && (
          <div className="relative inline-block overflow-hidden leading-none select-none">
            {/* 1. Base Layer: Original Image (Raw input with shadows/noise) */}
            <img
              src={currentImage}
              alt="Original Raw"
              className="block max-h-[80vh] w-auto max-w-none object-contain pointer-events-none select-none"
            />

            {/* 2. Enhanced Clean Layer: Revealed on the right side */}
            {processedImageUrl && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                style={{
                  clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                }}
              >
                <img
                  src={processedImageUrl}
                  alt="Enhanced Clean"
                  className="block max-h-[80vh] w-auto max-w-none object-contain pointer-events-none select-none"
                />
              </div>
            )}

            {/* 3. Interactive Split Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-30 w-1 bg-accent shadow-2xl cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-8 h-8 rounded-full bg-accent text-background-primary shadow-2xl flex items-center justify-center border-2 border-white select-none">
                <SplitSquareVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Badges: Explicit Left (Original) & Right (Enhanced) */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none bg-black/75 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-md border border-amber-500/40 shadow-lg">
              اصلی (دارای سایه و نویز)
            </div>
            <div className="absolute top-3 right-3 z-20 pointer-events-none bg-black/75 backdrop-blur-md text-accent text-xs font-bold px-3 py-1 rounded-md border border-accent/40 shadow-lg">
              بهبودیافته (سفید و تمیز)
            </div>
          </div>
        )}

        {/* VIEW MODE 2: Side-by-Side Comparison */}
        {viewMode === "side_by_side" && (
          <div className="flex items-center gap-4 p-3 bg-neutral-900 rounded-xl">
            <div className="flex flex-col items-center">
              <span className="text-xs text-amber-300 mb-1.5 font-bold">تصویر اصلی</span>
              <img
                src={currentImage}
                alt="Original"
                className="max-h-[75vh] w-auto object-contain rounded-lg border border-border/50"
              />
            </div>
            {processedImageUrl && (
              <div className="flex flex-col items-center">
                <span className="text-xs text-accent mb-1.5 font-bold">تصویر پاک‌سازی‌شده</span>
                <img
                  src={processedImageUrl}
                  alt="Cleaned"
                  className="max-h-[75vh] w-auto object-contain rounded-lg border border-accent/50 shadow-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 3: Result Only */}
        {viewMode === "overlay" && (
          <div className="relative">
            <img
              src={processedImageUrl || currentImage}
              alt="Enhanced Result"
              className="block max-h-[80vh] w-auto object-contain rounded-lg shadow-xl"
            />
            <div className="absolute top-3 right-3 z-20 pointer-events-none bg-black/75 backdrop-blur-md text-accent text-xs font-bold px-3 py-1 rounded-md border border-accent/40">
              نتیجه نهایی پاک‌سازی‌شده
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
