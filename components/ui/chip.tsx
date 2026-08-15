import * as React from "react";

import { cn } from "@/lib/utils";

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean };

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(({ className, selected = false, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    aria-pressed={selected}
    className={cn(
      "min-h-10 rounded-full border px-3 text-sm font-medium transition-colors duration-150",
      selected ? "border-signal-secondary bg-signal-secondary text-white" : "border-line bg-transparent text-ink-secondary hover:border-line-strong hover:text-ink",
      className,
    )}
    {...props}
  />
));
Chip.displayName = "Chip";
