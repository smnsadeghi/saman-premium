"use client";

import React, { useState } from "react";
import { Sparkles, Heart, Droplets, X, Check, HelpCircle, ArrowRight } from "lucide-react";
import { WindowKind, DeviationReason } from "@/types/ritual";
import { openWindowRpc, setDeviationReasonRpc } from "@/lib/services/window-service";
import { createClient } from "@/lib/supabase/client";

interface OpenWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWindowOpened: (kind: WindowKind) => void;
}

export function OpenWindowModal({ isOpen, onClose, onWindowOpened }: OpenWindowModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"choose" | "reason">("choose");
  const [createdWindowId, setCreatedWindowId] = useState<string | null>(null);
  const [selectedKind, setSelectedKind] = useState<WindowKind>("period");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectKind = async (kind: WindowKind) => {
    setLoading(true);
    setErrorMsg(null);
    setSelectedKind(kind);

    try {
      const { data, error } = await openWindowRpc(supabase, kind);
      if (error) {
        setErrorMsg(error.message || "خطا در گشودن پنجره ارتباطی");
        setLoading(false);
        return;
      }

      if (data?.needs_reason && data?.id) {
        setCreatedWindowId(data.id);
        setStep("reason");
        setLoading(false);
      } else {
        onWindowOpened(kind);
        onClose();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "خطای غیرمنتظره");
      setLoading(false);
    }
  };

  const handleSelectReason = async (reason?: DeviationReason) => {
    if (reason && createdWindowId) {
      setLoading(true);
      await setDeviationReasonRpc(supabase, createdWindowId, reason);
    }
    onWindowOpened(selectedKind);
    onClose();
  };

  const reasonOptions: { id: DeviationReason; label: string; icon: string }[] = [
    { id: "stress", label: "استرس یا خستگی", icon: "🌿" },
    { id: "travel", label: "سفر یا تغییر آب‌وهوا", icon: "✈️" },
    { id: "illness", label: "بیماری یا سرماخوردگی", icon: "🤒" },
    { id: "medication", label: "مصرف دارو", icon: "💊" },
    { id: "other", label: "سایر موارد", icon: "💭" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-luxury-card border border-luxury-border rounded-3xl p-6 shadow-2xl relative overflow-hidden safe-bottom">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-rosegold-glow rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute left-4 top-4 w-8 h-8 rounded-full bg-luxury-bg/60 border border-luxury-border flex items-center justify-center text-luxury-textMuted hover:text-luxury-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === "choose" ? (
          <div className="flex flex-col gap-5 pt-2">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-luxury-rosegold/10 border border-luxury-rosegold/20 text-luxury-rosegold mb-2.5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-champagne-light">
                گشودن پنجره آیینی
              </h3>
              <p className="text-xs text-luxury-textMuted mt-1 leading-relaxed">
                فضایی امن و اختصاصی برای ارتباط و همراهی آگاهانه با پارتنرت.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {/* Option 1: Period */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSelectKind("period")}
                className="group p-4 rounded-2xl bg-gradient-to-r from-[#2a131b] to-luxury-card border border-pink-900/40 hover:border-pink-500/50 active:scale-[0.98] transition-all flex items-center justify-between text-right disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300 group-hover:scale-105 transition-transform">
                    <Droplets className="w-5 h-5 text-pink-400 fill-pink-400/50" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-pink-200">
                      پریودم شروع شد 🩸
                    </span>
                    <span className="block text-[11px] text-pink-300/70 mt-0.5">
                      آغاز روزهای نیاز به مراقبت جسمی و آرامش
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-pink-400/60 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* Option 2: Support */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSelectKind("support")}
                className="group p-4 rounded-2xl bg-gradient-to-r from-[#241a28] to-luxury-card border border-purple-900/40 hover:border-purple-500/50 active:scale-[0.98] transition-all flex items-center justify-between text-right disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5 text-purple-300 fill-purple-300/40" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-purple-200">
                      فقط به حمایت نیاز دارم 🤍
                    </span>
                    <span className="block text-[11px] text-purple-300/70 mt-0.5">
                      یک روز سخت یا پرچالش و نیاز به حضور گرم او
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400/60 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Gentle Deviation Reason */
          <div className="flex flex-col gap-4 pt-2">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-luxury-rosegold/10 text-luxury-rosegold mb-2">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-luxury-champagne-light">
                یادداشت کوتاه برای تقویم
              </h3>
              <p className="text-xs text-luxury-textMuted mt-1 leading-relaxed">
                این بار شروع دوره کمی متفاوت از چرخه قبلی بود؛ مایل هستی علتش رو ثبت کنی؟
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {reasonOptions.map((opt) => (
                <button
                  key={opt.id}
                  disabled={loading}
                  onClick={() => handleSelectReason(opt.id)}
                  className="p-3 rounded-xl bg-luxury-bg/70 border border-luxury-border hover:border-luxury-rosegold/50 active:scale-[0.98] transition-all flex items-center justify-between text-right text-xs text-luxury-text"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  <Check className="w-3.5 h-3.5 text-luxury-rosegold opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSelectReason(undefined)}
              className="py-2 text-xs text-luxury-textMuted hover:text-luxury-text transition-colors"
            >
              رد کردن این مرحله
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
