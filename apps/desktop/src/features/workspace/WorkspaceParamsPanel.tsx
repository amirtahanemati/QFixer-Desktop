import React from "react";
import { useTranslation } from "react-i18next";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Eraser,
  Sliders,
  AlertCircle,
} from "lucide-react";

export const WorkspaceParamsPanel: React.FC = () => {
  const { t } = useTranslation("common");
  const { params, setParam, resetParams } = useWorkspaceStore();

  return (
    <aside className="w-80 bg-background-secondary border-s border-border flex flex-col justify-between overflow-hidden select-none">
      {/* Panel Header */}
      <div className="h-11 px-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-foreground">
            {t("workspace.params.panel_title")}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetParams} title={t("actions.reset")}>
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px]">{t("actions.reset")}</span>
        </Button>
      </div>

      {/* Scrollable Parameters List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Auto Enhance Switch */}
        <div className="p-3 rounded-lg bg-panel border border-border flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{t("workspace.params.auto_enhance")}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              تحلیل خودکار و تنظیم فیلترهای پس‌زمینه
            </p>
          </div>
          <Switch
            checked={params.autoEnhance}
            onCheckedChange={(checked) => setParam("autoEnhance", checked)}
          />
        </div>

        {/* Section 1: Cleanup & Lighting */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground border-b border-border/60 pb-1.5">
            <Eraser className="w-3.5 h-3.5 text-accent" />
            <span>{t("workspace.tool_groups.cleanup")}</span>
          </div>

          <Slider
            label={t("workspace.params.shadow_removal")}
            value={params.shadowRemoval}
            min={0}
            max={100}
            unit="%"
            onChange={(val) => setParam("shadowRemoval", val)}
          />

          <Slider
            label={t("workspace.params.noise_removal")}
            value={params.noiseRemoval}
            min={0}
            max={100}
            unit="%"
            onChange={(val) => setParam("noiseRemoval", val)}
          />

          <Slider
            label={t("workspace.params.background_cleaning")}
            value={params.backgroundCleaning}
            min={0}
            max={100}
            unit="%"
            onChange={(val) => setParam("backgroundCleaning", val)}
          />
        </div>

        {/* Section 2: Content Protection (Critical Core) */}
        <div className="space-y-3 p-3 rounded-xl bg-panel/70 border border-border">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>{t("workspace.tool_groups.protection")}</span>
            </div>
            <Badge variant="accent">فعال</Badge>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/90 font-medium">
                {t("workspace.params.protect_text")}
              </span>
              <Switch
                checked={params.protectText}
                onCheckedChange={(checked) => setParam("protectText", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/90 font-medium">
                {t("workspace.params.protect_formulas")}
              </span>
              <Switch
                checked={params.protectFormulas}
                onCheckedChange={(checked) => setParam("protectFormulas", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/90 font-medium">
                {t("workspace.params.protect_diagrams")}
              </span>
              <Switch
                checked={params.protectDiagrams}
                onCheckedChange={(checked) => setParam("protectDiagrams", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/90 font-medium">
                {t("workspace.params.protect_colors")}
              </span>
              <Switch
                checked={params.protectColors}
                onCheckedChange={(checked) => setParam("protectColors", checked)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Basic Tone & Adjustments */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground border-b border-border/60 pb-1.5">
            <Sun className="w-3.5 h-3.5 text-accent" />
            <span>{t("workspace.tool_groups.basic")}</span>
          </div>

          <Slider
            label={t("workspace.params.contrast")}
            value={params.contrast}
            min={-100}
            max={100}
            onChange={(val) => setParam("contrast", val)}
          />

          <Slider
            label={t("workspace.params.brightness")}
            value={params.brightness}
            min={-100}
            max={100}
            onChange={(val) => setParam("brightness", val)}
          />

          <Slider
            label={t("workspace.params.sharpening")}
            value={params.sharpening}
            min={0}
            max={100}
            unit="%"
            onChange={(val) => setParam("sharpening", val)}
          />
        </div>

        {/* Scientific Safety Notice */}
        <div className="p-3 rounded-lg bg-panel/40 border border-border/50 text-[11px] text-muted-foreground flex items-start gap-2 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <span>{t("workspace.params.manual_review_warning")}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-border bg-panel flex items-center gap-2">
        <Button variant="accent" className="flex-1" size="md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("actions.apply")}</span>
        </Button>
      </div>
    </aside>
  );
};
