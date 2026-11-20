"use client";

import React, { useState, useEffect } from "react";
import {
  Moon,
  Sparkles,
  Calendar,
  Mail,
  Heart,
  PlusCircle,
  Clock,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { AppWindow, PartnerWindowView, CycleRecord, TimeCapsule } from "@/types/ritual";
import { fetchCycles, recordCycle } from "@/lib/services/cycle-service";
import { fetchTimeCapsules, markCapsuleOpened } from "@/lib/services/capsule-service";
import { createClient } from "@/lib/supabase/client";

interface DormantViewProps {
  role: "her" | "him";
  windowData: AppWindow | PartnerWindowView | null;
  onOpenWindowClick?: () => void;
  onOpenCapsuleModal: () => void;
}

export function DormantView({
  role,
  windowData,
  onOpenWindowClick,
  onOpenCapsuleModal,
}: DormantViewProps) {
  const supabase = createClient();
  const [cycles, setCycles] = useState<CycleRecord[]>([]);
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cycleNotes, setCycleNotes] = useState("");
  const [savingCycle, setSavingCycle] = useState(false);

  const status = windowData?.status;
  const isHer = role === "her";

  const loadData = async () => {
    const [cData, capData] = await Promise.all([
      fetchCycles(supabase),
      fetchTimeCapsules(supabase),
    ]);
    setCycles(cData);
    setCapsules(capData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) return;

    setSavingCycle(true);
    await recordCycle(supabase, {
      start_date: startDate,
      end_date: endDate || null,
      notes: cycleNotes,
    });
    setSavingCycle(false);
    setShowCycleForm(false);
    setStartDate("");
    setEndDate("");
    setCycleNotes("");
    loadData();
  };

  const handleMarkCapsule = async (id: string) => {
    await markCapsuleOpened(supabase, id);
    loadData();
  };

  return (
    <div className="flex-1 flex flex-col gap-6 animate-fade-in">
      {/* 1. Calm Garden Sleep Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#16121b] via-luxury-card to-[#100d14] border border-luxury-border p-6 shadow-2xl text-center">
        {/* Soft Moon Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-luxury-rosegold-glow rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-luxury-bg/80 border border-luxury-border shadow-inner text-luxury-champagne mb-3 relative">
          <Moon className="w-7 h-7 text-luxury-rosegold" />
          <Sparkles className="w-3.5 h-3.5 text-luxury-champagne-light absolute top-2 right-2 animate-pulse" />
        </div>

        <h2 className="text-xl font-light text-luxury-champagne-light tracking-wide">
          باغ در خواب است...
        </h2>

        {status === "pre" ? (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40">
            <Clock className="w-3.5 h-3.5" />
            <span>پیش‌پنجره: ممکن است به‌زودی دوره جدید آغاز شود</span>
          </div>
        ) : status === "cooldown" ? (
          <div className="mt-3 p-3.5 rounded-2xl bg-luxury-bg/70 border border-luxury-border text-xs text-luxury-text leading-relaxed max-w-sm mx-auto">
            <span className="font-medium text-luxury-rosegold block mb-1">
              خلاصه و آرامش پس از دوره:
            </span>
            <p className="text-luxury-textMuted">
              {windowData?.summary || "دوره با آرامش و همراهی به پایان رسید. اکنون زمان ریکاوری و تجدید انرژی است."}
            </p>
          </div>
        ) : (
          <p className="text-xs text-luxury-textMuted mt-1.5 leading-relaxed max-w-xs mx-auto">
            در حال حاضر پنجره فعالی گشوده نیست. همه چیز در تعادل، امنیت و آرامش سپری می‌شود.
          </p>
        )}

        {/* Action Button for Her */}
        {isHer && onOpenWindowClick && (
          <div className="mt-6 pt-5 border-t border-luxury-border/60 flex flex-col gap-2">
            <button
              onClick={onOpenWindowClick}
              className="w-full py-3 px-5 rounded-2xl text-xs font-semibold text-luxury-bg bg-gradient-to-r from-luxury-rosegold-light via-luxury-rosegold to-luxury-rosegold-dark hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-luxury-rosegold/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>گشودن پنجره آیینی (پریود یا حمایت عاطفی)</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Time Capsules Section */}
      <div className="rounded-2xl bg-luxury-card border border-luxury-border p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-luxury-rosegold/10 border border-luxury-rosegold/20 flex items-center justify-center text-luxury-rosegold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-luxury-text">کپسول‌های زمانی عاشقانه</h3>
              <p className="text-[10px] text-luxury-textMuted">نامه‌هایی برای روزهای خاص</p>
            </div>
          </div>

          <button
            onClick={onOpenCapsuleModal}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-luxury-bg border border-luxury-rosegold/40 text-luxury-rosegold hover:bg-luxury-rosegold/10 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>نوشتن نامه جدید</span>
          </button>
        </div>

        {/* Unlocked / Received Capsules */}
        {capsules.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-luxury-border flex items-center justify-center text-xs text-luxury-textMuted/60 bg-luxury-bg/30">
            هنوز نامه‌ای ثبت نشده؛ اولین دل‌نوشته را برای او در کپسول بگذار!
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {capsules.map((cap) => {
              const isOpened = Boolean(cap.opened_at);

              return (
                <div
                  key={cap.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isOpened
                      ? "bg-luxury-bg/40 border-luxury-border opacity-80"
                      : "bg-luxury-cardHover border-luxury-rosegold/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-luxury-champagne flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-luxury-rosegold fill-luxury-rosegold/30" />
                      {cap.title || "نامه مهر و دلگرمی"}
                    </span>
                    <span className="text-[10px] text-luxury-textMuted">
                      {isOpened ? "گشوده‌شده" : "آماده خواندن ✨"}
                    </span>
                  </div>

                  <p className="text-xs text-luxury-text leading-relaxed whitespace-pre-wrap">
                    {cap.content}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-luxury-border/40 flex items-center justify-between text-[10px] text-luxury-textMuted">
                    <span>
                      شرط گشایش:{" "}
                      {cap.deliver_trigger === "next_window"
                        ? "پنجره بعدی"
                        : cap.deliver_trigger === "on_support"
                        ? "پنجره حمایتی"
                        : `تاریخ ${cap.deliver_date || "تعیین‌شده"}`}
                    </span>

                    {!isOpened && (
                      <button
                        onClick={() => handleMarkCapsule(cap.id)}
                        className="text-luxury-rosegold hover:underline flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>علامت خوانده شد</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Cycle Tracking & Calendar Section */}
      <div className="rounded-2xl bg-luxury-card border border-luxury-border p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-950/40 border border-pink-900/40 flex items-center justify-center text-pink-300">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-luxury-text">تاریخچه و تقویم دوره‌ها</h3>
              <p className="text-[10px] text-luxury-textMuted">ثبت دوره‌های قبلی برای دقت سامانه</p>
            </div>
          </div>

          <button
            onClick={() => setShowCycleForm(!showCycleForm)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-luxury-bg border border-luxury-border text-luxury-text hover:text-luxury-rosegold transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showCycleForm ? "بستن فرم" : "ثبت دوره"}</span>
          </button>
        </div>

        {/* Quick Cycle Record Form */}
        {showCycleForm && (
          <form
            onSubmit={handleSaveCycle}
            className="p-4 rounded-xl bg-luxury-bg/80 border border-luxury-border flex flex-col gap-3 animate-fade-in"
          >
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-luxury-textMuted mb-1">
                  تاریخ شروع پریود *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-luxury-card border border-luxury-border rounded-lg px-2.5 py-1.5 text-xs text-luxury-text focus:outline-none focus:border-luxury-rosegold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-luxury-textMuted mb-1">
                  تاریخ پایان (اختیاری)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-luxury-card border border-luxury-border rounded-lg px-2.5 py-1.5 text-xs text-luxury-text focus:outline-none focus:border-luxury-rosegold"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                value={cycleNotes}
                onChange={(e) => setCycleNotes(e.target.value)}
                placeholder="یادداشت کوتاه (مثال: شدت درد، داروها)..."
                className="w-full bg-luxury-card border border-luxury-border rounded-lg px-2.5 py-1.5 text-xs text-luxury-text placeholder-luxury-textMuted/50 focus:outline-none focus:border-luxury-rosegold"
              />
            </div>

            <button
              type="submit"
              disabled={savingCycle}
              className="py-2 rounded-lg text-xs font-medium bg-luxury-rosegold text-luxury-bg hover:opacity-90 transition-all self-end px-4"
            >
              {savingCycle ? "در حال ثبت..." : "ذخیره در تقویم"}
            </button>
          </form>
        )}

        {/* List of past cycles */}
        {cycles.length === 0 ? (
          <p className="text-xs text-luxury-textMuted/60 text-center py-2">
            هنوز دوره‌ای ثبت نشده است.
          </p>
        ) : (
          <div className="space-y-2">
            {cycles.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-luxury-bg/40 border border-luxury-border/60 text-xs"
              >
                <span className="text-luxury-text">
                  شروع: {c.start_date} {c.end_date ? `تا ${c.end_date}` : ""}
                </span>
                {c.notes && (
                  <span className="text-[10px] text-luxury-textMuted truncate max-w-[140px]">
                    {c.notes}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
