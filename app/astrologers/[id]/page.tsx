import Link from "next/link";
import { Globe2, Star } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { astrologers } from "@/data/astrologers";

type AstrologerProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AstrologerProfilePage({ params }: AstrologerProfilePageProps) {
  const { id } = await params;
  const astrologer = astrologers.find((item) => item.id === id);

  if (!astrologer) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Astrologer not found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">The astrologer you are looking for is unavailable.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-20 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-violet-100 text-2xl font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-200">
                {astrologer.initials}
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">{astrologer.name}</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">{astrologer.specialization}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-100">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {astrologer.rating.toFixed(1)} rating
                  </span>
                  <span>{astrologer.experience} years experience</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-violet-50 px-5 py-4 dark:bg-violet-950/50">
              <p className="text-sm text-violet-700 dark:text-violet-200">Consultation</p>
              <p className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">₹{astrologer.price}/session</p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Globe2 className="h-4 w-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
              Languages
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{astrologer.languages.join(", ")}</p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">About</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              With a thoughtful and practical approach, this astrologer offers personalized guidance to help you understand your path and make confident decisions.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Availability</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Today", "Tomorrow", "This Week"].map((time) => (
                <span key={time} className="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-200">
                  {time}
                </span>
              ))}
            </div>
            <Button asChild className="mt-6 w-full rounded-full">
              <Link href={`/booking?astrologer=${astrologer.id}`}>Book Consultation</Link>
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
