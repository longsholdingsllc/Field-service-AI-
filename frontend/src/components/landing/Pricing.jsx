import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    price: 299,
    blurb: "For solo operators and 1‑truck shops just starting out.",
    cta: "Start free pilot",
    features: [
      "Up to 200 inbound calls / mo",
      "1 AI voice persona",
      "After-hours coverage",
      "SMS confirmations",
      "Google Calendar sync",
      "Email support",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Sparkles,
    price: 599,
    blurb: "Most picked. For 2–6 truck shops scaling lead capture.",
    cta: "Book a demo",
    features: [
      "Up to 1,000 calls / mo",
      "Custom voice & dispatch logic",
      "ServiceTitan / Housecall Pro / Jobber sync",
      "Real-time CRM lead push",
      "Skill-based dispatch routing",
      "Weekly performance reports",
      "Priority chat support",
    ],
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    id: "scale",
    name: "Scale",
    icon: Crown,
    price: 1299,
    blurb: "For multi-location shops and franchise operators.",
    cta: "Talk to sales",
    features: [
      "Unlimited calls",
      "Multi-location call routing",
      "Bilingual AI (English + Spanish)",
      "Custom integrations & webhooks",
      "White-label voice & branding",
      "Dedicated success manager",
      "24/7 phone & SLA support",
    ],
    highlight: false,
  },
];

export const Pricing = () => {
  const scrollToCTA = () =>
    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="relative bg-white py-24 md:py-32 border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-5">
            <div className="mono-overline text-blue-600">06 / Pricing</div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-[-0.03em] leading-[0.95] mt-3 text-slate-950">
              One price.<br />
              No per-minute<br />
              <span className="text-blue-600">surprises.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
              Flat monthly billing. Every plan includes setup, training on your
              services, and a 14-day money-back pilot. Cancel any time, no
              contracts.
            </p>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const dark = tier.highlight;
            return (
              <div
                key={tier.id}
                data-testid={`pricing-tier-${tier.id}`}
                className={`group relative flex flex-col p-8 md:p-10 transition-all duration-500 ${
                  dark
                    ? "order-first md:order-none bg-slate-950 text-white md:-translate-y-4 md:scale-[1.02] shadow-[0_30px_80px_rgba(2,8,23,0.25)]"
                    : "bg-white text-slate-950 border border-slate-200 hover:border-blue-300 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)]"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-8 bg-blue-500 text-white mono-overline px-3 py-1.5 text-[0.6rem]">
                    {tier.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-11 h-11 flex items-center justify-center ${
                      dark ? "bg-blue-500" : "bg-slate-950"
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={2.25}
                      className={dark ? "text-white" : "text-blue-400"}
                    />
                  </div>
                  <span
                    className={`mono-overline ${
                      dark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Plan · {tier.id.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-3xl tracking-tight">
                  {tier.name}
                </h3>
                <p
                  className={`mt-2 text-sm font-medium leading-relaxed ${
                    dark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {tier.blurb}
                </p>

                {/* Price */}
                <div className="mt-7 flex items-baseline gap-1.5">
                  <span className="font-display font-black text-5xl md:text-6xl tracking-[-0.04em]">
                    ${tier.price}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      dark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    /mo
                  </span>
                </div>

                {/* Divider */}
                <div
                  className={`mt-7 h-px w-full ${
                    dark ? "bg-slate-800" : "bg-slate-200"
                  }`}
                />

                {/* Features */}
                <ul className="mt-7 space-y-3 flex-1">
                  {tier.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm font-medium leading-snug"
                    >
                      <Check
                        size={16}
                        strokeWidth={3}
                        className={`mt-0.5 shrink-0 ${
                          dark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <span
                        className={dark ? "text-slate-200" : "text-slate-700"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={scrollToCTA}
                  data-testid={`pricing-cta-${tier.id}`}
                  className={`mt-9 group/btn font-bold py-4 px-6 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${
                    dark
                      ? "bg-blue-500 hover:bg-blue-400 text-white"
                      : "border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 font-semibold">
          <span className="flex items-center gap-2">
            <Check size={14} strokeWidth={3} className="text-emerald-500" />
            14-day money-back pilot
          </span>
          <span className="flex items-center gap-2">
            <Check size={14} strokeWidth={3} className="text-emerald-500" />
            No setup fees
          </span>
          <span className="flex items-center gap-2">
            <Check size={14} strokeWidth={3} className="text-emerald-500" />
            Cancel any time
          </span>
          <span className="flex items-center gap-2">
            <Check size={14} strokeWidth={3} className="text-emerald-500" />
            US-based onboarding team
          </span>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
