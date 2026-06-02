import Hero from "@/components/Hero";
import Demo from "@/components/Demo";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Platforms from "@/components/Platforms";
import Footer from "@/components/Footer";
import { ArrowRight, Download } from "lucide-react";

export default function Home() {
  return (
    <main>
      <Hero />
      <Demo />
      <HowItWorks />
      <Features />
      <Platforms />

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Ready to transform your patient conversations?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Install Lexi Scribe and get back to what matters — your patients.
          </p>
          <a
            href="/lexi-scribe-extension.zip"
            download
            className="inline-flex items-center gap-2 bg-[#1D9E75] text-white px-10 py-4 rounded-full text-base font-semibold hover:bg-[#0F6E56] transition-colors shadow-lg shadow-green-100"
          >
            <Download size={18} />
            Install Lexi Scribe — Free
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
