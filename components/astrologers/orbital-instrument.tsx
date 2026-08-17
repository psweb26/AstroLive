export function OrbitalInstrument() {
  return (
    <figure className="relative mx-auto aspect-[5/4] w-full max-w-[33rem] overflow-hidden border border-line bg-canvas-secondary p-6 sm:p-9">
      <div aria-hidden="true" className="absolute inset-[10%] rounded-full border border-line-strong" />
      <div aria-hidden="true" className="absolute inset-[24%] rounded-full border border-line" />
      <div aria-hidden="true" className="absolute inset-[38%] rounded-full border border-signal-secondary/60" />
      <span aria-hidden="true" className="absolute left-[18%] top-[25%] h-2 w-2 rounded-full bg-signal" />
      <span aria-hidden="true" className="absolute bottom-[23%] right-[21%] h-2 w-2 rounded-full border border-signal-secondary bg-canvas" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-line-strong bg-surface text-center shadow-[0_16px_35px_-28px_hsl(var(--foreground)/0.7)] sm:h-28 sm:w-28">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal" />
          <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-signal-secondary">The handoff</p>
        </div>
      </div>
      <figcaption className="absolute bottom-5 left-5 right-5 border-t border-line pt-3 text-xs leading-5 text-ink-secondary sm:bottom-7 sm:left-7 sm:right-7">
        A considered path from question to specialist.
      </figcaption>
    </figure>
  );
}
