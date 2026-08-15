import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out hover:-translate-y-px focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-signal-secondary",
        outline: "border border-line-strong bg-transparent text-ink hover:border-signal-secondary hover:text-signal-secondary",
        ghost: "text-ink-secondary hover:bg-surface-muted hover:text-ink",
        signal: "bg-signal text-white hover:bg-signal-secondary",
        quiet: "text-signal-secondary underline-offset-4 hover:underline",
      },
      size: { default: "px-4 py-2", sm: "min-h-9 px-3 py-1.5 text-xs", icon: "h-11 w-11 p-0" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
