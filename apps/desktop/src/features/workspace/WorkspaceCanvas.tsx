import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { UploadCloud, SplitSquareVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WorkspaceCanvas: React.FC = () => {
  const { t } = useTranslation("common");
  const {
    currentImage,
    imageDimensions,
    viewMode,
    sliderPosition,
    setSliderPosition,
    zoomLevel,
    setZoomLevel,
    panOffset,
    setPanOffset,
    activeTool,
    setCurrentImage,
  } = useWorkspaceStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const overlayOpacity = 50;

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
    if (activeTool === "pan" || e.button === 1) {
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

  // Drag and Drop real files
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          setCurrentImage(objectUrl, { width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = objectUrl;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleLoadDemo = () => {
    setCurrentImage("demo_exam_sheet_biology.png", { width: 2480, height: 3508 });
  };

  if (!currentImage) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
        className={`flex-1 flex flex-col items-center justify-center p-6 bg-background select-none transition-colors ${
          isDragOver ? "bg-accent/10 border-2 border-accent border-dashed m-4 rounded-2xl" : ""
        }`}
      >
        <div
          onClick={handleLoadDemo}
          className="max-w-md w-full p-10 rounded-2xl border-2 border-dashed border-border hover:border-accent bg-panel/30 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1">
            {t("workspace.viewport.empty_title")}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {t("workspace.viewport.empty_desc")}
          </p>
          <Button variant="accent" size="sm" onClick={(e) => { e.stopPropagation(); handleLoadDemo(); }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>بارگذاری نمونه آزمون و سند ریاضی</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
      className={`flex-1 relative overflow-hidden bg-background/95 flex items-center justify-center p-4 select-none ${
        activeTool === "pan" || isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"
      }`}
    >
      {/* Canvas Wrapper scaled and panned */}
      <div
        className="relative shadow-2xl rounded border border-border overflow-hidden transition-transform duration-75"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`,
          width: "720px",
          height: "960px",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Comparison Mode: Slider */}
        {viewMode === "slider" && (
          <>
            {/* Processed Clean Layer */}
            <div className="absolute inset-0 bg-white text-gray-900 p-8 flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
                  <span className="font-bold text-sm text-gray-800">
                    سازمان سنجش آموزش کشور — آزمون سراسری ریاضی و فنی
                  </span>
                  <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    [Cleaned - Protected Content]
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-900 leading-relaxed">
                    سؤال ۱۰۴: اگر تابع f(x) = √(2x² - 4) / (x - 1) مفروض باشد، دامنه تابع کدام است؟
                  </div>

                  <div className="p-4 rounded border border-gray-200 bg-gray-50/50 space-y-2">
                    <div className="text-xs font-mono text-gray-700">
                      گزینه ۱) (-∞, -√2] ∪ [√2, +∞) - {"{1}"}
                    </div>
                    <div className="text-xs font-mono text-gray-700">
                      گزینه ۲) [-√2, √2]
                    </div>
                  </div>

                  {/* Clean SVG Graph */}
                  <div className="mt-6 p-4 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center h-48 bg-white">
                    <svg className="w-48 h-36" viewBox="0 0 200 150">
                      <line x1="20" y1="130" x2="180" y2="130" stroke="#111827" strokeWidth="2" />
                      <line x1="100" y1="20" x2="100" y2="140" stroke="#111827" strokeWidth="2" />
                      <path d="M 30,120 Q 100,20 170,120" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                      <text x="175" y="145" fontSize="11" fill="#374151">x</text>
                      <text x="85" y="25" fontSize="11" fill="#374151">y</text>
                      <circle cx="100" cy="70" r="3.5" fill="#ef4444" />
                    </svg>
                    <span className="text-[11px] text-gray-500 mt-2">
                      شکل ۱: نمودار تحلیلی با حفظ کامل محورها و ضخامت خطوط
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 border-t border-gray-200 pt-2 flex justify-between">
                <span>صفحه ۳ از ۱۲</span>
                <span>کد فایل: QF-RESTORED</span>
              </div>
            </div>

            {/* Original Raw Scanned Layer with clipped slider */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <div
                className="w-full h-full p-8 flex flex-col justify-between"
                style={{
                  backgroundColor: "#ECE7DE",
                  backgroundImage: "radial-gradient(ellipse at top left, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 75%)",
                }}
              >
                <div>
                  <div className="flex justify-between items-center border-b border-gray-500/40 pb-3 mb-6">
                    <span className="font-bold text-sm text-gray-700 opacity-80">
                      سازمان سنجش آموزش کشور — آزمون سراسری ریاضی و فنی
                    </span>
                    <span className="font-mono text-xs text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                      [Raw Scanned - With Shadow]
                    </span>
                  </div>

                  <div className="space-y-4 opacity-75">
                    <div className="text-sm font-semibold text-gray-800 leading-relaxed">
                      سؤال ۱۰۴: اگر تابع f(x) = √(2x² - 4) / (x - 1) مفروض باشد، دامنه تابع کدام است؟
                    </div>

                    <div className="p-4 rounded border border-gray-400/40 bg-gray-400/10 space-y-2">
                      <div className="text-xs font-mono text-gray-700">
                        گزینه ۱) (-∞, -√2] ∪ [√2, +∞) - {"{1}"}
                      </div>
                      <div className="text-xs font-mono text-gray-700">
                        گزینه ۲) [-√2, √2]
                      </div>
                    </div>

                    <div className="mt-6 p-4 border border-dashed border-gray-500/40 rounded flex flex-col items-center justify-center h-48 bg-stone-200/40">
                      <svg className="w-48 h-36 opacity-70" viewBox="0 0 200 150">
                        <line x1="20" y1="130" x2="180" y2="130" stroke="#374151" strokeWidth="2" strokeDasharray="3,1" />
                        <line x1="100" y1="20" x2="100" y2="140" stroke="#374151" strokeWidth="2" strokeDasharray="3,1" />
                        <path d="M 30,120 Q 100,20 170,120" fill="none" stroke="#1d4ed8" strokeWidth="2" />
                        <circle cx="100" cy="70" r="3.5" fill="#b91c1c" />
                      </svg>
                      <span className="text-[11px] text-gray-600 mt-2">سایه اسکنر و نویز بر روی نمودار</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 border-t border-gray-400/30 pt-2 flex justify-between">
                  <span>صفحه ۳ از ۱۲</span>
                  <span>واترمارک غیرمجاز</span>
                </div>
              </div>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-accent z-20 cursor-ew-resize flex items-center justify-center shadow-lg"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
            >
              <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground border-2 border-background flex items-center justify-center shadow-md text-xs cursor-ew-resize">
                <SplitSquareVertical className="w-3.5 h-3.5" />
              </div>
            </div>
          </>
        )}

        {/* Comparison Mode: Side by Side */}
        {viewMode === "side_by_side" && (
          <div className="w-full h-full flex divide-x divide-border">
            <div className="w-1/2 h-full p-4 bg-stone-100 flex flex-col justify-between text-gray-800 text-xs">
              <div className="font-bold border-b pb-2 text-stone-600">قبل از پردازش (تصویر اصلی)</div>
              <div className="opacity-80">سؤال ۱۰۴: دارای سایه و نویز اسکن</div>
              <div className="text-[10px] text-stone-400 font-mono">Raw Scan</div>
            </div>
            <div className="w-1/2 h-full p-4 bg-white flex flex-col justify-between text-gray-900 text-xs">
              <div className="font-bold border-b pb-2 text-accent-foreground bg-accent px-1.5 py-0.5 rounded w-fit">
                پس از پردازش هوشمند
              </div>
              <div className="font-semibold">سؤال ۱۰۴: پاکسازی‌شده با وضوح خطوط</div>
              <div className="text-[10px] text-emerald-600 font-mono">Restored 100%</div>
            </div>
          </div>
        )}

        {/* Comparison Mode: Overlay */}
        {viewMode === "overlay" && (
          <div className="relative w-full h-full bg-white text-gray-900 p-8 flex flex-col justify-between">
            <div>
              <div className="font-bold text-sm border-b pb-2">حالت انطباق لایه‌ها (Overlay)</div>
              <div className="text-xs text-muted-foreground mt-2">
                شفافیت لایه بازسازی‌شده: {overlayOpacity}٪
              </div>
            </div>
            <div className="text-xs text-center font-mono">انطباق دقیق پیکسلی و هندسی تأیید شد</div>
          </div>
        )}
      </div>

      {/* Viewport Badges */}
      <div className="absolute top-4 start-4 flex items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded bg-panel/90 border border-border text-[11px] font-mono text-foreground backdrop-blur-sm shadow-xs">
          {imageDimensions ? `${imageDimensions.width} × ${imageDimensions.height}` : "2400 × 3200"}
        </span>
        <span className="px-2.5 py-1 rounded bg-panel/90 border border-border text-[11px] font-mono text-accent backdrop-blur-sm shadow-xs">
          {zoomLevel}%
        </span>
      </div>
    </div>
  );
};
