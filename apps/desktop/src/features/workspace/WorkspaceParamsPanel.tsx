import React from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  ShieldCheck,
  Sun,
  PenTool,
  Zap,
  Download,
  Palette,
} from "lucide-react";

interface WorkspaceParamsPanelProps {
  onExportClick?: () => void;
}

export const WorkspaceParamsPanel: React.FC<WorkspaceParamsPanelProps> = ({ onExportClick }) => {
  const { params, setParam, resetParams, currentImage } = useWorkspaceStore();

  const handleApplyPreset = (preset: "heavy_shadow" | "light_scan" | "formula_boost") => {
    if (preset === "heavy_shadow") {
      setParam("shadowRemoval", 90);
      setParam("backgroundCleaning", 80);
      setParam("contrast", 40);
      setParam("sharpening", 35);
    } else if (preset === "light_scan") {
      setParam("shadowRemoval", 50);
      setParam("backgroundCleaning", 45);
      setParam("contrast", 20);
      setParam("sharpening", 20);
    } else if (preset === "formula_boost") {
      setParam("shadowRemoval", 70);
      setParam("backgroundCleaning", 65);
      setParam("contrast", 75);
      setParam("sharpening", 50);
      setParam("protectFormulas", true);
    }
  };

  return (
    <aside className="w-80 bg-background-secondary border-s border-border flex flex-col justify-between overflow-hidden select-none">
      {/* Header */}
      <div className="h-12 px-4 border-b border-border flex items-center justify-between shrink-0 bg-background">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-foreground">
            تنظیمات بهبود و حذف سایه
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetParams} title="بازنشانی به حالت پیش‌فرض">
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px]">بازنشانی</span>
        </Button>
      </div>

      {/* Scrollable Control Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground">حالت‌های بهینه‌سازی سریع:</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleApplyPreset("heavy_shadow")}
              className="px-2 py-1.5 rounded-lg bg-panel hover:bg-accent/15 border border-border hover:border-accent/40 text-[10px] text-foreground font-medium transition text-center"
            >
              سایه غلیظ موبایل
            </button>
            <button
              onClick={() => handleApplyPreset("light_scan")}
              className="px-2 py-1.5 rounded-lg bg-panel hover:bg-accent/15 border border-border hover:border-accent/40 text-[10px] text-foreground font-medium transition text-center"
            >
              اسکن کتاب
            </button>
            <button
              onClick={() => handleApplyPreset("formula_boost")}
              className="px-2 py-1.5 rounded-lg bg-panel hover:bg-accent/15 border border-border hover:border-accent/40 text-[10px] text-foreground font-medium transition text-center"
            >
              فرمول ریاضی
            </button>
          </div>
        </div>

        {/* Section 1: Shadow & Illumination */}
        <div className="space-y-4 bg-panel/40 p-3.5 rounded-xl border border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Sun className="w-3.5 h-3.5 text-accent" />
            <span>حذف سایه و اصلاح نور</span>
          </div>

          {/* Shadow Removal Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">شدت حذف سایه:</span>
              <span className="font-mono text-accent font-semibold">{params.shadowRemoval}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={params.shadowRemoval}
              onChange={(val) => setParam("shadowRemoval", val)}
            />
            <p className="text-[10px] text-muted-foreground">
              سایه‌های تیره دست یا تاخوردگی برگه را محو و نور را صاف می‌کند.
            </p>
          </div>

          {/* Background Whitening Slider */}
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">سفید کردن پس‌زمینه کاغذ:</span>
              <span className="font-mono text-accent font-semibold">{params.backgroundCleaning}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={params.backgroundCleaning}
              onChange={(val) => setParam("backgroundCleaning", val)}
            />
            <p className="text-[10px] text-muted-foreground">
              تیرگی و زردی کاغذ کاهی را به سفیدی خالص کتاب تبدیل می‌کند.
            </p>
          </div>
        </div>

        {/* Section 2: Ink Contrast & Sharpness */}
        <div className="space-y-4 bg-panel/40 p-3.5 rounded-xl border border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <PenTool className="w-3.5 h-3.5 text-accent" />
            <span>وضوح و تیرگی نوشته‌ها</span>
          </div>

          {/* Ink Darkness Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">پررنگ‌سازی جوهر و متن:</span>
              <span className="font-mono text-accent font-semibold">{params.contrast}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={params.contrast}
              onChange={(val) => setParam("contrast", val)}
            />
          </div>

          {/* Sharpening Slider */}
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">افزایش شفافیت و لبه‌ها (Sharpen):</span>
              <span className="font-mono text-accent font-semibold">{params.sharpening}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={params.sharpening}
              onChange={(val) => setParam("sharpening", val)}
            />
          </div>
        </div>

        {/* Section 3: Scientific Integrity Protections */}
        <div className="space-y-3 bg-panel/40 p-3.5 rounded-xl border border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>حفاظت از محتوای علمی</span>
          </div>

          {/* Protect Formulas & Diacritics */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-foreground">حفظ خطوط کسری، رادیکال و اعشار</span>
              <p className="text-[10px] text-muted-foreground">جلوگیری از محو شدن خطوط باریک</p>
            </div>
            <Switch
              checked={params.protectFormulas}
              onCheckedChange={(checked) => setParam("protectFormulas", checked)}
            />
          </div>

          {/* Protect Diagram Colors */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <Palette className="w-3 h-3 text-accent" />
                <span className="text-xs font-medium text-foreground">حفظ رنگ نمودارها</span>
              </div>
              <p className="text-[10px] text-muted-foreground">نگهداری رنگ‌های آبی، قرمز و سبز علمی</p>
            </div>
            <Switch
              checked={params.protectColors}
              onCheckedChange={(checked) => setParam("protectColors", checked)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="p-4 border-t border-border bg-background shrink-0">
        <Button
          variant="accent"
          size="md"
          disabled={!currentImage}
          onClick={onExportClick}
          className="w-full gap-2 font-bold shadow-lg shadow-accent/25 py-2.5"
        >
          <Download className="w-4 h-4" />
          <span>ذخیره تصویر نهایی (PNG / JPG)</span>
        </Button>
      </div>
    </aside>
  );
};
