import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Waves } from "lucide-react";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { id: "services", label: "Services" },
    { id: "hear-it", label: "Hear it" },
    { id: "how-it-works", label: "How it works" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-slate-200"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a
          href="#top"
          data-testid="brand-logo"
          className="flex items-center gap-2.5 group"
        >
          <div className="relative w-9 h-9 bg-slate-950 flex items-center justify-center">
            <Waves
              className="w-4.5 h-4.5 text-blue-400"
              strokeWidth={2.5}
              size={18}
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full">
              <span className="absolute inset-0 rounded-full ss-pulse" />
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-extrabold text-base tracking-tight">
              ServiceSpeak
            </span>
            <span className="mono-overline text-blue-600 text-[0.55rem] leading-tight mt-0.5">
              AI · RECEPTIONIST
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              data-testid={`nav-${item.id}`}
              className="text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollTo("cta")}
            data-testid="header-demo-btn"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
          >
            Book free demo
            <span className="inline-block">→</span>
          </button>
        </div>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center border border-slate-200"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-6 py-5 flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                data-testid={`mobile-nav-${item.id}`}
                className="text-left text-slate-700 font-semibold py-2"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("cta")}
              data-testid="mobile-demo-btn"
              className="mt-2 bg-blue-600 text-white font-bold px-6 py-4 text-sm"
            >
              Book free demo →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
