import * as React from "react";

import { cn } from "@/lib/utils";

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean };

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(({ className, selected = false, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    aria-pressed={selected}
    className={cn(
      "min-h-10 rounded-full border px-3 text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 focus-visible:outline-none",
      selected ? "border-signal-secondary bg-signal-secondary text-white shadow-[inset_0_0_0_1px_hsl(var(--accent-secondary)/0.2)]" : "border-line bg-transparent text-ink-secondary hover:-translate-y-px hover:border-line-strong hover:text-ink",
      className,
    )}
    {...props}
  />
));
Chip.displayName = "Chip";
