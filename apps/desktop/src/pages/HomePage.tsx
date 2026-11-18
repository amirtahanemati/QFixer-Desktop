import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/appStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  UploadCloud,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  FolderOpen,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { t } = useTranslation("common");
  const { lang, setCurrentPage } = useAppStore();
  const { setCurrentImage } = useWorkspaceStore();

  const isRtl = lang.startsWith("fa");
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleSampleLoad = () => {
    // Load a demonstrative educational sample image into workspace
    setCurrentImage("sample_konkur_geometry.png", { width: 2400, height: 3200 });
    setCurrentPage("workspace");
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-panel to-background-secondary p-6 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="accent">{t("app.title")}</Badge>
              <Badge variant="success">{t("app.offline_active")}</Badge>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              {t("app.tagline")}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {t("home.feature_protect_desc")}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="accent" size="lg" onClick={() => setCurrentPage("workspace")}>
              <Layers className="w-4 h-4" />
              <span>{t("actions.open_workspace")}</span>
              <ArrowIcon className="w-4 h-4 ms-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Drop Zone Area */}
      <div
        onClick={handleSampleLoad}
        className="group relative rounded-xl border-2 border-dashed border-border hover:border-accent bg-panel/40 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
      >
        <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent mb-3 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {t("home.dropzone_title")}
        </h3>
        <p className="text-xs text-muted-foreground max-w-md">
          {t("home.dropzone_desc")}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleSampleLoad(); }}>
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>بارگذاری نمونه سؤال امتحانی و آزمون محیط</span>
          </Button>
        </div>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>{t("home.stat_processed")}</span>
              <Activity className="w-4 h-4 text-accent" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">۱۲۴</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground">در سشن‌های اخیر محلی</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>{t("home.stat_success_rate")}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-emerald-500">۹۹.۸٪</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground">بدون حذف کوچک‌ترین فرمول یا علامت</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>{t("home.stat_avg_time")}</span>
              <Clock className="w-4 h-4 text-accent" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">۱.۲ <span className="text-xs font-normal text-muted-foreground">ثانیه</span></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground">بر روی تصویر با وضوح 4K</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>{t("home.models_installed")}</span>
              <Zap className="w-4 h-4 text-accent" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">۳ <span className="text-xs font-normal text-muted-foreground">مدل ثبت‌شده</span></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground">رجیستری ONNX محلی آفلاین</p>
          </CardContent>
        </Card>
      </div>

      {/* Hardware and Recent Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hardware Status Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              <CardTitle>{t("home.hardware_detected")}</CardTitle>
            </div>
            <CardDescription>مشخصات منابع پردازشی دستگاه</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">پردازنده مرکزی (CPU):</span>
              <span className="font-mono text-foreground font-medium">Multi-Core x86_64</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">کارت گرافیک (GPU):</span>
              <span className="font-mono text-accent font-medium">NVIDIA / DirectML Ready</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">وضعیت رانتایم هوش مصنوعی:</span>
              <span className="font-mono text-emerald-500 font-medium">ONNX Runtime Native</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-muted-foreground">پروتکل IPC:</span>
              <span className="font-mono text-foreground">v2.0.0 (Zero-Base64)</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects / Images */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-accent" />
                <CardTitle>{t("home.recent_projects")}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage("history")}>
                <span>{t("nav.history")}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Button>
            </div>
            <CardDescription>اسناد و تصاویری که اخیراً مورد بازسازی قرار گرفته‌اند</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              {
                title: "آزمون سراسری تجربی - زیست‌شناسی ۱۴۰۲ (نمودار ژنتیک)",
                time: "۱۰ دقیقه پیش",
                ops: "حذف سایه اسکن + فیلتر حفاظت از خطوط نازک",
                dim: "2480 × 3508",
              },
              {
                title: "کتاب فیزیک یازدهم - دیاگرام مدارهای الکتریکی و مقاومت‌ها",
                time: "دیروز، ساعت ۱۶:۴۰",
                ops: "اصلاح نور غیریکنواخت + رفع واترمارک",
                dim: "1920 × 2650",
              },
              {
                title: "نمونه سؤالات هندسه ۳ - شکل چندضلعی‌های محاطی و زوایا",
                time: "۳ روز پیش",
                ops: "حذف نویز پس‌زمینه کاغذ کاهی + افزایش تیزی لبه‌ها",
                dim: "3000 × 4000",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={handleSampleLoad}
                className="group flex items-center justify-between p-3 rounded-lg bg-background-secondary/60 hover:bg-background-secondary border border-border/50 cursor-pointer transition"
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{item.ops}</span>
                    <span>•</span>
                    <span className="font-mono">{item.dim}</span>
                  </div>
                </div>
                <div className="text-[11px] text-muted-foreground/80 shrink-0">
                  {item.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
