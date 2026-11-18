import React, { useRef, useState } from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "./ExportDialog";
import { MaskEditorModal } from "../masks/MaskEditorModal";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  SplitSquareVertical,
  Columns,
  Eye,
  Download,
  FolderOpen,
  Paintbrush,
  Image as ImageIcon,
} from "lucide-react";

interface WorkspaceToolbarProps {
  onNewImageSelected?: () => void;
}

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = () => {
  const {
    currentImage,
    imageDimensions,
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    viewMode,
    setViewMode,
    setCurrentImage,
  } = useWorkspaceStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMaskModalOpen, setIsMaskModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setCurrentImage(dataUrl, { width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="h-12 border-b border-border bg-background px-4 flex items-center justify-between gap-3 select-none">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Left Section: Image Change & Dimensions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 text-xs font-semibold"
          >
            <FolderOpen className="w-3.5 h-3.5 text-accent" />
            <span>انتخاب تصویر جدید</span>
          </Button>

          {imageDimensions && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-panel border border-border text-[11px] text-muted-foreground font-mono">
              <ImageIcon className="w-3 h-3 text-accent" />
              <span>{imageDimensions.width} × {imageDimensions.height}</span>
            </div>
          )}
        </div>

        {/* Center: Comparison View Mode Tabs */}
        <div className="flex items-center gap-1 bg-panel p-1 rounded-lg border border-border text-xs">
          <button
            onClick={() => setViewMode("slider")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition font-medium ${
              viewMode === "slider"
                ? "bg-accent text-background-primary shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>اسلایدر قبل و بعد</span>
          </button>

          <button
            onClick={() => setViewMode("side_by_side")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition font-medium ${
              viewMode === "side_by_side"
                ? "bg-accent text-background-primary shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>کنار هم</span>
          </button>

          <button
            onClick={() => setViewMode("overlay")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition font-medium ${
              viewMode === "overlay"
                ? "bg-accent text-background-primary shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>فقط نتیجه</span>
          </button>
        </div>

        {/* Right Section: Navigation & Tools & Export */}
        <div className="flex items-center gap-2">
          {/* Mask Editor Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMaskModalOpen(true)}
            disabled={!currentImage}
            title="ویرایشگر ماسک برای حذف لکه‌های خاص"
            className="gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">حذف دستی لکه</span>
          </Button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-panel px-2 py-0.5 rounded-lg border border-border text-xs">
            <button
              onClick={zoomOut}
              className="p-1 hover:text-accent rounded text-muted-foreground"
              title="کوچک‌نمایی"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs w-10 text-center font-semibold text-foreground">
              {zoomLevel}%
            </span>
            <button
              onClick={zoomIn}
              className="p-1 hover:text-accent rounded text-muted-foreground"
              title="بزرگ‌نمایی"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1 hover:text-accent rounded text-muted-foreground"
              title="اندازه طبیعی"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Direct Export Action Button */}
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsExportOpen(true)}
            disabled={!currentImage}
            className="gap-1.5 shadow font-bold text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ذخیره فایل</span>
          </Button>
        </div>
      </div>

      <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      <MaskEditorModal
        isOpen={isMaskModalOpen}
        onClose={() => setIsMaskModalOpen(false)}
        imageSrc={currentImage}
        onSaveMask={(maskDataUrl) => {
          console.log("Custom stain mask captured:", maskDataUrl.length);
        }}
      />
    </>
  );
};
