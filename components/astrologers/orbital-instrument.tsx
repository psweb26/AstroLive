const zodiac = [
  ["♈", "Aries"],
  ["♉", "Taurus"],
  ["♊", "Gemini"],
  ["♋", "Cancer"],
  ["♌", "Leo"],
  ["♍", "Virgo"],
  ["♎", "Libra"],
  ["♏", "Scorpio"],
  ["♐", "Sagittarius"],
  ["♑", "Capricorn"],
  ["♒", "Aquarius"],
  ["♓", "Pisces"],
].map(([symbol, label], index) => {
  const angle = ((index * 30 - 90) * Math.PI) / 180;
  return {
    symbol,
    label,
    left: `${50 + Math.cos(angle) * 42}%`,
    top: `${50 + Math.sin(angle) * 42}%`,
  };
});

export function OrbitalInstrument() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[33rem] overflow-hidden rounded-[2rem] border border-[#d6bd76]/25 bg-[#05091e] p-4 shadow-[0_28px_70px_-40px_#000] sm:p-6">
      <span className="sr-only">A decorative celestial wheel with twelve slowly revolving zodiac markers, representing the path from a personal question to a human specialist.</span>
      <div aria-hidden="true" className="absolute inset-[1.1rem] rounded-[1.5rem] border border-[#d6bd76]/30 sm:inset-6" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(30,43,108,0.82),rgba(10,17,51,0.55)_45%,rgba(5,9,30,0)_74%)]" />

      <svg aria-hidden="true" viewBox="0 0 480 480" className="absolute inset-[1.6rem] h-[calc(100%_-_3.2rem)] w-[calc(100%_-_3.2rem)] text-[#d6bd76] sm:inset-9 sm:h-[calc(100%_-_4.5rem)] sm:w-[calc(100%_-_4.5rem)]">
        <circle cx="240" cy="240" r="191" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.7" />
        <circle cx="240" cy="240" r="146" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.48" />
        <circle cx="240" cy="240" r="104" fill="none" stroke="currentColor" strokeWidth="1.15" opacity="0.55" />
        <circle cx="240" cy="240" r="66" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
        <circle cx="240" cy="240" r="89" fill="none" stroke="currentColor" strokeDasharray="3 8" strokeWidth="1" opacity="0.42" />
        <path d="M240 49 405 144 405 336 240 431 75 336 75 144Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.38" />
        <path d="M76 240 404 240M240 50 240 430M98 157 382 323M382 157 98 323" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.28" />
        <path d="M76 177C142 169 171 107 240 94 308 107 339 169 404 177" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />
        <path d="M76 303C142 311 171 373 240 386 308 373 339 311 404 303" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />
      </svg>

      <div aria-hidden="true" className="kundli-orbit absolute inset-[7%]">
        {zodiac.map((sign) => (
          <div key={sign.label} className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a998df]/50 bg-[#070b24] p-1 shadow-[0_0_18px_rgba(126,87,218,0.42)]" style={{ left: sign.left, top: sign.top }} title={sign.label}>
            <div className="flex h-full w-full items-center justify-center rounded-md border border-[#8e69dc]/50 bg-[#5134a0] text-xl leading-none text-[#f4eaff] shadow-[inset_0_0_14px_rgba(192,162,255,0.42)]">
              {sign.symbol}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#d6bd76]/65 bg-[#0b1131]/90 text-center shadow-[0_0_0_1rem_rgba(11,17,49,0.35)] sm:h-36 sm:w-36">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-[#d6bd76]">The handoff</p>
        <span aria-hidden="true" className="mt-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#5b3aad] text-xl text-[#f4eaff]">✦</span>
        <p className="mt-2 text-sm font-semibold text-white">Specialist map</p>
        <p className="mt-1 max-w-[6.5rem] text-[0.62rem] leading-4 text-[#c4c9dd]">A pattern that leads toward conversation.</p>
      </div>

      <div aria-hidden="true" className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-[#d6bd76]/30 pt-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#c4c9dd] sm:bottom-7 sm:left-7 sm:right-7">
        <span>Celestial relationship map</span>
        <span>12 signs</span>
      </div>
    </div>
  );
}
