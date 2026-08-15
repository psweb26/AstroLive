import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { eyebrow?: string; children: ReactNode };

export function PageHeading({ eyebrow, className, children, ...props }: HeadingProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      {eyebrow ? <p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">{eyebrow}</p> : null}
      <h1 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-[-0.035em] text-ink sm:text-5xl lg:text-6xl" {...props}>{children}</h1>
    </header>
  );
}

export function SectionHeading({ eyebrow, className, children, ...props }: HeadingProps) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-secondary">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-4xl" {...props}>{children}</h2>
    </header>
  );
}
