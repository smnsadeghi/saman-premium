"use client";

import React, { useState } from "react";
import { Droplets, Heart, Sparkles, Check, HelpCircle, ArrowRight } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { WindowKind, DeviationReason } from "@/types/ritual";
import { openWindowRpc, setDeviationReasonRpc } from "@/lib/services/window-service";
import { createClient } from "@/lib/supabase/client";
import { tapLight, ritualOpen } from "@/lib/haptics";

interface OpenWindowSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (kind: WindowKind) => void;
}

export function OpenWindowSheet({ isOpen, onClose, onSuccess }: OpenWindowSheetProps) {
  const supabase = createClient();
  const [step, setStep] = useState<"choose" | "reason">("choose");
  const [loading, setLoading] = useState(false);
  const [selectedKind, setSelectedKind] = useState<WindowKind>("period");
  const [windowId, setWindowId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectKind = async (kind: WindowKind) => {
    tapLight();
    setLoading(true);
    setErrorMsg(null);
    setSelectedKind(kind);

    const { data, error } = await openWindowRpc(supabase, kind);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "خطا در گشودن پنجره ارتباطی");
      return;
    }

    if (data?.needs_reason && data?.id) {
      setWindowId(data.id);
      setStep("reason");
    } else {
      ritualOpen();
      onSuccess(kind);
      onClose();
      // Reset step for next time
      setTimeout(() => setStep("choose"), 400);
    }
  };

  const handleReason = async (reason?: DeviationReason) => {
    tapLight();
    if (reason && windowId) {
      await setDeviationReasonRpc(supabase, windowId, reason);
    }
    ritualOpen();
    onSuccess(selectedKind);
    onClose();
    setTimeout(() => setStep("choose"), 400);
  };

  const reasons: { id: DeviationReason; label: string; icon: string }[] = [
    { id: "stress", label: "استرس، اضطراب یا خستگی مفرط", icon: "🌿" },
    { id: "travel", label: "مسافرت یا تغییر مکان و آب‌وهوا", icon: "✈️" },
    { id: "illness", label: "بیماری یا سرماخوردگی", icon: "🤒" },
    { id: "medication", label: "شروع یا تغییر مصرف دارو", icon: "💊" },
    { id: "other", label: "سایر عوامل بدنی یا روحی", icon: "💭" },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setTimeout(() => setStep("choose"), 400);
      }}
      title={step === "choose" ? "آیین گشایش ارتباط و همراهی" : "یادداشت تغییر در تقویم"}
      description={
        step === "choose"
          ? "فضایی خصوصی برای آگاهی پارتنرت و شروع لحظات توجه و مراقبت"
          : "این دوره کمی متفاوت از پیش‌بینی قبلی بود؛ مایل هستی دلیل آن را بنویسی؟"
      }
    >
      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      {step === "choose" ? (
        <div className="flex flex-col gap-3 py-1">
          {/* Option 1: Period */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSelectKind("period")}
            className="group p-4 rounded-3xl bg-gradient-to-r from-[#29171C] to-[#18171C] border border-[#C85A53]/30 hover:border-[#C85A53]/70 active:scale-[0.98] transition-all flex items-center justify-between text-right disabled:opacity-50 shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#C85A53]/20 border border-[#C85A53]/30 flex items-center justify-center text-[#C85A53] group-hover:scale-105 transition-transform">
                <Droplets className="w-6 h-6 fill-current/30" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F6F3F8]">پریودم شروع شد 🩸</h4>
                <p className="text-[11px] text-[#A59CB0] mt-0.5">
                  باز کردن پنجره کامل و ثبت رسمی شروع چرخه در تقویم
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#C85A53]/60 rotate-180 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Option 2: Support */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSelectKind("support")}
            className="group p-4 rounded-3xl bg-gradient-to-r from-[#172522] to-[#18171C] border border-[#4F7A75]/30 hover:border-[#4F7A75]/70 active:scale-[0.98] transition-all flex items-center justify-between text-right disabled:opacity-50 shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#4F7A75]/20 border border-[#4F7A75]/30 flex items-center justify-center text-[#4F7A75] group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-current/30" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F6F3F8]">
                  فقط به حمایت نیاز دارم 🤍
                </h4>
                <p className="text-[11px] text-[#A59CB0] mt-0.5">
                  گشودن فضای حمایتی ۴۸ ساعته بدون تغییر در تقویم و دوره‌ها
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#4F7A75]/60 rotate-180 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        /* Deviation Reason Options */
        <div className="flex flex-col gap-2.5 py-1">
          {reasons.map((r) => (
            <button
              key={r.id}
              type="button"
              disabled={loading}
              onClick={() => handleReason(r.id)}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/40 active:scale-[0.98] transition-all flex items-center justify-between text-right text-xs text-[#F6F3F8]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{r.icon}</span>
                <span>{r.label}</span>
              </div>
              <Check className="w-4 h-4 text-amber-300 opacity-60" />
            </button>
          ))}

          <button
            type="button"
            disabled={loading}
            onClick={() => handleReason(undefined)}
            className="mt-2 py-2 text-xs text-[#A59CB0] hover:text-[#F6F3F8] transition-colors"
          >
            رد کردن و ورود به پنجره
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
