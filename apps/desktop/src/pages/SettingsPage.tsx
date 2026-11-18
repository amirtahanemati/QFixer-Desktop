import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/appStore";
import { useSettingsStore, HardwarePreference } from "@/stores/settingsStore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Cpu,
  HardDrive,
  Info,
  Check,
  Moon,
  Sun,
  ShieldCheck,
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { lang, setLang, theme, setTheme } = useAppStore();
  const {
    hardwarePreference,
    setHardwarePreference,
    cacheDirectory,
    tilingThresholdMegapixels,
    setTilingThresholdMegapixels,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<string>("appearance");

  const tabItems = [
    { id: "appearance", label: t("settings.appearance"), icon: Palette },
    { id: "hardware", label: t("settings.hardware_tab"), icon: Cpu },
    { id: "storage", label: t("settings.storage_tab"), icon: HardDrive },
    { id: "about", label: t("settings.about_tab"), icon: Info },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 select-none max-w-4xl">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold text-foreground">{t("settings.title")}</h1>
        <p className="text-xs text-muted-foreground mt-1">{t("settings.desc")}</p>
      </div>

      {/* Tabs */}
      <Tabs items={tabItems} activeId={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Appearance & Language */}
      {activeTab === "appearance" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.language_label")}</CardTitle>
              <CardDescription>
                زبان مورد استفاده در تمامی منوها، دکمه‌ها و پنجره‌ها
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button
                variant={lang === "fa-IR" ? "accent" : "secondary"}
                onClick={() => setLang("fa-IR")}
                className="flex-1 justify-start py-6"
              >
                <div className="text-start">
                  <div className="font-bold text-xs">فارسی (پیش‌فرض)</div>
                  <div className="text-[11px] opacity-80">راست‌به‌چپ (RTL) • فونت وزیرمتن</div>
                </div>
              </Button>

              <Button
                variant={lang === "en-US" ? "accent" : "secondary"}
                onClick={() => setLang("en-US")}
                className="flex-1 justify-start py-6"
              >
                <div className="text-start">
                  <div className="font-bold text-xs">English (US)</div>
                  <div className="text-[11px] opacity-80">Left-to-Right (LTR) • Standard Font</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.theme_label")}</CardTitle>
              <CardDescription>
                انتخاب پوسته تیره (مخصوص تمرکز و محیط تاریک) یا پوسته روشن
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  theme === "dark"
                    ? "border-accent bg-accent/10"
                    : "border-border bg-panel hover:bg-background-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-accent">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      {t("settings.theme_dark")}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      #101114 / #C7FF3D
                    </div>
                  </div>
                </div>
                {theme === "dark" && <Check className="w-4 h-4 text-accent" />}
              </div>

              <div
                onClick={() => setTheme("light")}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  theme === "light"
                    ? "border-accent bg-accent/10"
                    : "border-border bg-panel hover:bg-background-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-accent">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      {t("settings.theme_light")}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      #F7F8FA / #789E00
                    </div>
                  </div>
                </div>
                {theme === "light" && <Check className="w-4 h-4 text-accent" />}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Hardware Configuration */}
      {activeTab === "hardware" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.hardware_mode")}</CardTitle>
              <CardDescription>
                تعیین اولویت سخت‌افزاری پردازش تصویر و استنتاج مدل‌های محلی
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { id: "auto", title: t("settings.auto_detect"), desc: "استفاده از شتاب‌دهنده GPU در صورت وجود، با جایگزین امن CPU" },
                { id: "cpu", title: t("settings.force_cpu"), desc: "اجرای تمام فیلترها و عملیات بدون نیاز به کارت گرافیک مجزا" },
                { id: "gpu", title: t("settings.force_gpu"), desc: "بهره‌گیری از هسته‌های CUDA جهت پردازش‌های فوق‌سریع و پایپ‌لاین موازی" },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setHardwarePreference(opt.id as HardwarePreference)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    hardwarePreference === opt.id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-panel hover:bg-background-secondary"
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-foreground">{opt.title}</div>
                    <div className="text-[11px] text-muted-foreground">{opt.desc}</div>
                  </div>
                  {hardwarePreference === opt.id && <Check className="w-4 h-4 text-accent" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.tiling_threshold")}</CardTitle>
              <CardDescription>
                تقسیم تصاویر بسیار بزرگ به کاشی‌های کوچک‌تر جهت جلوگیری از پر شدن حافظه RAM/VRAM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>حد آستانه مگاپیکسل:</span>
                <span className="font-mono text-accent font-semibold">{tilingThresholdMegapixels} MP</span>
              </div>
              <input
                type="range"
                min={8}
                max={64}
                step={4}
                value={tilingThresholdMegapixels}
                onChange={(e) => setTilingThresholdMegapixels(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Storage */}
      {activeTab === "storage" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.storage_tab")}</CardTitle>
              <CardDescription>{t("settings.cache_dir")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-panel border border-border font-mono text-xs text-foreground">
                {cacheDirectory}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <span>تغییر مسیر...</span>
                </Button>
                <Button variant="destructive" size="sm">
                  <span>{t("settings.clear_cache")}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: About */}
      {activeTab === "about" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="accent">QFixer Desktop</Badge>
              <span className="text-xs text-muted-foreground">{t("app.version")}</span>
            </div>
            <CardTitle className="text-lg pt-2">{t("app.tagline")}</CardTitle>
            <CardDescription className="leading-relaxed">
              {t("settings.about_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs border-t border-border pt-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">تضمین ۱۰۰٪ حریم خصوصی و عدم ارسال هرگونه داده به اینترنت</span>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              توسعه‌یافته با ترکیب فریم‌ورک دسکتاپ Tauri 2، کامپایلر Rust، رابط React و موتور هوشمند پردازش تصویر پایتون و اوپن‌سی‌وی.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
