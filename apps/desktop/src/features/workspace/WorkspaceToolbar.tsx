import React from "react";
import { useTranslation } from "react-i18next";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  SplitSquareVertical,
  Columns,
  Layers,
  Download,
  FolderOpen,
  MousePointer,
  Hand,
} from "lucide-react";

export const WorkspaceToolbar: React.FC = () => {
  const { t } = useTranslation("common");
  const {
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    viewMode,
    setViewMode,
    activeTool,
    setActiveTool,
    setCurrentImage,
  } = useWorkspaceStore();

  const handleSimulateLoad = () => {
    setCurrentImage("konkur-chemistry-diagram.png", { width: 2200, height: 3100 });
  };

  return (
    <div className="h-11 border-b border-border bg-background-secondary px-3 flex items-center justify-between gap-2 select-none">
      {/* File & History Actions */}
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" onClick={handleSimulateLoad} title={t("actions.import_image")}>
          <FolderOpen className="w-3.5 h-3.5 text-accent" />
          <span className="hidden sm:inline">{t("actions.import_image")}</span>
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button variant="ghost" size="icon" title={t("actions.undo")}>
          <Undo2 className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" title={t("actions.redo")}>
          <Redo2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Navigation & Selection Tools */}
      <div className="flex items-center gap-1 bg-panel/70 p-0.5 rounded-lg border border-border">
        <Button
          variant={activeTool === "select" ? "accent" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("select")}
          title={t("workspace.toolbar.select")}
        >
          <MousePointer className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant={activeTool === "pan" ? "accent" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("pan")}
          title={t("workspace.toolbar.pan")}
        >
          <Hand className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1.5 bg-panel/70 px-2 py-0.5 rounded-lg border border-border text-xs">
        <Button variant="ghost" size="icon" onClick={zoomOut} title={t("workspace.toolbar.zoom_out")}>
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <span className="font-mono text-xs w-12 text-center text-foreground font-medium">
          {zoomLevel}%
        </span>
        <Button variant="ghost" size="icon" onClick={zoomIn} title={t("workspace.toolbar.zoom_in")}>
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={resetZoom} title={t("workspace.toolbar.fit")}>
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* View & Compare Modes */}
      <div className="flex items-center gap-1 bg-panel/70 p-0.5 rounded-lg border border-border">
        <Button
          variant={viewMode === "slider" ? "accent" : "ghost"}
          size="sm"
          onClick={() => setViewMode("slider")}
          title={t("workspace.toolbar.compare_split")}
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t("workspace.toolbar.compare_split")}</span>
        </Button>
        <Button
          variant={viewMode === "side_by_side" ? "accent" : "ghost"}
          size="sm"
          onClick={() => setViewMode("side_by_side")}
          title={t("workspace.toolbar.compare_side")}
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t("workspace.toolbar.compare_side")}</span>
        </Button>
        <Button
          variant={viewMode === "overlay" ? "accent" : "ghost"}
          size="sm"
          onClick={() => setViewMode("overlay")}
          title={t("workspace.toolbar.compare_overlay")}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t("workspace.toolbar.compare_overlay")}</span>
        </Button>
      </div>

      {/* Export Action */}
      <div className="flex items-center gap-1">
        <Button variant="accent" size="sm" title={t("actions.export_image")}>
          <Download className="w-3.5 h-3.5" />
          <span>{t("actions.export_image")}</span>
        </Button>
      </div>
    </div>
  );
};
