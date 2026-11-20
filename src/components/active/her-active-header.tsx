"use client";

import React, { useState, useEffect } from "react";
import { Droplets, Heart, Clock, Plus, XCircle, Sparkles } from "lucide-react";
import { AppWindow } from "@/types/ritual";
import { extendSupportWindowRpc, closeWindowRpc } from "@/lib/services/window-service";
import { createClient } from "@/lib/supabase/client";
import { toPersianDigits, formatCountdown } from "@/lib/numbers";
import { tapLight, successFeedback } from "@/lib/haptics";

interface HerActiveHeaderProps {
  windowData: AppWindow;
  onRefresh: () => void;
  onNotice: (msg: string) => void;
}

export function HerActiveHeader({ windowData, onRefresh, onNotice }: HerActiveHeaderProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  const isPeriod = windowData.kind === "period";

  // Calculate remaining seconds for support window
  useEffect(() => {
    if (!isPeriod && windowData.expires_at) {
      const updateTime = () => {
        const diff = Math.max(
          0,
          Math.floor((new Date(windowData.expires_at!).getTime() - Date.now()) / 1000)
        );
        setSecondsRemaining(diff);
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [isPeriod, windowData.expires_at]);

  const handleClose = async () => {
    tapLight();
    if (!confirm("آیا مایل به پایان این دوره و بستن پنجره ارتباطی هستی؟")) return;

    setLoading(true);
    const { error } = await closeWindowRpc(supabase, false);
    setLoading(false);

    if (!error) {
      successFeedback();
      onNotice("پنجره آیینی بسته شد و دوره در وضعیت ریکاوری قرار گرفت ✨");
      onRefresh();
    }
  };

  const handleExtend = async () => {
    tapLight();
    setLoading(true);
    const { error } = await extendSupportWindowRpc(supabase);
    setLoading(false);

    if (!error) {
      successFeedback();
      onNotice("پنجره حمایتی با موفقیت ۲۴ ساعت تمدید شد ⏳");
      onRefresh();
    }
  };

  return (
    <div className="rounded-3xl bg-[#18171C]/90 backdrop-blur-xl border border-white/[0.06] p-6 shadow-2xl relative overflow-hidden select-none">
      {/* Dynamic ambient color glow */}
      <div
        className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
          isPeriod ? "bg-[#C85A53]/15" : "bg-[#4F7A75]/15"
        }`}
      />

      <div className="flex items-center justify-between mb-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            isPeriod
              ? "bg-[#C85A53]/15 text-[#E68A84] border-[#C85A53]/30"
              : "bg-[#4F7A75]/15 text-[#71AEA7] border-[#4F7A75]/30"
          }`}
        >
          {isPeriod ? (
            <>
              <Droplets className="w-3.5 h-3.5 fill-current/30" />
              <span>پنجره فعال پریود</span>
            </>
          ) : (
            <>
              <Heart className="w-3.5 h-3.5 fill-current/30" />
              <span>پنجره فعال حمایت عاطفی</span>
            </>
          )}
        </span>

        {/* Subtle close window button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleClose}
          className="text-[11px] text-[#A59CB0] hover:text-red-400 active:scale-95 transition-all flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/[0.04]"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>بستن پنجره</span>
        </button>
      </div>

      <h2 className="text-lg font-light text-[#F6F3F8]">
        سلام نازنینم، پنجره آیینی شما{" "}
        <span className={`font-semibold ${isPeriod ? "text-[#E68A84]" : "text-[#71AEA7]"}`}>
          گشوده است
        </span>
      </h2>

      <p className="text-xs text-[#A59CB0] mt-1.5 leading-relaxed">
        پارتنرت متصل است و هر لحظه با لمس دکمه‌های زیر، نیازت برای او فرستاده می‌شود.
      </p>

      {/* Support Window Timer & Extend */}
      {!isPeriod && (
        <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#A59CB0]">
            <Clock className="w-4 h-4 text-[#71AEA7]" />
            <span>زمان باقی‌مانده:</span>
            <span className="font-semibold text-[#F6F3F8] tabular-nums font-mono text-sm">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleExtend}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#4F7A75]/20 border border-[#4F7A75]/40 text-[#71AEA7] hover:bg-[#4F7A75]/30 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+۲۴ ساعت تمدید</span>
          </button>
        </div>
      )}
    </div>
  );
}
