"use client";

import React, { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { CapsuleTrigger } from "@/types/ritual";
import { createTimeCapsule } from "@/lib/services/capsule-service";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Heart, Calendar, Send, Mail } from "lucide-react";
import { tapLight, successFeedback } from "@/lib/haptics";

interface WriteCapsuleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function WriteCapsuleSheet({ isOpen, onClose, onCreated }: WriteCapsuleSheetProps) {
  const supabase = createClient();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [trigger, setTrigger] = useState<CapsuleTrigger>("next_window");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    tapLight();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await createTimeCapsule(supabase, {
      content,
      title: title.trim() || undefined,
      deliver_trigger: trigger,
      deliver_date: trigger === "date" ? date : undefined,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      successFeedback();
      setContent("");
      setTitle("");
      onCreated();
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="نوشتن کپسول زمانی عاشقانه 💌"
      description="این دل‌نوشته در شرایط انتخاب‌شده مهروموم شده و در زمان مناسب برای پارتنرت گشوده می‌شود."
    >
      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className="block text-[11px] text-[#A59CB0] mb-1">عنوان نامه (اختیاری)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: برای وقتی که دلتنگ شدی..."
            className="w-full bg-[#121115] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-[#F6F3F8] placeholder-white/30 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-[11px] text-[#A59CB0] mb-1">متن نامه</label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="چند کلمه گرم و عاشقانه برای روزهای خاص بنویس..."
            className="w-full bg-[#121115] border border-white/[0.08] rounded-xl p-3 text-xs text-[#F6F3F8] placeholder-white/30 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] text-[#A59CB0] mb-1.5">زمان گشایش کپسول</label>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => {
                tapLight();
                setTrigger("next_window");
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all text-right ${
                trigger === "next_window"
                  ? "bg-amber-500/15 border-amber-400/50 text-amber-200"
                  : "bg-white/[0.02] border-white/[0.06] text-[#A59CB0]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                <span>در پنجره بعدی (پریود یا حمایت)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                tapLight();
                setTrigger("on_support");
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all text-right ${
                trigger === "on_support"
                  ? "bg-[#4F7A75]/20 border-[#4F7A75]/50 text-[#71AEA7]"
                  : "bg-white/[0.02] border-white/[0.06] text-[#A59CB0]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 shrink-0 text-[#4F7A75]" />
                <span>وقتی روزش سخت بود و پنجره حمایتی باز کرد</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                tapLight();
                setTrigger("date");
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all text-right ${
                trigger === "date"
                  ? "bg-amber-500/15 border-amber-400/50 text-amber-200"
                  : "bg-white/[0.02] border-white/[0.06] text-[#A59CB0]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0 text-amber-300" />
                <span>در تاریخ مشخص تقویمی</span>
              </div>
            </button>
          </div>
        </div>

        {trigger === "date" && (
          <div>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#121115] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F6F3F8] focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full py-3 px-4 rounded-2xl text-xs font-semibold text-canvas bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
        >
          <Mail className="w-4 h-4" />
          <span>{loading ? "در حال مهروموم..." : "مهروموم و ذخیره کپسول"}</span>
        </button>
      </form>
    </BottomSheet>
  );
}
