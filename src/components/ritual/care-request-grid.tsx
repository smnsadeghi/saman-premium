"use client";

import React, { useState } from "react";
import {
  Coffee,
  Candy,
  Headphones,
  Film,
  Moon,
  MessageSquareOff,
  AlertOctagon,
  Send,
  CheckCircle2,
} from "lucide-react";
import { CareRequestType } from "@/types/ritual";
import { sendCareRequest } from "@/lib/services/care-service";
import { createClient } from "@/lib/supabase/client";

interface CareRequestGridProps {
  onLockedWindow: () => void;
  onRequestSent: () => void;
}

export function CareRequestGrid({ onLockedWindow, onRequestSent }: CareRequestGridProps) {
  const supabase = createClient();
  const [selectedType, setSelectedType] = useState<CareRequestType | null>(null);
  const [customNote, setCustomNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [successBadge, setSuccessBadge] = useState<string | null>(null);

  const careOptions: {
    type: CareRequestType;
    label: string;
    sub: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      type: "warm_drink",
      label: "یه چیز گرم برام بفرست",
      sub: "دمنوش، چای یا قهوه گرم",
      icon: Coffee,
      color: "from-amber-950/40 to-amber-900/20 text-amber-300 border-amber-800/40",
    },
    {
      type: "chocolate",
      label: "یه خوراکی / شکلات",
      sub: "شیرینی یا خوراکی مورد علاقه",
      icon: Candy,
      color: "from-pink-950/40 to-pink-900/20 text-pink-300 border-pink-800/40",
    },
    {
      type: "call",
      label: "فقط صدات رو بشنوم",
      sub: "یک تماس صوتی کوتاه و آرام",
      icon: Headphones,
      color: "from-purple-950/40 to-purple-900/20 text-purple-300 border-purple-800/40",
    },
    {
      type: "movie",
      label: "همزمان فیلم ببینیم",
      sub: "تماشای آنلاین یک قسمت سریال",
      icon: Film,
      color: "from-blue-950/40 to-blue-900/20 text-blue-300 border-blue-800/40",
    },
    {
      type: "sleep_call",
      label: "تا خوابم ببره کنارم بمون",
      sub: "تماس آرام تا زمان خوابیدن",
      icon: Moon,
      color: "from-indigo-950/40 to-indigo-900/20 text-indigo-300 border-indigo-800/40",
    },
    {
      type: "quiet",
      label: "امروز فقط پیام کوتاه",
      sub: "نیاز به سکوت و پیام‌های ملایم",
      icon: MessageSquareOff,
      color: "from-stone-900/60 to-stone-800/40 text-stone-300 border-stone-700/40",
    },
    {
      type: "sos",
      label: "نیاز فوری به حمایت",
      sub: "درد شدید یا شرایط بحرانی روحی",
      icon: AlertOctagon,
      color: "from-red-950/60 to-red-900/40 text-red-300 border-red-800/50",
    },
  ];

  const handleSend = async (type: CareRequestType) => {
    setLoading(true);
    setSuccessBadge(null);

    const { isWindowLocked, error } = await sendCareRequest(supabase, type, customNote);
    setLoading(false);

    if (isWindowLocked) {
      // Gracefully route user to Dormant view without technical error
      onLockedWindow();
      return;
    }

    if (!error) {
      const opt = careOptions.find((c) => c.type === type);
      setSuccessBadge(opt?.label || "درخواست مراقبت ارسال شد");
      setSelectedType(null);
      setCustomNote("");
      onRequestSent();
      setTimeout(() => setSuccessBadge(null), 3500);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-luxury-champagne-light">
          درخواست‌های مراقبت از راه دور (LDR)
        </h4>
        <span className="text-[10px] text-luxury-textMuted">یک لمس تا باخبر شدن او</span>
      </div>

      {successBadge && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>پیام محبت‌آمیز «{successBadge}» برای پارتنرت ارسال شد!</span>
        </div>
      )}

      {/* Grid of 7 Care Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {careOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.type;

          return (
            <div
              key={opt.type}
              className={`rounded-2xl border p-3.5 transition-all bg-gradient-to-br ${opt.color} ${
                isSelected ? "ring-2 ring-luxury-rosegold" : "hover:border-luxury-rosegold/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-luxury-bg/50 border border-current/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-medium">{opt.label}</h5>
                    <p className="text-[10px] opacity-70 mt-0.5">{opt.sub}</p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (isSelected) {
                      handleSend(opt.type);
                    } else {
                      setSelectedType(opt.type);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-luxury-bg/80 border border-current/30 hover:bg-luxury-bg active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSelected ? "ارسال فوری" : "انتخاب"}</span>
                </button>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-current/10 flex flex-col gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="پیام یا توضیح کوتاه (اختیاری)..."
                    className="w-full bg-luxury-bg/90 border border-luxury-border rounded-lg px-2.5 py-1.5 text-xs text-luxury-text placeholder-luxury-textMuted/50 focus:outline-none focus:border-luxury-rosegold"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedType(null)}
                      className="text-[10px] text-luxury-textMuted hover:text-luxury-text px-2 py-1"
                    >
                      انصراف
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleSend(opt.type)}
                      className="text-[11px] font-medium px-3 py-1 rounded-lg bg-luxury-rosegold text-luxury-bg hover:opacity-90 active:scale-95 transition-all"
                    >
                      تأیید و ارسال
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
