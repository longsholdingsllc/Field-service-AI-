import { Phone, Brain, Calendar, BellRing } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Your number, our AI.",
    body: "We forward missed calls (or all calls) to ServiceSpeak. Existing numbers stay the same — zero tech change required.",
    icon: Phone,
  },
  {
    n: "02",
    title: "AI answers in 1 ring.",
    body: "Trained on your services, pricing, and service area. Sounds human. Handles interruptions, accents, and chaos on the line.",
    icon: Brain,
  },
  {
    n: "03",
    title: "Books straight to your calendar.",
    body: "Reads availability, dispatches the right tech by skill and location, and texts the customer a confirmation.",
    icon: Calendar,
  },
  {
    n: "04",
    title: "You get a ping. Job's booked.",
    body: "Real-time notifications to your phone or CRM. Listen to the call, see the lead, roll the truck. That's it.",
    icon: BellRing,
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="relative bg-slate-950 text-white py-24 md:py-36 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <div className="md:col-span-5">
            <div className="mono-overline text-blue-400">04 / Workflow</div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-[-0.03em] leading-[0.95] mt-3">
              Live in 48 hours.<br />
              <span className="text-blue-400">Zero dev work.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              Most trades are answering calls within two days of signing. Here's
              the entire onboarding process, end to end.
            </p>
          </div>
        </div>

        {/* Steps — asymmetric grid */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 md:left-[88px] top-0 bottom-0 w-px bg-slate-800"
            aria-hidden
          />

          <div className="space-y-14 md:space-y-20">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.n}
                  data-testid={`step-${step.n}`}
                  className="relative grid md:grid-cols-12 gap-6 md:gap-10 items-start"
                >
                  {/* Giant number */}
                  <div className="md:col-span-3 flex items-start gap-5 md:gap-6">
                    <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 shrink-0 bg-slate-950 border-2 border-blue-500 flex items-center justify-center">
                      <Icon
                        size={20}
                        strokeWidth={2.25}
                        className="text-blue-400"
                      />
                    </div>
                    <div className="font-display font-black text-7xl md:text-8xl leading-none text-slate-800 select-none">
                      {step.n}
                    </div>
                  </div>

                  <div className="md:col-span-9 md:pl-4">
                    <h3 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight leading-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 md:mt-4 text-base md:text-lg text-slate-400 font-medium max-w-2xl leading-relaxed">
                      {step.body}
                    </p>

                    {i < STEPS.length - 1 && (
                      <div className="mt-8 h-px bg-slate-800" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-slate-800 pt-10">
          <div className="mono-overline text-slate-500">Integrations</div>
          {[
            "ServiceTitan",
            "Housecall Pro",
            "Jobber",
            "Zapier",
            "Google Calendar",
            "Twilio",
          ].map((tool) => (
            <span
              key={tool}
              className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors cursor-default"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
