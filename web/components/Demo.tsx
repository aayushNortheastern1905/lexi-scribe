"use client";
import { motion } from "framer-motion";

const stats = [
  { number: "30M",  label: "Patients face language barriers in US healthcare" },
  { number: "15+",  label: "Minutes per appointment lost to documentation" },
  { number: "80%",  label: "Of patients forget instructions after leaving" },
];

export default function Demo() {
  return (
    <>
      {/* Problem stats */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-red-100">
              The Problem
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              The language gap in healthcare is real.
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Doctors are overwhelmed. Patients are lost. Lexi Scribe bridges the gap.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.number}
                className="text-center p-8 rounded-2xl bg-[#F9FAFB] border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl font-black text-[#1D9E75] mb-3">{stat.number}</div>
                <div className="text-gray-500 leading-relaxed">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lexi branding */}
      <section className="py-24 bg-gradient-to-br from-[#0F6E56] to-[#1D9E75]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border border-white/30">
              Built on Lexi
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
              Lexi Scribe is powered by<br />Lexi&apos;s medical AI infrastructure.
            </h2>
            <p className="text-lg text-green-100 mb-4 max-w-2xl mx-auto leading-relaxed">
              Lexi is redefining healthcare communication for 30 million patients with limited English proficiency in the US.
            </p>
            <p className="text-green-200 mb-10">
              Lexi Scribe is what it looks like when that interpretation engine meets the doctor&apos;s workflow.
            </p>
            <a
              href="https://withlexi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#1D9E75] px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              Learn more at withlexi.com →
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
