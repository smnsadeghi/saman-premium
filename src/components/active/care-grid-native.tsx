"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Candy,
  Headphones,
  Film,
  Moon,
  MessageSquareOff,
  Send,
  Check,
} from "lucide-react";
import { CareRequestType } from "@/types/ritual";
import { sendCareRequest } from "@/lib/services/care-service";
import { createClient } from "@/lib/supabase/client";
import { tapLight, successFeedback } from "@/lib/haptics";

interface CareGridNativeProps {
  onSent: () => void;
  onLockedWindow?: () => void;
}

export function CareGridNative({ onSent, onLockedWindow }: CareGridNativeProps) {
  const supabase = createClient();
  const [selectedType, setSelectedType] = useState<CareRequestType | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  const careItems: {
    type: CareRequestType;
    label: string;
    sub: string;
    icon: React.ElementType;
    glow: string;
    border: string;
  }[] = [
    {
      type: "warm_drink",
      label: "یه چیز گرم بفرست",
      sub: "دمنوش، چای یا قهوه",
      icon: Coffee,
      glow: "hover:border-amber-500/40",
      border: "border-amber-500/20",
    },
    {
      type: "chocolate",
      label: "یه خوراکی شیرین",
      sub: "شکلات یا شیرینی دلخواه",
      icon: Candy,
      glow: "hover:border-pink-500/40",
      border: "border-pink-500/20",
    },
    {
      type: "call",
      label: "فقط صدات رو بشنوم",
      sub: "یک تماس کوتاه و آرامش‌بخش",
      icon: Headphones,
      glow: "hover:border-purple-500/40",
      border: "border-purple-500/20",
    },
    {
      type: "movie",
      label: "همزمان فیلم ببینیم",
      sub: "تماشای آنلاین یک سریال",
      icon: Film,
      glow: "hover:border-blue-500/40",
      border: "border-blue-500/20",
    },
    {
      type: "sleep_call",
      label: "تا خوابم ببره بمون",
      sub: "مکالمه ملایم تا زمان خواب",
      icon: Moon,
      glow: "hover:border-indigo-500/40",
      border: "border-indigo-500/20",
    },
    {
      type: "quiet",
      label: "امروز فقط پیام کوتاه",
      sub: "نیاز به سکوت و همراهی آرام",
      icon: MessageSquareOff,
      glow: "hover:border-stone-500/40",
      border: "border-stone-500/20",
    },
  ];

  const handleSend = async (type: CareRequestType) => {
    tapLight();
    setLoading(true);

    const { isWindowLocked, error } = await sendCareRequest(supabase, type, note);
    setLoading(false);

    if (isWindowLocked) {
      if (onLockedWindow) onLockedWindow();
      return;
    }

    if (!error) {
      successFeedback();
      setSentMap((prev) => ({ ...prev, [type]: true }));
      setSelectedType(null);
      setNote("");
      onSent();
      setTimeout(() => {
        setSentMap((prev) => ({ ...prev, [type]: false }));
      }, 4000);
    }
  };

  return (
    <div className="flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-[#F6F3F8]">
          درخواست‌های مراقبت از راه دور
        </h4>
        <span className="text-[10px] text-[#A59CB0]">یک لمس تا باخبر شدن او</span>
      </div>

      {/* 2x3 Grid of Rounded-3xl Cards */}
      <div className="grid grid-cols-2 gap-3">
        {careItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.type;
          const isSent = Boolean(sentMap[item.type]);

          return (
            <motion.div
              key={item.type}
              whileTap={{ scale: 0.97 }}
              className={`relative rounded-3xl bg-[#18171C]/90 backdrop-blur-xl border p-4 flex flex-col justify-between transition-all cursor-pointer shadow-lg overflow-hidden ${
                isSent
                  ? "border-emerald-600/60 bg-emerald-950/20"
                  : isSelected
                  ? "border-white/40 ring-1 ring-white/20"
                  : `${item.border} ${item.glow}`
              }`}
              onClick={() => {
                if (isSent) return;
                tapLight();
                setSelectedType(isSelected ? null : item.type);
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
                    isSent
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-white/[0.04] border-white/[0.06] text-[#F6F3F8]"
                  }`}
                >
                  {isSent ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                {isSent && (
                  <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    ارسال شد 🤍
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h5 className="text-xs font-semibold text-[#F6F3F8] tracking-tight leading-snug">
                  {item.label}
                </h5>
                <p className="text-[10px] text-[#A59CB0] mt-1 line-clamp-1">{item.sub}</p>
              </div>

              {/* Slide-out input note when selected */}
              <AnimatePresence>
                {isSelected && !isSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 pt-3 border-t border-white/[0.08] flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="پیام یا توضیح کوتاه..."
                      className="w-full bg-[#121115] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-[#F6F3F8] placeholder-white/30 focus:outline-none focus:border-white/40"
                    />

                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedType(null)}
                        className="text-[10px] text-[#A59CB0] px-2 py-1"
                      >
                        انصراف
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSend(item.type)}
                        className="px-3 py-1 rounded-xl text-[11px] font-semibold bg-white text-canvas hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1 shadow-md"
                      >
                        <Send className="w-3 h-3" />
                        <span>ارسال</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
