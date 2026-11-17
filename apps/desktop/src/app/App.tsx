import React, { useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { StatusBar } from "@/components/StatusBar";
import { HomePage } from "@/pages/HomePage";
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
          {currentPage !== "home" && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              بخش {currentPage} در فازهای بعدی فعال خواهد شد.
            </div>
          )}
        </main>
      </div>
      <StatusBar />
    </div>
  );
};
