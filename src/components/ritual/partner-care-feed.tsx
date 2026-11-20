"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  Eye,
  Coffee,
  Candy,
  Headphones,
  Film,
  Moon,
  MessageSquareOff,
  AlertOctagon,
  Sparkles,
} from "lucide-react";
import { CareRequest, CareRequestType, CareRequestStatus } from "@/types/ritual";
import { fetchCareRequests, updateCareRequestStatus } from "@/lib/services/care-service";
import { createClient } from "@/lib/supabase/client";

interface PartnerCareFeedProps {
  onWindowLocked?: () => void;
}

export function PartnerCareFeed({ onWindowLocked }: PartnerCareFeedProps) {
  const supabase = createClient();
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    const list = await fetchCareRequests(supabase);
    setRequests(list);
  };

  useEffect(() => {
    loadRequests();

    // 1. Polling every 15 seconds as required
    const interval = setInterval(() => {
      loadRequests();
    }, 15000);

    // 2. Realtime subscription on care_requests
    const channel = supabase
      .channel("public:care_requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "care_requests",
        },
        () => {
          loadRequests();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdate = async (id: string, status: CareRequestStatus) => {
    setLoading(true);
    const { isWindowLocked, error } = await updateCareRequestStatus(supabase, id, status);
    setLoading(false);

    if (isWindowLocked) {
      if (onWindowLocked) onWindowLocked();
      return;
    }

    if (!error) {
      loadRequests();
    }
  };

  const getIcon = (type: CareRequestType) => {
    switch (type) {
      case "warm_drink":
        return Coffee;
      case "chocolate":
        return Candy;
      case "call":
        return Headphones;
      case "movie":
        return Film;
      case "sleep_call":
        return Moon;
      case "quiet":
        return MessageSquareOff;
      case "sos":
        return AlertOctagon;
      default:
        return Sparkles;
    }
  };

  const getLabel = (type: CareRequestType) => {
    switch (type) {
      case "warm_drink":
        return "یه چیز گرم برام بفرست";
      case "chocolate":
        return "یه خوراکی / شکلات";
      case "call":
        return "فقط صدات رو بشنوم";
      case "movie":
        return "همزمان فیلم ببینیم";
      case "sleep_call":
        return "تا خوابم ببره کنارم بمون";
      case "quiet":
        return "امروز فقط پیام کوتاه";
      case "sos":
        return "نیاز فوری به حمایت (SOS)";
      default:
        return "درخواست مراقبت";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-luxury-champagne-light flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-luxury-rosegold" />
          درخواست‌های مراقبت دریافتی (لحظه‌ای)
        </h4>
        <span className="text-[10px] text-luxury-textMuted">به‌روزرسانی خودکار</span>
      </div>

      {requests.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-luxury-border text-center text-xs text-luxury-textMuted/60 bg-luxury-bg/30">
          در حال حاضر درخواست فعالی ثبت نشده است.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {requests.map((req) => {
            const Icon = getIcon(req.type);
            const isDone = req.status === "done";
            const isSeen = req.status === "seen";

            return (
              <div
                key={req.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isDone
                    ? "bg-luxury-bg/40 border-luxury-border opacity-70"
                    : isSeen
                    ? "bg-luxury-card border-luxury-border"
                    : "bg-gradient-to-r from-[#26171a] to-luxury-card border-pink-900/60 shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        req.type === "sos"
                          ? "bg-red-950/60 border-red-800 text-red-300 animate-pulse"
                          : "bg-luxury-bg border-luxury-border text-luxury-rosegold"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-luxury-text">
                          {getLabel(req.type)}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                            isDone
                              ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                              : isSeen
                              ? "bg-blue-950/40 text-blue-300 border border-blue-800/40"
                              : "bg-pink-950/60 text-pink-300 border border-pink-800/60 font-medium"
                          }`}
                        >
                          {isDone ? "انجام شد" : isSeen ? "دیده شده" : "جدید"}
                        </span>
                      </div>

                      {req.label && (
                        <p className="text-xs text-luxury-champagne mt-1 leading-relaxed bg-luxury-bg/60 p-2 rounded-lg border border-luxury-border/60">
                          «{req.label}»
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isDone && (
                      <>
                        {!isSeen && (
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleUpdate(req.id, "seen")}
                            title="علامت دیدم"
                            className="px-2 py-1 rounded-lg text-[10px] font-medium bg-luxury-bg border border-blue-800/50 text-blue-300 hover:bg-blue-950/40 active:scale-95 transition-all flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>دیدم</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleUpdate(req.id, "done")}
                          title="علامت انجام شد"
                          className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-emerald-900/40 border border-emerald-700/60 text-emerald-200 hover:bg-emerald-800/50 active:scale-95 transition-all flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>انجام شد</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
