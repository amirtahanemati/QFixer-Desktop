import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore, AppPage } from "@/stores/appStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Layers, Copy, Clock, Settings, PlusCircle } from "lucide-react";

interface NavItem {
  id: AppPage;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "workspace", labelKey: "nav.workspace", icon: Layers },
  { id: "batch", labelKey: "nav.batch", icon: Copy },
  { id: "history", labelKey: "nav.history", icon: Clock },
  { id: "settings", labelKey: "nav.settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { t } = useTranslation("common");
  const { currentPage, setCurrentPage } = useAppStore();
  const { setCurrentImage } = useWorkspaceStore();

  const handleStartNew = () => {
    setCurrentImage(null);
    setCurrentPage("workspace");
  };

  return (
    <aside className="w-52 bg-background-secondary border-e border-border flex flex-col justify-between py-3 select-none">
      <div className="flex flex-col gap-3 px-2">
        {/* Quick New Image Action */}
        <button
          onClick={handleStartNew}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-accent text-background-primary font-bold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تصویر جدید</span>
        </button>

        <nav className="flex flex-col gap-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "bg-panel text-accent border border-border/80 shadow-xs"
                    : "text-muted-foreground hover:bg-panel/50 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-4 py-2 border-t border-border/60 text-[11px] text-muted-foreground">
        <div className="font-semibold text-foreground">QFixer Desktop</div>
        <div className="text-[10px] text-muted-foreground/75 font-mono">نسخه ۱.۰.۰ (آفلاین)</div>
      </div>
    </aside>
  );
};

