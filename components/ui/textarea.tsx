import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn("min-h-32 w-full resize-y rounded-md border border-line bg-surface px-3 py-3 text-sm leading-6 text-ink placeholder:text-ink-muted transition-colors duration-150 focus:border-signal-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
