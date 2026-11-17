import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore, AppPage } from "@/stores/appStore";
import { Home, Layers, Copy, Clock, Settings } from "lucide-react";

interface NavItem {
  id: AppPage;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "home", labelKey: "nav.home", icon: Home },
  { id: "workspace", labelKey: "nav.workspace", icon: Layers },
  { id: "batch", labelKey: "nav.batch", icon: Copy },
  { id: "history", labelKey: "nav.history", icon: Clock },
  { id: "settings", labelKey: "nav.settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { t } = useTranslation("common");
  const { currentPage, setCurrentPage } = useAppStore();

  return (
    <aside className="w-48 bg-background-secondary border-e border-border flex flex-col justify-between py-3">
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition ${
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-foreground/80 hover:bg-panel hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-2 border-t border-border text-[11px] text-muted-foreground">
        <div>نسخه ۰.۱.۰</div>
        <div className="text-[10px] opacity-75">Tauri 2 + Python Engine</div>
      </div>
    </aside>
  );
};
