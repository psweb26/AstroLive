import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full border border-line-strong px-2.5 py-1 text-xs font-semibold tracking-wide text-signal-secondary", className)} {...props} />;
}
