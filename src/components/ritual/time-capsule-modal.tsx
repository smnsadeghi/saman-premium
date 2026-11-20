"use client";

import React, { useState } from "react";
import { Mail, Calendar, Sparkles, X, Heart, Clock } from "lucide-react";
import { CapsuleTrigger } from "@/types/ritual";
import { createTimeCapsule } from "@/lib/services/capsule-service";
import { createClient } from "@/lib/supabase/client";

interface TimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapsuleCreated: () => void;
}

export function TimeCapsuleModal({ isOpen, onClose, onCapsuleCreated }: TimeCapsuleModalProps) {
  const supabase = createClient();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [trigger, setTrigger] = useState<CapsuleTrigger>("next_window");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

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
      setContent("");
      setTitle("");
      onCapsuleCreated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-luxury-card border border-luxury-border rounded-3xl p-6 shadow-2xl relative overflow-hidden safe-bottom">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 w-8 h-8 rounded-full bg-luxury-bg/60 border border-luxury-border flex items-center justify-center text-luxury-textMuted hover:text-luxury-text"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-luxury-rosegold/10 text-luxury-rosegold mb-2 border border-luxury-rosegold/20">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-luxury-champagne-light">
            نوشتن کپسول زمانی 💌
          </h3>
          <p className="text-xs text-luxury-textMuted mt-1 leading-relaxed">
            نامه‌ای محبت‌آمیز که در زمان مناسب و نیازمند به پارتنرت هدیه داده می‌شود.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-luxury-textMuted mb-1 mr-1">
              عنوان کپسول (اختیاری)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: برای روزی که دلتنگ شدی..."
              className="w-full bg-luxury-bg border border-luxury-border rounded-xl px-3.5 py-2 text-xs text-luxury-text placeholder-luxury-textMuted/50 focus:outline-none focus:border-luxury-rosegold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-luxury-textMuted mb-1 mr-1">
              متن نامه یا دل‌نوشته
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="چند خط کلام گرم برای آرامش او بنویس..."
              className="w-full bg-luxury-bg border border-luxury-border rounded-xl p-3 text-xs text-luxury-text placeholder-luxury-textMuted/50 focus:outline-none focus:border-luxury-rosegold resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-luxury-textMuted mb-1.5 mr-1">
              زمان گشوده شدن نامه
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                  trigger === "next_window"
                    ? "bg-luxury-rosegold/10 border-luxury-rosegold text-luxury-rosegold"
                    : "bg-luxury-bg border-luxury-border text-luxury-textMuted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>در پنجره آیینی بعدی (پریود یا حمایت)</span>
                </div>
                <input
                  type="radio"
                  name="trigger"
                  value="next_window"
                  checked={trigger === "next_window"}
                  onChange={() => setTrigger("next_window")}
                  className="hidden"
                />
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                  trigger === "on_support"
                    ? "bg-purple-950/40 border-purple-600 text-purple-300"
                    : "bg-luxury-bg border-luxury-border text-luxury-textMuted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 shrink-0" />
                  <span>وقتی روزش سخت بود و پنجره حمایتی باز کرد</span>
                </div>
                <input
                  type="radio"
                  name="trigger"
                  value="on_support"
                  checked={trigger === "on_support"}
                  onChange={() => setTrigger("on_support")}
                  className="hidden"
                />
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                  trigger === "date"
                    ? "bg-luxury-rosegold/10 border-luxury-rosegold text-luxury-rosegold"
                    : "bg-luxury-bg border-luxury-border text-luxury-textMuted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>در تاریخ مشخص تقویمی</span>
                </div>
                <input
                  type="radio"
                  name="trigger"
                  value="date"
                  checked={trigger === "date"}
                  onChange={() => setTrigger("date")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {trigger === "date" && (
            <div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-luxury-bg border border-luxury-border rounded-xl px-3 py-2 text-xs text-luxury-text focus:outline-none focus:border-luxury-rosegold"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-luxury-bg bg-gradient-to-r from-luxury-rosegold-light via-luxury-rosegold to-luxury-rosegold-dark hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-luxury-bg border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>ارسال و ذخیره در کپسول</span>
                <Clock className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
