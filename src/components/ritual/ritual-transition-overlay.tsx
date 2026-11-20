"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Droplets } from "lucide-react";
import { WindowKind } from "@/types/ritual";
import { ritualOpen } from "@/lib/haptics";

interface RitualTransitionOverlayProps {
  isOpen: boolean;
  role: "her" | "him";
  kind: WindowKind;
  onDismiss: () => void;
}

export function RitualTransitionOverlay({
  isOpen,
  role,
  kind,
  onDismiss,
}: RitualTransitionOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      ritualOpen();
      const timer = setTimeout(() => {
        onDismiss();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onDismiss]);

  const isPeriod = kind === "period";
  const isHer = role === "her";

  const message = isHer
    ? isPeriod
      ? "پنجره پریود باز شد.\nاینجا فضای امن توست؛ با خیال راحت هر چه نیاز داری بگو."
      : "پنجره حمایتی باز شد.\nامروز آرام بگیر؛ همراهت اینجاست تا کنارت باشد."
    : isPeriod
    ? "پنجره پریود باز شد.\nوقت توجه، ارسال آرامش و مراقبت هوشمند از راه دور است."
    : "پنجره حمایتی باز شد.\nوقت حضور امن، شنیدن بی‌قضاوت و همدلی است.";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onDismiss}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-canvas/95 backdrop-blur-2xl cursor-pointer"
        >
          {/* Pulsing Light Aura */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.8, 1.4, 1.2], opacity: [0.2, 0.6, 0.4] }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className={`w-72 h-72 rounded-full blur-[90px] absolute pointer-events-none ${
              isPeriod ? "bg-[#C85A53]" : "bg-[#4F7A75]"
            }`}
          />

          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 max-w-xs text-center flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`w-16 h-16 rounded-3xl flex items-center justify-center border shadow-2xl ${
                isPeriod
                  ? "bg-[#C85A53]/20 border-[#C85A53]/40 text-[#C85A53]"
                  : "bg-[#4F7A75]/20 border-[#4F7A75]/40 text-[#4F7A75]"
              }`}
            >
              {isPeriod ? (
                <Droplets className="w-8 h-8 fill-current/30" />
              ) : (
                <Heart className="w-8 h-8 fill-current/30" />
              )}
            </motion.div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-white/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>آیین گشایش ارتباط</span>
            </div>

            <p className="text-base font-medium text-[#F6F3F8] leading-relaxed whitespace-pre-line">
              {message}
            </p>

            <span className="text-[11px] text-white/40 mt-3">لمس صفحه برای ورود مستقیم</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
