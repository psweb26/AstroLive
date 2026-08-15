import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-muted",
  success: "bg-signal-success",
  warning: "bg-signal-warning",
  danger: "bg-signal-danger",
};

export function StatusIndicator({ tone = "neutral", className, children, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn("inline-flex items-center gap-2 text-sm text-ink-secondary", className)} {...props}><span aria-hidden="true" className={cn("h-2 w-2 rounded-full", tones[tone])} />{children}</span>;
}
