import { Search } from "lucide-react";

import { AstrologerCard } from "@/components/AstrologerCard";
import { Navbar } from "@/components/Navbar";
import { astrologers } from "@/data/astrologers";

export default function AstrologersPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            Browse Astrologers
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Find the right expert based on your needs.
          </p>
        </div>

        <div className="relative mt-8 max-w-xl">
          <label htmlFor="astrologer-search" className="sr-only">
            Search astrologers
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="astrologer-search"
            type="search"
            placeholder="Search astrologers"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white py-2 pl-12 pr-4 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-950"
          />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {astrologers.map((astrologer) => (
            <AstrologerCard key={astrologer.name} {...astrologer} />
          ))}
        </div>
      </main>
    </div>
  );
}
