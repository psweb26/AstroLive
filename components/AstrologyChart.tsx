"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const zodiacSigns = [
  { name: "Aries", symbol: "♈", element: "Fire", traits: "Bold • Driven", position: { left: "50%", top: "8%" }, insight: "Bold beginnings and clear momentum." },
  { name: "Taurus", symbol: "♉", element: "Earth", traits: "Grounded • Steady", position: { left: "71%", top: "14%" }, insight: "Grounded energy for lasting growth." },
  { name: "Gemini", symbol: "♊", element: "Air", traits: "Curious • Expressive", position: { left: "86%", top: "31%" }, insight: "Curiosity opens new possibilities." },
  { name: "Cancer", symbol: "♋", element: "Water", traits: "Intuitive • Caring", position: { left: "92%", top: "50%" }, insight: "Trust your intuition and inner compass." },
  { name: "Leo", symbol: "♌", element: "Fire", traits: "Warm • Courageous", position: { left: "86%", top: "69%" }, insight: "Let your natural light lead the way." },
  { name: "Virgo", symbol: "♍", element: "Earth", traits: "Practical • Analytical", position: { left: "71%", top: "86%" }, insight: "Small intentions create meaningful change." },
  { name: "Libra", symbol: "♎", element: "Air", traits: "Harmonious • Thoughtful", position: { left: "50%", top: "92%" }, insight: "Balance brings perspective to every choice." },
  { name: "Scorpio", symbol: "♏", element: "Water", traits: "Focused • Transformative", position: { left: "29%", top: "86%" }, insight: "Transformation begins with honest reflection." },
  { name: "Sagittarius", symbol: "♐", element: "Fire", traits: "Adventurous • Open", position: { left: "14%", top: "69%" }, insight: "Follow the path that broadens your world." },
  { name: "Capricorn", symbol: "♑", element: "Earth", traits: "Patient • Ambitious", position: { left: "8%", top: "50%" }, insight: "Patient focus turns ambition into progress." },
  { name: "Aquarius", symbol: "♒", element: "Air", traits: "Original • Visionary", position: { left: "14%", top: "31%" }, insight: "A fresh perspective reveals what is possible." },
  { name: "Pisces", symbol: "♓", element: "Water", traits: "Imaginative • Empathetic", position: { left: "29%", top: "14%" }, insight: "Make space for imagination and feeling." },
];

const stars = [[46, 76], [83, 112], [121, 42], [154, 82], [226, 47], [272, 74], [324, 112], [351, 181], [321, 255], [284, 324], [222, 356], [141, 340], [72, 288], [47, 218], [103, 186], [294, 187]];

const particles = [
  { left: "12%", top: "19%", size: 3, opacity: 0.7, delay: "-1s", float: "7s", twinkle: "4s" },
  { left: "25%", top: "72%", size: 2, opacity: 0.45, delay: "-3s", float: "9s", twinkle: "5s" },
  { left: "41%", top: "11%", size: 2, opacity: 0.65, delay: "-2s", float: "8s", twinkle: "3.6s" },
  { left: "63%", top: "26%", size: 3, opacity: 0.5, delay: "-4s", float: "10s", twinkle: "4.5s" },
  { left: "78%", top: "78%", size: 2, opacity: 0.7, delay: "-1.5s", float: "7.5s", twinkle: "5.2s" },
  { left: "89%", top: "42%", size: 2, opacity: 0.4, delay: "-5s", float: "11s", twinkle: "4.2s" },
  { left: "56%", top: "88%", size: 3, opacity: 0.45, delay: "-2.4s", float: "9.5s", twinkle: "3.8s" },
  { left: "8%", top: "56%", size: 2, opacity: 0.55, delay: "-4.5s", float: "8.5s", twinkle: "4.8s" },
];

export function AstrologyChart() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const selectedSign = zodiacSigns[selectedIndex];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setSelectedIndex((index) => (index + 1) % zodiacSigns.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const stage = stageRef.current;
    if (!stage || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const tiltY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const tiltX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
    stage.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    stage.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  }

  function resetTilt() {
    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <section
      className="wheel-card relative mx-auto w-full max-w-lg rounded-[2rem] bg-[#080b1a] p-4 shadow-2xl shadow-slate-950/20 sm:p-6"
      aria-label="Interactive zodiac wheel"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="nebula nebula-one" aria-hidden="true" />
      <div className="nebula nebula-two" aria-hidden="true" />
      <div className="outer-halo" aria-hidden="true" />
      <div ref={stageRef} className="wheel-stage relative aspect-square" aria-live="polite">
        <div className="relative h-full w-full rounded-[1.5rem] border border-amber-200/30">
          {particles.map((particle, index) => (
            <span
              key={index}
              className="particle"
              aria-hidden="true"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity,
                "--float-duration": particle.float,
                "--twinkle-duration": particle.twinkle,
                "--particle-delay": particle.delay,
              } as CSSProperties}
            />
          ))}
          <span className="shooting-star shooting-star-one" aria-hidden="true" />
          <span className="shooting-star shooting-star-two" aria-hidden="true" />

          <div className="wheel-rotation absolute inset-0">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="196" fill="#0d1430" />
              <circle cx="200" cy="200" r="160" fill="none" stroke="#e7c783" strokeOpacity="0.78" />
              <circle cx="200" cy="200" r="119" fill="none" stroke="#e7c783" strokeOpacity="0.38" />
              <circle cx="200" cy="200" r="73" fill="#111c42" stroke="#e7c783" strokeOpacity="0.58" />
              {Array.from({ length: 12 }, (_, index) => (
                <line key={index} x1="200" y1="40" x2="200" y2="81" stroke="#e7c783" strokeOpacity="0.36" transform={`rotate(${index * 30} 200 200)`} />
              ))}
              <path d="M46 218 103 186 141 340 222 356 284 324 321 255 294 187 324 112" fill="none" stroke="#8aa4d8" strokeOpacity="0.45" strokeWidth="1.2" />
              <path d="m83 112 71-30 72-35 46 27 79 38" fill="none" stroke="#8aa4d8" strokeOpacity="0.35" strokeWidth="1.2" />
              {stars.map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r={index % 3 === 0 ? 2.2 : 1.3} fill="#f9e7b0" />)}
              <circle cx="200" cy="200" r="95" fill="none" stroke="#879ecb" strokeOpacity="0.28" strokeDasharray="3 7" />
              <circle className="energy-pulse energy-pulse-one" cx="46" cy="218" r="3" fill="#f9e7b0" />
              <circle className="energy-pulse energy-pulse-two" cx="83" cy="112" r="3" fill="#f9e7b0" />
            </svg>

            {zodiacSigns.map((sign, index) => (
              <div key={sign.name} className="zodiac-position absolute -translate-x-1/2 -translate-y-1/2" style={sign.position}>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  onPointerEnter={() => setHoveredIndex(index)}
                  onPointerLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  aria-pressed={selectedIndex === index}
                  aria-label={`Show ${sign.name} reading`}
                  className={`zodiac-button flex h-10 w-10 items-center justify-center rounded-full border text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b1a] ${selectedIndex === index ? "border-amber-200 bg-amber-100 text-slate-950" : "border-amber-100/35 bg-slate-950/50 text-amber-100 hover:border-amber-100 hover:bg-slate-900"}`}
                  style={{ "--pulse-delay": `${index * -0.38}s` } as CSSProperties}
                >
                  <span className="zodiac-symbol" aria-hidden="true">{sign.symbol}</span>
                </button>
              </div>
            ))}
          </div>

          <div key={selectedSign.name} className="center-reading absolute left-1/2 top-1/2 flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center sm:w-40">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/70">Rising sign</span>
            <span className="mt-2 text-4xl text-amber-100" aria-hidden="true">{selectedSign.symbol}</span>
            <strong className="mt-1 text-lg font-semibold text-white">{selectedSign.name}</strong>
            <p className="mt-2 text-xs leading-5 text-slate-300">{selectedSign.insight}</p>
          </div>

          {hoveredIndex !== null && (
            <div className="sign-tooltip absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-100/25 bg-slate-950/90 px-3 py-2 text-center text-xs text-amber-50 shadow-lg shadow-slate-950/40" role="tooltip">
              <span className="font-semibold">{zodiacSigns[hoveredIndex].name}</span>
              <span className="mx-1.5 text-amber-100/60">•</span>
              <span>{zodiacSigns[hoveredIndex].element}</span>
              <span className="mx-1.5 text-amber-100/60">•</span>
              <span>{zodiacSigns[hoveredIndex].traits}</span>
            </div>
          )}
        </div>
      </div>
      <p className="px-2 pb-1 pt-4 text-center text-sm text-slate-300">Explore the wheel to uncover each sign&apos;s cosmic energy.</p>

      <style jsx>{`
        .wheel-stage {
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          transform: perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
          transition: transform 180ms ease-out;
          transform-style: preserve-3d;
        }

        .wheel-rotation {
          animation: wheel-rotate 32s linear infinite;
        }

        .wheel-card:hover .wheel-rotation,
        .wheel-card:hover .zodiac-symbol {
          animation-play-state: paused;
        }

        .zodiac-button {
          animation: sign-pulse 5s ease-in-out var(--pulse-delay) infinite;
          box-shadow: 0 0 16px rgba(248, 211, 135, 0.13);
          transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, border-color 180ms ease;
        }

        .zodiac-button:hover,
        .zodiac-button:focus-visible {
          transform: scale(1.12);
          box-shadow: 0 0 24px rgba(248, 211, 135, 0.5);
        }

        .zodiac-symbol {
          animation: counter-rotate 32s linear infinite;
        }

        .particle {
          position: absolute;
          z-index: 1;
          border-radius: 9999px;
          background: #fff3c4;
          box-shadow: 0 0 8px rgba(255, 230, 162, 0.75);
          animation: star-float var(--float-duration) ease-in-out var(--particle-delay) infinite alternate, star-twinkle var(--twinkle-duration) ease-in-out var(--particle-delay) infinite;
        }

        .shooting-star {
          position: absolute;
          z-index: 1;
          width: 56px;
          height: 1px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, #fff4cb);
          box-shadow: 0 0 10px rgba(255, 236, 177, 0.7);
          opacity: 0;
          transform: rotate(-28deg);
        }

        .shooting-star-one {
          left: 9%;
          top: 29%;
          animation: shooting-star 11s linear 2s infinite;
        }

        .shooting-star-two {
          right: 7%;
          top: 18%;
          animation: shooting-star 14s linear 7s infinite;
        }

        .energy-pulse {
          filter: drop-shadow(0 0 5px #f9e7b0);
          opacity: 0;
        }

        .energy-pulse-one {
          animation: energy-one 7s linear infinite;
        }

        .energy-pulse-two {
          animation: energy-two 9s linear 1.8s infinite;
        }

        .center-reading {
          animation: center-change 520ms ease-out;
        }

        .outer-halo {
          position: absolute;
          inset: 1.5rem;
          border: 1px solid rgba(248, 211, 135, 0.2);
          border-radius: 9999px;
          box-shadow: 0 0 32px rgba(129, 157, 225, 0.12), inset 0 0 26px rgba(248, 211, 135, 0.06);
          animation: halo-breathe 6s ease-in-out infinite;
          pointer-events: none;
        }

        .nebula {
          position: absolute;
          width: 56%;
          aspect-ratio: 1;
          border-radius: 9999px;
          filter: blur(34px);
          opacity: 0.24;
          pointer-events: none;
          animation: nebula-drift 14s ease-in-out infinite alternate;
        }

        .nebula-one {
          left: -18%;
          top: 8%;
          background: radial-gradient(circle, #5f4fb6 0%, transparent 68%);
        }

        .nebula-two {
          bottom: -16%;
          right: -14%;
          background: radial-gradient(circle, #236a8c 0%, transparent 68%);
          animation-delay: -6s;
        }

        @keyframes wheel-rotate {
          to { transform: rotate(360deg); }
        }

        @keyframes counter-rotate {
          to { transform: rotate(-360deg); }
        }

        @keyframes sign-pulse {
          0%, 100% { box-shadow: 0 0 14px rgba(248, 211, 135, 0.12); }
          50% { box-shadow: 0 0 22px rgba(248, 211, 135, 0.3); }
        }

        @keyframes star-float {
          to { transform: translate3d(4px, -7px, 0); }
        }

        @keyframes star-twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }

        @keyframes shooting-star {
          0%, 74% { opacity: 0; transform: translate3d(0, 0, 0) rotate(-28deg); }
          77% { opacity: 0.9; }
          84% { opacity: 0; transform: translate3d(124px, 78px, 0) rotate(-28deg); }
          100% { opacity: 0; transform: translate3d(124px, 78px, 0) rotate(-28deg); }
        }

        @keyframes energy-one {
          0% { opacity: 0; transform: translate(0, 0); }
          8% { opacity: 1; }
          78% { opacity: 1; transform: translate(278px, -106px); }
          86%, 100% { opacity: 0; transform: translate(278px, -106px); }
        }

        @keyframes energy-two {
          0% { opacity: 0; transform: translate(0, 0); }
          8% { opacity: 1; }
          78% { opacity: 1; transform: translate(268px, 69px); }
          86%, 100% { opacity: 0; transform: translate(268px, 69px); }
        }

        @keyframes center-change {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.94); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes halo-breathe {
          0%, 100% { opacity: 0.42; transform: scale(0.97); }
          50% { opacity: 0.82; transform: scale(1.02); }
        }

        @keyframes nebula-drift {
          to { opacity: 0.38; transform: translate3d(18px, -12px, 0) scale(1.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wheel-rotation,
          .zodiac-button,
          .zodiac-symbol,
          .particle,
          .shooting-star,
          .energy-pulse,
          .center-reading,
          .outer-halo,
          .nebula {
            animation: none;
          }

          .wheel-stage,
          .zodiac-button {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
