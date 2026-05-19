"use client";
import { motion } from "framer-motion";
import { Download, Video, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Install the extension",
    description: "Add Lexi Scribe to Chrome in one click. No setup, no configuration, no account needed.",
  },
  {
    number: "02",
    icon: Video,
    title: "Join your video call",
    description: "Works on Google Meet, Zoom, Teams, and Webex. Lexi Scribe activates automatically when you join.",
  },
  {
    number: "03",
    icon: Heart,
    title: "Focus on your patient",
    description: "We handle the translation, transcription, and documentation. You handle the care.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#F9FAFB]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#065F46] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-[#6EE7B7]">
            How It Works
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Three steps. Zero workflow change.
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Lexi Scribe works inside the tools you already use. No switching apps, no extra steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="absolute top-6 right-6 text-7xl font-black text-gray-50 leading-none select-none">
                {step.number}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center mb-6 relative z-10">
                <step.icon size={22} className="text-[#1D9E75]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 relative z-10">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm relative z-10">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
