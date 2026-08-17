import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn("min-h-32 w-full resize-y rounded-md border border-line bg-surface px-3 py-3 text-sm leading-6 text-ink placeholder:text-ink-muted transition-[border-color,box-shadow,background-color] duration-150 focus:border-signal-secondary focus:bg-surface-elevated focus:outline-none focus:ring-4 focus:ring-signal-secondary/10 disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
