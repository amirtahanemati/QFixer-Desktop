import React, { useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { StatusBar } from "@/components/StatusBar";
import { HomePage } from "@/pages/HomePage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { BatchPage } from "@/pages/BatchPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { useAppStore } from "@/stores/appStore";

export const App: React.FC = () => {
  const { theme, lang, currentPage } = useAppStore();

  useEffect(() => {
    // Initial sync of theme and language direction
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    document.documentElement.dir = lang.startsWith("fa") ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [theme, lang]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          {currentPage === "home" && <HomePage />}
          {currentPage === "workspace" && <WorkspacePage />}
          {currentPage === "batch" && <BatchPage />}
          {currentPage === "history" && <HistoryPage />}
          {currentPage === "settings" && <SettingsPage />}
        </main>
      </div>
      <StatusBar />
    </div>
  );
};
