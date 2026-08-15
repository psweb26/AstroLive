import * as React from "react";

import { cn } from "@/lib/utils";

const inputClassName = "min-h-11 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted transition-colors duration-150 focus:border-signal-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(inputClassName, className)} {...props} />
));
Input.displayName = "Input";

export { inputClassName };
