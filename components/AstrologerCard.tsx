import Link from "next/link";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Astrologer } from "@/data/astrologers";

export function AstrologerCard({
  id,
  initials,
  name,
  specialization,
  experience,
  rating,
  languages,
  price,
}: Astrologer) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-base font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-200">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{name}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{specialization}</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500 dark:text-slate-400">Experience</dt>
          <dd className="font-medium text-slate-800 dark:text-slate-100">{experience} years</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500 dark:text-slate-400">Rating</dt>
          <dd className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-100">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            {rating.toFixed(1)}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500 dark:text-slate-400">Languages</dt>
          <dd className="text-right font-medium text-slate-800 dark:text-slate-100">{languages.join(", ")}</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">Consultation</p>
        <p className="font-semibold text-slate-950 dark:text-white">₹{price}/session</p>
      </div>
      <Button asChild variant="outline" className="mt-5 w-full rounded-full">
        <Link href={`/astrologers/${id}`}>View Profile</Link>
      </Button>
    </article>
  );
}
