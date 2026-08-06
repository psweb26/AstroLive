"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { astrologers } from "@/data/astrologers";

const bookingHref = `/booking?astrologer=${astrologers[0].id}`;

const navigation = [
  { href: "/", label: "Home" },
  { href: "/astrologers", label: "Astrologers" },
  { href: "/#about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
          AstroLive
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild className="rounded-full px-5">
            <Link href={bookingHref}>Book Consultation</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-white md:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {isOpen && (
        <nav id="mobile-navigation" className="border-t border-slate-200 px-5 py-4 dark:border-slate-800 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-3 rounded-full" onClick={closeMenu}>
              <Link href={bookingHref}>Book Consultation</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
