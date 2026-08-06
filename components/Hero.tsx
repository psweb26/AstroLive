import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { AstrologyChart } from "@/components/AstrologyChart";
import { Button } from "@/components/ui/button";
import { astrologers } from "@/data/astrologers";

const bookingHref = `/booking?astrologer=${astrologers[0].id}`;

export function Hero() {
  return (
    <section id="about" className="overflow-hidden bg-white dark:bg-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100/70 px-3 py-1 text-sm font-medium text-violet-800 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Guidance that meets you where you are
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            Find clarity in the stars, live.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            AstroLive connects you with thoughtful astrologers for personal, meaningful guidance whenever you need a new perspective.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="default" className="group rounded-full px-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25">
              <Link href={bookingHref}>
                Book Consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="default" className="rounded-full border-slate-300 bg-white px-6 transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900">
              <Link href="/astrologers">Explore Astrologers</Link>
            </Button>
          </div>
        </div>

        <AstrologyChart />
      </div>
    </section>
  );
}
