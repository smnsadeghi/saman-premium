"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
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
import { tapLight, successFeedback } from "@/lib/haptics";

interface PartnerCareFeedNativeProps {
  onLockedWindow?: () => void;
}

export function PartnerCareFeedNative({ onLockedWindow }: PartnerCareFeedNativeProps) {
  const supabase = createClient();
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    const list = await fetchCareRequests(supabase);
    setRequests(list);
  };

  useEffect(() => {
    loadRequests();

    // 15-second polling interval
    const interval = setInterval(() => {
      loadRequests();
    }, 15000);

    // Supabase Realtime channel
    const channel = supabase
      .channel("public:care_requests_him")
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

  const handleStatusUpdate = async (id: string, status: CareRequestStatus) => {
    tapLight();
    setLoading(true);
    const { isWindowLocked, error } = await updateCareRequestStatus(supabase, id, status);
    setLoading(false);

    if (isWindowLocked) {
      if (onLockedWindow) onLockedWindow();
      return;
    }

    if (!error) {
      successFeedback();
      loadRequests();
    }
  };

  const getCareInfo = (type: CareRequestType) => {
    switch (type) {
      case "warm_drink":
        return { label: "یه چیز گرم بفرست", icon: Coffee, color: "text-amber-400" };
      case "chocolate":
        return { label: "یه خوراکی شیرین", icon: Candy, color: "text-pink-400" };
      case "call":
        return { label: "فقط صدات رو بشنوم", icon: Headphones, color: "text-purple-400" };
      case "movie":
        return { label: "همزمان فیلم ببینیم", icon: Film, color: "text-blue-400" };
      case "sleep_call":
        return { label: "تا خوابم ببره کنارم بمون", icon: Moon, color: "text-indigo-400" };
      case "quiet":
        return { label: "امروز فقط پیام کوتاه", icon: MessageSquareOff, color: "text-stone-400" };
      case "sos":
        return { label: "نیاز فوری به حمایت (SOS)", icon: AlertOctagon, color: "text-red-400" };
      default:
        return { label: "درخواست مراقبت", icon: Sparkles, color: "text-amber-300" };
    }
  };

  return (
    <div className="flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-[#F6F3F8] flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-amber-300" />
          درخواست‌های مراقبت دریافتی (لحظه‌ای)
        </h4>
        <span className="text-[10px] text-[#A59CB0]">همگام‌سازی Realtime</span>
      </div>

      {requests.length === 0 ? (
        <div className="p-4 rounded-3xl border border-dashed border-white/[0.08] text-center text-xs text-[#A59CB0]/70 bg-white/[0.01]">
          در حال حاضر درخواست فعالی از طرف او ثبت نشده است.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence>
            {requests.map((req) => {
              const info = getCareInfo(req.type);
              const Icon = info.icon;
              const isDone = req.status === "done";
              const isSeen = req.status === "seen";

              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`p-4 rounded-3xl border transition-all ${
                    isDone
                      ? "bg-white/[0.02] border-white/[0.06] opacity-60"
                      : req.type === "sos"
                      ? "bg-gradient-to-r from-red-950/60 to-[#18171C] border-red-600/70 shadow-lg shadow-red-950/30"
                      : isSeen
                      ? "bg-[#18171C]/90 border-blue-500/30"
                      : "bg-gradient-to-r from-amber-950/30 to-[#18171C] border-amber-500/40 shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                          req.type === "sos"
                            ? "bg-red-500/20 border-red-500/40 text-red-300 animate-pulse"
                            : "bg-white/[0.04] border-white/[0.08] text-[#F6F3F8]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-semibold text-[#F6F3F8]">{info.label}</h5>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                              isDone
                                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                                : isSeen
                                ? "bg-blue-950/40 text-blue-300 border border-blue-800/40"
                                : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                            }`}
                          >
                            {isDone ? "انجام شد" : isSeen ? "دیده شد" : "جدید ✨"}
                          </span>
                        </div>

                        {req.label && (
                          <p className="text-xs text-amber-200/90 mt-1.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] leading-relaxed">
                            «{req.label}»
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {!isDone && (
                        <>
                          {!isSeen && (
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => handleStatusUpdate(req.id, "seen")}
                              className="px-2.5 py-1.5 rounded-xl text-[10px] font-medium bg-blue-950/40 border border-blue-700/50 text-blue-300 hover:bg-blue-900/50 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                            >
                              <Eye className="w-3 h-3" />
                              <span>دیدم و انجام میدم</span>
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleStatusUpdate(req.id, "done")}
                            className="px-2.5 py-1.5 rounded-xl text-[10px] font-semibold bg-emerald-900/40 border border-emerald-600/60 text-emerald-200 hover:bg-emerald-800/50 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3 h-3" />
                            <span>انجام شد 🤍</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
