import {
  Star,
  Sparkles,
  MessageCircleHeart,
  LayoutGrid,
  ShieldAlert,
  ArrowRight,
  ThumbsUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Smart Sentiment Detection",
    body: "Personal thank-yous for 5 stars, flags for anything less.",
  },
  {
    icon: MessageCircleHeart,
    title: "Your Brand Voice",
    body: "The AI learns your personality and staff names.",
  },
  {
    icon: LayoutGrid,
    title: "One Dashboard, Every Platform",
    body: "Google Business, Yelp, and Facebook — unified.",
  },
  {
    icon: ShieldAlert,
    title: "Escalation Safeguards",
    body: "You stay in control of the sensitive stuff.",
  },
];

export const ReviewPilot = () => {
  const scrollToCTA = () =>
    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="our-software"
      data-testid="reviewpilot-section"
      className="relative bg-slate-50 py-24 md:py-32 border-b border-slate-200 overflow-hidden"
    >
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 bg-grid-slate opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className="grid md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-5">
            <div className="mono-overline text-blue-600">06 / Our Software</div>
            <h2
              className="font-display font-black text-5xl md:text-7xl tracking-[-0.04em] leading-[0.9] mt-3 text-slate-950"
              data-testid="reviewpilot-headline"
            >
              ReviewPilot.
            </h2>
            <p className="mt-4 mono-overline text-slate-500">
              by ServiceSpeak AI
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
              Your reviews deserve better than silence. ReviewPilot monitors
              your Google Business Profile, Yelp, and Facebook reviews in real
              time, then crafts thoughtful, on-brand responses in seconds, not
              hours.
            </p>
          </div>
        </div>

        {/* Bento grid: visual mock + features */}
        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          {/* LEFT — Mock review + AI reply */}
          <div
            data-testid="reviewpilot-visual"
            className="md:col-span-5 relative bg-slate-950 text-white p-7 md:p-9 shadow-[16px_16px_0_rgba(37,99,235,1)] flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 ss-pulse" />
                  <span className="relative rounded-full w-2.5 h-2.5 bg-emerald-500" />
                </span>
                <span className="mono-overline text-slate-400">
                  NEW REVIEW · GOOGLE
                </span>
              </div>
              <span className="mono-overline text-slate-500 text-[0.55rem]">
                JUST NOW
              </span>
            </div>

            {/* Customer review */}
            <div className="border-l-2 border-emerald-500 pl-4">
              <div className="flex items-center gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="#fbbf24"
                    strokeWidth={0}
                  />
                ))}
                <span className="ml-2 text-xs font-bold text-slate-400">
                  Maria K.
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                "Carlos came out same-day for our furnace and explained
                everything. Honest pricing, professional crew. Will use Apex
                again!"
              </p>
            </div>

            {/* Spacer */}
            <div className="my-6 flex items-center gap-3">
              <span className="mono-overline text-blue-400 text-[0.6rem]">
                AI · DRAFTING REPLY
              </span>
              <div className="flex-1 h-px bg-slate-800" />
              <span className="mono-overline text-slate-500 text-[0.6rem]">
                0.8s
              </span>
            </div>

            {/* AI reply */}
            <div className="border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 shrink-0 bg-blue-600 flex items-center justify-center">
                  <ThumbsUp
                    size={13}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex-1">
                  <div className="mono-overline text-blue-400 text-[0.55rem]">
                    YOUR BRAND · APPROVED
                  </div>
                </div>
              </div>
              <p className="text-sm text-white leading-relaxed font-medium">
                Maria — thank you for the kind words! We'll let Carlos know
                he made your day. Welcome to the Apex family — we'll be here
                whenever you need us. 🛠️
              </p>
            </div>

            {/* Action row */}
            <div className="mt-auto pt-6 flex items-center gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 text-xs transition-colors">
                APPROVE & POST
              </button>
              <button className="px-4 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-xs transition-colors">
                EDIT
              </button>
            </div>
          </div>

          {/* RIGHT — Feature grid */}
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-6 md:gap-7">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  data-testid={`reviewpilot-feature-${i}`}
                  className="group bg-white border border-slate-200 p-7 hover:border-blue-300 transition-all duration-300 hover:shadow-[0_18px_40px_rgba(37,99,235,0.08)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 bg-slate-950 flex items-center justify-center">
                      <Icon
                        size={20}
                        className="text-blue-400"
                        strokeWidth={2.25}
                      />
                    </div>
                    <span className="mono-overline text-slate-300 text-[0.6rem]">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg md:text-xl tracking-tight text-slate-950 leading-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-14 md:mt-16 bg-slate-950 text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="mono-overline text-blue-400">Try ReviewPilot</div>
            <div className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mt-2 leading-tight">
              Stop letting reviews go unanswered.
            </div>
            <div className="text-sm text-slate-400 font-medium mt-2">
              Full access · No credit card · Cancel anytime.
            </div>
          </div>
          <button
            onClick={scrollToCTA}
            data-testid="reviewpilot-cta-btn"
            className="group shrink-0 bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm md:text-base px-7 py-5 flex items-center gap-3 transition-all hover:-translate-y-0.5 shadow-[0_14px_40px_rgba(37,99,235,0.35)]"
          >
            Start your 14-day free trial
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewPilot;
