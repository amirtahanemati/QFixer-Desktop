import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, FileText, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModernDropzoneProps {
  onImageSelected: (dataUrl: string, file: File, imgElement: HTMLImageElement) => void;
  onLoadSample?: (sampleType: "math" | "physics" | "handwritten") => void;
}

export const ModernDropzone: React.FC<ModernDropzoneProps> = ({
  onImageSelected,
  onLoadSample,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          onImageSelected(result, file, img);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Support Ctrl + V paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith("image/")) {
          processFile(file);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-background-secondary select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/bmp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div className="max-w-xl w-full flex flex-col items-center text-center">
        {/* Title & Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>نسخه تخصصی پاک‌سازی تصاویر آموزشی و کنکور</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
          تصویر سؤال یا جزوه خود را وارد کنید
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          سایه‌ها را حذف کنید، نور را یکنواخت کرده و بدون کوچک‌ترین افت در فرمول‌ها و خطوط علمی، سندی شفاف و باکیفیت تحویل بگیرید.
        </p>

        {/* Main Interactive Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center group ${
            isDragOver
              ? "border-accent bg-accent/15 scale-[1.02] shadow-2xl"
              : "border-border hover:border-accent/80 bg-panel/40 hover:bg-panel/70 shadow-lg"
          }`}
        >
          <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-10 h-10" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
            تصویر را به اینجا بکشید و رها کنید
          </h3>
          <p className="text-xs text-muted-foreground mb-6">
            پشتیبانی از فرمت‌های PNG، JPG، WEBP و اسکن‌های باکیفیت
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="accent"
              size="md"
              className="gap-2 px-6 shadow-md shadow-accent/20"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <ImageIcon className="w-4 h-4" />
              <span>انتخاب تصویر از کامپیوتر</span>
            </Button>
          </div>

          {/* Paste Hint */}
          <div className="flex items-center gap-2 mt-6 text-[11px] text-muted-foreground/80 bg-background/50 px-3 py-1.5 rounded-lg border border-border/50">
            <Clipboard className="w-3.5 h-3.5 text-accent" />
            <span>می‌توانید تصویر اسکرین‌شات را با کلیدهای </span>
            <kbd className="px-1.5 py-0.5 rounded bg-panel border border-border font-mono text-[10px] text-foreground">
              Ctrl + V
            </kbd>
            <span>مستقیماً جای‌گذاری کنید.</span>
          </div>
        </div>

        {/* Samples Section */}
        {onLoadSample && (
          <div className="mt-8 pt-6 border-t border-border/60 w-full flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-3">یا با یکی از نمونه‌های آماده امتحان کنید:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLoadSample("math")}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span>سؤال دیفرانسیل با سایه اسکن</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLoadSample("physics")}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span>نمودار فیزیک و کنکور تجربی</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
