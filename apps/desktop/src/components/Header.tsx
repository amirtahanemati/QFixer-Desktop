import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/appStore";
import { Moon, Sun, Languages } from "lucide-react";

export const Header: React.FC = () => {
  const { t } = useTranslation("common");
  const { theme, toggleTheme, lang, setLang } = useAppStore();

  const handleLangToggle = () => {
    const nextLang = lang === "fa-IR" ? "en-US" : "fa-IR";
    setLang(nextLang);
  };

  return (
    <header className="h-12 border-b border-border bg-background-secondary px-4 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center font-bold text-xs text-accent-foreground">
          QF
        </div>
        <div>
          <span className="font-semibold text-sm tracking-wide">{t("app.title")}</span>
          <span className="text-xs text-muted-foreground ms-2 hidden sm:inline">
            {t("app.tagline")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleLangToggle}
          title={t("actions.switch_lang")}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-panel hover:bg-muted transition text-foreground"
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{lang === "fa-IR" ? "EN" : "فارسی"}</span>
        </button>

        <button
          onClick={toggleTheme}
          title={t("actions.toggle_theme")}
          className="p-1.5 rounded bg-panel hover:bg-muted transition text-foreground"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-accent" />}
        </button>
      </div>
    </header>
  );
};
