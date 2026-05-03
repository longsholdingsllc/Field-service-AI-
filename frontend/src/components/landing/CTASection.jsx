import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ArrowRight, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { getPricingVariant } from "@/lib/abVariant";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CTASection = () => {
  const [form, setForm] = useState({
    name: "",
    business: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill out name, phone, and email.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/leads`, {
        name: form.name,
        business: form.business || null,
        phone: form.phone,
        email: form.email,
        source: "landing-cta",
        variant: getPricingVariant(),
      });
      toast.success("Demo booked. We'll call you within 1 business hour.", {
        description: `Thanks ${form.name} — look out for a call from (415) 555-SPEAK.`,
      });
      setForm({ name: "", business: "", phone: "", email: "" });
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        "Couldn't submit your request. Please try again.";
      toast.error("Submission failed", { description: detail });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="cta"
      data-testid="cta-section"
      className="relative bg-blue-600 text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white opacity-30 pointer-events-none" />

      {/* Giant background text */}
      <div
        aria-hidden
        className="absolute -bottom-10 md:-bottom-16 left-0 right-0 text-center font-display font-black text-[20vw] leading-none tracking-[-0.05em] text-white/10 select-none pointer-events-none whitespace-nowrap"
      >
        NEVER MISS A LEAD
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT */}
          <div className="lg:col-span-6">
            <div className="mono-overline text-blue-200">07 / Get Started</div>
            <h2 className="font-display font-black text-4xl md:text-6xl lg:text-7xl tracking-[-0.035em] leading-[0.92] mt-3">
              Book your free<br />
              <span className="text-white">15-min</span> demo.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-blue-100 font-medium leading-relaxed max-w-lg">
              See exactly how ServiceSpeak handles your worst call scenarios —
              live, on a real phone call with our team. No slides. No pitch.
            </p>

            <div className="mt-10 space-y-4">
              <Perk
                icon={PhoneCall}
                text="Listen to a live AI handle your callers' toughest questions"
              />
              <Perk
                icon={ShieldCheck}
                text="14-day pilot · money-back if you don't book more jobs"
              />
              <Perk
                icon={Sparkles}
                text="48-hour setup with your pricing, services, and calendar"
              />
            </div>
          </div>

          {/* RIGHT — Form card */}
          <div className="lg:col-span-6 lg:pl-8">
            <form
              onSubmit={handleSubmit}
              data-testid="demo-form"
              className="relative bg-white text-slate-950 p-7 md:p-10 border-2 border-slate-950 shadow-[16px_16px_0_rgba(2,8,23,1)]"
            >
              <div className="mono-overline text-blue-600 mb-4">
                Claim your demo slot
              </div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight leading-tight">
                Tell us about your business.
              </h3>

              <div className="mt-7 space-y-5">
                <Field
                  label="Your name"
                  name="name"
                  placeholder="Alex Rivera"
                  value={form.name}
                  onChange={handleChange}
                  testId="input-name"
                  required
                />
                <Field
                  label="Business name"
                  name="business"
                  placeholder="Rivera Plumbing Co."
                  value={form.business}
                  onChange={handleChange}
                  testId="input-business"
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 555-0123"
                    value={form.phone}
                    onChange={handleChange}
                    testId="input-phone"
                    required
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="alex@riveraplumb.com"
                    value={form.email}
                    onChange={handleChange}
                    testId="input-email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                data-testid="submit-demo-btn"
                className="mt-8 group w-full bg-slate-950 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-5 px-6 flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 text-base"
              >
                {submitting ? "Sending…" : "Book my free demo"}
                {!submitting && (
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>

              <p className="mt-4 text-xs text-slate-500 font-semibold text-center">
                By submitting, you agree to our Terms. We'll never share your
                info.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Perk = ({ icon: Icon, text }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 shrink-0 bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
      <Icon size={18} strokeWidth={2.25} className="text-white" />
    </div>
    <p className="text-base md:text-lg text-white font-semibold leading-snug pt-1.5">
      {text}
    </p>
  </div>
);

const Field = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  testId,
  required,
}) => (
  <div>
    <label
      htmlFor={name}
      className="mono-overline text-slate-500 block mb-2"
    >
      {label} {required && <span className="text-blue-600">*</span>}
    </label>
    <Input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      data-testid={testId}
      className="h-12 rounded-none border-slate-300 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2 font-medium text-base"
    />
  </div>
);

export default CTASection;
