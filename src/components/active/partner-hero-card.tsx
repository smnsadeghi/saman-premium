"use client";

import React from "react";
import { Sparkles, Heart, Coffee, PhoneCall, Mic, Gift, Smile, Droplets } from "lucide-react";
import { WindowKind } from "@/types/ritual";
import { toPersianDigits } from "@/lib/numbers";

interface PartnerHeroCardProps {
  kind: WindowKind;
  cycleDay?: number | null;
}

export function PartnerHeroCard({ kind, cycleDay }: PartnerHeroCardProps) {
  const isPeriod = kind === "period";

  return (
    <div className="rounded-3xl bg-[#18171C]/90 backdrop-blur-xl border border-white/[0.06] p-6 shadow-2xl relative overflow-hidden">
      {/* Ambient Accent Glow */}
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
              <span>پنجره همراهی و دلگرمی</span>
            </>
          )}
        </span>

        {isPeriod && cycleDay && (
          <span className="text-xs font-semibold text-[#F6F3F8] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08] tabular-nums">
            روز {toPersianDigits(cycleDay)} دوره
          </span>
        )}
      </div>

      <h2 className="text-lg font-light text-[#F6F3F8]">
        {isPeriod ? (
          <>
            سلام همراه گرامی، <span className="font-semibold text-[#E68A84]">پریود او آغاز شده</span>
          </>
        ) : (
          <>
            سلام همراه گرامی، <span className="font-semibold text-[#71AEA7]">به حضور امن تو نیاز دارد</span>
          </>
        )}
      </h2>

      <p className="text-xs text-[#A59CB0] mt-1.5 leading-relaxed">
        {isPeriod
          ? "در این روزها با رفتارهای ساده و لمس‌نشدنی از راه دور، آرامش و احساس در کنار هم بودن را به او هدیه بده."
          : "امروز روزی پرچالش برای او بوده است. بدون نیاز به ارائه راهکار یا تحلیل، فقط شنونده و حامی او باش."}
      </p>

      {/* Practical LDR Suggestions */}
      <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-col gap-2.5">
        <h4 className="text-[11px] font-medium text-[#A59CB0] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>الان چه کاری بیشترین آرامش را به او می‌دهد؟</span>
        </h4>

        {isPeriod ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-xs text-[#F6F3F8]">
                سفارش یک دمنوش بابونه یا سوپ گرم به آدرس او
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-300 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-xs text-[#F6F3F8]">
                یک تماس کوتاه و آرام بدون بحث‌های جدی یا سنگین
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-300 flex items-center justify-center shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-xs text-[#F6F3F8]">
                ارسال یک پیام صوتی ۱ دقیقه‌ای پر از مهر و آرامش
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-300 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-xs text-[#F6F3F8]">
                فرستادن خوراکی یا شیرینی دلخواهش برای بهبود روحیه
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#4F7A75]/20 text-[#71AEA7] flex items-center justify-center shrink-0">
              <Smile className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#F6F3F8] leading-relaxed">
              یک پیام صوتی یا متنی بفرست و بگو: «میدونم امروز روز سختی برات بوده؛ هر وقت دوست داشتی صحبت کنی من تمام‌وقت اینجام تا فقط گوش بدم».
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
