import Link from "next/link";
import { CircleCheck } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { astrologers } from "@/data/astrologers";

type SuccessPageProps = {
  searchParams: Promise<{ astrologer?: string | string[] }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { astrologer: astrologerParam } = await searchParams;
  const astrologerId = Array.isArray(astrologerParam) ? astrologerParam[0] : astrologerParam;
  const astrologer = astrologers.find((item) => item.id === astrologerId);
  const astrologerName = astrologer?.name ?? "Ananya Sharma";
  const bookingDetails = [
    ["Booking ID", "AL-2026-1042"],
    ["Astrologer", astrologerName],
    ["Consultation Type", "Video Call"],
    ["Date", "August 12, 2026"],
    ["Time", "4:00 PM"],
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] items-center px-5 py-12 sm:px-6">
        <section className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <CircleCheck className="mx-auto h-14 w-14 text-violet-600 dark:text-violet-300" aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Booking Confirmed
          </h1>
          <p className="mx-auto mt-4 max-w-sm leading-7 text-slate-600 dark:text-slate-300">
            Your consultation request has been received. Our astrologer will contact you shortly.
          </p>

          <dl className="mt-8 rounded-2xl bg-violet-50 p-5 text-left dark:bg-violet-950/50">
            {bookingDetails.map(([label, value], index) => (
              <div
                key={label}
                className={`flex items-center justify-between gap-4 py-3 text-sm ${index > 0 ? "border-t border-violet-100 dark:border-violet-900" : ""}`}
              >
                <dt className="text-slate-600 dark:text-slate-300">{label}</dt>
                <dd className="text-right font-medium text-slate-950 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full px-6">
              <Link href="/">Return Home</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/astrologers">Browse Astrologers</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
