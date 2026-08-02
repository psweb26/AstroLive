"use client";

import Link from "next/link";
import { LayoutDashboard, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r md:block">
      <div className="sticky top-0 flex h-screen flex-col p-4">
        <Link className="mb-8 px-3 text-lg font-semibold" href="/">AstroLive</Link>
        <nav className="space-y-1" aria-label="Dashboard navigation">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === href && "bg-accent text-accent-foreground",
              )}
              href={href}
              key={href}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
