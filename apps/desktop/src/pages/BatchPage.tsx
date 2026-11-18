import React from "react";
import { useTranslation } from "react-i18next";
import { useBatchStore } from "@/stores/batchStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FolderOpen,
  Plus,
  Play,
  Square,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

export const BatchPage: React.FC = () => {
  const { t } = useTranslation("common");
  const {
    items,
    outputDirectory,
    concurrency,
    isProcessing,
    addItem,
    removeItem,
    clearQueue,
    setIsProcessing,
  } = useBatchStore();

  const handleAddSample = () => {
    addItem({
      fileName: `exam-sheet-p${items.length + 1}.png`,
      filePath: `C:/Exams/exam-sheet-p${items.length + 1}.png`,
      fileSize: "2.6 MB",
      dimensions: "2480 × 3508",
    });
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{t("batch.title")}</h1>
            <Badge variant="accent">{t("batch.queue_count", { count: items.length })}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t("batch.desc")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleAddSample}>
            <Plus className="w-3.5 h-3.5 text-accent" />
            <span>{t("batch.add_files")}</span>
          </Button>

          {isProcessing ? (
            <Button variant="destructive" size="sm" onClick={() => setIsProcessing(false)}>
              <Square className="w-3.5 h-3.5" />
              <span>{t("actions.stop_batch")}</span>
            </Button>
          ) : (
            <Button
              variant="accent"
              size="sm"
              disabled={items.length === 0}
              onClick={() => setIsProcessing(true)}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t("actions.start_batch")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Control Parameters Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">{t("batch.output_dir")}</span>
            <div className="font-mono text-xs text-foreground font-medium truncate">
              {outputDirectory}
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-fit">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{t("batch.browse")}</span>
          </Button>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">{t("batch.concurrency")}</span>
            <div className="text-xs text-foreground font-medium">
              {t("batch.threads", { count: concurrency })}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            تنظیم هوشمند بر اساس تعداد هسته‌های CPU و حافظه آزاد
          </p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">تنظیمات پایپ‌لاین:</span>
            <div className="text-xs text-foreground font-medium">
              حذف سایه + ماسک محافظتی کامل
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="accent">تطبیق خودکار</Badge>
          </div>
        </Card>
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border">
          <CardTitle className="text-sm">فهرست تصاویر در صف</CardTitle>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearQueue}>
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-400">پاکسازی کل صف</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {t("batch.queue_empty")}
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 hover:bg-background-secondary/50 transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-panel border border-border flex items-center justify-center text-muted-foreground">
                      <Copy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground font-mono">{item.fileName}</div>
                      <div className="text-[11px] text-muted-foreground">{item.filePath}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-muted-foreground font-mono text-[11px]">
                      {item.dimensions} • {item.fileSize}
                    </div>

                    <div>
                      {item.status === "waiting" && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{t("batch.status_waiting")}</span>
                        </Badge>
                      )}
                      {item.status === "processing" && (
                        <Badge variant="accent" className="flex items-center gap-1 animate-pulse">
                          <span>{t("batch.status_processing")}</span>
                        </Badge>
                      )}
                      {item.status === "completed" && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t("batch.status_completed")}</span>
                        </Badge>
                      )}
                      {item.status === "error" && (
                        <Badge variant="warning" className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{t("batch.status_error")}</span>
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
