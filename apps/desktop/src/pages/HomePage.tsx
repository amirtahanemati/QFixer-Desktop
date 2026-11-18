import React from "react";
import { useAppStore } from "@/stores/appStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { ModernDropzone } from "@/components/ModernDropzone";
import { generateEducationalSample } from "@/utils/sampleImageGenerator";

export const HomePage: React.FC = () => {
  const { setCurrentPage } = useAppStore();
  const { setCurrentImage } = useWorkspaceStore();

  const handleImageSelected = (dataUrl: string, _file: File, img: HTMLImageElement) => {
    setCurrentImage(dataUrl, {
      width: img.naturalWidth || 1920,
      height: img.naturalHeight || 1080,
    });
    setCurrentPage("workspace");
  };

  const handleLoadSample = (sampleType: "math" | "physics" | "handwritten") => {
    const dataUrl = generateEducationalSample(sampleType);
    const img = new Image();
    img.onload = () => {
      setCurrentImage(dataUrl, { width: img.naturalWidth, height: img.naturalHeight });
      setCurrentPage("workspace");
    };
    img.src = dataUrl;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <ModernDropzone
        onImageSelected={handleImageSelected}
        onLoadSample={handleLoadSample}
      />
    </div>
  );
};
