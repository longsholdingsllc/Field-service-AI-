import {
  CalendarCheck,
  MessageSquareText,
  UserRoundSearch,
  ArrowUpRight,
  Clock,
  Check,
} from "lucide-react";

export const Services = () => {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative bg-white py-24 md:py-32 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="md:col-span-5">
            <div className="mono-overline text-blue-600">03 / Core Services</div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-[-0.03em] leading-[0.95] mt-3 text-slate-950">
              Everything your<br />front desk does.<br />
              <span className="text-blue-600">Automated.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
              Three purpose-built AI capabilities trained on thousands of real
              service calls — designed to sound human, close bookings, and feed
              your CRM while you're on the truck.
            </p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-6 gap-6 md:gap-8">
          {/* Card 1 — Automated Booking (wide) */}
          <div
            data-testid="service-card-booking"
            className="md:col-span-4 group relative bg-white border border-slate-200 p-8 md:p-10 hover:border-blue-300 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)] overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-600 flex items-center justify-center">
                  <CalendarCheck
                    size={20}
                    className="text-white"
                    strokeWidth={2.25}
                  />
                </div>
                <span className="mono-overline text-slate-400">Service 01</span>
              </div>
              <ArrowUpRight
                size={22}
                className="text-slate-300 group-hover:text-blue-600 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all"
              />
            </div>

            <h3 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-slate-950 leading-tight">
              Automated Booking
            </h3>
            <p className="mt-4 text-slate-600 font-medium text-base leading-relaxed max-w-md">
              Reads your real-time calendar, dispatches the right technician,
              and confirms appointments with SMS — no human touch needed.
            </p>

            {/* Mock calendar preview */}
            <div className="mt-8 grid grid-cols-5 gap-2">
              {[
                { d: "MON", t: "9 AM", booked: true },
                { d: "TUE", t: "11 AM", booked: false },
                { d: "WED", t: "2 PM", booked: true, hot: true },
                { d: "THU", t: "4 PM", booked: true },
                { d: "FRI", t: "10 AM", booked: false },
              ].map((slot, i) => (
                <div
                  key={i}
                  className={`border p-3 flex flex-col gap-1 transition-all ${
                    slot.hot
                      ? "bg-blue-600 border-blue-600 text-white"
                      : slot.booked
                      ? "bg-slate-950 border-slate-950 text-white"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  <span
                    className={`mono-overline text-[0.55rem] ${
                      slot.hot
                        ? "text-blue-200"
                        : slot.booked
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    {slot.d}
                  </span>
                  <span className="font-display font-extrabold text-sm">
                    {slot.t}
                  </span>
                  <span className="text-[0.55rem] font-semibold mt-1">
                    {slot.booked ? "BOOKED" : "OPEN"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — FAQ Handling */}
          <div
            data-testid="service-card-faq"
            className="md:col-span-2 group relative bg-slate-950 text-white p-8 md:p-10 overflow-hidden hover:bg-slate-900 transition-all duration-500"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-11 h-11 bg-white flex items-center justify-center">
                <MessageSquareText
                  size={20}
                  className="text-slate-950"
                  strokeWidth={2.25}
                />
              </div>
              <ArrowUpRight
                size={22}
                className="text-slate-700 group-hover:text-blue-400 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all"
              />
            </div>
            <div className="mono-overline text-slate-500 mb-2">Service 02</div>
            <h3 className="font-display font-extrabold text-3xl tracking-tight leading-tight">
              FAQ Handling
            </h3>
            <p className="mt-3 text-slate-400 font-medium text-sm leading-relaxed">
              Trained on your pricing, service area, hours, and 200+ trade
              questions.
            </p>

            <div className="mt-8 space-y-2.5">
              {[
                "Do you service my area?",
                "What's your trip charge?",
                "Are you licensed & bonded?",
              ].map((q, i) => (
                <div
                  key={i}
                  className="border border-slate-800 p-2.5 text-xs font-medium text-slate-300 flex items-center gap-2"
                >
                  <Check
                    size={12}
                    className="text-blue-400 shrink-0"
                    strokeWidth={3}
                  />
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 — Lead Capture (full width) */}
          <div
            data-testid="service-card-lead"
            className="md:col-span-6 group relative bg-blue-50 border border-blue-200 p-8 md:p-12 overflow-hidden hover:border-blue-400 transition-all duration-500"
          >
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-slate-950 flex items-center justify-center">
                    <UserRoundSearch
                      size={20}
                      className="text-blue-400"
                      strokeWidth={2.25}
                    />
                  </div>
                  <span className="mono-overline text-blue-700">
                    Service 03
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-slate-950 leading-tight">
                  Lead Capture<br />
                  <span className="text-blue-600">that never sleeps.</span>
                </h3>
                <p className="mt-4 text-slate-700 font-medium max-w-md leading-relaxed">
                  Qualifies every caller, captures name, address, job type, and
                  urgency — then syncs instantly to ServiceTitan, Housecall Pro,
                  or your CRM.
                </p>

                <div className="mt-6 flex items-center gap-5 text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} strokeWidth={2.5} />
                    &lt; 0.8s response
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check size={14} strokeWidth={3} />
                    100% capture rate
                  </span>
                </div>
              </div>

              {/* Mock lead card */}
              <div className="md:col-span-6 bg-white border-2 border-slate-950 p-6 font-mono text-xs shadow-[0_12px_40px_rgba(37,99,235,0.12)]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <span className="mono-overline text-blue-600">
                    NEW LEAD · JUST NOW
                  </span>
                  <span className="mono-overline text-emerald-600">
                    ● QUALIFIED
                  </span>
                </div>
                <div className="space-y-2.5 text-slate-700 font-medium">
                  <Row k="name" v="Sarah Martinez" />
                  <Row k="phone" v="(555) 412-8890" />
                  <Row k="address" v="742 Elm St, Denver CO" />
                  <Row k="issue" v="Burst pipe — basement" />
                  <Row k="urgency" v="HIGH · Emergency" isHot />
                  <Row k="est_value" v="$1,840" />
                </div>
                <button className="mt-5 w-full bg-slate-950 hover:bg-blue-600 text-white font-bold py-3 text-xs transition-colors flex items-center justify-center gap-2">
                  DISPATCH NOW
                  <ArrowUpRight size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Row = ({ k, v, isHot }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-slate-400 uppercase tracking-wider text-[0.6rem]">
      {k}
    </span>
    <span
      className={`font-bold ${
        isHot ? "text-red-600" : "text-slate-950"
      } text-right`}
    >
      {v}
    </span>
  </div>
);

export default Services;
