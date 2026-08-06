import { CalendarDays, MessageCircle, Search } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose an Astrologer",
    description: "Browse verified astrologers based on expertise and experience.",
    icon: Search,
  },
  {
    number: "02",
    title: "Book a Consultation",
    description: "Select a convenient date and time for your session.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Get Personalized Guidance",
    description: "Connect with the astrologer and receive tailored advice.",
    icon: MessageCircle,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            How It Works
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
            Get started in three simple steps.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <article
              key={number}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wider text-violet-600 dark:text-violet-300">{number}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
