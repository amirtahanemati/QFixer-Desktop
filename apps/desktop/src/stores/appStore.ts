import { create } from "zustand";
import i18n from "@/i18n";

export type ThemeMode = "dark" | "light";
export type SupportedLang = "fa-IR" | "en-US";
export type AppPage = "home" | "workspace" | "batch" | "history" | "settings";

interface AppState {
  theme: ThemeMode;
  lang: SupportedLang;
  currentPage: AppPage;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setLang: (lang: SupportedLang) => void;
  setCurrentPage: (page: AppPage) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: "dark",
  lang: "fa-IR",
  currentPage: "home",
  setTheme: (theme) => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(nextTheme);
  },
  setLang: (lang) => {
    i18n.changeLanguage(lang);
    const dir = lang.startsWith("fa") ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    set({ lang });
  },
  setCurrentPage: (currentPage) => set({ currentPage }),
}));
