"use client";

import React, { useState } from "react";
import { Calendar, Plus, ChevronDown, ChevronUp, Check, BookOpen } from "lucide-react";
import { CycleRecord } from "@/types/ritual";
import { recordCycle } from "@/lib/services/cycle-service";
import { createClient } from "@/lib/supabase/client";
import { toPersianDigits, formatPersianDate } from "@/lib/numbers";
import { tapLight, successFeedback } from "@/lib/haptics";

interface CyclesDrawerProps {
  cycles: CycleRecord[];
  onRefresh: () => void;
}

export function CyclesDrawer({ cycles, onRefresh }: CyclesDrawerProps) {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) return;

    setLoading(true);
    tapLight();
    const { error } = await recordCycle(supabase, {
      start_date: startDate,
      end_date: endDate || null,
      notes,
    });
    setLoading(false);

    if (!error) {
      successFeedback();
      setSavedSuccess(true);
      setStartDate("");
      setEndDate("");
      setNotes("");
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const datesCount = cycles.length;
  const neededForPrediction = Math.max(0, 3 - datesCount);

  return (
    <div className="rounded-3xl bg-[#18171C]/90 backdrop-blur-xl border border-white/[0.06] p-5 shadow-xl transition-all">
      <div
        onClick={() => {
          tapLight();
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#F6F3F8]">
              تقویم و تاریخچه دوره‌های قبلی
            </h3>
            <p className="text-[10px] text-[#A59CB0] mt-0.5">
              {neededForPrediction > 0
                ? `${toPersianDigits(neededForPrediction)} تاریخ دیگر تا فعال‌سازی هوش پیش‌بینی`
                : `${toPersianDigits(datesCount)} دوره ثبت‌شده؛ سامانه هوشمند فعال است`}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#A59CB0]"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-4 animate-fade-in">
          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>دوره جدید با موفقیت در تقویم ثبت شد!</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-[#A59CB0] mb-1">
                  تاریخ شروع پریود *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#121115] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F6F3F8] focus:outline-none focus:border-[#C85A53]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#A59CB0] mb-1">
                  تاریخ پایان (اختیاری)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#121115] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F6F3F8] focus:outline-none focus:border-[#C85A53]"
                />
              </div>
            </div>

            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="یادداشت کوتاه (شدت علائم یا توضیحات)..."
              className="w-full bg-[#121115] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F6F3F8] placeholder-white/30 focus:outline-none focus:border-[#C85A53]"
            />

            <button
              type="submit"
              disabled={loading || !startDate}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#C85A53] to-[#A8443E] hover:opacity-90 active:scale-[0.98] transition-all self-end flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{loading ? "در حال ثبت..." : "ثبت دوره جدید"}</span>
            </button>
          </form>

          {/* Past Cycles History */}
          <div className="flex flex-col gap-2 pt-2">
            <h4 className="text-[11px] font-medium text-[#A59CB0]">سوابق ثبت‌شده:</h4>
            {cycles.length === 0 ? (
              <p className="text-xs text-white/30 py-2 text-center">هنوز تاریخی ثبت نشده است.</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                {cycles.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-[#F6F3F8]"
                  >
                    <span>
                      {formatPersianDate(c.start_date)}{" "}
                      {c.end_date ? `تا ${formatPersianDate(c.end_date)}` : ""}
                    </span>
                    {c.notes && (
                      <span className="text-[10px] text-[#A59CB0] truncate max-w-[120px]">
                        {c.notes}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
