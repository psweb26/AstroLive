import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const journey = [
  {
    step: "01",
    title: "Ask",
    description: "Name the question that is genuinely present for you.",
  },
  {
    step: "02",
    title: "Understand",
    description: "See a structured interpretation and the reasoning behind it.",
  },
  {
    step: "03",
    title: "Find",
    description: "Know when a specialist could add something meaningful — and why.",
  },
  {
    step: "04",
    title: "Prepare",
    description: "Take a clear brief into the conversation, rather than starting from zero.",
  },
];

export function HomepageExperience() {
  return (
    <div className="overflow-x-clip">
      <section aria-labelledby="home-hero-title" className="border-b border-line">
        <div className="page-frame py-8 sm:py-10 lg:py-14">
          <p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            A considered way to begin
          </p>

          <div className="relative mt-7 lg:min-h-[43rem]">
            <div className="relative z-10 max-w-2xl bg-canvas pb-7 sm:pb-9 lg:absolute lg:bottom-14 lg:left-0 lg:w-[55%] lg:max-w-[45rem] lg:p-10">
              <p className="text-sm font-medium text-signal-secondary">Personal insight, made more legible.</p>
              <h1 id="home-hero-title" className="mt-4 max-w-xl font-display text-5xl font-medium leading-[0.92] tracking-[-0.045em] text-ink sm:text-6xl lg:text-7xl">
                Begin with the question beneath the question.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-ink-secondary sm:text-lg">
                AstroLive helps you put a personal concern into words, understand what it may be asking for, and find the right human conversation when one would help.
              </p>
              <Button asChild variant="signal" className="mt-7 gap-2">
                <Link href="/understanding-you">
                  Begin with your question <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <figure className="relative min-h-[15rem] overflow-hidden border border-line bg-canvas-secondary sm:min-h-[22rem] lg:ml-auto lg:min-h-[40rem] lg:w-[82%]">
              <Image
                src="/images/astrolive-observatory-hero.png"
                alt="An astrologer sharing a celestial chart with a young person in an observatory courtyard."
                fill
                priority
                sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 3rem), 78vw"
                className="object-cover object-center"
              />
              <div aria-hidden="true" className="pointer-events-none absolute right-5 top-5 hidden aspect-square w-36 rounded-full border border-white/35 lg:block">
                <span className="absolute inset-[22%] rounded-full border border-white/35" />
                <span className="absolute left-1/2 top-[-0.2rem] h-2 w-2 -translate-x-1/2 rounded-full bg-signal" />
              </div>
              <figcaption className="absolute bottom-0 right-0 max-w-[17rem] border-l border-t border-white/30 bg-[#102421]/85 px-4 py-3 text-xs leading-5 text-white/85 backdrop-blur-sm sm:max-w-xs sm:px-5">
                Celestial knowledge has always been held in human observation and conversation.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section aria-labelledby="question-title" className="page-frame py-20 sm:py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-secondary">01 — The question</p>
          </div>
          <div className="lg:col-span-9">
            <div className="max-w-3xl">
              <h2 id="question-title" className="font-display text-4xl leading-[0.98] tracking-[-0.035em] text-ink sm:text-5xl">
                Start where life is already asking for your attention.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-secondary sm:text-lg">
                A date or a chart is never the whole story. AstroLive begins with the concern you can name in your own language, before it attempts any interpretation.
              </p>
            </div>

            <div className="mt-12 border-y border-line py-7 sm:mt-14 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-8 sm:py-9">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted">The first step</p>
                <p className="mt-2 text-sm leading-6 text-ink-secondary">A visual representation of the real concern prompt.</p>
              </div>
              <div className="mt-6 border-l-2 border-signal pl-5 sm:mt-0">
                <p className="font-display text-2xl italic leading-snug text-ink sm:text-3xl">
                  “I am at a crossroads, and I want to understand what I need before I decide.”
                </p>
                <p className="mt-5 text-sm leading-6 text-ink-muted">There is no prescribed way to phrase what matters to you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="insight-title" className="border-y border-line bg-canvas-secondary">
        <div className="page-frame grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-32">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-secondary">02 — The insight</p>
            <h2 id="insight-title" className="mt-4 font-display text-4xl leading-[0.98] tracking-[-0.035em] text-ink sm:text-5xl">
              An interpretation should show how it arrived.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-secondary sm:text-lg">
              AstroLive turns a concern into a structured reading of its category, primary need, and supporting reasons — so the next step feels grounded, not handed down.
            </p>
          </div>

          <div className="border-y border-line-strong lg:col-span-7 lg:border">
            <div className="border-b border-line px-5 py-4 sm:px-7">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted">Illustrative interpretation structure</p>
            </div>
            <dl className="divide-y divide-line">
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-7">
                <dt className="text-sm font-semibold text-ink">What you said</dt>
                <dd className="text-sm leading-6 text-ink-secondary">The concern, kept in the language you used to describe it.</dd>
              </div>
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-7">
                <dt className="text-sm font-semibold text-ink">What emerged</dt>
                <dd className="text-sm leading-6 text-ink-secondary">A clear category and the primary need that appears to be asking for attention.</dd>
              </div>
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-7">
                <dt className="text-sm font-semibold text-ink">Why it matters</dt>
                <dd className="text-sm leading-6 text-ink-secondary">The reasons and uncertainty are made visible, so you can judge the interpretation for yourself.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="human-title" className="page-frame py-20 sm:py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex items-end lg:col-span-7">
            <h2 id="human-title" className="max-w-3xl font-display text-5xl leading-[0.92] tracking-[-0.045em] text-ink sm:text-6xl">
              Understanding comes first. The right conversation comes second.
            </h2>
          </div>
          <div className="border-t border-line pt-6 lg:col-span-5 lg:pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-secondary">03 — Human connection</p>
            <p className="mt-4 text-base leading-7 text-ink-secondary">
              When a human perspective would be useful, AstroLive makes the handoff more considered: a relevant specialist, the reason for the match, and a useful starting brief for the session.
            </p>
            <div className="mt-8 border-l border-line-strong pl-5">
              <p className="text-sm font-semibold text-ink">A conversation with context</p>
              <p className="mt-2 text-sm leading-6 text-ink-secondary">The consultation begins with what has already been understood, not with a blank slate.</p>
            </div>
            <Link href="/astrologers" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-signal-secondary underline-offset-4 hover:underline">
              Meet the astrologers <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="trust-title" className="border-y border-line bg-surface">
        <div className="page-frame py-20 sm:py-24 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-secondary lg:col-span-3">Why trust it</p>
            <div className="lg:col-span-9">
              <h2 id="trust-title" className="max-w-4xl font-display text-4xl leading-[0.98] tracking-[-0.035em] text-ink sm:text-5xl">
                Credibility means being clear about what the system can explain — and what belongs in a human conversation.
              </h2>
              <div className="mt-12 grid gap-8 border-t border-line pt-7 sm:grid-cols-3 sm:gap-10">
                <div>
                  <p className="text-sm font-semibold text-ink">Reasoning stays visible</p>
                  <p className="mt-2 text-sm leading-6 text-ink-secondary">Interpretations are accompanied by the context that supports them.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Uncertainty has a place</p>
                  <p className="mt-2 text-sm leading-6 text-ink-secondary">Confidence is part of the experience, not something hidden behind a conclusion.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Human guidance stays human</p>
                  <p className="mt-2 text-sm leading-6 text-ink-secondary">A recommendation is a transparent reason to speak, never a substitute for the conversation itself.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-title" className="page-frame py-20 sm:py-24 lg:py-32">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-secondary">The AstroLive journey</p>
            <h2 id="journey-title" className="mt-3 font-display text-4xl leading-none tracking-[-0.035em] text-ink sm:text-5xl">One question, carried forward.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-ink-secondary">Each step gives the next one more context, so your time is spent on the question that matters.</p>
        </div>

        <ol className="mt-8 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((item) => (
            <li key={item.step} className="relative border-t border-line-strong pt-5">
              <span className="absolute -top-1.5 left-0 h-3 w-3 rounded-full border border-signal-secondary bg-canvas" aria-hidden="true" />
              <p className="text-xs font-semibold tracking-[0.15em] text-ink-muted">{item.step}</p>
              <h3 className="mt-3 font-display text-3xl leading-none text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-secondary">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="final-cta-title" className="border-t border-line bg-canvas-secondary">
        <div className="page-frame py-20 text-center sm:py-24 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-secondary">Your next starting point</p>
          <h2 id="final-cta-title" className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-[0.94] tracking-[-0.045em] text-ink sm:text-6xl">
            Bring the question that has been staying with you.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ink-secondary">We will start by understanding it, together.</p>
          <Button asChild variant="signal" className="mt-8 gap-2">
            <Link href="/understanding-you">
              Begin with your question <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
