import React from "react";
import { useTranslation } from "react-i18next";
import { Cpu, CheckCircle2 } from "lucide-react";

export const StatusBar: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <footer className="h-7 bg-panel border-t border-border px-3 flex items-center justify-between text-[11px] text-muted-foreground select-none">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-accent" />
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-accent" />
          <span>{t("status.ready")}</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3" />
          <span>{t("status.hardware")}</span>
          <span className="text-foreground font-mono">CPU (Multi-Thread)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>{t("status.engine")}</span>
          <span className="text-foreground font-mono">Python CV Worker (v2.0)</span>
        </div>
      </div>
    </footer>
  );
};
