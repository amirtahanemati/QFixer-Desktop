import React from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud, CheckCircle, ShieldCheck, Zap, Terminal } from "lucide-react";

export const HomePage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Phase 0 Status Banner */}
      <div className="rounded-xl border border-border bg-panel/60 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent/20 text-accent">
            {t("phase0.badge")}
          </span>
          <span className="text-xs text-muted-foreground">حالت دسکتاپ آفلاین فعال است</span>
        </div>
        <h2 className="text-lg font-bold text-foreground">
          {t("phase0.status_title")}
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("phase0.status_desc")}
        </p>
      </div>

      {/* Grid of Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-panel border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">امنیت و حریم خصوصی قطعی</h3>
          <p className="text-xs text-muted-foreground">
            پردازش‌ها ۱۰۰٪ محلی و بدون هیچ‌گونه نیاز به اینترنت یا سرور ابری انجام می‌شوند.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-panel border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">حفظ فرمول‌ها و نمودارها</h3>
          <p className="text-xs text-muted-foreground">
            ماسک‌های محافظتی هوشمند از آسیب دیدن کسرها، توان‌ها، رادیکال‌ها و خطوط علمی جلوگیری می‌کنند.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-panel border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Terminal className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">معماری Rust + Python IPC</h3>
          <p className="text-xs text-muted-foreground">
            پروتکل نسخه ۲ بدون سربار Base64 و با مدیریت هوشمند حافظه برای تصاویر با ابعاد بسیار بزرگ.
          </p>
        </div>
      </div>

      {/* Quick Drop Zone placeholder */}
      <div className="rounded-xl border-2 border-dashed border-border hover:border-accent/60 bg-panel/30 p-10 flex flex-col items-center justify-center text-center cursor-pointer transition">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-medium text-foreground mb-1">
          {t("actions.import_image")}
        </h4>
        <p className="text-xs text-muted-foreground">
          تصاویر سؤالات امتحانی، اسکن کتاب یا جزوات را به اینجا بکشید یا کلیک کنید
        </p>
      </div>

      {/* Checklist */}
      <div className="p-4 rounded-lg bg-panel border border-border space-y-3">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          وضعیت آزمون‌های فاز صفر:
        </h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-accent" />
            <span>پروتکل ارتباطی IPC نسخه ۲.۰ پایتون اعتبارسنجی شد (Pytest Passed)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-accent" />
            <span>توکن‌های طراحی تیره (#101114) و روشن (#F7F8FA) به صورت پویا پیاده‌سازی شدند</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-accent" />
            <span>زبان پیش‌فرض فارسی با ساختار کامل RTL و قابلیت سوییچ به انگلیسی فعال است</span>
          </div>
        </div>
      </div>
    </div>
  );
};
