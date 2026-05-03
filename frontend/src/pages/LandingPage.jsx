import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import Services from "@/components/landing/Services";
import HowItWorks from "@/components/landing/HowItWorks";
import Outcomes from "@/components/landing/Outcomes";
import CTASection from "@/components/landing/CTASection";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main
      className="relative overflow-x-hidden bg-white text-slate-950"
      data-testid="landing-page"
    >
      <Header />
      <Hero />
      <TrustedBy />
      <Services />
      <HowItWorks />
      <Outcomes />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
