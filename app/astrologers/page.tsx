import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { OrbitalInstrument } from "@/components/astrologers/orbital-instrument";
import { Divider } from "@/components/ui/divider";
import { getAllAstrologers } from "@/src/core/recommendation/dataset";

const portraits = [
  "/images/astrologers/ananya-placeholder.png",
  "/images/astrologers/rohan-placeholder.png",
  "/images/astrologers/meera-placeholder.png",
  "/images/astrologers/arjun-placeholder.png",
];

export default function AstrologersPage() {
  const astrologers = getAllAstrologers().slice(0, 4);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <main className="page-frame product-page">
        <section aria-labelledby="astrologers-title" className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-16">
          <header className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">The human handoff</p>
            <h1 id="astrologers-title" className="mt-5 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-ink sm:text-6xl">
              Meet the right person to continue the conversation.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-ink-secondary sm:text-lg">AstroLive helps connect your question with a specialist who fits it.</p>
          </header>
          <OrbitalInstrument />
        </section>

        <Divider className="mt-16 sm:mt-20" />

        <section aria-labelledby="specialist-list-title" className="py-10 lg:py-14">
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Featured specialists</p>
              <h2 id="specialist-list-title" className="mt-3 font-display text-4xl leading-[0.98] tracking-[-0.035em] text-ink">Guidance from those who practice it.</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-ink-secondary">A limited introduction. Your insight determines the relevant next conversation.</p>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {astrologers.map((astrologer, index) => (
              <li key={astrologer.id}>
                <Link href={`/astrologers/${astrologer.id}`} className="group block h-full overflow-hidden border border-line bg-surface transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-signal-secondary hover:shadow-[0_18px_35px_-30px_hsl(var(--foreground)/0.7)] focus-visible:border-signal-secondary focus-visible:outline-none">
                  <figure className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
                    <Image src={portraits[index]} alt={`Placeholder portrait for ${astrologer.name}`} fill sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1279px) calc((100vw - 4.5rem) / 2), 18rem" className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
                    <figcaption className="sr-only">Visual placeholder portrait</figcaption>
                  </figure>
                  <div className="flex min-h-[13.5rem] flex-col p-5">
                    <h3 className="font-display text-3xl leading-none text-ink">{astrologer.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink-secondary">{astrologer.specializations.join(" · ")}</p>
                    <p className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">{astrologer.experience_years} years · {astrologer.languages.join(" · ")}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-signal-secondary underline-offset-4 group-hover:underline">View profile <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
