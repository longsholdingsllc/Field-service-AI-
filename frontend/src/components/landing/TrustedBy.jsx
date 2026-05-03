const COMPANIES = [
  "APEX HEATING & AIR",
  "FLOWTECH PLUMBERS",
  "VOLT ELECTRIC",
  "RAPID RESPONSE HVAC",
  "COPPER CREEK PLUMBING",
  "BRIGHTWORKS ELECTRICAL",
  "TRUE NORTH MECHANICAL",
  "IRONSIDE SERVICES",
  "MERIDIAN HEATING",
  "SPARKFIELD ELECTRIC",
];

export const TrustedBy = () => {
  const loop = [...COMPANIES, ...COMPANIES];
  return (
    <section
      data-testid="trusted-by-section"
      className="relative bg-slate-50 border-y border-slate-200 py-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-8">
        <div className="shrink-0 max-w-xs">
          <div className="mono-overline text-blue-600">02 / Social Proof</div>
          <h3 className="font-display font-extrabold text-2xl md:text-3xl mt-2 tracking-tight leading-tight text-slate-950">
            Trusted by 500+<br />local trades.
          </h3>
        </div>
        <div className="h-px w-full bg-slate-300 hidden lg:block" />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="flex marquee-track gap-14">
          {loop.map((name, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center gap-4 px-2"
              data-testid={`trusted-logo-${i}`}
            >
              <span className="w-2 h-2 bg-blue-600 rotate-45" />
              <span className="font-display font-black text-2xl md:text-3xl text-slate-400 tracking-tight whitespace-nowrap hover:text-slate-900 transition-colors">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
