import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "danger";

const toneClasses: Record<AlertTone, string> = {
  info: "border-signal-secondary/40 bg-signal-secondary/10 text-ink",
  success: "border-signal-success/40 bg-signal-success/10 text-ink",
  warning: "border-signal-warning/40 bg-signal-warning/10 text-ink",
  danger: "border-signal-danger/40 bg-signal-danger/10 text-ink",
};

export function Alert({ tone = "info", className, ...props }: HTMLAttributes<HTMLDivElement> & { tone?: AlertTone }) {
  return <div role={tone === "danger" ? "alert" : "status"} className={cn("border-l-2 px-4 py-3 text-sm leading-6", toneClasses[tone], className)} {...props} />;
}
