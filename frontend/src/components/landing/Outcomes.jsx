import { Quote } from "lucide-react";

const METRICS = [
  { k: "Missed calls", v: "0", sub: "after switching" },
  { k: "Lead-to-book rate", v: "68%", sub: "industry avg: 22%" },
  { k: "Avg. revenue lift", v: "3.2×", sub: "within 90 days" },
  { k: "Avg. speed-to-answer", v: "1.1s", sub: "faster than any human" },
];

const TESTIMONIALS = [
  {
    quote:
      "We were losing 40% of after-hours calls. ServiceSpeak booked $22,000 in emergency jobs in the first month. Paid for itself twelve times over.",
    name: "Marcus Chen",
    role: "Owner, Apex Heating & Air",
    location: "Phoenix, AZ",
    img: "https://images.unsplash.com/photo-1748442001865-5583ec02ae22?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwaHZhYyUyMHdvcmtlcnxlbnwwfHx8fDE3Nzc3OTkyMTR8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    quote:
      "Customers keep telling me they love how fast we answer. They have no idea it's AI. Booking rate is up 60% — I hired two more techs because of it.",
    name: "Dave Ricci",
    role: "Lead Plumber, FlowTech Plumbers",
    location: "Denver, CO",
    img: "https://images.unsplash.com/photo-1732395805034-e0bf859665e5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxwbHVtYmVyJTIwaHZhYyUyMHdvcmtlcnxlbnwwfHx8fDE3Nzc3OTkyMTR8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    quote:
      "I run a 4-truck shop. Couldn't afford a full-time dispatcher. ServiceSpeak does the job for a fraction — nights, weekends, holidays. Game over.",
    name: "Linda Okafor",
    role: "Founder, Volt Electric",
    location: "Austin, TX",
    img: "https://images.unsplash.com/photo-1676210133055-eab6ef033ce3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxwbHVtYmVyJTIwaHZhYyUyMHdvcmtlcnxlbnwwfHx8fDE3Nzc3OTkyMTR8MA&ixlib=rb-4.1.0&q=85",
  },
];

export const Outcomes = () => {
  return (
    <section
      id="outcomes"
      data-testid="outcomes-section"
      className="relative bg-white py-24 md:py-32 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-5">
            <div className="mono-overline text-blue-600">05 / Outcomes</div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-[-0.03em] leading-[0.95] mt-3 text-slate-950">
              Numbers don't<br />lie.<br />
              <span className="text-blue-600">Neither do we.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
              Real performance data from 500+ trades running ServiceSpeak
              across the United States and Canada. Average of 12 months of data.
            </p>
          </div>
        </div>

        {/* Massive metrics strip */}
        <div
          data-testid="metrics-strip"
          className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-b-2 border-slate-950 divide-x divide-slate-200 md:divide-slate-200"
        >
          {METRICS.map((m, i) => (
            <div
              key={i}
              className={`py-10 md:py-14 px-5 md:px-8 ${
                i < 2 ? "border-b-2 md:border-b-0 border-slate-200" : ""
              }`}
              data-testid={`metric-${i}`}
            >
              <div className="mono-overline text-slate-400">{m.k}</div>
              <div className="font-display font-black text-5xl md:text-7xl tracking-[-0.04em] mt-2 text-slate-950 leading-none">
                {m.v}
              </div>
              <div className="text-xs md:text-sm text-slate-500 mt-3 font-semibold">
                {m.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              data-testid={`testimonial-${i}`}
              className="group bg-white border border-slate-200 p-7 md:p-8 flex flex-col hover:border-blue-300 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)]"
            >
              <Quote
                size={28}
                className="text-blue-600 mb-5"
                strokeWidth={2.5}
              />
              <blockquote className="text-base md:text-lg text-slate-800 font-medium leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-7 pt-5 border-t border-slate-200 flex items-center gap-4">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 transition-all"
                />
                <div>
                  <div className="font-display font-extrabold text-sm text-slate-950">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    {t.role}
                  </div>
                  <div className="mono-overline text-blue-600 text-[0.55rem] mt-1">
                    {t.location}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Outcomes;
