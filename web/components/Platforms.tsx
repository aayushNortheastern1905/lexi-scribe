"use client";
import { motion } from "framer-motion";

const platforms = [
  { name: "Google Meet", bg: "#ECFDF5", emoji: "🟢" },
  { name: "Zoom",        bg: "#EFF6FF", emoji: "🔵" },
  { name: "Microsoft Teams", bg: "#F5F0FF", emoji: "🟣" },
  { name: "Webex",       bg: "#F0FDF4", emoji: "🟩" },
  { name: "Whereby",     bg: "#FFF1F4", emoji: "🔴" },
];

export default function Platforms() {
  return (
    <section className="py-20 bg-[#F9FAFB]" id="platforms">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Works on every major platform
          </p>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            One extension. Every video call.
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.name}
              className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: platform.bg }}
              >
                {platform.emoji}
              </div>
              <span className="font-semibold text-gray-800">{platform.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
