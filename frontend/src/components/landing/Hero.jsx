import { ArrowRight, PhoneCall, Play } from "lucide-react";

export const Hero = () => {
  const scrollToCTA = () =>
    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative bg-white border-b border-slate-200"
    >
      <div className="absolute inset-0 bg-grid-slate opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-32">
        {/* Overline */}
        <div className="flex items-center gap-3 mb-10 fade-up">
          <span className="relative flex w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-blue-500 ss-pulse" />
            <span className="relative rounded-full w-2.5 h-2.5 bg-blue-600" />
          </span>
          <span className="mono-overline text-slate-600">
            SYS.STATUS · ONLINE · ANSWERING CALLS NOW
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT — Headline */}
          <div className="lg:col-span-7">
            <h1
              data-testid="hero-headline"
              className="font-display font-black text-[3rem] sm:text-[4.25rem] lg:text-[5.25rem] leading-[0.92] tracking-[-0.035em] text-slate-950 fade-up"
              style={{ animationDelay: "80ms" }}
            >
              Never miss<br />
              a lead <span className="inline-block">again.</span>
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600">
                  24/7 AI answering
                </span>
                <span className="absolute left-0 right-0 bottom-1 h-3 bg-blue-100 -z-0" />
              </span>
              <br />
              <span className="text-slate-950">for the trades.</span>
            </h1>

            <p
              className="mt-8 max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed font-medium fade-up"
              style={{ animationDelay: "180ms" }}
            >
              A human-sounding AI receptionist that answers every call, books
              jobs on your calendar, and captures leads — so plumbers, HVAC
              techs, and electricians stop losing $10k+ a month to voicemail.
            </p>

            <div
              className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 fade-up"
              style={{ animationDelay: "260ms" }}
            >
              <button
                onClick={scrollToCTA}
                data-testid="hero-primary-cta"
                className="group bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-5 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 shadow-[0_14px_40px_rgba(37,99,235,0.28)]"
              >
                Book your free demo
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <a
                href="#how-it-works"
                data-testid="hero-secondary-cta"
                className="group border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white font-bold text-base px-8 py-5 flex items-center justify-center gap-3 transition-all"
              >
                <Play size={16} strokeWidth={2.5} />
                See how it works
              </a>
            </div>

            <div
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500 fade-up"
              style={{ animationDelay: "340ms" }}
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                14-day pilot
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Live in 48 hours
              </span>
            </div>
          </div>

          {/* RIGHT — Phone Call visual */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative fade-up"
              style={{ animationDelay: "180ms" }}
            >
              {/* Blue accent block */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-blue-600 -z-10" />

              {/* Call card */}
              <div className="relative bg-slate-950 text-white p-8 border-2 border-slate-950">
                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex w-2.5 h-2.5">
                      <span className="absolute inset-0 rounded-full bg-red-500 ss-pulse" />
                      <span className="relative rounded-full w-2.5 h-2.5 bg-red-500" />
                    </span>
                    <span className="mono-overline text-slate-400">
                      LIVE CALL · 01:42
                    </span>
                  </div>
                  <PhoneCall size={14} className="text-blue-400" />
                </div>

                {/* Transcript bubbles */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 shrink-0 bg-slate-800 border border-slate-700 flex items-center justify-center mono-overline text-[0.55rem] text-slate-400">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="mono-overline text-slate-500 text-[0.55rem] mb-1">
                        CALLER · (312) 555‑0118
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        "Hey, my water heater's leaking everywhere. Can you get
                        someone out tonight?"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 shrink-0 bg-blue-600 flex items-center justify-center">
                      <Waveform />
                    </div>
                    <div className="flex-1">
                      <div className="mono-overline text-blue-400 text-[0.55rem] mb-1">
                        SERVICESPEAK AI
                      </div>
                      <p className="text-sm text-white leading-relaxed font-medium">
                        "Absolutely — I can dispatch a technician to 742 Elm St
                        at 7:30 PM tonight. Shall I book it and text you the
                        ETA?"
                      </p>
                    </div>
                  </div>

                  {/* Booking confirmed */}
                  <div className="mt-5 border border-blue-500/30 bg-blue-500/10 p-4 flex items-center justify-between">
                    <div>
                      <div className="mono-overline text-blue-300 text-[0.55rem]">
                        BOOKING CONFIRMED
                      </div>
                      <div className="text-sm font-bold text-white mt-1">
                        Today · 7:30 PM · Emergency
                      </div>
                    </div>
                    <div className="font-display font-black text-3xl text-blue-300">
                      ✓
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating metric chip */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 bg-white border-2 border-slate-950 p-5 shadow-[0_12px_40px_rgba(2,8,23,0.12)]">
                <div className="mono-overline text-slate-500">This month</div>
                <div className="font-display font-black text-3xl text-slate-950 leading-none mt-1">
                  +$18,420
                </div>
                <div className="text-xs text-slate-500 mt-1 font-semibold">
                  in recovered jobs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Waveform = () => (
  <div className="flex items-end gap-[2px] h-3.5">
    {[0, 120, 240, 80, 300].map((delay, i) => (
      <span
        key={i}
        className="w-[2px] bg-white wave-bar"
        style={{
          animationDelay: `${delay}ms`,
          height: `${30 + (i % 3) * 20}%`,
        }}
      />
    ))}
  </div>
);

export default Hero;
