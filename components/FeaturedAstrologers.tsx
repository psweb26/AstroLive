import { AstrologerCard } from "@/components/AstrologerCard";
import { astrologers } from "@/data/astrologers";

export function FeaturedAstrologers() {
  return (
    <section id="astrologers" className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Featured Astrologers
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
            Find trusted experts for personalized guidance.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {astrologers.map((astrologer) => (
            <AstrologerCard key={astrologer.name} {...astrologer} />
          ))}
        </div>
      </div>
    </section>
  );
}
