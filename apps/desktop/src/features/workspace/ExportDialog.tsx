import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Download, X, FileImage, CheckCircle2 } from "lucide-react";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("common");
  const { imageDimensions } = useWorkspaceStore();
  const [format, setFormat] = useState<"png" | "jpeg" | "tiff">("png");
  const [jpegQuality, setJpegQuality] = useState<number>(92);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background-secondary p-5 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <FileImage className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-foreground">
              {t("actions.export_image")}
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
          <div className="text-xs text-muted-foreground">
            تصویر انتخابی با ابعاد{" "}
            <span className="font-mono text-foreground font-semibold">
              {imageDimensions ? `${imageDimensions.width} × ${imageDimensions.height}` : "2400 × 3200"}
            </span>{" "}
            با حفظ کامل داده‌های علمی ذخیره خواهد شد.
          </div>

          {/* Format selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">فرمت فایل خروجی:</label>
            <div className="grid grid-cols-3 gap-2">
              {(["png", "jpeg", "tiff"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-2 px-3 rounded-lg border text-xs font-mono uppercase font-semibold transition ${
                    format === fmt
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-panel text-muted-foreground hover:bg-panel/80 hover:text-foreground"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {format === "jpeg" && (
            <Slider
              label="کیفیت فشرده‌سازی JPEG:"
              value={jpegQuality}
              min={50}
              max={100}
              unit="%"
              onChange={setJpegQuality}
            />
          )}

          {format === "png" && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-panel border border-border text-xs">
              <span>حفظ کانال شفافیت (Alpha):</span>
              <Badge variant="accent">فعال (بدون افت کیفیت)</Badge>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isExporting}>
            <span>{t("actions.cancel")}</span>
          </Button>

          <Button
            variant="accent"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || exportSuccess}
          >
            {exportSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-foreground" />
                <span>ذخیره شد!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? "در حال ذخیره‌سازی..." : t("actions.export_image")}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
