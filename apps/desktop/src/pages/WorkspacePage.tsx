import React, { useState } from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { WorkspaceToolbar } from "@/features/workspace/WorkspaceToolbar";
import { WorkspaceCanvas } from "@/features/workspace/WorkspaceCanvas";
import { WorkspaceParamsPanel } from "@/features/workspace/WorkspaceParamsPanel";
import { ModernDropzone } from "@/components/ModernDropzone";
import { ExportDialog } from "@/features/workspace/ExportDialog";
import { generateEducationalSample } from "@/utils/sampleImageGenerator";

export const WorkspacePage: React.FC = () => {
  const { currentImage, setCurrentImage } = useWorkspaceStore();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [currentProcessedUrl, setCurrentProcessedUrl] = useState<string | null>(null);

  const handleImageSelected = (dataUrl: string, _file: File, img: HTMLImageElement) => {
    setCurrentImage(dataUrl, {
      width: img.naturalWidth || 1920,
      height: img.naturalHeight || 1080,
    });
  };

  const handleLoadSample = (sampleType: "math" | "physics" | "handwritten") => {
    const dataUrl = generateEducationalSample(sampleType);
    const img = new Image();
    img.onload = () => {
      setCurrentImage(dataUrl, { width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = dataUrl;
  };

  // If no image is opened yet, display the ultra-clean, modern dropzone
  if (!currentImage) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <ModernDropzone
          onImageSelected={handleImageSelected}
          onLoadSample={handleLoadSample}
        />
      </div>
    );
  }

  // Active Workspace with full interactive canvas and clean sidebar controls
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <WorkspaceToolbar />
      <div className="flex-1 flex overflow-hidden">
        <WorkspaceCanvas onProcessedReady={setCurrentProcessedUrl} />
        <WorkspaceParamsPanel onExportClick={() => setIsExportDialogOpen(true)} />
      </div>
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        processedImageSrc={currentProcessedUrl}
      />
    </div>
  );
};
