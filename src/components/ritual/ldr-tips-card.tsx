"use client";

import React from "react";
import { Sparkles, Heart, Coffee, PhoneCall, Mic, Gift, Smile } from "lucide-react";
import { WindowKind } from "@/types/ritual";

interface LdrTipsCardProps {
  kind: WindowKind;
  cycleDay?: number | null;
}

export function LdrTipsCard({ kind, cycleDay }: LdrTipsCardProps) {
  const isPeriod = kind === "period";

  return (
    <div className="rounded-2xl bg-luxury-card border border-luxury-border p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isPeriod
                ? "bg-pink-950/40 border-pink-900/40 text-pink-300"
                : "bg-purple-950/40 border-purple-900/40 text-purple-300"
            }`}
          >
            {isPeriod ? <Sparkles className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-luxury-text">
              {isPeriod ? "راهنمای مراقبت از راه دور (LDR)" : "فضای همراهی و دلگرمی"}
            </h4>
            <p className="text-[10px] text-luxury-textMuted">
              {isPeriod
                ? `روز ${cycleDay || "جاری"} دوره پریود پارتنر`
                : "پنجره حمایتی باز است؛ نیاز به حضور و آرامش تو دارد"}
            </p>
          </div>
        </div>
      </div>

      {isPeriod ? (
        <div className="grid grid-cols-1 gap-2.5">
          <div className="p-3 rounded-xl bg-luxury-bg/70 border border-luxury-border flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-950/40 text-amber-300 shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-medium text-luxury-champagne block">
                سفارش نوشیدنی یا خوراکی گرم
              </span>
              <p className="text-[11px] text-luxury-textMuted leading-relaxed mt-0.5">
                یک دمنوش بابونه، چای یا سوپ گرم به آدرس او سفارش بده تا حس کند کنار او هستی.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-luxury-bg/70 border border-luxury-border flex items-start gap-3">
            <div className="p-2 rounded-lg bg-pink-950/40 text-pink-300 shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-medium text-luxury-champagne block">
                تماس تلفنی کوتاه و بدون چالش
              </span>
              <p className="text-[11px] text-luxury-textMuted leading-relaxed mt-0.5">
                فقط حالش را بپرس و شنونده باش؛ از پیش کشیدن مباحث پیچیده یا تصمیم‌گیری‌های سنگین خودداری کن.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-luxury-bg/70 border border-luxury-border flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-950/40 text-purple-300 shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-medium text-luxury-champagne block">
                ارسال ویس‌های آرامش‌بخش
              </span>
              <p className="text-[11px] text-luxury-textMuted leading-relaxed mt-0.5">
                شنیدن صدای گرم تو حتی برای ۱ دقیقه، سطح کورتیزول و اضطراب او را کاهش می‌دهد.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-luxury-bg/70 border border-luxury-border flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-950/40 text-rose-300 shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-medium text-luxury-champagne block">
                یک هدیه یا پیام محبت‌آمیز غیرمنتظره
              </span>
              <p className="text-[11px] text-luxury-textMuted leading-relaxed mt-0.5">
                یک شاخه گل یا پیام متنی عاشقانه در میانه روز، انرژی مثبتی برای تحمل دردهای جسمی به او می‌بخشد.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Support Window Tips (without hormonal assumptions) */
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-luxury-bg border border-purple-900/30 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-purple-300">
            <Smile className="w-4 h-4" />
            <span className="text-xs font-semibold">حضور امن، شنیدن بدون قضاوت</span>
          </div>
          <p className="text-xs text-luxury-text leading-relaxed">
            امروز روزی است که به حضور عاطفی و حمایت بی‌قیدوشرط تو نیاز دارد. لازم نیست راهکاری برای مشکلات پیدا کنی؛ همین که بداند در کنار او هستی و احساساتش را به رسمیت می‌شناسی، بزرگ‌ترین آرامش برای اوست.
          </p>
          <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between text-[11px] text-purple-300/80">
            <span>✨ پیشنهاد: یک پیام صوتی کوتاه پر از مهر و اطمینان بفرست.</span>
          </div>
        </div>
      )}
    </div>
  );
}
