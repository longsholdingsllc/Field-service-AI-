import { Waves, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-white border-t-4 border-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-slate-950 flex items-center justify-center">
                <Waves className="text-blue-400" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-extrabold text-base tracking-tight">
                  ServiceSpeak
                </div>
                <div className="mono-overline text-blue-600 text-[0.55rem]">
                  AI · RECEPTIONIST
                </div>
              </div>
            </div>
            <p className="text-slate-600 font-medium max-w-sm leading-relaxed">
              24/7 AI receptionists built for the trades. Answer every call.
              Book every job. Keep every lead.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <div className="mono-overline text-slate-500 mb-4">Product</div>
            <ul className="space-y-2.5">
              {["Services", "How it works", "Pricing", "Integrations"].map(
                (l) => (
                  <li key={l}>
                    <a
                      href="#services"
                      className="text-sm font-semibold text-slate-950 hover:text-blue-600 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="mono-overline text-slate-500 mb-4">Company</div>
            <ul className="space-y-2.5">
              {["About", "Blog", "Careers", "Partners"].map((l) => (
                <li key={l}>
                  <a
                    href="#top"
                    className="text-sm font-semibold text-slate-950 hover:text-blue-600 transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="mono-overline text-slate-500 mb-4">Contact</div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm font-semibold text-slate-700">
                <Mail size={14} className="mt-1 shrink-0 text-blue-600" />
                hello@servicespeak.ai
              </li>
              <li className="flex items-start gap-2.5 text-sm font-semibold text-slate-700">
                <Phone size={14} className="mt-1 shrink-0 text-blue-600" />
                (415) 555-SPEAK
              </li>
              <li className="flex items-start gap-2.5 text-sm font-semibold text-slate-700">
                <MapPin size={14} className="mt-1 shrink-0 text-blue-600" />
                Austin, TX · Remote-first
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-semibold text-slate-500">
            © {new Date().getFullYear()} ServiceSpeak AI, Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#top"
              className="text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#top"
              className="text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors"
            >
              Terms
            </a>
            <a
              href="#top"
              className="text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors"
            >
              Security
            </a>
            <span className="mono-overline text-slate-400 text-[0.55rem]">
              BUILT WITH ◆ EMERGENT
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
