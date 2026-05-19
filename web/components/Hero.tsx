"use client";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0FDF4] via-white to-white pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center">
            <span className="text-white text-sm font-bold">L</span>
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Lexi Scribe</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">
            How it works
          </a>
          <a href="#features" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">
            Features
          </a>
          <a
            href="#"
            className="bg-[#1D9E75] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0F6E56] transition-colors"
          >
            Install Extension
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col lg:flex-row items-center gap-16">
        {/* Left: text */}
        <motion.div
          className="flex-1 max-w-2xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#065F46] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-[#6EE7B7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] inline-block" />
            Built on Lexi&apos;s Medical AI
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
            Your AI Medical Scribe.<br />
            <span className="text-[#1D9E75]">In Every Patient</span><br />
            Conversation.
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-xl">
            Lexi Scribe translates, transcribes, and documents your appointments in real time — right inside Google Meet, Zoom, and Teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-[#1D9E75] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#0F6E56] transition-colors shadow-lg shadow-green-100"
            >
              <Download size={18} />
              Install Chrome Extension — It&apos;s Free
              <ArrowRight size={16} />
            </a>
          </div>

          <p className="text-sm text-gray-400">
            Works on Google Meet · Zoom · Microsoft Teams · Webex
          </p>
        </motion.div>

        {/* Right: Extension mockup */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            {/* Browser chrome */}
            <div className="w-[560px] max-w-full rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Browser bar */}
              <div className="bg-[#F3F4F6] px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 mx-2 truncate">
                  meet.google.com/xyz-abc-def
                </div>
              </div>

              {/* Page content */}
              <div className="flex h-[400px]">
                {/* Fake video call */}
                <div className="flex-1 bg-[#1a1a2e] flex flex-col items-center justify-center gap-3 p-6">
                  <div className="w-20 h-20 rounded-full bg-[#2d2d44] flex items-center justify-center text-3xl">
                    👨‍⚕️
                  </div>
                  <div className="text-white text-sm font-medium">Dr. Martinez</div>
                  <div className="text-gray-500 text-xs">Google Meet</div>
                  <div className="mt-4 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2d2d44] flex items-center justify-center text-xs text-gray-400">🎤</div>
                    <div className="w-8 h-8 rounded-full bg-[#2d2d44] flex items-center justify-center text-xs text-gray-400">📷</div>
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">✕</div>
                  </div>
                </div>

                {/* Lexi Scribe sidebar */}
                <div className="w-[188px] bg-white border-l border-gray-200 flex flex-col text-[10px] flex-shrink-0">
                  {/* Sidebar header */}
                  <div className="bg-[#1D9E75] px-3 py-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                    <span className="text-white font-semibold text-[11px]">Lexi Scribe</span>
                  </div>

                  {/* Timer */}
                  <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                    <span className="text-gray-600 font-medium">Recording</span>
                    <span className="ml-auto text-[#1D9E75] font-bold tabular-nums">00:08:42</span>
                  </div>

                  {/* Transcript label */}
                  <div className="bg-gray-50 px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Live Transcript
                  </div>

                  {/* Messages */}
                  <div className="flex-1 px-2 py-2 flex flex-col gap-2 overflow-hidden">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-gray-400 font-bold">DR</span>
                      <div className="bg-gray-100 rounded-md px-2 py-1.5 text-[9px] text-gray-700 leading-snug">
                        You have high blood pressure.
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 items-end">
                      <div className="bg-[#ECFDF5] rounded-md px-2 py-1.5 text-[9px] text-emerald-800 leading-snug max-w-[90%] text-right">
                        🇻🇳 Bạn bị huyết áp cao.
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-gray-400 font-bold">PT</span>
                      <div className="bg-gray-100 rounded-md px-2 py-1.5 text-[9px] text-gray-700 leading-snug">
                        Tôi cảm thấy chóng mặt.
                      </div>
                      <div className="text-[8px] text-gray-400 italic px-1">🇺🇸 I feel dizzy.</div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="border-t border-gray-100 flex-shrink-0">
                    <div className="bg-gray-50 px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      📋 Clinical Notes
                    </div>
                    <div className="px-3 py-2 text-[9px] text-gray-600 flex flex-col gap-0.5">
                      <div className="font-bold text-[#1D9E75]">Symptoms</div>
                      <div>• Dizziness</div>
                      <div>• Headache</div>
                      <div className="font-bold text-[#1D9E75] mt-1">Medications</div>
                      <div>• Lisinopril 10mg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-lg">
                🇻🇳
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Translated instantly</div>
                <div className="text-[10px] text-gray-400">7 languages supported</div>
              </div>
            </div>

            {/* Second badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-lg">
                📋
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Auto clinical notes</div>
                <div className="text-[10px] text-gray-400">Zero manual entry</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
