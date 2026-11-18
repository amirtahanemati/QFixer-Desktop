import React from "react";
import { WorkspaceToolbar } from "@/features/workspace/WorkspaceToolbar";
import { WorkspaceToolbox } from "@/features/workspace/WorkspaceToolbox";
import { WorkspaceCanvas } from "@/features/workspace/WorkspaceCanvas";
import { WorkspaceParamsPanel } from "@/features/workspace/WorkspaceParamsPanel";

export const WorkspacePage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <WorkspaceToolbar />
      <div className="flex-1 flex overflow-hidden">
        <WorkspaceToolbox />
        <WorkspaceCanvas />
        <WorkspaceParamsPanel />
      </div>
    </div>
  );
};
