import React from "react";
import { useTranslation } from "react-i18next";
import { useWorkspaceStore, ActiveToolGroup } from "@/stores/workspaceStore";
import {
  Sparkles,
  Eraser,
  Paintbrush,
  ShieldCheck,
  Sun,
  Brush,
  Scissors,
} from "lucide-react";

interface ToolGroupItem {
  id: ActiveToolGroup;
  titleKey: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const groups: ToolGroupItem[] = [
  {
    id: "cleanup",
    titleKey: "workspace.tool_groups.cleanup",
    icon: Eraser,
    description: "حذف سایه، لکه و اصلاح نور",
  },
  {
    id: "protection",
    titleKey: "workspace.tool_groups.protection",
    icon: ShieldCheck,
    description: "ماسک‌های حفاظتی فرمول، متن و خطوط",
  },
  {
    id: "basic",
    titleKey: "workspace.tool_groups.basic",
    icon: Sun,
    description: "روشنایی، کنتراست و نوردهی",
  },
  {
    id: "restoration",
    titleKey: "workspace.tool_groups.restoration",
    icon: Paintbrush,
    description: "حذف واترمارک و بازسازی Inpainting",
  },
  {
    id: "advanced",
    titleKey: "workspace.tool_groups.advanced",
    icon: Sparkles,
    description: "تیزی لبه‌ها و سوپررزولوشن",
  },
];

export const WorkspaceToolbox: React.FC = () => {
  const { t } = useTranslation("common");
  const { activeGroup, setActiveGroup } = useWorkspaceStore();

  return (
    <aside className="w-14 bg-background-secondary border-e border-border flex flex-col items-center py-3 gap-2 select-none">
      {groups.map((group) => {
        const Icon = group.icon;
        const isActive = activeGroup === group.id;
        return (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            title={`${t(group.titleKey)} - ${group.description}`}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              isActive
                ? "bg-accent text-accent-foreground shadow-sm scale-105"
                : "text-muted-foreground hover:bg-panel hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
          </button>
        );
      })}

      <div className="w-8 h-px bg-border my-2" />

      {/* Mask Quick Tools */}
      <button
        title="قلم‌موی ماسک دستی"
        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-panel hover:text-foreground transition"
      >
        <Brush className="w-4 h-4" />
      </button>
      <button
        title="پاک‌کن ماسک دستی"
        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-panel hover:text-foreground transition"
      >
        <Scissors className="w-4 h-4" />
      </button>
    </aside>
  );
};
