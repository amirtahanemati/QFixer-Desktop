import React, { useState } from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Download, X, FileImage, CheckCircle2 } from "lucide-react";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  processedImageSrc?: string | null;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  processedImageSrc,
}) => {
  const { currentImage, imageDimensions } = useWorkspaceStore();
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [jpegQuality, setJpegQuality] = useState<number>(95);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);

    const sourceToExport = processedImageSrc || currentImage;
    if (!sourceToExport) {
      setIsExporting(false);
      return;
    }

    try {
      // Create offscreen image and canvas for final clean export
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = sourceToExport;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 1920;
        canvas.height = img.naturalHeight || 1080;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          const mimeType = format === "png" ? "image/png" : "image/jpeg";
          const dataUrl = canvas.toDataURL(mimeType, jpegQuality / 100);

          // Trigger instant browser/desktop download
          const link = document.createElement("a");
          const timestamp = new Date().toISOString().slice(0, 10);
          link.download = `QFixer_Cleaned_${timestamp}.${format === "png" ? "png" : "jpg"}`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setIsExporting(false);
          setExportSuccess(true);
          setTimeout(() => {
            setExportSuccess(false);
            onClose();
          }, 1200);
        }
      };
    } catch (err) {
      console.error("Export error:", err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background-secondary p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <FileImage className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-bold text-foreground">
              ذخیره و دریافت تصویر پاک‌سازی‌شده
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-panel transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground leading-relaxed">
            تصویر با حفظ ۱۰۰٪ فرمول‌ها، خطوط نمودار و ابعاد اصلی{" "}
            <span className="font-mono text-accent font-semibold">
              {imageDimensions ? `${imageDimensions.width} × ${imageDimensions.height}` : "کیفیت اصلی"}
            </span>{" "}
            با پس‌زمینه سفید خالص ذخیره می‌شود.
          </div>

          {/* Format selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">فرمت فایل خروجی:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat("png")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  format === "png"
                    ? "border-accent bg-accent/15 text-accent shadow-sm"
                    : "border-border bg-panel text-muted-foreground hover:text-foreground"
                }`}
              >
                PNG (بدون افت کیفیت - پیشنهادی)
              </button>
              <button
                type="button"
                onClick={() => setFormat("jpeg")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  format === "jpeg"
                    ? "border-accent bg-accent/15 text-accent shadow-sm"
                    : "border-border bg-panel text-muted-foreground hover:text-foreground"
                }`}
              >
                JPEG (حجم کمتر)
              </button>
            </div>
          </div>

          {format === "jpeg" && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">کیفیت ذخیره‌سازی:</span>
                <span className="font-mono text-accent font-semibold">{jpegQuality}%</span>
              </div>
              <Slider
                value={jpegQuality}
                min={70}
                max={100}
                step={1}
                onChange={setJpegQuality}
              />
            </div>
          )}

          {format === "png" && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-panel border border-border text-xs">
              <span className="text-muted-foreground">وضوح و فشرده‌سازی:</span>
              <Badge variant="accent">Lossless (کاملاً بدون افت کیفیت)</Badge>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isExporting}>
            <span>انصراف</span>
          </Button>

          <Button
            variant="accent"
            size="md"
            onClick={handleExport}
            disabled={isExporting || exportSuccess}
            className="gap-2 px-5 font-bold"
          >
            {exportSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                <span>با موفقیت ذخیره شد!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isExporting ? "در حال آماده‌سازی..." : "دانلود و ذخیره فایل"}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
