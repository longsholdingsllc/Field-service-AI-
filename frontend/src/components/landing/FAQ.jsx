import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QUESTIONS = [
  {
    q: "Will my customers know it's AI?",
    a: "Most won't. ServiceSpeak's voice is natural, warm, and trade-fluent. If asked directly, we always disclose honestly — but 94% of callers in our data never ask, and surveys show satisfaction scores rival top human receptionists.",
  },
  {
    q: "How long does setup take?",
    a: "About 48 hours from signed contract to live. We onboard your services, pricing, service area, technicians, and calendar integration in a 60-minute kickoff call, then fine-tune over a 48-hour soft launch before going fully live.",
  },
  {
    q: "What happens on emergency or complex calls?",
    a: "ServiceSpeak detects urgency, after-hours emergencies, and edge cases, then seamlessly warm-transfers to your on-call tech — or books an emergency dispatch directly. You control escalation rules.",
  },
  {
    q: "Does it work with my CRM?",
    a: "Yes. Native integrations with ServiceTitan, Housecall Pro, Jobber, and FieldEdge. We also support Zapier, Google Calendar, and custom webhooks. Leads sync in real-time.",
  },
  {
    q: "How much does it cost?",
    a: "Plans start at $299/mo for solo operators and scale by call volume. Most shops see 5–15× ROI in the first 30 days. Every pilot includes a money-back guarantee if you aren't booking more jobs by week two.",
  },
  {
    q: "What if I want to listen to calls?",
    a: "Every call is recorded, transcribed, and tagged. You get a searchable dashboard of transcripts, bookings, and missed opportunities — plus weekly performance reports.",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative bg-slate-50 py-24 md:py-32 border-b border-slate-200"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <div className="mono-overline text-blue-600">06 / FAQ</div>
            <h2 className="font-display font-black text-4xl md:text-5xl tracking-[-0.03em] leading-[0.95] mt-3 text-slate-950">
              Questions<br />we hear daily.
            </h2>
            <p className="mt-6 text-slate-600 font-medium leading-relaxed">
              Can't find yours? Our onboarding team answers on the same call
              that would've gone to voicemail. How's that for irony.
            </p>
          </div>

          <div className="md:col-span-7">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              data-testid="faq-accordion"
            >
              {QUESTIONS.map((item, i) => (
                <AccordionItem
                  value={`item-${i}`}
                  key={i}
                  className="border-t border-slate-300 first:border-t-0 last:border-b"
                  data-testid={`faq-item-${i}`}
                >
                  <AccordionTrigger className="py-6 text-left font-display font-extrabold text-lg md:text-xl text-slate-950 hover:no-underline hover:text-blue-600 transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 font-medium leading-relaxed pb-7 text-base">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
