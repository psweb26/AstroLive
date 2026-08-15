"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavigationContext = "marketing" | "product" | "account";

const items: Record<NavigationContext, { href: string; label: string }[]> = {
  marketing: [
    { href: "/", label: "Home" },
    { href: "/understanding-you", label: "Your insight" },
    { href: "/astrologers", label: "Astrologers" },
  ],
  product: [
    { href: "/", label: "AstroLive" },
    { href: "/understanding-you", label: "Your insight" },
    { href: "/astrologers", label: "Astrologers" },
  ],
  account: [
    { href: "/", label: "AstroLive" },
    { href: "/login", label: "Log in" },
  ],
};

const contextLabel: Record<NavigationContext, string> = {
  marketing: "Main navigation",
  product: "Product navigation",
  account: "Account navigation",
};

export function AstroLiveNav({ context = "marketing" }: { context?: NavigationContext }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navigation = items[context];
  const actionLabel = context === "account" ? "Create account" : "Start an insight";
  const actionHref = context === "account" ? "/signup" : "/understanding-you";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="page-frame flex min-h-[4.25rem] items-center justify-between gap-4">
        <Link href="/" className="brand-mark shrink-0 font-display text-[1.65rem] font-semibold tracking-[-0.04em] text-ink">
          AstroLive
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label={contextLabel[context]}>
          {navigation.slice(1).map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("rounded-sm px-3 py-2 text-sm font-medium text-ink-secondary transition-colors hover:text-ink", active && "text-signal-secondary")}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm"><Link href={actionHref}>{actionLabel}</Link></Button>
        </div>

        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink md:hidden" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="astro-live-mobile-navigation" onClick={() => setOpen((value) => !value)}>
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <nav id="astro-live-mobile-navigation" className="border-t border-line bg-surface md:hidden" aria-label={contextLabel[context]}>
          <div className="page-frame flex flex-col py-3">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} className={cn("min-h-11 px-1 py-3 text-sm font-medium text-ink-secondary", active && "text-signal-secondary")}>{item.label}</Link>;
            })}
            <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
              <ThemeToggle />
              <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}><Link href={actionHref}>{actionLabel}</Link></Button>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
