import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Cpu, Eye } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useAppStore } from "@/stores/appStore";

interface HistoryRecord {
  id: string;
  title: string;
  date: string;
  ops: string;
  hardware: string;
  duration: string;
  resolution: string;
}

const mockHistory: HistoryRecord[] = [
  {
    id: "h-1",
    title: "آزمون سراسری ریاضی و فنی - سؤالات دیفرانسیل و انتگرال",
    date: "۱۴۰۲/۰۸/۲۴ - ۱۸:۳۲",
    ops: "حذف سایه اسکن، وضوح فرمول‌های ریاضی و کسرها",
    hardware: "CPU Multi-Thread",
    duration: "۱.۴ ثانیه",
    resolution: "2480 × 3508",
  },
  {
    id: "h-2",
    title: "جزوه فیزیک - نمودار ترمودینامیک و دیاگرام‌های فشار-حجم",
    date: "۱۴۰۲/۰۸/۲۴ - ۱۵:۱۰",
    ops: "اصلاح نور غیریکنواخت عکاسی، حفظ خطوط منحنی",
    hardware: "CUDA GPU",
    duration: "۰.۷ ثانیه",
    resolution: "3000 × 4000",
  },
  {
    id: "h-3",
    title: "شیمی دوازدهم - شکل ساختارهای مولکولی و پیوندها",
    date: "۱۴۰۲/۰۸/۲۳ - ۰۹:۱۵",
    ops: "حذف نویز کاغذ کاهی، حفظ رنگ‌های معنادار پیوندها",
    hardware: "CPU Multi-Thread",
    duration: "۱.۱ ثانیه",
    resolution: "1920 × 2560",
  },
];

export const HistoryPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { setCurrentPage } = useAppStore();
  const { setCurrentImage } = useWorkspaceStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockHistory.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReopen = (item: HistoryRecord) => {
    setCurrentImage(item.title, { width: 2480, height: 3508 });
    setCurrentPage("workspace");
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("history.title")}</h1>
          <p className="text-xs text-muted-foreground mt-1">{t("history.desc")}</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("history.search_placeholder")}
            className="w-full h-8 ps-8 pe-3 rounded-lg bg-panel border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* History Records List */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {t("history.empty")}
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-background-secondary/50 transition gap-4 text-xs"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                      <span>{item.title}</span>
                      <Badge variant="accent">تأیید کیفی</Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.ops}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.resolution}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-end">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-foreground">
                        <Cpu className="w-3 h-3 text-accent" />
                        <span>{item.hardware}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        زمان: {item.duration}
                      </div>
                    </div>

                    <Button variant="secondary" size="sm" onClick={() => handleReopen(item)}>
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      <span>{t("history.reopen")}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
