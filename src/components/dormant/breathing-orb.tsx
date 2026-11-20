"use client";

import React from "react";
import { motion } from "framer-motion";
import { Moon, Sparkles, Clock } from "lucide-react";
import { WindowStatus } from "@/types/ritual";

interface BreathingOrbProps {
  status?: WindowStatus | null;
  summary?: string | null;
}

export function BreathingOrb({ status, summary }: BreathingOrbProps) {
  const isPre = status === "pre";
  const isCooldown = status === "cooldown";

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center select-none relative">
      {/* Outer Breathing Rings */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Halo */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-56 h-56 rounded-full blur-3xl pointer-events-none ${
            isPre
              ? "bg-[#9D84B7]/20"
              : isCooldown
              ? "bg-[#E09F7D]/20"
              : "bg-[#D9A05B]/15"
          }`}
        />

        {/* Middle Pulse Ring */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className={`w-44 h-44 rounded-full border border-dashed flex items-center justify-center ${
            isPre
              ? "border-[#9D84B7]/30"
              : isCooldown
              ? "border-[#E09F7D]/30"
              : "border-[#D9A05B]/30"
          }`}
        >
          {/* Core Orb */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border shadow-2xl backdrop-blur-xl ${
              isPre
                ? "bg-gradient-to-b from-[#251e30] to-[#16121f] border-[#9D84B7]/40 text-[#9D84B7]"
                : isCooldown
                ? "bg-gradient-to-b from-[#2a1d18] to-[#18110e] border-[#E09F7D]/40 text-[#E09F7D]"
                : "bg-gradient-to-b from-[#251e18] to-[#17130f] border-[#D9A05B]/40 text-[#D9A05B]"
            }`}
          >
            <Moon className="w-8 h-8 mb-1 opacity-90 stroke-[1.5]" />
            <span className="text-[11px] font-medium tracking-tight">باغ در آرامش</span>
          </motion.div>
        </motion.div>
      </div>

      {/* State Caption */}
      <div className="mt-6 flex flex-col items-center max-w-xs">
        {isPre ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#9D84B7]/15 text-[#9D84B7] border border-[#9D84B7]/30">
            <Clock className="w-3.5 h-3.5" />
            <span>پیش‌پنجره: ممکن است به‌زودی دوره آغاز شود</span>
          </div>
        ) : isCooldown ? (
          <div className="p-3.5 rounded-2xl bg-[#18171C]/90 border border-white/[0.06] text-xs leading-relaxed text-[#A59CB0] text-center">
            <span className="text-[#E09F7D] font-medium block mb-1">
              خلاصه و ریکاوری پایان دوره:
            </span>
            <p>{summary || "دوره با آرامش و همراهی به پایان رسید. اکنون زمان تجدید قواست."}</p>
          </div>
        ) : (
          <p className="text-xs text-[#A59CB0] leading-relaxed">
            در حال حاضر پنجره فعالی گشوده نیست. همه چیز در سکوت و تعادل سپری می‌شود.
          </p>
        )}
      </div>
    </div>
  );
}
