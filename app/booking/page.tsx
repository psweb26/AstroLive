import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { astrologers } from "@/data/astrologers";

const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-950";

type BookingPageProps = {
  searchParams: Promise<{ astrologer?: string | string[] }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { astrologer: astrologerParam } = await searchParams;
  const astrologerId = Array.isArray(astrologerParam) ? astrologerParam[0] : astrologerParam;
  const astrologer = astrologers.find((item) => item.id === astrologerId);

  if (!astrologer) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Astrologer not found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Please select an astrologer before booking a consultation.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="px-5 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Booking Consultation
          </h1>

          <div className="mt-6 rounded-2xl bg-violet-50 p-5 dark:bg-violet-950/50">
            <p className="text-lg font-semibold text-slate-950 dark:text-white">{astrologer.name}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{astrologer.specialization}</p>
            <p className="mt-3 text-sm font-medium text-violet-700 dark:text-violet-200">Consultation fee: ₹{astrologer.price}/session</p>
          </div>

          <form action={`/success?astrologer=${astrologer.id}`} className="mt-8 space-y-5">
            <div>
              <label htmlFor="full-name" className="text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
              <input id="full-name" name="fullName" type="text" required className={fieldClassName} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                <input id="email" name="email" type="email" required className={fieldClassName} />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</label>
                <input id="phone" name="phone" type="tel" required className={fieldClassName} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="preferred-date" className="text-sm font-medium text-slate-700 dark:text-slate-200">Preferred Date</label>
                <input id="preferred-date" name="preferredDate" type="date" required className={fieldClassName} />
              </div>
              <div>
                <label htmlFor="preferred-time" className="text-sm font-medium text-slate-700 dark:text-slate-200">Preferred Time</label>
                <input id="preferred-time" name="preferredTime" type="time" required className={fieldClassName} />
              </div>
            </div>

            <div>
              <label htmlFor="consultation-type" className="text-sm font-medium text-slate-700 dark:text-slate-200">Consultation Type</label>
              <select id="consultation-type" name="consultationType" required defaultValue="" className={fieldClassName}>
                <option value="" disabled>Select a consultation type</option>
                <option value="voice-call">Voice Call</option>
                <option value="video-call">Video Call</option>
                <option value="chat">Chat</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-200">Message / Concern</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-950"
              />
            </div>

            <Button type="submit" className="w-full rounded-full">Confirm Booking</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
