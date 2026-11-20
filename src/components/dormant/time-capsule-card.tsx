"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Unlock, PenLine, Heart, Sparkles, Check } from "lucide-react";
import { TimeCapsule } from "@/types/ritual";
import { markCapsuleOpened } from "@/lib/services/capsule-service";
import { createClient } from "@/lib/supabase/client";
import { toPersianDigits, formatPersianDate } from "@/lib/numbers";
import { tapLight, successFeedback } from "@/lib/haptics";

interface TimeCapsuleCardProps {
  capsules: TimeCapsule[];
  onOpenWriteModal: () => void;
  onRefresh: () => void;
}

export function TimeCapsuleCard({
  capsules,
  onOpenWriteModal,
  onRefresh,
}: TimeCapsuleCardProps) {
  const supabase = createClient();
  const [readingCapsule, setReadingCapsule] = useState<TimeCapsule | null>(null);

  // Separate opened vs sealed/locked capsules
  const unreadCapsules = capsules.filter((c) => !c.opened_at);
  const openedCapsules = capsules.filter((c) => Boolean(c.opened_at));

  const handleOpenLetter = async (cap: TimeCapsule) => {
    tapLight();
    setReadingCapsule(cap);
    if (!cap.opened_at) {
      await markCapsuleOpened(supabase, cap.id);
      successFeedback();
      onRefresh();
    }
  };

  return (
    <div className="rounded-3xl bg-[#18171C]/90 backdrop-blur-xl border border-white/[0.06] p-5 shadow-xl relative overflow-hidden">
      {/* Subtle Wax Seal Decor */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#F6F3F8]">صندوقچه نامه‌ها و کپسول زمانی</h3>
            <p className="text-[10px] text-[#A59CB0] mt-0.5">
              {unreadCapsules.length > 0
                ? `${toPersianDigits(unreadCapsules.length)} نامه منتظر خواندن`
                : "پیام‌هایی مهروموم‌شده برای روزهای آینده"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            tapLight();
            onOpenWriteModal();
          }}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.06] border border-white/[0.08] text-[#F6F3F8] hover:border-amber-400/40 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <PenLine className="w-3.5 h-3.5 text-amber-300" />
          <span>نوشتن نامه</span>
        </button>
      </div>

      {/* Capsule Envelopes List */}
      {capsules.length === 0 ? (
        <div className="p-4 rounded-2xl border border-dashed border-white/[0.08] text-center text-xs text-[#A59CB0]/70 bg-white/[0.01]">
          هنوز نامه‌ای مهروموم نشده؛ اولین کپسول عاشقانه را برای او ثبت کن!
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {capsules.map((cap) => {
            const isRead = Boolean(cap.opened_at);

            return (
              <motion.div
                key={cap.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenLetter(cap)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  !isRead
                    ? "bg-gradient-to-r from-amber-950/30 to-[#18171C] border-amber-500/40 shadow-md"
                    : "bg-white/[0.02] border-white/[0.06] opacity-75"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      !isRead
                        ? "bg-amber-500/20 border-amber-500/30 text-amber-300"
                        : "bg-white/[0.04] border-white/[0.06] text-[#A59CB0]"
                    }`}
                  >
                    {!isRead ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-[#F6F3F8]">
                      {cap.title || "نامه مهروموم‌شده"}
                    </h4>
                    <span className="text-[10px] text-[#A59CB0] block mt-0.5">
                      {cap.deliver_trigger === "next_window"
                        ? "در پنجره بعدی"
                        : cap.deliver_trigger === "on_support"
                        ? "در روزهای سخت و حمایت"
                        : `تاریخ ${formatPersianDate(cap.deliver_date)}`}
                    </span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      !isRead
                        ? "bg-amber-400/20 text-amber-200 border border-amber-400/30 font-medium"
                        : "text-[#A59CB0]"
                    }`}
                  >
                    {!isRead ? "آماده خواندن ✨" : "گشوده‌شده"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reading Letter Popup (Native feeling letter modal) */}
      <AnimatePresence>
        {readingCapsule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setReadingCapsule(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-[#1D1B22] border border-amber-500/30 p-6 shadow-2xl relative"
            >
              {/* Envelope wax header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-amber-300">
                  <Heart className="w-4 h-4 fill-current/30" />
                  <span className="text-xs font-semibold">
                    {readingCapsule.title || "دل‌نوشته عاشقانه"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setReadingCapsule(null)}
                  className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-[#A59CB0] text-xs hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="py-2 max-h-[50dvh] overflow-y-auto no-scrollbar">
                <p className="text-sm text-[#F6F3F8] leading-relaxed whitespace-pre-wrap font-light">
                  {readingCapsule.content}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#A59CB0]">
                <span>ثبت شده در: {formatPersianDate(readingCapsule.created_at)}</span>
                <span className="text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>پایان نامه</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
