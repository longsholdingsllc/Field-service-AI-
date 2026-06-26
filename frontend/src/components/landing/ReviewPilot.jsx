import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Star,
  Sparkles,
  MessageCircleHeart,
  LayoutGrid,
  ShieldAlert,
  ArrowRight,
  ThumbsUp,
  AlertTriangle,
  Wand2,
  Copy,
  CheckCircle2,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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

const DEFAULT_REVIEW =
  "Carlos came out same-day for our furnace and explained everything. Honest pricing, professional crew. Will use Apex again!";

export const ReviewPilot = () => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState(DEFAULT_REVIEW);
  const [customerName, setCustomerName] = useState("Maria");
  const [businessName, setBusinessName] = useState("Apex Heating & Air");
  const [draft, setDraft] = useState({
    reply:
      "Maria — thank you for the kind words! We'll let Carlos know he made your day. Welcome to the Apex family — we'll be here whenever you need us.",
    sentiment: "positive",
    escalate: false,
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const scrollToCTA = () =>
    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });

  const generate = async () => {
    if (!reviewText.trim()) {
      toast.error("Paste a review first.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/reviewpilot/draft`, {
        review_text: reviewText.trim(),
        rating,
        customer_name: customerName.trim() || null,
        business_name: businessName.trim() || null,
      });
      setDraft(data);
      setHasGenerated(true);
    } catch (err) {
      const detail =
        err?.response?.data?.detail || "Couldn't draft a reply. Try again.";
      toast.error("Generation failed", { description: detail });
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async () => {
    try {
      await navigator.clipboard.writeText(draft.reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy.");
    }
  };

  const sentimentTag =
    draft.sentiment === "negative"
      ? { label: "NEGATIVE · ESCALATE", cls: "text-red-400" }
      : draft.sentiment === "mixed"
      ? { label: "MIXED · REVIEW BEFORE POSTING", cls: "text-amber-400" }
      : { label: "POSITIVE · READY TO POST", cls: "text-emerald-400" };

  return (
    <section
      id="our-software"
      data-testid="reviewpilot-section"
      className="relative bg-slate-50 py-24 md:py-32 border-b border-slate-200 overflow-hidden"
    >
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

        {/* Interactive demo */}
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 mb-14">
          {/* LEFT — Try it live */}
          <div
            data-testid="reviewpilot-tryit"
            className="md:col-span-5 relative bg-slate-950 text-white p-7 md:p-9 shadow-[16px_16px_0_rgba(37,99,235,1)] flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wand2 size={14} className="text-blue-400" />
                <span className="mono-overline text-blue-400">
                  TRY IT · LIVE AI
                </span>
              </div>
              <span className="mono-overline text-slate-500 text-[0.55rem]">
                CLAUDE HAIKU
              </span>
            </div>

            {/* Rating selector */}
            <div className="mb-4">
              <label className="mono-overline text-slate-500 block mb-2">
                Rating
              </label>
              <div
                className="flex items-center gap-1.5"
                data-testid="reviewpilot-rating"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    type="button"
                    data-testid={`star-${r}`}
                    className="transition-transform hover:scale-110"
                    aria-label={`${r} star${r > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={22}
                      fill={r <= rating ? "#fbbf24" : "transparent"}
                      stroke={r <= rating ? "#fbbf24" : "#475569"}
                      strokeWidth={2}
                    />
                  </button>
                ))}
                <span className="ml-2 mono-overline text-slate-500 text-[0.6rem]">
                  {rating}/5
                </span>
              </div>
            </div>

            {/* Name + business compact */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="mono-overline text-slate-500 block mb-1.5">
                  Customer
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  data-testid="reviewpilot-customer"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 outline-none px-3 py-2.5 text-sm font-medium text-white"
                  placeholder="Maria"
                />
              </div>
              <div>
                <label className="mono-overline text-slate-500 block mb-1.5">
                  Business
                </label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  data-testid="reviewpilot-business"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 outline-none px-3 py-2.5 text-sm font-medium text-white"
                  placeholder="Your business"
                />
              </div>
            </div>

            {/* Review textarea */}
            <div className="mb-5 flex-1 flex flex-col">
              <label className="mono-overline text-slate-500 block mb-1.5">
                Paste a review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                data-testid="reviewpilot-textarea"
                rows={5}
                maxLength={2000}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 outline-none px-3 py-2.5 text-sm font-medium text-slate-200 leading-relaxed resize-none"
                placeholder="Paste a Google / Yelp / Facebook review…"
              />
              <span className="mono-overline text-slate-600 text-[0.55rem] mt-1.5 text-right">
                {reviewText.length} / 2000
              </span>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              data-testid="reviewpilot-generate-btn"
              className="group w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Drafting reply…
                </>
              ) : (
                <>
                  <Wand2 size={16} strokeWidth={2.5} />
                  Generate AI reply
                </>
              )}
            </button>
          </div>

          {/* RIGHT — Generated reply + features */}
          <div className="md:col-span-7 flex flex-col gap-6 md:gap-7">
            {/* Generated reply card */}
            <div
              data-testid="reviewpilot-output"
              className={`relative bg-white border ${
                draft.escalate
                  ? "border-red-300"
                  : draft.sentiment === "mixed"
                  ? "border-amber-300"
                  : "border-blue-300"
              } p-6 md:p-7 transition-all duration-500`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {draft.escalate ? (
                    <AlertTriangle
                      size={14}
                      className={sentimentTag.cls}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <ThumbsUp
                      size={14}
                      className={sentimentTag.cls}
                      strokeWidth={2.5}
                    />
                  )}
                  <span className={`mono-overline ${sentimentTag.cls}`}>
                    {sentimentTag.label}
                  </span>
                </div>
                <button
                  onClick={copyReply}
                  data-testid="reviewpilot-copy-btn"
                  className="flex items-center gap-1.5 mono-overline text-slate-500 hover:text-slate-950 text-[0.6rem] transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      COPIED
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      COPY
                    </>
                  )}
                </button>
              </div>

              <div className="mono-overline text-slate-400 mb-2">
                Suggested reply
              </div>
              <p
                data-testid="reviewpilot-reply"
                className="font-display text-lg md:text-xl font-medium text-slate-950 leading-relaxed"
              >
                {draft.reply}
              </p>

              <div className="mt-5 pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
                <span className="mono-overline text-slate-400">
                  {hasGenerated ? "GENERATED · LIVE AI" : "DEFAULT · SAMPLE"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={draft.escalate}
                    className="px-4 py-2.5 text-xs font-bold border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    APPROVE &amp; POST
                  </button>
                  {draft.escalate && (
                    <button className="px-4 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors">
                      ESCALATE
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Compact feature row */}
            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    data-testid={`reviewpilot-feature-${i}`}
                    className="group bg-white border border-slate-200 p-5 hover:border-blue-300 transition-all flex items-start gap-4"
                  >
                    <div className="w-10 h-10 shrink-0 bg-slate-950 flex items-center justify-center">
                      <Icon
                        size={18}
                        className="text-blue-400"
                        strokeWidth={2.25}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-extrabold text-base tracking-tight text-slate-950 leading-tight">
                        {f.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed">
                        {f.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div className="bg-slate-950 text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
